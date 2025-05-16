import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { format, parseISO, isValid, subMonths } from 'date-fns';
import { useState, useMemo } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface StatData {
  day: string;
  total_likes: number;
  post_count: number;
  total_comments: number;
}

interface MemeStatsChartProps {
  statsData: StatData[];
}

export default function MemeStatsChart({ statsData }: MemeStatsChartProps) {
  // Process data for the chart
  const chartData = useMemo(() =>
    statsData.map(stat => {
      const parsedDate = parseISO(stat.day);
      if (!isValid(parsedDate)) {
        console.warn('Invalid date:', stat.day);
        return null;
      }
      return {
        date: parsedDate,
        likes: Number(stat.total_likes),
        comments: Number(stat.total_comments),
        posts: Number(stat.post_count)
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => a.date.getTime() - b.date.getTime()),
    [statsData]
  );

  const [dateRange, setDateRange] = useState({
    start: chartData.length > 0 ? chartData[0]?.date : subMonths(new Date(), 1),
    end: chartData.length > 0 ? chartData[chartData.length - 1]?.date : new Date(),
  });

  const filteredData = chartData.filter(
    item => item.date >= dateRange.start && item.date <= dateRange.end
  );

  const data = {
    datasets: [
      {
        label: 'Likes',
        data: filteredData.map(item => ({
          x: item.date,
          y: item.likes,
        })),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1,
      },
      {
        label: 'Comments',
        data: filteredData.map(item => ({
          x: item.date,
          y: item.comments,
        })),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.1,
      },
      {
        label: 'Posts',
        data: filteredData.map(item => ({
          x: item.date,
          y: item.posts,
        })),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Meme Engagement Over Time',
      },
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const,
          tooltipFormat: 'PPP',
          displayFormats: {
            day: 'MMM d, yyyy',
          },
        },
        title: {
          display: true,
          text: 'Date',
        },
        min: dateRange.start.toISOString(),
        max: dateRange.end.toISOString(),
      },
      y: {
        title: {
          display: true,
          text: 'Count',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center justify-center">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-400">From:</label>
          <input
            type="date"
            value={format(dateRange.start, 'yyyy-MM-dd')}
            onChange={(e) => {
              const newDate = parseISO(e.target.value);
              if (isValid(newDate)) {
                setDateRange(prev => ({ ...prev, start: newDate }));
              }
            }}
            className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-400">To:</label>
          <input
            type="date"
            value={format(dateRange.end, 'yyyy-MM-dd')}
            onChange={(e) => {
              const newDate = parseISO(e.target.value);
              if (isValid(newDate)) {
                setDateRange(prev => ({ ...prev, end: newDate }));
              }
            }}
            className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-white"
          />
        </div>
      </div>
      <div className="w-full h-[400px] bg-gray-800 p-4 rounded-lg">
        <Line options={options} data={data} />
      </div>
    </div>
  );
}