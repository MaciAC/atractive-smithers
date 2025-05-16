"use client";

import { useState, useEffect, useCallback } from "react";
import MemeModal from "../../components/MemeModal";
import { Comment, Post, User } from "@/lib/db";
import { Meme } from "@/types/meme";

const COMMENTS_PER_PAGE = 20;

interface CommentWithContext extends Comment {
  post_id: string;
  caption: string | null;
}

interface PostData {
  post: Post;
  comments: (Comment & {owner: User})[];
}

export default function Comments() {
  const [comments, setComments] = useState<CommentWithContext[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMemeId, setSelectedMemeId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [selectedMemeData, setSelectedMemeData] = useState<PostData | null>(null);
  const [totalComments, setTotalComments] = useState(0);
  const sortBy = 'likes';
  // Fetch comments when search or sort changes
  const fetchComments = useCallback(async (newSearch = false) => {
    if (isLoading) return;

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
    }
  }, [isLoading, page, searchQuery, sortBy]);

  const loadMoreComments = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchComments();
    }
  }, [fetchComments, isLoading, hasMore]);

  // Load post data when a post is selected
  const loadPostData = useCallback(async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`);
      const data = await response.json();
      setSelectedMemeData(data);
    } catch (error) {
      console.error('Failed to fetch post data:', error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchComments(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, sortBy]);

  // Handle infinite scroll
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

  // Load post data when selected
  useEffect(() => {
    if (selectedMemeId) {
      loadPostData(selectedMemeId);
    }
  }, [selectedMemeId, loadPostData]);

  // Convert database format to Meme format
  const convertToMeme = (post: Post, comments: (Comment & {owner: User})[]): Meme => {
    return {
      date: post.date.toString(),
      likes: post.likes,
      caption: post.caption,
      total_comments: post.total_comments,
      multimedia: post.multimedia || [],
      comments: comments.map(comment => ({
        text: comment.text,
        likes: comment.likes,
        owner: {
          id: comment.owner?.id || '',
          username: comment.owner?.username || '',
          is_verified: comment.owner?.is_verified || false,
          profile_pic_url: comment.owner?.profile_pic_url || ''
        },
        thread_comments: comment.thread_comments?.map(threadComment => ({
          text: threadComment.text,
          likes: threadComment.likes,
          owner: {
            id: threadComment.owner?.id || '',
            username: threadComment.owner?.username || '',
            is_verified: threadComment.owner?.is_verified || false,
            profile_pic_url: threadComment.owner?.profile_pic_url || ''
          }
        })) || []
      }))
    };
  };

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
                  <span className="font-bold text-white">{comment.owner?.username}</span>
                  {comment.owner?.is_verified && (
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

        {selectedMemeId && selectedMemeData && (
          <MemeModal
            memeId={selectedMemeId}
            memeData={convertToMeme(selectedMemeData.post, selectedMemeData.comments)}
            onClose={() => setSelectedMemeId(null)}
          />
        )}
      </div>
    </main>
  );
}