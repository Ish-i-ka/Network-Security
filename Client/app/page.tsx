import { Upload, Shield, BarChart3, Database } from "lucide-react"
import Link from "next/link"
import FileUpload from "@/components/file-upload"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-500" />
              <div>
                <h1 className="text-xl font-semibold text-white">PhishGuard</h1>
                <p className="text-xs text-gray-400">URL Security Analysis</p>
              </div>
            </div>
            <nav className="flex items-center space-x-8">
              <Link href="/" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">
                Analyze
              </Link>
              <Link href="/train" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">
                Train Model
              </Link>
              <Link href="/dashboard" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Phishing URL Detection System</h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Upload CSV files containing URLs for automated phishing detection analysis using machine learning
              algorithms.
            </p>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Upload className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Batch Processing</h3>
                <p className="text-gray-300 text-sm">Upload CSV files for bulk URL analysis</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <BarChart3 className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Analysis Reports</h3>
                <p className="text-gray-300 text-sm">Detailed results with threat classifications</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Database className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Model Training</h3>
                <p className="text-gray-300 text-sm">Retrain models with updated datasets</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-white mb-2">Upload Analysis File</h3>
              <p className="text-gray-300">Select a CSV file containing URLs for analysis</p>
            </div>
            <FileUpload />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black py-8">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-500" />
              <span className="text-white font-medium">PhishGuard</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400 text-sm">URL Security Analysis Platform</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
