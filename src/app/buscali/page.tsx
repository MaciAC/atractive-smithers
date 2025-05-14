"use client";

import { useState, useEffect, useCallback } from "react";
import MemeCard from "../../components/MemeCard";
import MemeModal from "../../components/MemeModal";
import allData from "../../../public/all_data.json";
import { Meme, Comment } from "../../types/meme";

const typedData = allData as Record<string, Meme>;
const MEMES_PER_PAGE = 36;
const TOTAL_MEMES = Object.keys(typedData).length;

type SortOption = 'date' | 'date_reverse' | 'likes' | 'comments';

export default function Searcher() {
  const [selectedMemeId, setSelectedMemeId] = useState<string | null>(null);
  const [memeIds, setMemeIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [visibleMemes, setVisibleMemes] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const searchInComments = (meme: Meme, query: string): boolean => {
    const searchInComment = (comment: Comment): boolean => {
      // Check comment text
      if (comment.text?.toLowerCase().includes(query)) return true;

      // Check commenter username
      if (comment.owner?.username?.toLowerCase().includes(query)) return true;

      // Check thread comments recursively
      if (comment.thread_comments?.some(searchInComment)) return true;

      return false;
    };

    return meme.comments?.some(searchInComment) || false;
  };

  const filterAndSortMemes = useCallback((query: string, sort: SortOption) => {
    const allIds = Object.keys(typedData);
    let filteredIds = allIds;

    // Apply search filter
    if (query) {
      const lowerQuery = query.toLowerCase();
      filteredIds = allIds.filter(id => {
        const meme = typedData[id];
        return (
          meme.caption?.toLowerCase().includes(lowerQuery) ||
          id.toLowerCase().includes(lowerQuery) ||
          searchInComments(meme, lowerQuery)
        );
      });
    }

    // Apply date range filter
    if (startDate || endDate) {
      filteredIds = filteredIds.filter(id => {
        const meme = typedData[id];
        const memeDate = meme.date.split('_')[0]; // Get YYYY-MM-DD part
        if (startDate && memeDate < startDate) return false;
        if (endDate && memeDate > endDate) return false;
        return true;
      });
    }

    // Apply sorting
    filteredIds.sort((a, b) => {
      const memeA = typedData[a];
      const memeB = typedData[b];

      switch (sort) {
        case 'likes':
          return memeB.likes - memeA.likes;
        case 'comments':
          return memeB.total_comments - memeA.total_comments;
        case 'date_reverse':
          return memeA.date.localeCompare(memeB.date);
        case 'date':
        default:
          return memeB.date.localeCompare(memeA.date);
      }
    });

    return filteredIds;
  }, [startDate, endDate]);

  const loadMoreMemes = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    const filteredAndSortedIds = filterAndSortMemes(searchQuery, sortBy);
    const remainingIds = filteredAndSortedIds.filter(id => !memeIds.includes(id));

    if (remainingIds.length === 0) {
      setHasMore(false);
      setIsLoading(false);
      return;
    }

    const newIds = remainingIds.slice(0, Math.min(MEMES_PER_PAGE, remainingIds.length));
    setMemeIds(prev => [...prev, ...newIds]);
    setHasMore(memeIds.length + newIds.length < filteredAndSortedIds.length);
    setIsLoading(false);
  }, [memeIds, isLoading, hasMore, searchQuery, sortBy, filterAndSortMemes]);

  // Reset and load initial memes when search, sort, or date filters change
  useEffect(() => {
    const filteredAndSortedIds = filterAndSortMemes(searchQuery, sortBy);
    const initialIds = filteredAndSortedIds.slice(0, MEMES_PER_PAGE);
    setMemeIds(initialIds);
    setHasMore(initialIds.length < filteredAndSortedIds.length);
    setVisibleMemes(new Set());
  }, [searchQuery, sortBy, startDate, endDate, filterAndSortMemes]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000
      ) {
        loadMoreMemes();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMoreMemes]);

  // Intersection Observer to detect when memes become visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const memeId = entry.target.getAttribute('data-meme-id');
            if (memeId) {
              setVisibleMemes(prev => new Set([...prev, memeId]));
            }
          }
        });
      },
      {
        rootMargin: '100px 0px',
        threshold: 0.1
      }
    );

    const memeElements = document.querySelectorAll('[data-meme-id]');
    memeElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [memeIds]);

  return (
    <main className="min-h-screen py-8">
      <div className="container">
        <div className="max-w-2xl mx-auto mb-8 space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Busca..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-gray-600 text-white font-mono"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-gray-600 text-white font-mono"
            >
              <option value="date">Més nous primer</option>
              <option value="date_reverse">Més antics primer</option>
              <option value="likes">Més likes primer</option>
              <option value="comments">Més comentaris primer</option>
            </select>
          </div>
          <div className="flex gap-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-gray-600 text-white font-mono"
              placeholder="Data inicial"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-gray-600 text-white font-mono"
              placeholder="Data final"
            />
          </div>
          {(searchQuery || startDate || endDate) && (
            <div className="text-gray-400 text-sm font-mono">
              Found {memeIds.length} results
              {searchQuery && ` for "${searchQuery}"`}
              {(startDate || endDate) && ` between ${startDate || '...'} and ${endDate || '...'}`}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-items-center gap-4 max-w-full mx-auto">
          {memeIds.map((memeId) => (
            <div key={memeId + 'card'} data-meme-id={memeId}>
              <MemeCard
                memeId={memeId}
                memeData={typedData[memeId]}
                onSelect={setSelectedMemeId}
                shouldLoadImage={visibleMemes.has(memeId)}
              />
            </div>
          ))}
        </div>
        {isLoading && (
          <div className="w-full flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600"></div>
          </div>
        )}
        {!hasMore && memeIds.length > 0 && (
          <div className="text-gray-500 text-center py-4 font-mono">
            {memeIds.length === TOTAL_MEMES
              ? `All ${TOTAL_MEMES} memes loaded`
              : `${memeIds.length} of ${TOTAL_MEMES} memes loaded`}
          </div>
        )}

        {selectedMemeId && (
          <MemeModal
            memeId={selectedMemeId}
            memeData={typedData[selectedMemeId]}
            onClose={() => setSelectedMemeId(null)}
          />
        )}
      </div>
    </main>
  );
}