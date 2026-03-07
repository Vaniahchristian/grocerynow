import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Gift, Users, Star, Share, Mail, Link as LinkIcon } from "lucide-react"

export default function ReferralPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <Gift className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Refer a Friend</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Share the love of fresh groceries! Refer friends and both of you get amazing rewards.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="shadow-lg bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center text-green-800">
                  <Users className="w-6 h-6 mr-3" />
                  Your Friend Gets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">10%</span>
                    </div>
                    <div>
                      <p className="font-semibold">10% Discount Token</p>
                      <p className="text-sm text-green-700">On their first order of UGX 100,000 or more</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-800">
                  <Star className="w-6 h-6 mr-3" />
                  You Get
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">20%</span>
                    </div>
                    <div>
                      <p className="font-semibold">20% Discount OR Free Delivery</p>
                      <p className="text-sm text-blue-700">Token on your account for your next order</p>
                    </div>
                  </div>
                  <p className="text-xs text-blue-600 italic">
                    *You must have already placed at least one order with us
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* How It Works */}
          <Card className="shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-center">How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Share className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Step 1</h3>
                  <p className="text-gray-600">
                    Refer friends using your email or your invitation URL
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Step 2</h3>
                  <p className="text-gray-600">
                    Your friend must click on the email or link when creating an account to make their first order
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Step 3</h3>
                  <p className="text-gray-600">
                    After your friend places their first order, you'll receive an instant 20% discount or free delivery token
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Referral Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-center">Start Referring Now</CardTitle>
              <p className="text-center text-gray-600">
                Sign in or create an account to refer a friend to Grocery Now
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Ready to Refer?</h4>
                  <p className="text-gray-600 mb-4">
                    Please sign in to your account to access your personalized referral link and start earning rewards.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild className="bg-green-600 hover:bg-green-700">
                      <a href="/auth/login">Sign In</a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="/auth/register">Create Account</a>
                    </Button>
                  </div>
                </div>

                {/* Coming Soon: Referral Tools */}
                <div className="grid md:grid-cols-2 gap-4 opacity-60">
                  <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                    <Mail className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <h4 className="font-medium text-gray-600">Email Invitation</h4>
                    <p className="text-sm text-gray-500">Send referral emails directly to friends</p>
                  </div>
                  
                  <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                    <LinkIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <h4 className="font-medium text-gray-600">Referral Link</h4>
                    <p className="text-sm text-gray-500">Share your unique referral URL</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terms */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Terms and conditions apply. Rewards are subject to successful completion of friend's first order.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}