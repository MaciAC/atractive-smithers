"use client";

import { useState, useEffect, useCallback } from "react";

type RandomContentItem = {
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

type RandomContent = RandomContentItem[];

export default function Home() {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [randomContent, setRandomContent] = useState<RandomContent | null>(null);
  const [mediaErrors, setMediaErrors] = useState<{[key: number]: boolean}>({});

  const getRandomContent = useCallback(async () => {
    // First fade out
    setIsVisible(false);

    // Wait for fade out animation
    await new Promise(resolve => setTimeout(resolve, 300));

    // Clear content before loading new data
    setRandomContent(null);

    setIsLoading(true);
    setMediaErrors({});
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

  const handleMediaError = (mediaId: number) => {
    setMediaErrors(prev => ({ ...prev, [mediaId]: true }));
  };

  // Helper function to calculate aspect ratio
  const getAspectRatio = (width: number | null, height: number | null) => {
    if (!width || !height) return 1; // Default to square if dimensions are missing
    return width / height;
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
              className="transition-all duration-600 ease-in-out w-full flex flex-col gap-8"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'scale(1)' : 'scale(0.98)'
              }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-400"></div>
                </div>
              ) : randomContent && randomContent.length > 0 ? (
                <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
                  {randomContent.map((item, index) => {
                    const aspectRatio = getAspectRatio(item.multimedia.width, item.multimedia.height);
                    
                    return (
                      <div 
                        key={item.multimedia.id} 
                        className="rounded-xl overflow-hidden border border-gray-700 bg-gray-900/50 hover:bg-gray-900/70 transition-colors duration-200"
                      >
                        {/* Media Section */}
                        <div 
                          className="relative flex items-center justify-center bg-black w-full"
                          style={{ aspectRatio: aspectRatio }}
                        >
                          {mediaErrors[item.multimedia.id] ? (
                            <div className="text-red-500 text-center p-4">Error loading media. Try again!</div>
                          ) : item.multimedia.type === 'image' ? (
                            <img
                              src={item.multimedia.url}
                              alt={`Random content ${index + 1}`}
                              className="w-full h-full object-contain"
                              onError={() => handleMediaError(item.multimedia.id)}
                            />
                          ) : (
                            <video
                              src={item.multimedia.url}
                              controls
                              autoPlay
                              loop
                              muted
                              className="w-full h-full object-contain"
                              onError={() => handleMediaError(item.multimedia.id)}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-gray-400 p-8">
                  No content available. Try again!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}