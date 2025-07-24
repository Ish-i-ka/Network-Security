"use client"

import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

interface ThreatChartProps {
  legitimate: number
  suspicious: number
}

export default function ThreatChart({ legitimate, suspicious }: ThreatChartProps) {
  const data = {
    labels: ["Safe & Legitimate", "Suspicious Threats"],
    datasets: [
      {
        data: [legitimate, suspicious],
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)", // Green for legitimate
          "rgba(239, 68, 68, 0.8)", // Red for suspicious
        ],
        borderColor: ["rgba(34, 197, 94, 1)", "rgba(239, 68, 68, 1)"],
        borderWidth: 3,
        hoverBackgroundColor: ["rgba(34, 197, 94, 0.9)", "rgba(239, 68, 68, 0.9)"],
        hoverBorderWidth: 4,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 25,
          usePointStyle: true,
          pointStyle: "circle",
          font: {
            size: 14,
            weight: "600" as const,
          },
          color: "#d1d5db", // gray-300
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        titleColor: "#ffffff",
        bodyColor: "#d1d5db", // gray-300
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: true,
        callbacks: {
          label: (context: any) => {
            const total = legitimate + suspicious
            const percentage = ((context.parsed / total) * 100).toFixed(1)
            return `${context.label}: ${context.parsed} URLs (${percentage}%)`
          },
        },
      },
    },
    cutout: "60%",
    elements: {
      arc: {
        borderRadius: 8,
      },
    },
  }

  return (
    <div className="relative h-80">
      <Doughnut data={data} options={options} />
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="text-3xl font-black text-white">{legitimate + suspicious}</div>
          <div className="text-sm text-gray-300 font-medium">Total URLs</div>
        </div>
      </div>
    </div>
  )
}
