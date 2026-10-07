import { getDatabase } from '@/lib/mongodb';
import { Movie } from '@/types/movie';
import { WithId, Document } from 'mongodb';

/**
 * 将 MongoDB 文档转换为 Movie 类型
 */
function toMovie(doc: WithId<Document>): Movie {
  const movie: Document = { ...doc };
  delete movie._id;
  delete movie.createdAt;
  delete movie.updatedAt;
  return movie as Movie;
}

/**
 * 获取电影总数
 */
export async function getMovieCount(): Promise<number> {
  const db = await getDatabase();
  return db.collection('movies').countDocuments();
}

/**
 * 获取所有豆瓣 ID（用于静态生成）
 */
export async function getAllDoubanIds(): Promise<string[]> {
  const db = await getDatabase();
  const movies = await db
    .collection('movies')
    .find(
      { doubanId: { $exists: true, $ne: '' } },
      { projection: { doubanId: 1 } },
    )
    .toArray();
  return movies.map((m) => m.doubanId as string);
}

/**
 * 根据豆瓣 ID 获取电影
 */
export async function getMovieByDoubanId(
  doubanId: string,
): Promise<Movie | null> {
  const db = await getDatabase();
  const doc = await db.collection('movies').findOne({ doubanId });
  return doc ? toMovie(doc) : null;
}

/**
 * 排序字段
 */
export type SortField = 'rating' | 'releaseDate' | 'title' | 'ratingCount';

/**
 * 排序方向
 */
export type SortOrder = 'asc' | 'desc';

/**
 * 排序配置
 */
export interface SortConfig {
  field: SortField;
  order: SortOrder;
}

/**
 * 解析排序字符串为排序配置
 * @param sortStr 排序字符串，如 "rating_desc"、"releaseDate_asc"、"title_asc"
 */
export function parseSortString(sortStr: string): SortConfig {
  const [field, order] = sortStr.split('_') as [SortField, SortOrder];

  // 验证字段有效性
  const validFields: SortField[] = [
    'rating',
    'releaseDate',
    'title',
    'ratingCount',
  ];
  const validOrders: SortOrder[] = ['asc', 'desc'];

  return {
    field: validFields.includes(field) ? field : 'rating',
    order: validOrders.includes(order) ? order : 'desc',
  };
}

/**
 * 排序字段映射到数据库字段
 */
const SORT_FIELD_MAP: Record<SortField, string> = {
  rating: 'doubanRating',
  releaseDate: 'releaseDate',
  title: 'title',
  ratingCount: 'ratingCount',
};

/**
 * 分页获取电影列表
 * @param page 页码
 * @param limit 每页数量
 * @param sortConfig 排序配置
 */
export async function getMovies(
  page: number,
  limit: number = 24,
  sortConfig: SortConfig = { field: 'ratingCount', order: 'desc' },
): Promise<Movie[]> {
  const db = await getDatabase();
  const skip = (page - 1) * limit;

  // 根据排序配置选择排序字段和方向
  const sortField = SORT_FIELD_MAP[sortConfig.field];
  const sortDirection = sortConfig.order === 'asc' ? 1 : -1;

  const docs = await db
    .collection('movies')
    .find({})
    .sort({ [sortField]: sortDirection })
    .skip(skip)
    .limit(limit)
    .toArray();

  return docs.map(toMovie);
}

/**
 * 搜索电影
 * 支持按标题、导演、演员搜索
 */
export async function searchMovies(
  query: string,
  limit: number = 10,
): Promise<Movie[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const db = await getDatabase();
  const searchTerm = query.trim();

  // 使用正则表达式进行模糊搜索（支持中文）
  const regex = new RegExp(searchTerm, 'i');

  const docs = await db
    .collection('movies')
    .find({
      $or: [
        { title: regex },
        { originalTitle: regex },
        { director: regex },
        { cast: regex },
      ],
    })
    .limit(limit)
    .toArray();

  return docs.map(toMovie);
}
