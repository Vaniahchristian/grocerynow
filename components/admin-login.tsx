"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Demo login - in real app, this would be proper authentication
    if (credentials.username === "titus" && credentials.password === "titus") {
      alert("Login successful! Welcome to the admin panel.")
      router.push("/admin/dashboard")
    } else {
      alert("Login failed. Ask access from Titus")
    }
  }

  return (
    <Card className="w-full max-w-md rounded-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Admin Login</CardTitle>
        {/* <p className="text-gray-600">Demo credentials: titus / titus</p> */}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              placeholder="Enter username"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              placeholder="Enter password"
              required
            />
          </div>
          <Button type="submit" className="w-full rounded-lg">
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
