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
import { format, parseISO, isValid, subMonths, addMonths } from 'date-fns';
import { Meme } from '../types/meme';
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

interface MemeStatsChartProps {
  memes: Record<string, Meme>;
}

export default function MemeStatsChart({ memes }: MemeStatsChartProps) {
  // Process data for the chart
  const chartData = useMemo(() =>
    Object.entries(memes)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(([_, meme]) => {
        // Convert date from "YYYY-MM-DD_HH-mm-ss_UTC" to "YYYY-MM-DDTHH:mm:ssZ"
        const [datePart, timePart] = meme.date.split('_');
        const timeWithColons = timePart.replace(/-/g, ':');
        const dateStr = `${datePart}T${timeWithColons}Z`;

        const parsedDate = parseISO(dateStr);
        if (!isValid(parsedDate)) {
          console.warn('Invalid date:', meme.date, 'parsed as:', dateStr);
          return null;
        }
        return {
          date: parsedDate,
          likes: meme.likes,
          comments: meme.total_comments,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => a.date.getTime() - b.date.getTime()),
    [memes]
  );

  const [dateRange, setDateRange] = useState({
    start: chartData[0]?.date || subMonths(new Date(), 1),
    end: chartData[chartData.length - 1]?.date || addMonths(new Date(), 1),
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