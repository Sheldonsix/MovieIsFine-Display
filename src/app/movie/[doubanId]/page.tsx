import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMovieByDoubanId, getAllDoubanIds } from "@/services/movieService";
import MovieTimeline from "@/components/MovieTimeline";
import ParentalGuide from "@/components/ParentalGuide";
import { getPosterUrl } from "@/lib/imageUrl";

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

  return (
    <div className="space-y-4">
      {/* Breadcrumb - 90s style navigation */}
      <nav className="panel-90s p-2">
        <div className="flex items-center text-sm font-bold">
          <Link
            href="/"
            className="flex items-center hover:text-[#FF0000]"
          >
            <span className="mr-1">◄</span>
            返回首页
          </Link>
          <span className="mx-2 text-[#808080]">»</span>
          <span className="text-[#000080] truncate max-w-50 md:max-w-none">{movie.title}</span>
        </div>
      </nav>

      {/* Main Movie Window */}
      <div className="window-90s">
        {/* Title bar */}
        <div className="win95-titlebar flex items-center justify-between">
          <span className="text-sm sm:text-base truncate">🎬 {movie.title}</span>
          <div className="flex gap-1 shrink-0">
            <button className="btn-90s px-2 py-0 text-xs">_</button>
            <button className="btn-90s px-2 py-0 text-xs">□</button>
            <button className="btn-90s btn-90s-danger px-2 py-0 text-xs">×</button>
          </div>
        </div>

        {/* Window content */}
        <div className="panel-90s-content p-4">
          {/* Movie header - poster and basic info */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Poster with bevel */}
            <div className="shrink-0 mx-auto md:mx-0">
              <div className="bevel-inset p-2 bg-[#000080]">
                <div className="relative w-48 md:w-64 aspect-[2/3]">
                  <Image
                    src={getPosterUrl(movie.poster)}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
              {/* NEW badge if recent */}
              <div className="text-center mt-2">
                <span className="inline-block bg-[#FF0000] text-white font-bold px-2 py-1 text-xs animate-pulse-glow bevel-outset">
                  ★ HOT ★
                </span>
              </div>
            </div>

            {/* Movie info */}
            <div className="flex-1 space-y-4">
              {/* Title */}
              <div>
                <h1 className="heading-90s text-2xl md:text-4xl text-rainbow">
                  {movie.title}
                </h1>
                {movie.originalTitle && (
                  <p className="text-lg text-[#808080] font-bold mt-1">
                    {movie.originalTitle}
                  </p>
                )}
              </div>

              {/* Rating badges - table style */}
              <div className="flex flex-wrap gap-4">
                {/* Douban Rating */}
                <a
                  href={movie.doubanUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bevel-outset bg-[#00AA00] p-2 flex items-center gap-2 no-underline"
                >
                  <span className="font-bold text-white text-xs">豆瓣</span>
                  <div className="bg-white bevel-inset px-2 py-1">
                    <span className="mono-90s text-xl font-bold text-[#00AA00]">{movie.doubanRating}</span>
                    <span className="text-xs text-[#808080]">/10</span>
                  </div>
                  {movie.ratingCount && (
                    <span className="text-xs text-white font-bold">
                      {(movie.ratingCount / 10000).toFixed(1)}W
                    </span>
                  )}
                </a>

                {/* IMDb Rating */}
                {movie.imdbId && (
                  <a
                    href={`https://www.imdb.com/title/${movie.imdbId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bevel-outset bg-[#FFCC00] p-2 flex items-center gap-2 no-underline"
                  >
                    <span className="font-bold text-black text-xs">IMDb</span>
                    {movie.imdbRating ? (
                      <>
                        <div className="bg-white bevel-inset px-2 py-1">
                          <span className="mono-90s text-xl font-bold text-[#000000]">{movie.imdbRating}</span>
                          <span className="text-xs text-[#808080]">/10</span>
                        </div>
                        {movie.imdbRatingCount && (
                          <span className="text-xs text-black font-bold">
                            {movie.imdbRatingCount >= 10000
                              ? `${(movie.imdbRatingCount / 10000).toFixed(1)}W`
                              : movie.imdbRatingCount.toLocaleString()}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-xs font-bold text-black mono-90s">{movie.imdbId}</span>
                    )}
                  </a>
                )}
              </div>

              {/* Genres as colored boxes */}
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre, index) => {
                  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
                  const bgColor = colors[index % colors.length];
                  const textColor = ['#FFFF00', '#00FF00', '#00FFFF'].includes(bgColor) ? '#000000' : '#FFFFFF';
                  return (
                    <span
                      key={genre}
                      className="bevel-outset px-2 py-1 text-xs font-bold uppercase"
                      style={{ backgroundColor: bgColor, color: textColor }}
                    >
                      {genre}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Groove divider */}
          <div className="hr-groove my-6"></div>

          {/* Two column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Synopsis & Content */}
            <div className="lg:col-span-8 space-y-6">
              {/* Synopsis Section */}
              <section className="window-90s">
                <div className="win95-titlebar text-sm">
                  📖 剧情简介
                </div>
                <div className="panel-90s-content p-4">
                  <p className="text-base leading-relaxed">
                    {movie.synopsis}
                  </p>
                </div>
              </section>

              {/* Timeline Section */}
              {movie.plotPoints && movie.plotPoints.length > 0 && (
                <section className="window-90s">
                  <div className="win95-titlebar text-sm flex items-center justify-between">
                    <span>⏱️ 剧情时间轴</span>
                    <span className="bg-[#FF0000] text-white px-2 text-xs font-bold animate-blink">
                      NEW!
                    </span>
                  </div>
                  <div className="panel-90s-content p-4 bg-[#FFFFCC]">
                    <MovieTimeline
                      duration={movie.duration}
                      plotPoints={movie.plotPoints}
                    />
                  </div>
                </section>
              )}

              {/* Parental Guide Section */}
              {movie.parentalGuide && (
                <section className="window-90s">
                  <div className="win95-titlebar text-sm">
                    ⚠️ 家长指南
                  </div>
                  <div className="panel-90s-content p-4">
                    <ParentalGuide guide={movie.parentalGuide} />
                  </div>
                </section>
              )}
            </div>

            {/* Right Column: Meta Info - Table style */}
            <div className="lg:col-span-4">
              <div className="window-90s sticky top-4">
                <div className="win95-titlebar text-sm">
                  📋 影片详细信息
                </div>
                <div className="panel-90s-content">
                  {/* Table-like layout with alternating rows */}
                  <div className="divide-y-2 divide-[#808080]">
                    <InfoRow label="导演" value={movie.director} icon="🎬" even />
                    <InfoRow label="编剧" value={movie.writers.join(" / ")} icon="✍️" />
                    <InfoRow label="主演" value={movie.cast.join(" / ")} icon="🎭" even />
                    <InfoRow label="类型" value={movie.genres.join(" · ")} icon="📽️" />
                    <InfoRow label="语言" value={movie.language} icon="🌐" even />
                    <InfoRow label="上映日期" value={movie.releaseDate} icon="📅" />
                    <InfoRow label="片长" value={`${movie.duration} 分钟`} icon="⏱️" even />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Construction stripe decoration at bottom */}
      <div className="bg-construction h-6 bevel-inset"></div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  icon,
  even = false
}: {
  label: string;
  value: string;
  icon?: string;
  even?: boolean;
}) {
  return (
    <div className={`p-3 ${even ? 'bg-[#FFFFFF]' : 'bg-[#E8E8E8]'}`}>
      <div className="flex items-start gap-2">
        <span className="text-base">{icon}</span>
        <div className="flex-1">
          <div className="text-xs font-bold text-[#808080] uppercase tracking-wide mb-1">
            {label}
          </div>
          <div className="text-sm font-bold text-black leading-relaxed">
            {value}
          </div>
        </div>
      </div>
    </div>
  );
}
