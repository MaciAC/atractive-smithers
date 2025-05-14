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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="backdrop-blur-xl bg-black/80 rounded-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <MemeRender memeId={memeId} memeData={memeData} onClose={onClose} />
      </div>
    </div>
  );
}