"use client";

import { Meme } from "../types/meme";
import MemeRender from "./MemeRender";

interface MemeModalProps {
  memeId: string;
  memeData: Meme;
  onClose: () => void;
}

export default function MemeModal({ memeId, memeData, onClose }: MemeModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <MemeRender memeId={memeId} memeData={memeData} onClose={onClose} />
      </div>
    </div>
  );
}