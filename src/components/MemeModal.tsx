"use client";

import { Meme } from "../types/meme";
import Image from "next/image";
import { useState, useEffect } from "react";
import { XMarkIcon, HeartIcon, ChatBubbleLeftIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { format, parseISO, isValid } from "date-fns";

interface MemeModalProps {
  memeId: string;
  memeData: Meme;
  onClose: () => void;
}

interface MemeFile {
  key: string;
  url: string;
}

export default function MemeModal({ memeId, memeData, onClose }: MemeModalProps) {
  const [memeFiles, setMemeFiles] = useState<MemeFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchMemeFiles = async () => {
      try {
        const response = await fetch(`/api/memes/${memeId}`);
        if (!response.ok) throw new Error('Failed to fetch meme files');
        const data = await response.json();
        setMemeFiles(data.files);
      } catch (error) {
        console.error('Error fetching meme files:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemeFiles();
  }, [memeId]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % memeFiles.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + memeFiles.length) % memeFiles.length);
  };

  // Parse the date from the ID format: YYYY-MM-DD_HH-mm-ss_UTC
  const [datePart, timePart] = memeData.date.split('_');
  const timeWithColons = timePart.replace(/-/g, ':');
  const dateStr = `${datePart}T${timeWithColons}Z`;
  const parsedDate = parseISO(dateStr);

  const formattedDate = isValid(parsedDate)
    ? format(parsedDate, 'MMM d, yyyy')
    : memeData.date.split('_')[0]; // Fallback to just the date part if parsing fails

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center space-x-4">
            <span className="text-gray-400 font-mono">#{memeId}</span>
            <div className="flex items-center space-x-4 text-gray-500">
              <div className="flex items-center space-x-1">
                <HeartIcon className="w-4 h-4" />
                <span>{memeData.likes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ChatBubbleLeftIcon className="w-4 h-4" />
                <span>{memeData.total_comments}</span>
              </div>
              <div className="flex items-center space-x-1">
                <CalendarIcon className="w-4 h-4" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Image Section */}
          <div className="w-2/3 p-4 flex items-center justify-center bg-gray-800 relative">
            {isLoading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600"></div>
            ) : (
              <>
                <div className="relative w-full h-full">
                  <Image
                    src={memeFiles[currentImageIndex]?.url || ''}
                    alt={`Meme ${memeId}`}
                    width={800}
                    height={800}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                {memeFiles.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      ←
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      →
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-mono">
                      {currentImageIndex + 1} / {memeFiles.length}
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* Comments Section */}
          <div className="w-1/3 border-l border-gray-800 overflow-y-auto">
            <div className="p-4">
              {memeData.caption && (
                <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-gray-300 text-sm font-mono">{memeData.caption}</p>
                </div>
              )}
              <div className="space-y-4">
                {memeData.comments.map((comment, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400 font-mono text-sm">
                        {comment.owner.username}
                      </span>
                      {comment.owner.is_verified && (
                        <span className="text-blue-400">✓</span>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm">{comment.text}</p>
                    {comment.likes > 0 && (
                      <div className="flex items-center space-x-1 text-gray-500 text-xs">
                        <HeartIcon className="w-3 h-3" />
                        <span>{comment.likes}</span>
                      </div>
                    )}
                    {comment.thread_comments && comment.thread_comments.length > 0 && (
                      <div className="pl-4 mt-2 space-y-2 border-l border-gray-800">
                        {comment.thread_comments.map((reply, replyIndex) => (
                          <div key={replyIndex} className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-400 font-mono text-sm">
                                {reply.owner.username}
                              </span>
                              {reply.owner.is_verified && (
                                <span className="text-blue-400">✓</span>
                              )}
                            </div>
                            <p className="text-gray-300 text-sm">{reply.text}</p>
                            {reply.likes > 0 && (
                              <div className="flex items-center space-x-1 text-gray-500 text-xs">
                                <HeartIcon className="w-3 h-3" />
                                <span>{reply.likes}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}