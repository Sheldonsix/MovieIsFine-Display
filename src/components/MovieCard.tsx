import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { Movie } from "@/types/movie";
import { getPosterUrl } from "@/lib/imageUrl";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const t = useTranslations("MovieCard");
  const year = movie.releaseDate?.slice(0, 4);

  return (
    <Link
      href={`/movie/${movie.doubanId}`}
      className="focus-ring group block h-full rounded-sm no-underline hover:bg-transparent"
    >
      <article>
        <div className="relative aspect-2/3 overflow-hidden border border-[#dedede] bg-[#f3f3f3] p-[3px]">
          <div className="relative h-full overflow-hidden">
            <Image
              src={getPosterUrl(movie.poster)}
              alt={movie.title}
              fill
              className="object-cover transition-opacity group-hover:opacity-90"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 190px"
            />
          </div>
        </div>

        <div className="pt-2.5">
          <h2 className="line-clamp-1 text-sm font-normal text-[#3377aa] group-hover:underline">
            {movie.title}
            {year && <span className="ml-1 text-[#999]">({year})</span>}
          </h2>

          {movie.doubanRating > 0 && (
            <p className="mt-1 text-xs">
              <span className="mr-1 text-[#f39800]">★</span>
              <span className="rating-number font-semibold">{movie.doubanRating}</span>
              {movie.ratingCount ? (
                <span className="ml-1.5 text-[#999]">
                  ({movie.ratingCount.toLocaleString()}人评价)
                </span>
              ) : null}
            </p>
          )}

          <p className="mt-1 line-clamp-1 text-xs text-[#777]">
            {t("director")}：{movie.director}
          </p>
          <p className="mt-0.5 line-clamp-1 text-xs text-[#999]">
            {movie.genres.join(" / ")}
          </p>
        </div>
      </article>
    </Link>
  );
}
