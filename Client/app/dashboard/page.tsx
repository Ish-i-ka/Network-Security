import { ArrowLeft, Shield, Database, BarChart3, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
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
              <h1 className="text-xl font-semibold text-white">System Dashboard</h1>
              <p className="text-gray-400 text-sm">Monitor system performance and activity</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Total Scans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">1,247</div>
              <div className="text-sm text-gray-300">This month</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                <Shield className="h-4 w-4 mr-2 text-green-400" />
                Detection Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">97.3%</div>
              <div className="text-sm text-gray-300">Accuracy</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                <Database className="h-4 w-4 mr-2" />
                Training Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">45,200</div>
              <div className="text-sm text-gray-300">URLs in dataset</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Avg Response
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">45ms</div>
              <div className="text-sm text-gray-300">Processing time</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card className="bg-gray-800 border border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { url: "malicious-site.com", status: "Blocked", time: "2 min ago", threat: true },
                { url: "legitimate-bank.com", status: "Safe", time: "5 min ago", threat: false },
                { url: "suspicious-login.net", status: "Blocked", time: "8 min ago", threat: true },
                { url: "trusted-service.org", status: "Safe", time: "12 min ago", threat: false },
                { url: "fake-payment.co", status: "Blocked", time: "15 min ago", threat: true },
              ].map((scan, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-700 rounded-lg border border-gray-600"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${scan.threat ? "bg-red-400" : "bg-green-400"}`}></div>
                    <div>
                      <p className="font-medium text-white text-sm">{scan.url}</p>
                      <p className="text-xs text-gray-300">{scan.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {scan.threat ? (
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    )}
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        scan.threat ? "bg-red-900 text-red-300" : "bg-green-900 text-green-300"
                      }`}
                    >
                      {scan.status}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="bg-gray-800 border border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white">System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "API Gateway", status: "Online", uptime: "99.9%" },
                { name: "ML Engine", status: "Active", uptime: "99.7%" },
                { name: "Database", status: "Connected", uptime: "100%" },
                { name: "Training Service", status: "Ready", uptime: "98.5%" },
              ].map((system, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-700 rounded-lg border border-gray-600"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <div>
                      <p className="font-medium text-white text-sm">{system.name}</p>
                      <p className="text-xs text-gray-300">Uptime: {system.uptime}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-green-900 text-green-300">
                    {system.status}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
