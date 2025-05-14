"use client";

import allData from "../../public/all_data.json";
import { Meme } from "@/types/meme";
import { useState, useEffect } from "react";
import MemeRender from "@/components/MemeRender";

const typedData = allData as Record<string, Meme>;

export default function Home() {
  const [randomMeme, setRandomMeme] = useState<Meme | null>(null);
  const [randomMemeId, setRandomMemeId] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const getRandomMeme = () => {
    setIsTransitioning(true);

    // Delay setting the new meme to allow for fade-out animation
    setTimeout(() => {
      const memeIds = Object.keys(typedData);
      const randomId = memeIds[Math.floor(Math.random() * memeIds.length)];
      setRandomMeme(typedData[randomId]);
      setRandomMemeId(randomId);

      // Allow some time for the new meme to fade in
      setTimeout(() => {
        setIsTransitioning(false);
      }, 600);
    }, 600);
  };

  useEffect(() => {
    getRandomMeme();
  }, []);

  return (
    <main className="pb-4">
      <div className="container">
        <div>
          <div className="flex flex-col gap-4 justify-center items-center">
            <button
              onClick={getRandomMeme}
              className="bg-white p-1 text-emerald-300 text-2xl font-bold rounded hover:bg-emerald-300 hover:text-emerald-900"
              disabled={isTransitioning}
            >
              DALEEEEE
            </button>
            <div className={`transition-opacity duration-300 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
              {randomMeme && randomMemeId && (
                <MemeRender
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