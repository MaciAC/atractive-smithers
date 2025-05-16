"use client";

import { useState, useEffect, useCallback } from "react";
import MemeRender from "@/components/MemeRender";
import { Meme } from "@/types/meme";
import { Post, Comment } from "@/lib/db";

export default function Home() {
  const [randomMemeId, setRandomMemeId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [allMemeIds, setAllMemeIds] = useState<string[]>([]);
  const [memeData, setMemeData] = useState<Meme | null>(null);

  const fetchMemeIds = useCallback(async () => {
    try {
      const response = await fetch('/api/search?limit=1000');
      const data = await response.json();
      setAllMemeIds(data.posts.map((post: Post) => post.id));
    } catch (error) {
      console.error('Error fetching meme IDs:', error);
    }
  }, []);

  const getRandomMeme = useCallback(async (ids = allMemeIds) => {
    if (!ids.length) return;
    const randomIndex = Math.floor(Math.random() * ids.length);
    const randomId = ids[randomIndex];
    setIsLoading(true);
    try {
      const response = await fetch(`/api/posts/${randomId}`);
      const data = await response.json();

      if (!data || !data.post) {
        console.error('Invalid response format:', data);
        return;
      }

      setMemeData({
        date: data.post.date.toString(),
        likes: data.post.likes,
        caption: data.post.caption,
        total_comments: data.post.total_comments,
        multimedia: data.post.multimedia || [],
        comments: (data.comments || []).map((comment: Comment) => ({
          text: comment.text,
          likes: comment.likes,
          owner: {
            id: comment.user?.id || '',
            username: comment.user?.username || '',
            is_verified: comment.user?.is_verified || false,
            profile_pic_url: comment.user?.profile_pic_url || ''
          },
          thread_comments: (comment.thread_comments || []).map((tc: Comment) => ({
            text: tc.text,
            likes: tc.likes,
            owner: {
              id: tc.user?.id || '',
              username: tc.user?.username || '',
              is_verified: tc.user?.is_verified || false,
              profile_pic_url: tc.user?.profile_pic_url || ''
            }
          }))
        }))
      });
      setRandomMemeId(randomId);
      setIsVisible(true);
    } catch (error) {
      console.error('Error fetching random meme:', error);
    } finally {
      setIsLoading(false);
    }
  }, [allMemeIds]);

  useEffect(() => {
    fetchMemeIds();
  }, [fetchMemeIds]);

  useEffect(() => {
    getRandomMeme();
  }, [getRandomMeme]);


  return (
    <main className="pb-4 flex flex-col items-center justify-center">
      <div className="mx-auto px-4">
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col gap-4 items-center w-full max-w-3xl mx-auto">
            <button
              onClick={() => getRandomMeme()}
              className="bg-white p-1 text-emerald-300 text-2xl font-bold rounded hover:bg-emerald-300 hover:text-emerald-900"
              disabled={isLoading}
            >
              {isLoading ? "Espera..." : "DALEEEEE"}
            </button>

            <div
              className="transition-opacity duration-500 ease-in-out w-full flex justify-center backdrop-blur-2xl"
              style={{ opacity: isVisible ? 1 : 0 }}
            >
              {memeData && randomMemeId && (
                <MemeRender
                  key={randomMemeId}
                  memeId={randomMemeId}
                  memeData={memeData}
                  onClose={() => {}}
                  variant="inline"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}