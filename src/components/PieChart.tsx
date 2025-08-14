import { Chart as ChartJS, ArcElement, Tooltip, Legend, } from 'chart.js';
import { Pie } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, Legend);
export default function ItemsPieChart({ data }: { data: any }) {
  if (!Array.isArray(data)) { return <p className="text-red-500">No chart data available.</p>; }
  const chartData = { labels: data.map((d) => d.item_name), datasets: [{ data: data.map((d) => d.total_quantity), backgroundColor: ['#3b82f6', '#22c55e', '#f97316', '#eab308', '#ef4444', '#8b5cf6', '#06b6d4',], },], };

  return (
    <div data-testid="pie-chart-wrapper">
      {data.length > 0 ? (
        <Pie data={chartData} />
      ) : (
        <p data-testid="empty-chart-message" className="text-gray-500">
          No chart data to display.
        </p>
      )}
    </div>
  );
}