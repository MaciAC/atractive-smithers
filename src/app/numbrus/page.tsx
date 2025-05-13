"use client";

import MemeStatsChart from "../../components/MemeStatsChart";
import allData from "../../../public/all_data.json";
import { Meme } from "../../types/meme";

const typedData = allData as Record<string, Meme>;

export default function StatsPage() {
  return (
    <main className="min-h-screen py-8">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <MemeStatsChart memes={typedData} />
        </div>
      </div>
    </main>
  );
}