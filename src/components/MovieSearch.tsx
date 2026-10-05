"use client";

import { useState, useRef, useEffect, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import Image from "next/image";
import { searchMovies } from "@/app/actions";
import { Movie } from "@/types/movie";
import { getPosterUrl } from "@/lib/imageUrl";

export function MovieSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isPending, startTransition] = useTransition();

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  // Handle search input change
  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (value.trim().length === 0) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    // Debounced search
    debounceTimerRef.current = setTimeout(() => {
      startTransition(async () => {
        const searchResults = await searchMovies(value);
        setResults(searchResults);
        setIsOpen(true);
        setSelectedIndex(-1);
      });
    }, 300);
  }, []);

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navigate to movie detail page
  const navigateToMovie = useCallback(
    (doubanId: string) => {
      setIsOpen(false);
      setQuery("");
      router.push(`/movie/${doubanId}`);
    },
    [router]
  );

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          navigateToMovie(results[selectedIndex].doubanId);
        }
        break;
      case "Escape":
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  // Clear search
  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      <div className="relative z-50">
        <div className="flex items-center rounded-[3px] border border-[#c9c9c9] bg-white px-1 focus-within:border-[#8ab79b]">
          <Search
            className="ml-2 shrink-0 text-[#999]"
            size={17}
            strokeWidth={2}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.trim().length > 0 && setIsOpen(true)}
            placeholder="搜索电影、导演或演员"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isOpen}
            aria-controls="movie-search-results"
            className="form-input min-w-0 flex-1 px-2.5 py-2 text-sm"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="focus-ring mr-1 flex size-7 items-center justify-center rounded-sm text-[#999] hover:bg-[#f0f0f0] hover:text-[#555]"
              aria-label="清空搜索"
            >
              <X size={14} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="content-box absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden shadow-lg shadow-black/10">
          <div className="border-b border-[#e5e5e5] bg-[#f7f7f7] px-3 py-2 text-xs text-[#999]">
            搜索结果
          </div>
          <div id="movie-search-results" role="listbox" className="max-h-96 overflow-y-auto">
            {isPending ? (
              <div className="p-2 space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 bg-[#f7f7f7] p-2">
                    <div className="h-14 w-10 bg-[#e5e5e5]" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 bg-[#e5e5e5]" />
                      <div className="h-3 w-1/2 bg-[#e5e5e5]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              <ul>
                {results.map((movie, index) => (
                  <li key={movie.doubanId}>
                    <button
                      id={`movie-search-result-${index}`}
                      onClick={() => navigateToMovie(movie.doubanId)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      role="option"
                      aria-selected={index === selectedIndex}
                      className={`flex w-full items-center gap-3 border-b border-[#eeeeee] p-2.5 text-left last:border-b-0
                        ${index === selectedIndex
                          ? "bg-[#eef6f2] text-[#333]"
                          : "bg-white text-[#333] hover:bg-[#f7f7f7]"
                        }`}
                    >
                      <div className="shrink-0 overflow-hidden border border-[#e5e5e5]">
                        <div className="relative h-14 w-10">
                          <Image
                            src={getPosterUrl(movie.poster)}
                            alt={movie.title}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm truncate">
                          {movie.title}
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-[#999]">
                          <span>
                            {movie.releaseDate.slice(0, 4)}
                          </span>
                          <span className="truncate max-w-[120px]">{movie.director}</span>
                        </div>
                      </div>
                      {movie.doubanRating > 0 && (
                        <div className="shrink-0 px-2 py-1">
                          <span className="rating-number text-sm font-bold">
                            {movie.doubanRating}
                          </span>
                        </div>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-10 text-center">
                <p className="text-sm font-semibold">未找到与 &quot;{query}&quot; 相关的电影</p>
                <p className="mt-1 text-xs text-[#999]">换个关键词试试？</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
