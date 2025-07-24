"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Download, Shield, AlertTriangle, FileText, BarChart3 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ThreatChart from "@/components/threat-chart"

interface AnalysisData {
  total: number
  legitimate: number
  suspicious: number
  tableHtml: string
}

export default function ResultsPage() {
  const [data, setData] = useState<AnalysisData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const resultsHtml = sessionStorage.getItem("analysisResults")
    if (!resultsHtml) {
      router.push("/")
      return
    }

    const parser = new DOMParser()
    const doc = parser.parseFromString(resultsHtml, "text/html")
    const table = doc.querySelector("table")

    if (table) {
      const rows = table.querySelectorAll("tbody tr")
      let legitimate = 0
      let suspicious = 0

      rows.forEach((row) => {
        const threatCell = row.querySelector("td:last-child")
        if (threatCell?.textContent?.includes("Legitimate")) {
          legitimate++
        } else if (threatCell?.textContent?.includes("Suspicious")) {
          suspicious++
        }
      })

      setData({
        total: rows.length,
        legitimate,
        suspicious,
        tableHtml: table.outerHTML,
      })
    }

    setLoading(false)
  }, [router])

  const downloadResults = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "URL,Prediction,Threat Level\n" +
      "Sample data would be generated from actual results"

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "phishing_analysis_results.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading results...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-300 mb-4">No results found</p>
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Go Back</Button>
          </Link>
        </div>
      </div>
    )
  }

  const threatPercentage = ((data.suspicious / data.total) * 100).toFixed(1)
  const safePercentage = ((data.legitimate / data.total) * 100).toFixed(1)

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-black border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-white">Analysis Results</h1>
                <p className="text-gray-400 text-sm">URL security assessment complete</p>
              </div>
            </div>
            <Button onClick={downloadResults} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Summary */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">{data.total} URLs Analyzed</h2>
          <p className="text-gray-300">
            {data.suspicious > 0 ? (
              <>Found {data.suspicious} suspicious URLs requiring attention</>
            ) : (
              <>All URLs classified as legitimate</>
            )}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800 border border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Total Processed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{data.total}</div>
              <div className="text-sm text-gray-300">URLs analyzed</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                <Shield className="h-4 w-4 mr-2 text-green-400" />
                Legitimate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{data.legitimate}</div>
              <div className="text-sm text-gray-300">{safePercentage}% of total</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-red-400" />
                Suspicious
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{data.suspicious}</div>
              <div className="text-sm text-gray-300">{threatPercentage}% of total</div>
            </CardContent>
          </Card>
        </div>

        {/* Chart and Table */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="bg-gray-800 border border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white">Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ThreatChart legitimate={data.legitimate} suspicious={data.suspicious} />
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Detailed Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-auto">
                <div className="results-table" dangerouslySetInnerHTML={{ __html: data.tableHtml }} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
