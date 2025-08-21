import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          family: 'Inter, sans-serif',
          size: 12
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: { family: 'Inter, sans-serif' },
      bodyFont: { family: 'Inter, sans-serif' },
      cornerRadius: 6
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: { family: 'Inter, sans-serif', size: 11 }
      }
    },
    y: {
      grid: {
        color: 'rgba(0, 0, 0, 0.1)'
      },
      ticks: {
        font: { family: 'Inter, sans-serif', size: 11 }
      }
    }
  }
}

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          family: 'Inter, sans-serif',
          size: 12
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: { family: 'Inter, sans-serif' },
      bodyFont: { family: 'Inter, sans-serif' },
      cornerRadius: 6
    }
  },
  cutout: '60%'
}

export function LineChart({ data }) {
  return <Line options={chartOptions} data={data} />
}

export function BarChart({ data }) {
  return <Bar options={chartOptions} data={data} />
}

export function DoughnutChart({ data }) {
  return <Doughnut options={doughnutOptions} data={data} />
}