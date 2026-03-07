"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { authAPI } from '@/lib/auth'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Lock, Bookmark, ShoppingBag, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, isAuthenticated, updateUser, token } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postal_code || ''
      })
    }
  }, [user])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="mx-auto w-20 h-20 bg-[#097969] rounded-full flex items-center justify-center mb-6">
              <User className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">My Profile</h1>
            <p className="text-gray-600 mb-8 text-lg">
              Sign in to view and manage your profile.
            </p>
            <div className="space-y-4">
              <Button asChild className="w-full h-12 bg-[#097969] hover:bg-[#075a52] text-white font-semibold text-lg">
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button variant="outline" asChild className="w-full h-12 border-[#097969] text-[#097969] hover:bg-[#097969] hover:text-white font-semibold text-lg">
                <Link href="/auth/register">Create Account</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    setIsLoading(true)
    try {
      const response = await authAPI.updateProfile(token, profileData)
      updateUser(response.user)
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    setPasswordLoading(true)
    try {
      await authAPI.changePassword(token, passwordData.currentPassword, passwordData.newPassword)
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      toast({
        title: "Password Changed",
        description: "Your password has been changed successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to change password.",
        variant: "destructive",
      })
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <div className="mx-auto w-20 h-20 bg-[#097969] rounded-full flex items-center justify-center mb-6">
              <User className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600 text-lg">
              Manage your account settings and preferences
            </p>
          </div>

        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg h-14">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Lock className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center space-x-2">
              <ShoppingBag className="h-4 w-4" />
              <span>Activity</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and contact details.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-sm text-gray-500">Email cannot be changed</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={profileData.city}
                        onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        value={profileData.postalCode}
                        onChange={(e) => setProfileData(prev => ({ ...prev, postalCode: e.target.value }))}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-[#097969] hover:bg-[#075a52] text-white font-semibold h-11"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Profile'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      disabled={passwordLoading}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      disabled={passwordLoading}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      disabled={passwordLoading}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={passwordLoading}
                    className="bg-[#097969] hover:bg-[#075a52] text-white font-semibold h-11"
                  >
                    {passwordLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Changing...
                      </>
                    ) : (
                      'Change Password'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bookmark className="h-5 w-5 text-red-500" />
                    <span>Wishlist</span>
                  </CardTitle>
                  <CardDescription>
                    Your saved favorite products
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <Button asChild className="bg-[#097969] hover:bg-[#075a52] text-white font-semibold h-11">
                      <Link href="/wishlist">View Wishlist</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ShoppingBag className="h-5 w-5 text-emerald-500" />
                    <span>Order History</span>
                  </CardTitle>
                  <CardDescription>
                    Your past orders and purchases
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <Button asChild className="bg-[#097969] hover:bg-[#075a52] text-white font-semibold h-11">
                      <Link href="/orders">View Orders</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
