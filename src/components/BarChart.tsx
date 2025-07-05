// /src/components/OrderBarChart.tsx
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export type ChartData = {
  order_date: string;
  order_count: number;
};

export default function OrderBarChart({ data }: { data: ChartData[] }) {
  const chartData = {
    labels: data.map(d => new Date(d.order_date).toLocaleDateString('en-CA')),
    datasets: [
      {
        label: '# of Orders',
        data: data.map(d => d.order_count),
        backgroundColor: '#3b82f6',
      },
    ],
  };

  return <Bar data={chartData} />;
}