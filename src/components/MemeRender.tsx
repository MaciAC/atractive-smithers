"use client";

import { Meme } from "@/types/meme";
import { HeartIcon, ChatBubbleLeftIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { useState, useRef, useEffect } from "react";
import { parseISO, isValid, format } from "date-fns";

interface MemeRenderProps {
  memeId: string;
  memeData: Meme;
  onClose: () => void;
  variant?: 'modal' | 'inline';
}

// Completely revise the CommentSection component to handle its own scrolling
function CommentSection({ memeData, isModal = false }: { memeData: Meme; isModal?: boolean }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollHeight, setScrollHeight] = useState<number | null>(null);

  useEffect(() => {
    if (isModal && scrollContainerRef.current) {
      const calculateHeight = () => {
        const windowHeight = window.innerHeight;
        const containerRect = scrollContainerRef.current?.getBoundingClientRect();
        if (containerRect) {
          const topPosition = containerRect.top;
          const availableHeight = windowHeight - topPosition - 16;
          setScrollHeight(availableHeight);
        }
      };

      calculateHeight();
      window.addEventListener('resize', calculateHeight);

      return () => {
        window.removeEventListener('resize', calculateHeight);
      };
    }
  }, [isModal]);

  return (
    <div className="h-full flex flex-col" ref={scrollContainerRef}>
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden discreet-scrollbar"
        style={{
          ...(scrollHeight ? { maxHeight: `${scrollHeight}px` } : {}),
          // Explicit scrollbar styling
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(75, 85, 99, 0.3) transparent',
        }}
      >
        <div className="p-3 sm:p-4 pb-4">
          {memeData.caption && (
            <div className="mb-4 p-3 sm:p-4 rounded-lg">
              <p className="text-gray-200 sm:text-gray-300 text-xs sm:text-sm font-mono">{memeData.caption}</p>
            </div>
          )}
          <div className="divide-y divide-gray-700/50">
            {memeData.comments.length > 0 ? (
              memeData.comments.map((comment, index) => (
              <div key={index} className="py-3 sm:py-4 space-y-1 sm:space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-300 sm:text-gray-400 font-mono font-bold sm:font-normal text-sm">
                    {comment.owner.username}
                  </span>
                  {comment.owner.is_verified && (
                    <span className="text-blue-400 text-xs">✓</span>
                  )}
                </div>
                <p className="text-gray-200 sm:text-gray-300 text-xs sm:text-sm">{comment.text}</p>
                {comment.likes > 0 && (
                  <div className="flex items-center space-x-1 text-gray-400 sm:text-gray-500 text-xs">
                    <HeartIcon className="w-3 h-3" />
                    <span>{comment.likes}</span>
                  </div>
                )}
                {comment.thread_comments && comment.thread_comments.length > 0 && (
                  <div className="pl-4 mt-2 space-y-2 border-l border-gray-700">
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
              ))
            ) : (
              <div className="py-4 text-center text-gray-400 font-mono text-sm">
                sense comentaris...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MemeRender({ memeId, memeData }: MemeRenderProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % memeData.multimedia.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + memeData.multimedia.length) % memeData.multimedia.length);
  };

  // Parse the date - handle both old and new formats
  let parsedDate;
  let formattedDate = '';

  try {
    const dateString = memeData.date?.toString() || new Date().toISOString();
    // Try to parse directly first (for new format from PostgreSQL)
    parsedDate = parseISO(dateString);

    // If that fails, try the old format (YYYY-MM-DD_HH-mm-ss_UTC)
    if (!isValid(parsedDate) && dateString.includes('_')) {
      try {
        const [datePart, timePart] = dateString.split('_');
        if (timePart) {
          const timeWithColons = timePart.replace(/-/g, ':');
          const dateStr = `${datePart}T${timeWithColons}Z`;
          parsedDate = parseISO(dateStr);
        } else {
          // If only date part is available
          parsedDate = parseISO(datePart);
        }
      } catch (error) {
        console.error('Error parsing date:', error);
      }
    }

    // Format the date or fall back to a simple display
    formattedDate = isValid(parsedDate)
      ? format(parsedDate, 'MMM d, yyyy')
      : dateString.split('_')[0] || dateString.split('T')[0] || dateString;
  } catch (error) {
    console.error('Error formatting date:', error);
    formattedDate = 'Unknown date';
  }

  // Function to get the correct media URL
  const getMediaUrl = (url: string) => {
    try {
      console.log('Processing URL:', url);
      // If the URL is already a presigned URL, use it as is
      if (url.includes('X-Amz-Signature')) {
        console.log('Using presigned URL:', url);
        return url;
      }

      // If it's a direct object URL, use it as is
      if (url.startsWith('https://') && !url.includes('?')) {
        console.log('Using direct URL:', url);
        return url;
      }

      // If we can't determine the URL type, return as is
      console.log('Using original URL:', url);
      return url;
    } catch (error) {
      console.error('Error parsing URL:', error);
      return url;
    }
  };

  return (
    <div className="flex flex-col h-auto w-full max-w-3xl rounded-xl overflow-hidden border border-gray-700 bg-gray-900/50">
      <div className="flex items-center justify-between p-3 border-b border-gray-800/70">
        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none">
          <span className="text-gray-300 font-mono text-sm whitespace-nowrap">#{memeId}</span>
          <div className="flex items-center space-x-3 text-gray-400">
            <div className="flex items-center space-x-1 whitespace-nowrap">
              <HeartIcon className="w-3.5 h-3.5" />
              <span className="text-sm">{memeData.likes}</span>
            </div>
            <div className="flex items-center space-x-1 whitespace-nowrap">
              <ChatBubbleLeftIcon className="w-3.5 h-3.5" />
              <span className="text-sm">{memeData.total_comments}</span>
            </div>
            <div className="flex items-center space-x-1 whitespace-nowrap">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span className="text-sm">{formattedDate}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row overflow-hidden" style={{ height: 'calc(80vh - 50px)' }}>
        {/* Media Section - responsive */}
        <div className="w-full md:w-2/3 h-full relative flex items-center justify-center">
          {memeData.multimedia.length > 0 && (() => {
            const currentMedia = memeData.multimedia[currentImageIndex];
            console.log('Current media:', currentMedia);
            const isVideo = currentMedia.type === 'video';
            const mediaUrl = getMediaUrl(currentMedia.url);
            console.log('Final media URL:', mediaUrl);
            return isVideo ? (
              <video
                src={mediaUrl}
                controls
                autoPlay
                loop
                muted
                className="object-contain max-w-full max-h-full"
              />
            ) : (
              <img
                src={mediaUrl}
                alt={`Meme ${memeId}`}
                className="object-contain max-w-full max-h-full"
                loading="lazy"
              />
            );
          })()}

          {memeData.multimedia.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-md hover:bg-black/60 text-white p-1.5 rounded-full transition-colors"
              >
                ←
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-md hover:bg-black/60 text-white p-1.5 rounded-full transition-colors"
              >
                →
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full text-white text-xs font-mono">
                {currentImageIndex + 1} / {memeData.multimedia.length}
              </div>
            </>
          )}
        </div>
        {/* Comments Section - responsive */}
        <div className="w-full md:w-1/3 border-t md:border-t-0 md:border-l border-gray-700/50 h-full overflow-hidden">
          <CommentSection memeData={memeData} isModal={true} />
        </div>
      </div>
    </div>
  );
}
