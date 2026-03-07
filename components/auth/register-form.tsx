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

interface RegisterFormProps {
  onSuccess?: () => void
  redirectTo?: string
}

export function RegisterForm({ onSuccess, redirectTo }: RegisterFormProps) {
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setIsLoading(false)
      return
    }

    try {
      const { confirmPassword, ...registerData } = formData
      await register(registerData)
      
      if (onSuccess) {
        onSuccess()
      } else if (redirectTo) {
        window.location.href = redirectTo
      } else {
        window.location.href = '/'
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed')
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
        <CardTitle className="text-3xl font-bold text-gray-900">Create Account</CardTitle>
        <CardDescription className="text-gray-600 text-lg">
          Join Grocery Now today
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>
          
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
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+1234567890"
              value={formData.phone}
              onChange={handleChange}
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
                placeholder="At least 6 characters"
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
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address (Optional)</Label>
            <Input
              id="address"
              name="address"
              type="text"
              placeholder="123 Main Street"
              value={formData.address}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City (Optional)</Label>
              <Input
                id="city"
                name="city"
                type="text"
                placeholder="Kampala"
                value={formData.city}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code (Optional)</Label>
              <Input
                id="postalCode"
                name="postalCode"
                type="text"
                placeholder="10001"
                value={formData.postalCode}
                onChange={handleChange}
                disabled={isLoading}
              />
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
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
          
          <div className="text-center">
            <span className="text-gray-600">Already have an account? </span>
            <Link href="/auth/login" className="text-[#097969] hover:text-[#075a52] font-semibold hover:underline transition-colors">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
