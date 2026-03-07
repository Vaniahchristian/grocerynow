"use client"

import { WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"

export function NoInternet({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <WifiOff className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Internet Connection</h3>
        <p className="text-gray-600 mb-6">Please check your connection and try again.</p>
        {onRetry && (
          <Button onClick={onRetry} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-6 py-2">
            Retry
          </Button>
        )}
      </div>
    </div>
  )
}
