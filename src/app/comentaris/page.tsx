"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import MemeModal from "../../components/MemeModal";
import { debounce } from "lodash";

const COMMENTS_PER_PAGE = 50;

type SortOption = 'likes' | 'newest' | 'oldest' | 'shortest' | 'longest';

type CommentWithContext = {
  id: number;
  post_id: string;
  user_id: string;
  text: string;
  likes: number;
  parent_comment_id: number | null;
  created_at: Date;
  user: {
    id: string;
    username: string;
    is_verified: boolean;
    profile_pic_url: string | null;
  };
  thread_comments: Array<{
    id: number;
    text: string;
    likes: number;
    user: {
      id: string;
      username: string;
      is_verified: boolean;
      profile_pic_url: string | null;
    };
  }>;
  caption: string | null;
};

export default function Comments() {
  const [comments, setComments] = useState<CommentWithContext[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMemeId, setSelectedMemeId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalComments, setTotalComments] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>('likes');
  const [verifiedFilter, setVerifiedFilter] = useState<'any' | 'verified' | 'not_verified'>('any');
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Add a ref to track if we're currently fetching
  const isFetchingRef = useRef(false);

  // Fetch comments when search or sort changes
  const fetchComments = useCallback(async (newSearch = false) => {
    if (isLoading || isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsLoading(true);
    const currentPage = newSearch ? 1 : page;

    try {
      const url = new URL('/api/comments', window.location.origin);
      if (searchQuery) {
        url.searchParams.append('q', searchQuery);
      }
      url.searchParams.append('sort', sortBy);
      url.searchParams.append('page', currentPage.toString());
      url.searchParams.append('limit', COMMENTS_PER_PAGE.toString());
      if (verifiedFilter !== 'any') {
        url.searchParams.append('verified', verifiedFilter);
      }

      const response = await fetch(url);
      const data = await response.json();

      if (newSearch) {
        setComments(data.comments || []);
        setPage(1);
      } else {
        setComments(prev => {
          const existingIds = new Set(prev.map((c: CommentWithContext) => c.id));
          const newComments = (data.comments || []).filter((c: CommentWithContext) => !existingIds.has(c.id));
          return [...prev, ...newComments];
        });
        setPage(currentPage + 1);
      }

      setTotalComments(data.total || 0);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [isLoading, page, searchQuery, sortBy, verifiedFilter]);

  // Add debounced scroll handler
  const debouncedLoadMore = useCallback(
    debounce(() => {
      if (!isLoading && hasMore) {
        fetchComments();
      }
    }, 300),
    [fetchComments, isLoading, hasMore]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalVisible(false);
    // Wait for fade out animation before clearing data
    setTimeout(() => {
      setSelectedMemeId(null);
    }, 300);
  }, []);

  // Initial load
  useEffect(() => {
    fetchComments(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, sortBy, verifiedFilter]);

  // Handle infinite scroll with debounced handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000
      ) {
        debouncedLoadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      debouncedLoadMore.cancel(); // Cancel any pending debounced calls
    };
  }, [debouncedLoadMore]);

  // Load post data when selected
  useEffect(() => {
    if (selectedMemeId) {
      setIsModalVisible(true);
    }
  }, [selectedMemeId]);

  return (
    <main className="min-h-screen py-8">
      <div className="container">
        <div className="max-w-2xl mx-auto mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Busca..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-gray-600 text-white font-mono"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-gray-600 text-white font-mono"
            >
              <option value="likes">Més likes primer</option>
              <option value="newest">Més nous primer</option>
              <option value="oldest">Més antics primer</option>
              <option value="shortest">Més curts primer</option>
              <option value="longest">Més llargs primer</option>
            </select>
            <select
              value={verifiedFilter}
              onChange={(e) => setVerifiedFilter(e.target.value as 'any' | 'verified' | 'not_verified')}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-gray-600 text-white font-mono"
            >
              <option value="any">Tots els perfils</option>
              <option value="verified">Només verificats</option>
              <option value="not_verified">Només no verificats</option>
            </select>
          </div>
          {searchQuery && (
            <div className="text-gray-400 text-sm font-mono">
              Found {totalComments} comentaris buscant &quot;{searchQuery}&quot;
            </div>
          )}
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {comments.map((comment, index) => (
            <div
              key={`${comment.post_id}-${comment.id}-${index}`}
              className="backdrop-blur-sm rounded-xl p-6 hover:backdrop-blur-md transition-colors cursor-pointer h-full"
              onClick={() => setSelectedMemeId(comment.post_id)}
            >
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{comment.user?.username}</span>
                  {comment.user?.is_verified && (
                    <span className="text-blue-400">✓</span>
                  )}
                </div>
                <div className="text-sm text-gray-400">
                  {comment.likes} likes
                </div>
              </div>
              <p className="text-white mb-4">{comment.text}</p>
              {comment.caption && (
                <div className="text-sm text-gray-400 italic">
                  Comment on: &quot;{comment.caption}&quot;
                </div>
              )}
            </div>
          ))}
        </div>

        {isLoading && (
          <div className="w-full flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600"></div>
          </div>
        )}
        {!hasMore && comments.length > 0 && (
          <div className="text-gray-500 text-center py-4 font-mono">
            No n&apos;hi ha més...
          </div>
        )}

        {selectedMemeId && (
          <MemeModal
            memeId={selectedMemeId}
            onClose={handleCloseModal}
            isVisible={isModalVisible}
          />
        )}
      </div>
    </main>
  );
}