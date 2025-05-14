"use client";

import { Meme } from "../types/meme";
import Image from "next/image";
import { useState, useEffect } from "react";

interface MemeCardProps {
  memeId: string;
  memeData: Meme;
  onSelect: (memeId: string) => void;
  shouldLoadImage: boolean;
}

interface MemeFile {
  key: string;
  url: string;
}

export default function MemeCard({ memeId, memeData, onSelect, shouldLoadImage }: MemeCardProps) {
  const [memeFiles, setMemeFiles] = useState<MemeFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!shouldLoadImage) return;

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
  }, [memeId, shouldLoadImage]);

  return (
    <div
      className="w-[300px] bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-gray-700 transition-all duration-200 cursor-pointer"
      onClick={() => onSelect(memeId)}
    >
      <div className="w-full h-[300px] bg-gray-800 flex items-center justify-center">
        {!shouldLoadImage ? (
          <div className="w-full h-full bg-gray-800 animate-pulse" />
        ) : isLoading ? (
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600"></div>
        ) : (
          <div className="relative w-full h-full">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Image
                src={memeFiles[0]?.url || ''}
                alt={`Meme ${memeId}`}
                width={300}
                height={300}
                className="max-w-[280px] max-h-[280px] object-contain"
                priority={false}
              />
              {memeFiles.some(file => file.key.endsWith('.mp4')) && (
                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-mono flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Video
                </div>
              )}
            </div>
            {memeFiles.length > 1 && !memeFiles.some(file => file.key.endsWith('.mp4')) && (
              <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs font-mono">
                +{memeFiles.length - 1}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400 font-mono">#{memeId}</span>
          <div className="flex items-center space-x-2 text-gray-500">
            <span>{memeData.likes}</span>
            <span>•</span>
            <span>{memeData.total_comments}</span>
          </div>
        </div>
        {memeData.caption && (
          <p className="mt-2 text-gray-300 text-sm line-clamp-2 font-mono">{memeData.caption}</p>
        )}
      </div>
    </div>
  );
}