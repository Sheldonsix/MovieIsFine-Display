import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Star, StarHalf } from 'lucide-react';
import { getAllDoubanIds, getMovieByDoubanId } from '@/services/movieService';
import MovieTimeline from '@/components/MovieTimeline';
import ParentalGuide from '@/components/ParentalGuide';
import { getPosterUrl } from '@/lib/imageUrl';

export const revalidate = 3600;

export async function generateStaticParams() {
  const doubanIds = await getAllDoubanIds();
  return doubanIds.map((doubanId) => ({ doubanId }));
}

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ doubanId: string }>;
}) {
  const { doubanId } = await params;
  const movie = await getMovieByDoubanId(doubanId);

  if (!movie) {
    notFound();
  }

  const year = movie.releaseDate?.slice(0, 4);

  const rating = Math.max(0, Math.min(10, movie.doubanRating));
  const starRating = Math.round(rating) / 2;

  const fullStars = Math.floor(starRating);
  const hasHalfStar = starRating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <article>
      <nav aria-label="面包屑导航" className="mb-5">
        <Link
          href="/"
          className="focus-ring inline-flex items-center gap-1 rounded-sm text-xs no-underline"
        >
          <ArrowLeft size={13} />
          返回电影列表
        </Link>
      </nav>

      <header className="border-b border-[#e5e5e5] pb-8">
        <h1 className="text-2xl font-bold leading-snug text-[#333] sm:text-[28px]">
          {movie.title}
          {year && (
            <span className="ml-2 font-normal text-[#888]">({year})</span>
          )}
        </h1>
        {movie.originalTitle && (
          <p className="mt-1 text-sm text-[#999]">{movie.originalTitle}</p>
        )}

        <div className="mt-6 grid gap-6 sm:grid-cols-[150px_minmax(0,1fr)] lg:grid-cols-[160px_minmax(0,1fr)_210px]">
          <div className="relative mx-auto aspect-2/3 w-[150px] overflow-hidden border border-[#dedede] bg-[#f3f3f3] p-1 sm:mx-0 lg:w-40">
            <div className="relative h-full">
              <Image
                src={getPosterUrl(movie.poster)}
                alt={movie.title}
                fill
                className="object-cover"
                priority
                sizes="160px"
              />
            </div>
          </div>

          <dl className="space-y-1.5 text-[13px] leading-6 text-[#555]">
            <DetailRow label="导演" value={movie.director} />
            <DetailRow label="编剧" value={movie.writers.join(' / ')} />
            <DetailRow label="主演" value={movie.cast.join(' / ')} />
            <DetailRow label="类型" value={movie.genres.join(' / ')} />
            <DetailRow label="语言" value={movie.language} />
            <DetailRow label="上映日期" value={movie.releaseDate} />
            <DetailRow label="片长" value={`${movie.duration} 分钟`} />
          </dl>

          <aside className="border-t border-[#e5e5e5] pt-5 sm:col-span-2 lg:col-span-1 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <p className="text-xs text-[#999]">豆瓣评分</p>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="rating-number text-[30px] leading-none">
                {movie.doubanRating}
              </span>
              <span className="text-xs text-[#999]">/ 10</span>
            </div>
            <div
              className="mt-1 flex gap-0.5"
              aria-label={`${movie.doubanRating} 分`}
            >
              {Array.from({ length: fullStars }, (_, i) => (
                <Star
                  key={`full-${i}`}
                  className="size-4 fill-[#f39800] text-[#f39800]"
                  aria-hidden="true"
                />
              ))}
              {hasHalfStar && (
                <span className="relative size-4" aria-hidden="true">
                  <Star className="absolute inset-0 size-4  text-[#d8d8d8]" />
                  <StarHalf className="absolute inset-0 size-4 fill-[#f39800] text-[#f39800]" />
                </span>
              )}
              {Array.from({ length: emptyStars }, (_, i) => (
                <Star
                  key={`empty-${i}`}
                  className="size-4 text-[#d8d8d8]"
                  aria-hidden="true"
                />
              ))}
            </div>
            {movie.ratingCount ? (
              <p className="mt-1 text-xs text-[#999]">
                {movie.ratingCount.toLocaleString()} 人评价
              </p>
            ) : null}
            {movie.doubanUrl && (
              <a
                href={movie.doubanUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs"
              >
                查看豆瓣条目
              </a>
            )}

            {movie.imdbId && (
              <div className="flex flex-col mt-5 border-t border-[#eeeeee] pt-4">
                <p className="text-xs text-[#999]">IMDb 评分</p>
                <a
                  href={`https://www.imdb.com/title/${movie.imdbId}/ratings/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`查看 IMDb 用户评分${movie.imdbRating ? `：${movie.imdbRating} 分` : ''}`}
                  className="focus-ring mt-1 inline-flex items-center gap-2 rounded px-1 py-1 text-[#333] no-underline transition-colors hover:bg-[#f5f5f5] hover:text-[#333]"
                >
                  <Star
                    size={28}
                    fill="currentColor"
                    strokeWidth={1.5}
                    aria-hidden="true"
                    className="shrink-0 text-[#f5c518]"
                  />
                  <span>
                    <span className="flex items-baseline gap-0.5 leading-none">
                      <span className="text-xl font-bold tabular-nums">
                        {movie.imdbRating || '暂无'}
                      </span>
                      {movie.imdbRating ? (
                        <span className="text-xs font-normal text-[#777]">
                          /10
                        </span>
                      ) : null}
                    </span>
                    {movie.imdbRatingCount ? (
                      <span className="mt-1 block text-xs text-[#777]">
                        {movie.imdbRatingCount.toLocaleString('en-US', {
                          notation: 'compact',
                          maximumFractionDigits: 1,
                        })}
                      </span>
                    ) : null}
                  </span>
                </a>
                {movie.imdbId && (
                  <a
                    href={`https://www.imdb.com/title/${movie.imdbId}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs"
                  >
                    查看 IMDb 条目
                  </a>
                )}
              </div>
            )}
          </aside>
        </div>
      </header>

      <div className="max-w-[760px] space-y-9 pt-8">
        <section>
          <h2 className="section-heading">{movie.title}的剧情简介</h2>
          <p className="mt-4 indent-[2em] whitespace-pre-line text-[14px] leading-7 text-[#555]">
            {movie.synopsis}
          </p>
        </section>

        {movie.plotPoints && movie.plotPoints.length > 0 && (
          <section>
            <h2 className="section-heading">剧情时间轴</h2>
            <div className="mt-5">
              <MovieTimeline
                duration={movie.duration}
                plotPoints={movie.plotPoints}
              />
            </div>
          </section>
        )}

        {movie.parentalGuide && (
          <section>
            <h2 className="section-heading">家长指南</h2>
            <div className="mt-5">
              <ParentalGuide guide={movie.parentalGuide} />
            </div>
          </section>
        )}
      </div>
    </article>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <dt className="shrink-0 text-[#999]">{label}：</dt>
      <dd>{value || '暂无'}</dd>
    </div>
  );
}
