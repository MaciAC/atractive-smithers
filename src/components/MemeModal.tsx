"use client";

import { Meme } from "../types/meme";
import MemeRender from "./MemeRender";
import { HeartIcon, ChatBubbleLeftIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { Multimedia, Comment } from "@/lib/db";

interface MemeModalProps {
  memeId: string;
  memeData?: Meme;
  onClose: () => void;
  isVisible: boolean;
}

export default function MemeModal({ memeId, memeData: initialMemeData, onClose, isVisible }: MemeModalProps) {
  const [memeData, setMemeData] = useState<Meme | null>(initialMemeData || null);
  const [isLoading, setIsLoading] = useState(!initialMemeData);

  useEffect(() => {
    if (isVisible && !memeData) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/posts/${memeId}?includeFiles=true`);
          const data = await response.json();

          if (!data || !data.post) {
            console.error('Invalid response format:', data);
            return;
          }

          console.log('API Response:', data);
          console.log('Multimedia data:', data.post.multimedia);

          // Ensure we have valid multimedia data
          const multimedia = data.post.multimedia?.map((m: Multimedia) => {
            console.log('Processing media item:', m);
            return {
              id: m.id,
              type: m.type || (m.url?.toLowerCase().endsWith('.mp4') ? 'video' : 'image'),
              url: m.url,
              width: m.width,
              height: m.height,
              duration: m.duration,
              display_order: m.display_order
            };
          }) || [];

          console.log('Processed multimedia:', multimedia);

          setMemeData({
            date: data.post.date?.toString() || new Date().toISOString(),
            likes: data.post.likes || 0,
            caption: data.post.caption || '',
            total_comments: data.post.total_comments || 0,
            multimedia,
            comments: data.post.comments?.map((comment: Comment) => ({
              text: comment.text,
              likes: comment.likes,
              owner: {
                id: comment.user?.id || '',
                username: comment.user?.username || '',
                is_verified: comment.user?.is_verified || false,
                profile_pic_url: comment.user?.profile_pic_url || ''
              },
              thread_comments: comment.thread_comments?.map((tc: Comment) => ({
                text: tc.text,
                likes: tc.likes,
                owner: {
                  id: tc.user?.id || '',
                  username: tc.user?.username || '',
                  is_verified: tc.user?.is_verified || false,
                  profile_pic_url: tc.user?.profile_pic_url || ''
                }
              })) || []
            })) || []
          });
        } catch (error) {
          console.error('Failed to fetch post data:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [isVisible, memeId]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isVisible) {
      const timer = setTimeout(() => {
        setMemeData(null);
        setIsLoading(true);
      }, 300); // Match the fade out duration
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-in-out"
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none'
      }}
      onClick={onClose}
    >
      <div
        className="backdrop-blur-lg rounded-lg overflow-hidden flex flex-col transition-all duration-300 ease-in-out"
        style={{
          transform: isVisible ? 'scale(1)' : 'scale(0.98)',
          filter: isVisible ? 'blur(0)' : 'blur(4px)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading ? (
          <div className="flex flex-col h-auto w-full max-w-3xl rounded-xl overflow-hidden border border-gray-700 bg-gray-900/50">
            <div className="flex items-center justify-between p-3 border-b border-gray-800/70">
              <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none">
                <span className="text-gray-300 font-mono text-sm whitespace-nowrap">#{memeId}</span>
                <div className="flex items-center space-x-3 text-gray-400">
                  <div className="flex items-center space-x-1 whitespace-nowrap">
                    <HeartIcon className="w-3.5 h-3.5" />
                    <span className="text-sm">...</span>
                  </div>
                  <div className="flex items-center space-x-1 whitespace-nowrap">
                    <ChatBubbleLeftIcon className="w-3.5 h-3.5" />
                    <span className="text-sm">...</span>
                  </div>
                  <div className="flex items-center space-x-1 whitespace-nowrap">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span className="text-sm">...</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row overflow-hidden" style={{ height: 'calc(80vh - 50px)' }}>
              <div className="w-full md:w-2/3 h-full relative flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-400"></div>
              </div>
              <div className="w-full md:w-1/3 border-t md:border-t-0 md:border-l border-gray-700/50 h-full overflow-hidden">
                <div className="h-full flex flex-col">
                  <div className="flex-1 overflow-y-auto overflow-x-hidden discreet-scrollbar p-3 sm:p-4 pb-4">
                    <div className="space-y-4">
                      <div className="animate-pulse h-4 bg-gray-700/50 rounded w-3/4"></div>
                      <div className="animate-pulse h-4 bg-gray-700/50 rounded w-1/2"></div>
                      <div className="animate-pulse h-4 bg-gray-700/50 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <MemeRender memeId={memeId} memeData={memeData!} onClose={onClose} />
        )}
      </div>
    </div>
  );
}