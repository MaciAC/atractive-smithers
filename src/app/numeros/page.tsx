"use client";

import { useState, useEffect } from "react";
import MemeStatsChart from "../../components/MemeStatsChart";

interface StatData {
  day: string;
  total_likes: number;
  post_count: number;
  total_comments: number;
}

export default function StatsPage() {
  const [statsData, setStatsData] = useState<StatData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        setStatsData(data.stats || []);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <main className="min-h-screen py-8">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-600"></div>
            </div>
          ) : (
            <MemeStatsChart statsData={statsData} />
          )}
        </div>
      </div>
    </main>
  );
}