"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  User,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/quiz", label: "Quiz", icon: User },
  { href: "/results", label: "Results", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
      {/* Logo / Brand */}
      <div>
        <div className="h-16 flex items-center justify-center border-b border-neutral-200 dark:border-neutral-800">
          <h1 className="text-xl font-bold">⚡ CSA</h1>
        </div>

        {/* Nav Links */}
        <nav className="mt-4 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
        <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors">
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  )
}
