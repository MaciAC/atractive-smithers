"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import MemeModal from "../../components/MemeModal";
import allData from "../../../public/all_data.json";
import { Meme, Comment } from "../../types/meme";

const typedData = allData as Record<string, Meme>;
const COMMENTS_PER_PAGE = 20;

type SortOption = 'likes' | 'date';

interface CommentWithContext {
  comment: Comment;
  memeId: string;
  memeCaption: string | null;
}

export default function Comments() {
  const [comments, setComments] = useState<CommentWithContext[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>('likes');
  const [selectedMemeId, setSelectedMemeId] = useState<string | null>(null);

  // Pre-process all comments once when component mounts
  const allComments = useMemo(() => {
    const comments: CommentWithContext[] = [];

    Object.entries(typedData).forEach(([memeId, meme]) => {
      const processComment = (comment: Comment) => {
        comments.push({
          comment,
          memeId,
          memeCaption: meme.caption
        });

        comment.thread_comments?.forEach(threadComment => {
          processComment(threadComment);
        });
      };

      meme.comments?.forEach(comment => processComment(comment));
    });

    return comments;
  }, []);

  // Memoize filtered and sorted comments
  const filteredAndSortedComments = useMemo(() => {
    let filtered = allComments;

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = allComments.filter(({ comment }) =>
        comment.owner.username?.toLowerCase().includes(lowerQuery) ||
        comment.text.toLowerCase().includes(lowerQuery)
      );
    }

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'likes':
          return b.comment.likes - a.comment.likes;
        case 'date':
        default:
          return b.memeId.localeCompare(a.memeId);
      }
    });
  }, [allComments, searchQuery, sortBy]);

  const loadMoreComments = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    const remainingComments = filteredAndSortedComments.filter(
      comment => !comments.some(c =>
        c.comment === comment.comment && c.memeId === comment.memeId
      )
    );

    if (remainingComments.length === 0) {
      setHasMore(false);
      setIsLoading(false);
      return;
    }

    const newComments = remainingComments.slice(0, Math.min(COMMENTS_PER_PAGE, remainingComments.length));
    setComments(prev => [...prev, ...newComments]);
    setHasMore(comments.length + newComments.length < filteredAndSortedComments.length);
    setIsLoading(false);
  }, [comments, isLoading, hasMore, filteredAndSortedComments]);

  // Reset and load initial comments when search or sort changes
  useEffect(() => {
    const initialComments = filteredAndSortedComments.slice(0, COMMENTS_PER_PAGE);
    setComments(initialComments);
    setHasMore(initialComments.length < filteredAndSortedComments.length);
  }, [filteredAndSortedComments]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000
      ) {
        loadMoreComments();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMoreComments]);

  return (
    <main className="min-h-screen py-8">
      <div className="container">
        <div className="max-w-2xl mx-auto mb-8 space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search by username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-gray-600 text-white font-mono"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-gray-600 text-white font-mono"
            >
              <option value="likes">Sort by Likes</option>
              <option value="date">Sort by Date</option>
            </select>
          </div>
          {searchQuery && (
            <div className="text-gray-400 text-sm font-mono">
              Found {comments.length} comments from user &quot;{searchQuery}&quot;
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {comments.map(({ comment, memeId, memeCaption }, index) => (
            <div
              key={`${memeId}-${index}`}
              className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors cursor-pointer"
              onClick={() => setSelectedMemeId(memeId)}
            >
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{comment.owner.username}</span>
                  {comment.owner.is_verified && (
                    <span className="text-blue-400">✓</span>
                  )}
                </div>
                <div className="text-sm text-gray-400">
                  {comment.likes} likes
                </div>
              </div>
              <p className="text-white mb-4">{comment.text}</p>
              {memeCaption && (
                <div className="text-sm text-gray-400 italic">
                  Comment on: &quot;{memeCaption}&quot;
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
            No more comments to load
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