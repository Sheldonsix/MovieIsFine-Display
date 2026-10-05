import MovieInfiniteList from "@/components/MovieInfiniteList";
import { fetchMovieCount, fetchMovies } from "@/app/actions";
import { parseSortString, type SortConfig } from "@/services/movieService";

export const revalidate = 3600;

interface HomeProps {
  searchParams: Promise<{ sort?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const sortConfig: SortConfig = params.sort
    ? parseSortString(params.sort)
    : { field: "rating", order: "desc" };
  const initialMovies = await fetchMovies(1, sortConfig);
  const movieCount = await fetchMovieCount();

  return (
    <section aria-labelledby="movie-catalog-title">
      <div className="mb-6 border-b border-[#e5e5e5] pb-4">
        <h1 id="movie-catalog-title" className="text-2xl font-bold text-[#333]">
          选电影
        </h1>
        <p className="mt-2 text-sm text-[#999]">
          从 <span className="font-medium text-[#666]">{movieCount}</span> 部电影中发现下一部值得看的作品
        </p>
      </div>

      <MovieInfiniteList initialMovies={initialMovies} initialSort={sortConfig} />
    </section>
  );
}
