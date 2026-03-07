"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Tag, 
  Settings, 
  LogOut, 
  Home,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  FileText
} from "lucide-react"

interface SidebarProps {
  className?: string
}

const navigationItems = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
        description: "Overview & Analytics"
      }
    ]
  },
  {
    title: "Store Management",
    items: [
      {
        title: "Products",
        href: "/admin/products",
        icon: Package,
        description: "Manage inventory"
      },
      {
        title: "Orders",
        href: "/admin/orders",
        icon: ShoppingCart,
        description: "Order management"
      },
      {
        title: "Offers",
        href: "/admin/offers",
        icon: Tag,
        description: "Promotions & discounts"
      }
    ]
  },
  // {
  //   title: "Analytics",
  //   items: [
  //     {
  //       title: "Reports",
  //       href: "/admin/reports",
  //       icon: BarChart3,
  //       description: "Sales & performance"
  //     },
  //     {
  //       title: "Customers",
  //       href: "/admin/customers",
  //       icon: Users,
  //       description: "Customer insights"
  //     }
  //   ]
  // }
]

export function AdminSidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className={cn(
      "flex flex-col h-screen bg-slate-900 text-slate-100 transition-all duration-300",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <div>
              <h2 className="font-semibold text-sm">Grocery Now</h2>
              <p className="text-xs text-slate-400">Admin Panel</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-white hover:bg-slate-800 p-1 h-8 w-8"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-6">
          {navigationItems.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {!collapsed && (
                <h3 className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center px-4 py-2 text-sm transition-colors relative group",
                        isActive 
                          ? "bg-emerald-600 text-white" 
                          : "text-slate-300 hover:bg-slate-800 hover:text-white",
                        collapsed && "justify-center px-2"
                      )}
                    >
                      <Icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
                      {!collapsed && (
                        <div className="flex-1">
                          <div className="font-medium">{item.title}</div>
                          <div className="text-xs text-slate-400">{item.description}</div>
                        </div>
                      )}
                      
                      {/* Tooltip for collapsed state */}
                      {collapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                          {item.title}
                        </div>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Footer Actions */}
      <div className="border-t border-slate-800 p-4 space-y-2">
        <Link
          href="/"
          className={cn(
            "flex items-center px-2 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-md transition-colors",
            collapsed && "justify-center"
          )}
        >
          <Home className={cn("h-4 w-4", !collapsed && "mr-3")} />
          {!collapsed && "View Store"}
        </Link>
        
        <Link
          href="/admin"
          className={cn(
            "flex items-center px-2 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-md transition-colors",
            collapsed && "justify-center"
          )}
        >
          <LogOut className={cn("h-4 w-4", !collapsed && "mr-3")} />
          {!collapsed && "Logout"}
        </Link>
      </div>
    </div>
  )
}
