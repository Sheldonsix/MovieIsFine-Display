'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Movie } from '@/types/movie';
import MovieCard from './MovieCard';
import { fetchMovies } from '@/app/actions';
import type { SortConfig, SortField } from '@/services/movieService';
import { Star, Calendar, ArrowUp, ArrowDown, Type } from 'lucide-react';

interface MovieInfiniteListProps {
  initialMovies: Movie[];
  initialSort: SortConfig;
}

interface SortOption {
  field: SortField;
  label: string;
  icon: React.ReactNode;
}

const SORT_OPTIONS: SortOption[] = [
  { field: 'rating', label: '评分', icon: <Star className="w-4 h-4 stroke-[2px]" /> },
  { field: 'releaseDate', label: '首映日期', icon: <Calendar className="w-4 h-4 stroke-[2px]" /> },
  { field: 'title', label: '名称', icon: <Type className="w-4 h-4 stroke-[2px]" /> },
];

/**
 * Convert sort config to URL parameter string
 */
function sortConfigToString(config: SortConfig): string {
  return `${config.field}_${config.order}`;
}

export default function MovieInfiniteList({ initialMovies, initialSort }: MovieInfiniteListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [sortConfig, setSortConfig] = useState<SortConfig>(initialSort);
  const [isChangingSort, setIsChangingSort] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Reset state when initialMovies or initialSort changes
  useEffect(() => {
    setMovies(initialMovies);
    setPage(2);
    setHasMore(initialMovies.length > 0);
    setSortConfig(initialSort);
    setIsChangingSort(false);
  }, [initialMovies, initialSort]);

  const loadMoreMovies = useCallback(async () => {
    if (loading || !hasMore || isChangingSort) return;

    setLoading(true);
    try {
      const newMovies = await fetchMovies(page, sortConfig);

      if (newMovies.length === 0) {
        setHasMore(false);
      } else {
        setMovies((prev) => [...prev, ...newMovies]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Failed to load movies:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, sortConfig, isChangingSort]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isChangingSort) {
          loadMoreMovies();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    const target = observerTarget.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [loadMoreMovies, hasMore, isChangingSort]);

  // Handle sort button click: toggle order for same field, switch to field (default desc) for different field
  const handleSortClick = (field: SortField) => {
    let newConfig: SortConfig;

    if (sortConfig.field === field) {
      // Same field: toggle order
      newConfig = {
        field,
        order: sortConfig.order === 'desc' ? 'asc' : 'desc',
      };
    } else {
      // Different field: switch to that field, default descending
      newConfig = {
        field,
        order: 'desc',
      };
    }

    updateSort(newConfig);
  };

  // Update URL and trigger reload
  const updateSort = (newConfig: SortConfig) => {
    if (newConfig.field === sortConfig.field && newConfig.order === sortConfig.order) return;

    setIsChangingSort(true);
    const params = new URLSearchParams(searchParams.toString());

    // Default value (rating_desc) doesn't need to be shown in URL
    if (newConfig.field === 'rating' && newConfig.order === 'desc') {
      params.delete('sort');
    } else {
      params.set('sort', sortConfigToString(newConfig));
    }

    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : '/', { scroll: false });
  };

  return (
    <>
      <div className="subtle-box mb-7 flex flex-wrap items-center gap-3 px-3 py-2.5">
        <span className="text-xs text-[#999]">排序：</span>

        <div className="flex flex-wrap gap-2">
          {SORT_OPTIONS.map((option) => {
            const isActive = sortConfig.field === option.field;
            const isDesc = sortConfig.order === 'desc';

            return (
              <button
                key={option.field}
                onClick={() => handleSortClick(option.field)}
                disabled={isChangingSort}
                aria-pressed={isActive}
                className={`control focus-ring px-3 py-1
                  ${isActive
                    ? 'control-active'
                    : ''
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed`}
                title={
                  isActive
                    ? `当前${isDesc ? '降序' : '升序'}，点击切换${isDesc ? '升序' : '降序'}`
                    : `按${option.label}排序`
                }
              >
                {option.icon}
                <span>{option.label}</span>
                {/* Show arrow for active field */}
                {isActive && (
                  isDesc
                    ? <ArrowDown className="w-4 h-4 stroke-[2px]" />
                    : <ArrowUp className="w-4 h-4 stroke-[2px]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {movies.map((movie) => (
          <div key={movie.id}>
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>

      <div ref={observerTarget} className="flex justify-center py-8">
        {(loading || isChangingSort) && (
          <div className="subtle-box flex items-center gap-2 px-4 py-2 text-sm text-[#999]">
            <span className="size-1.5 rounded-full bg-[#00a65a]" />
            <span>
              {isChangingSort ? '切换排序中...' : '正在加载更多...'}
            </span>
          </div>
        )}
        {!hasMore && movies.length > 0 && !isChangingSort && (
          <p className="text-sm text-[#999]">已经浏览完全部电影</p>
        )}
      </div>
    </>
  );
}
