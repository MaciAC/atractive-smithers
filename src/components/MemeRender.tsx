import { Meme } from "@/types/meme";
import { HeartIcon, ChatBubbleLeftIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { parseISO, isValid, format } from "date-fns";

interface MemeFile {
    key: string;
    url: string;
  }

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
            <div className="mb-4 p-3 sm:p-4 bg-gray-700/40 sm:bg-gray-800/50 backdrop-blur-md rounded-lg">
              <p className="text-gray-200 sm:text-gray-300 text-xs sm:text-sm font-mono">{memeData.caption}</p>
            </div>
          )}
          <div className="divide-y divide-gray-700/50">
            {memeData.comments.map((comment, index) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MemeRender({ memeId, memeData, onClose, variant = 'modal' }: MemeRenderProps) {
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

    // Inline variant with responsive layout
    if (variant === 'inline') {
        return (
            <div className="flex flex-col h-auto max-h-[80vh] w-full max-w-3xl rounded-xl overflow-hidden border border-gray-700 backdrop-blur-md bg-gray-800/70">
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

                <div className="flex flex-col md:flex-row overflow-hidden">
                    {/* Image Section - responsive */}
                    <div className="w-full md:w-2/3 aspect-video md:aspect-auto p-2 flex items-center justify-center bg-gray-800/60 backdrop-blur-sm relative">
                        {isLoading ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-400"></div>
                        ) : (
                            <>
                                <div className="relative w-full h-full max-h-[50vh]">
                                    <Image
                                        src={memeFiles[currentImageIndex]?.url || ''}
                                        alt={`Meme ${memeId}`}
                                        width={800}
                                        height={800}
                                        className="object-contain w-full h-full"
                                    />
                                </div>
                                {memeFiles.length > 1 && (
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
                                            {currentImageIndex + 1} / {memeFiles.length}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    {/* Comments Section - responsive */}
                    <div className="w-full md:w-1/3 border-t md:border-t-0 md:border-l border-gray-700/50 bg-gray-800/50 backdrop-blur-md h-[300px] md:h-auto">
                        <CommentSection memeData={memeData} />
                    </div>
                </div>
            </div>
        );
    }

    // Original modal view with improved scrolling
    return (
        <div className="flex flex-col h-full">
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

            <div className="flex flex-1 min-h-0">
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

                {/* Comments Section with improved scrolling */}
                <div className="w-1/3 border-l border-gray-800 h-full">
                    <CommentSection memeData={memeData} isModal={true} />
                </div>
            </div>
        </div>
    );
}
