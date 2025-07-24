"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const router = useRouter()

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === "text/csv") {
      setFile(droppedFile)
      setError(null)
    } else {
      setError("Please upload a valid CSV file")
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile)
      setError(null)
    } else {
      setError("Please upload a valid CSV file")
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const htmlContent = await response.text()
      sessionStorage.setItem("analysisResults", htmlContent)
      router.push("/results")
    } catch (err) {
      setError("Failed to analyze file. Please check your backend connection.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="bg-gray-800 border border-gray-700">
      <CardContent className="p-8">
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            dragActive ? "border-blue-400 bg-blue-950" : "border-gray-600 hover:border-gray-500"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
              <Upload className="h-8 w-8 text-gray-400" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-white">
                Drop your CSV file here, or{" "}
                <label className="text-blue-400 hover:text-blue-300 cursor-pointer underline">
                  browse files
                  <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
                </label>
              </p>
              <p className="text-gray-300">CSV files only • Maximum 10MB</p>
            </div>
          </div>
        </div>

        {file && (
          <div className="mt-6 p-4 bg-green-900 border border-green-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-800 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-green-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">{file.name}</p>
                <p className="text-green-300 text-sm">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6">
            <Alert className="border-red-700 bg-red-900">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300">{error}</AlertDescription>
            </Alert>
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Analyzing...</span>
              </div>
            ) : (
              "Start Analysis"
            )}
          </Button>
        </div>

        {isUploading && (
          <div className="mt-4">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="h-2 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
            <p className="text-center text-gray-300 mt-2 text-sm">Processing file...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
