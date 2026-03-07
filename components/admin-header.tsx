import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogOut, Home } from "lucide-react"

export function AdminHeader() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/admin/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Admin Panel</span>
            </Link>

            <nav className="flex items-center space-x-6">
              <Link href="/admin/dashboard" className="text-gray-700 hover:text-blue-600">
                Dashboard
              </Link>
              <Link href="/admin/products" className="text-gray-700 hover:text-blue-600">
                Products
              </Link>
              <Link href="/admin/orders" className="text-gray-700 hover:text-blue-600">
                Orders
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                View Store
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
