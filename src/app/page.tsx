"use client";

import { Post, Comment, User } from "@/lib/db";
import { useState, useEffect } from "react";
import MemeRender from "@/components/MemeRender";
import { Meme } from "@/types/meme";

export default function Home() {
  const [randomMeme, setRandomMeme] = useState<{post: Post, comments: (Comment & {owner: User})[]} | null>(null);
  const [randomMemeId, setRandomMemeId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [allMemeIds, setAllMemeIds] = useState<string[]>([]);

  // Get all meme IDs when the component mounts
  useEffect(() => {
    const fetchMemeIds = async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        if (data.posts && data.posts.length > 0) {
          setAllMemeIds(data.posts.map((post: Post) => post.id));
          // Load initial random meme
          getRandomMeme(true, data.posts.map((post: Post) => post.id));
        }
      } catch (error) {
        console.error('Failed to fetch meme IDs:', error);
      }
    };

    fetchMemeIds();
  }, []);

  const getRandomMeme = async (isInitial = false, ids = allMemeIds) => {
    if (isLoading || ids.length === 0) return;
    setIsLoading(true);

    // First, hide the current meme if not initial load
    if (!isInitial) {
      setIsVisible(false);
    }

    const loadMeme = async () => {
      // Select a new meme
      let randomId;

      // Avoid selecting the same meme
      do {
        randomId = ids[Math.floor(Math.random() * ids.length)];
      } while (randomId === randomMemeId && ids.length > 1);

      try {
        const response = await fetch(`/api/posts/${randomId}`);
        const data = await response.json();

        // Update the meme state
        setRandomMeme(data);
        setRandomMemeId(randomId);

        // Show the new meme
        setIsVisible(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch meme:', error);
        setIsLoading(false);
      }
    };

    if (isInitial) {
      loadMeme();
    } else {
      // Wait for fade-out animation to complete
      setTimeout(loadMeme, 500);
    }
  };

  // Convert database format to Meme format
  const convertToMeme = (post: Post, comments: (Comment & {owner: User})[]): Meme => {
    return {
      date: post.date.toString(),
      likes: post.likes,
      caption: post.caption,
      total_comments: post.total_comments,
      comments: comments.map(comment => ({
        text: comment.text,
        likes: comment.likes,
        owner: {
          id: comment.owner?.id || '',
          username: comment.owner?.username || '',
          is_verified: comment.owner?.is_verified || false,
          profile_pic_url: comment.owner?.profile_pic_url || ''
        },
        thread_comments: comment.thread_comments?.map(tc => ({
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
    };
  };

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
              {randomMeme && randomMemeId && randomMeme.post && (
                <MemeRender
                  key={randomMemeId} // Force complete re-render on ID change
                  memeId={randomMemeId}
                  memeData={convertToMeme(randomMeme.post, randomMeme.comments)}
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