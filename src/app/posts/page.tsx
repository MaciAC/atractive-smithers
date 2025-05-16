"use client";

import { useState, useEffect, useCallback } from "react";
import MemeCard from "../../components/MemeCard";
import MemeModal from "../../components/MemeModal";
import { Post, Multimedia, Comment } from "@/lib/db";
import { Meme } from "@/types/meme";

const MEMES_PER_PAGE = 36;

type SortOption = 'date' | 'date_reverse' | 'likes' | 'comments';

export default function Searcher() {
  const [selectedMemeId, setSelectedMemeId] = useState<string | null>(null);
  const [memes, setMemes] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [visibleMemes, setVisibleMemes] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [selectedMemeData, setSelectedMemeData] = useState<Post | null>(null);

  const loadMemes = useCallback(async (newSearch = false) => {
    if (isLoading) return;

    setIsLoading(true);
    const currentPage = newSearch ? 1 : page;

    try {
      const url = new URL('/api/search', window.location.origin);
      if (searchQuery) {
        url.searchParams.append('q', searchQuery);
      }
      url.searchParams.append('sort', sortBy);
      if (startDate) {
        url.searchParams.append('start', startDate);
      }
      if (endDate) {
        url.searchParams.append('end', endDate);
      }
      url.searchParams.append('page', currentPage.toString());
      url.searchParams.append('limit', MEMES_PER_PAGE.toString());

      const response = await fetch(url);
      const data = await response.json();

      // Check for duplicate IDs
      const ids = new Set();
      const duplicates = data.posts?.filter((post: Post) => {
        if (ids.has(post.id)) return true;
        ids.add(post.id);
        return false;
      });
      if (duplicates?.length > 0) {
        console.warn('Found duplicate IDs:', duplicates.map((d: Post) => d.id));
      }

      if (newSearch) {
        setMemes(data.posts || []);
        setPage(1);
      } else {
        setMemes(prev => {
          // Create a Map of existing memes by ID
          const existingMemes = new Map(prev.map(meme => [meme.id, meme]));
          // Add new memes, overwriting any duplicates
          data.posts?.forEach((meme: Post) => {
            existingMemes.set(meme.id, meme);
          });
          // Convert back to array
          return Array.from(existingMemes.values());
        });
        setPage(currentPage + 1);
      }

      setTotalPosts(data.total || 0);
      setHasMore(data.hasMore || false);
    } catch (error) {
      console.error('Failed to fetch memes:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, page, searchQuery, sortBy, startDate, endDate]);

  // Load post data when a post is selected
  const loadPostData = useCallback(async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`);
      const data = await response.json();

      if (!data || !data.post) {
        console.error('Invalid response format:', data);
        return;
      }

      setSelectedMemeData(data.post);
    } catch (error) {
      console.error('Failed to fetch post data:', error);
    }
  }, []);

  // Reset and load initial memes when search, sort, or date filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      loadMemes(true);
    }, 300); // Debounce the search

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, sortBy, startDate, endDate]); // Remove loadMemes from dependencies

  // Load more memes when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000
      ) {
        if (!isLoading && hasMore) {
          loadMemes();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, hasMore]); // Remove loadMemes from dependencies

  // Load post data when selected
  useEffect(() => {
    if (selectedMemeId) {
      loadPostData(selectedMemeId);
    }
  }, [selectedMemeId, loadPostData]);

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
  }, [memes]);

  // Convert database format to Meme format
  const convertToMeme = (post: Post): Meme => {
    return {
      date: post.date.toString(),
      likes: post.likes,
      caption: post.caption,
      total_comments: post.total_comments,
      comments: [], // Comments will be loaded separately when opening the modal
      multimedia: post.multimedia.map(m => ({
        id: m.id,
        type: m.type,
        url: m.url,
        width: m.width,
        height: m.height,
        duration: m.duration,
        display_order: m.display_order
      }))
    };
  };

  return (
    <main className="min-h-screen py-8">
      <div className="container">
        <div className="max-w-2xl mx-auto mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
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
          <div className="flex gap-4 justify-center">
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
              N&apos;hi ha {totalPosts}
              {searchQuery && ` buscant "${searchQuery}"`}
              {(startDate || endDate) && ` entre ${startDate || 'el principi dels temps'} i ${endDate || 'última update'}`}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-items-center gap-4 max-w-full mx-auto">
          {memes.filter(meme => meme.multimedia && meme.multimedia.length > 0).map((meme) => (
            <div key={meme.id} data-meme-id={meme.id}>
              <MemeCard
                memeId={meme.id}
                memeData={convertToMeme(meme)}
                onSelect={setSelectedMemeId}
                shouldLoadImage={visibleMemes.has(meme.id)}
              />
            </div>
          ))}
        </div>
        {isLoading && (
          <div className="w-full flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600"></div>
          </div>
        )}
        {!hasMore && memes.length > 0 && (
          <div className="text-gray-500 text-center py-4 font-mono">
            {memes.length === totalPosts
              ? `All ${totalPosts} memes loaded`
              : `${memes.length} of ${totalPosts} memes loaded`}
          </div>
        )}

        {selectedMemeId && selectedMemeData && (
          <MemeModal
            memeId={selectedMemeId}
            memeData={{
              date: selectedMemeData.date.toString(),
              likes: selectedMemeData.likes,
              caption: selectedMemeData.caption,
              total_comments: selectedMemeData.total_comments,
              multimedia: selectedMemeData.multimedia.map((m: Multimedia) => ({
                id: m.id,
                type: m.type,
                url: m.url,
                width: m.width,
                height: m.height,
                duration: m.duration,
                display_order: m.display_order
              })),
              comments: selectedMemeData.comments.map((comment: Comment) => ({
                text: comment.text,
                likes: comment.likes,
                owner: {
                  id: comment.owner?.id || '',
                  username: comment.owner?.username || '',
                  is_verified: comment.owner?.is_verified || false,
                  profile_pic_url: comment.owner?.profile_pic_url || ''
                },
                thread_comments: comment.thread_comments?.map((tc: Comment) => ({
                  text: tc.text,
                  likes: tc.likes,
                  owner: {
                    id: tc.owner?.id || '',
                    username: tc.owner?.username || '',
                    is_verified: tc.owner?.is_verified || false,
                    profile_pic_url: tc.owner?.profile_pic_url || ''
                  }
                })) || []
              }))
            }}
            onClose={() => setSelectedMemeId(null)}
          />
        )}
      </div>
    </main>
  );
}