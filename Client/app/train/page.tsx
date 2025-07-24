"use client"

import { useState } from "react"
import { ArrowLeft, Brain, Play, CheckCircle, AlertCircle, Database } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function TrainPage() {
  const [isTraining, setIsTraining] = useState(false)
  const [trainingStatus, setTrainingStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [progress, setProgress] = useState(0)

  const handleTrain = async () => {
    setIsTraining(true)
    setTrainingStatus("idle")
    setMessage("")
    setProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + Math.random() * 15
      })
    }, 500)

    try {
      const response = await fetch("http://localhost:8000/train", {
        method: "GET",
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (response.ok) {
        setTrainingStatus("success")
        setMessage("Model training completed successfully.")
      } else {
        throw new Error("Training failed")
      }
    } catch (error) {
      clearInterval(progressInterval)
      setTrainingStatus("error")
      setMessage("Training failed. Please check your backend connection.")
    } finally {
      setIsTraining(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-black border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-white">Model Training</h1>
              <p className="text-gray-400 text-sm">Retrain the phishing detection model</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Training Card */}
          <Card className="bg-gray-800 border border-gray-700 mb-8">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-8 w-8 text-blue-400" />
              </div>
              <CardTitle className="text-xl font-semibold text-white">Model Training</CardTitle>
              <p className="text-gray-300">Update the detection model with latest data</p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Training Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                  <h3 className="font-medium text-white mb-2 flex items-center">
                    <Database className="h-4 w-4 mr-2 text-blue-400" />
                    Data Processing
                  </h3>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Data validation</li>
                    <li>• Feature extraction</li>
                    <li>• Dataset preparation</li>
                  </ul>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                  <h3 className="font-medium text-white mb-2 flex items-center">
                    <Brain className="h-4 w-4 mr-2 text-blue-400" />
                    Model Training
                  </h3>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Algorithm optimization</li>
                    <li>• Cross-validation</li>
                    <li>• Performance evaluation</li>
                  </ul>
                </div>
              </div>

              {/* Status Messages */}
              {trainingStatus === "success" && (
                <Alert className="border-green-700 bg-green-900">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <AlertDescription className="text-green-300">{message}</AlertDescription>
                </Alert>
              )}

              {trainingStatus === "error" && (
                <Alert className="border-red-700 bg-red-900">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-300">{message}</AlertDescription>
                </Alert>
              )}

              {/* Progress Bar */}
              {isTraining && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Training Progress</span>
                    <span className="text-blue-400 font-medium">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 bg-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-center text-gray-300 text-sm">
                    {progress < 30
                      ? "Initializing training..."
                      : progress < 60
                        ? "Processing data..."
                        : progress < 90
                          ? "Training model..."
                          : "Finalizing..."}
                  </p>
                </div>
              )}

              {/* Training Button */}
              <div className="text-center">
                <Button
                  onClick={handleTrain}
                  disabled={isTraining}
                  className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50"
                >
                  {isTraining ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Training...</span>
                    </div>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Training
                    </>
                  )}
                </Button>
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-400">Training typically takes 3-5 minutes</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
