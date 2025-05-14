"use client";

import allData from "../../public/all_data.json";
import { Meme } from "@/types/meme";
import { useState, useEffect } from "react";
import MemeRender from "@/components/MemeRender";

const typedData = allData as Record<string, Meme>;

export default function Home() {
  const [randomMeme, setRandomMeme] = useState<Meme | null>(null);
  const [randomMemeId, setRandomMemeId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const getRandomMeme = () => {
    if (isLoading) return;
    setIsLoading(true);

    // First, hide the current meme
    setIsVisible(false);

    // Wait for fade-out animation to complete
    setTimeout(() => {
      // Select a new meme
      const memeIds = Object.keys(typedData);
      let randomId;

      // Avoid selecting the same meme
      do {
        randomId = memeIds[Math.floor(Math.random() * memeIds.length)];
      } while (randomId === randomMemeId && memeIds.length > 1);

      // Update the meme state while it's hidden
      setRandomMeme(typedData[randomId]);
      setRandomMemeId(randomId);

      // Small additional delay to ensure the DOM has updated
      setTimeout(() => {
        // Show the new meme
        setIsVisible(true);
        setIsLoading(false);
      }, 100);
    }, 500);
  };

  useEffect(() => {
    // Initial meme load
    const memeIds = Object.keys(typedData);
    const randomId = memeIds[Math.floor(Math.random() * memeIds.length)];
    setRandomMeme(typedData[randomId]);
    setRandomMemeId(randomId);
  }, []);

  return (
    <main className="pb-4 flex flex-col items-center justify-center">
      <div className="mx-auto px-4">
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col gap-4 items-center w-full max-w-3xl mx-auto">
            <button
              onClick={getRandomMeme}
              className="bg-white p-1 text-emerald-300 text-2xl font-bold rounded hover:bg-emerald-300 hover:text-emerald-900"
              disabled={isLoading}
            >
              {isLoading ? "Espera..." : "DALEEEEE"}
            </button>

            <div
              className="transition-opacity duration-500 ease-in-out w-full flex justify-center backdrop-blur-2xl"
              style={{ opacity: isVisible ? 1 : 0 }}
            >
              {randomMeme && randomMemeId && (
                <MemeRender
                  key={randomMemeId} // Force complete re-render on ID change
                  memeId={randomMemeId}
                  memeData={randomMeme}
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