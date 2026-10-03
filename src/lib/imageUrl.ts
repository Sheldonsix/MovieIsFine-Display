/**
 * 图片 URL 工具函数
 * 根据环境变量拼接完整的图片 URL
 */

const IMAGE_CDN_URL = process.env.NEXT_PUBLIC_IMAGE_CDN_URL || "";

/**
 * 获取海报完整 URL
 * @param filename 文件名，如 "71b6cf84-a7eb-4498-b756-6f01f57bbbae.jpg"
 * @returns 完整 URL，如 "https://img.053000.xyz/71b6cf84-a7eb-4498-b756-6f01f57bbbae.jpg"
 */
export function getPosterUrl(filename: string): string {
  if (!filename) return "";

  // 如果已经是完整 URL，直接返回
  if (filename.startsWith("http://") || filename.startsWith("https://")) {
    return filename;
  }

  // 如果有 CDN URL，拼接
  if (IMAGE_CDN_URL) {
    return `${IMAGE_CDN_URL}/${filename}`;
  }

  // 降级：使用本地路径
  return `/posters/${filename}`;
}
