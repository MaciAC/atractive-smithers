"use client";

import { useState, useEffect, useCallback } from "react";

type RandomContent = {
  multimedia: {
    id: number;
    type: 'image' | 'video';
    url: string;
    width: number | null;
    height: number | null;
    duration: number | null;
    display_order: number;
  };
  comments: Array<{
    text: string;
    likes: number;
    owner: {
      id: string;
      username: string;
      is_verified: boolean;
      profile_pic_url: string | null;
    };
  }>;
};

export default function Home() {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [randomContent, setRandomContent] = useState<RandomContent | null>(null);
  const [mediaError, setMediaError] = useState(false);

  const getRandomContent = useCallback(async () => {
    // First fade out
    setIsVisible(false);

    // Wait for fade out animation
    await new Promise(resolve => setTimeout(resolve, 300));

    // Clear content before loading new data
    setRandomContent(null);

    setIsLoading(true);
    setMediaError(false);
    try {
      const response = await fetch('/api/random');
      const data = await response.json();
      // Wait a bit before fading in
      await new Promise(resolve => setTimeout(resolve, 100));
      setRandomContent(data);
      setIsVisible(true);
    } catch (error) {
      console.error('Error fetching random content:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getRandomContent();
  }, [getRandomContent]);

  const handleMediaError = () => {
    setMediaError(true);
  };

  return (
    <main className="pb-4 flex flex-col items-center justify-center">
      <div className="mx-auto px-4">
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col gap-4 items-center w-full max-w-3xl mx-auto">
            <button
              onClick={() => getRandomContent()}
              className="bg-white p-1 text-emerald-300 text-2xl font-bold rounded hover:bg-emerald-300 hover:text-emerald-900"
              disabled={isLoading}
            >
              {isLoading ? "Espera..." : "DAAAAALE"}
            </button>

            <div
              className="transition-all duration-600 ease-in-out w-full flex flex-col gap-8 backdrop-blur-2xl"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'scale(1)' : 'scale(0.98)',
                filter: isVisible ? 'blur(0)' : 'blur(4px)'
              }}
            >
              {randomContent && (
                <div className="flex flex-col h-auto w-full max-w-3xl rounded-xl overflow-hidden border border-gray-700 bg-gray-900/50">
                  {/* Content */}
                  <div className="flex flex-col md:flex-row overflow-hidden" style={{ height: 'calc(80vh - 50px)' }}>
                    {/* Media Section */}
                    <div className="w-full md:w-2/3 h-full relative flex items-center justify-center">
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-400"></div>
                      ) : mediaError ? (
                        <div className="text-red-500">Error loading media. Try again!</div>
                      ) : randomContent.multimedia.type === 'image' ? (
                        <img
                          src={randomContent.multimedia.url}
                          alt="Random content"
                          className="object-contain max-w-full max-h-full"
                          onError={handleMediaError}
                        />
                      ) : (
                        <video
                          src={randomContent.multimedia.url}
                          controls
                          autoPlay
                          loop
                          muted
                          className="object-contain max-w-full max-h-full"
                          onError={handleMediaError}
                        />
                      )}
                    </div>

                    {/* Comments Section */}
                    <div className="w-full md:w-1/3 border-t md:border-t-0 md:border-l border-gray-700/50 h-full overflow-hidden">
                      <div className="h-full flex flex-col">
                        <div className="flex-1 overflow-y-auto overflow-x-hidden discreet-scrollbar p-3 sm:p-4">
                          <div className="divide-y divide-gray-700/50">
                            {randomContent.comments.map((comment, index) => (
                              <div key={index} className="py-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-bold text-white">{comment.owner.username}</span>
                                  {comment.owner.is_verified && (
                                    <span className="text-blue-400">✓</span>
                                  )}
                                </div>
                                <p className="text-gray-200 text-sm">{comment.text}</p>
                                <div className="mt-2 text-xs text-gray-400">
                                  {comment.likes} likes
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}