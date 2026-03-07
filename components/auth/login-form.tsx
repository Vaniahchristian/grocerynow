"use client"

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface LoginFormProps {
  onSuccess?: () => void
  redirectTo?: string
}

export function LoginForm({ onSuccess, redirectTo }: LoginFormProps) {
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await login(formData.email, formData.password)
      
      if (onSuccess) {
        onSuccess()
      } else if (redirectTo) {
        window.location.href = redirectTo
      } else {
        window.location.href = '/'
      }
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white/95 backdrop-blur-sm rounded-xl">
      <CardHeader className="space-y-4 text-center pb-8">
        <div className="mx-auto w-16 h-16 bg-[#097969] rounded-full flex items-center justify-center mb-4">
          <img src="/logo1.png" alt="Grocery Now" className="w-10 h-10 object-contain" />
        </div>
        <CardTitle className="text-3xl font-bold text-gray-900">Welcome Back</CardTitle>
        <CardDescription className="text-gray-600 text-lg">
          Sign in to your Groceries Now account
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-6 pt-6">
          <Button 
            type="submit" 
            className="w-full h-12 bg-[#097969] hover:bg-[#075a52] text-white font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl rounded-xl" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
          
          <div className="text-center">
            <span className="text-gray-600">Don't have an account? </span>
            <Link href="/auth/register" className="text-[#097969] hover:text-[#075a52] font-semibold hover:underline transition-colors">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
