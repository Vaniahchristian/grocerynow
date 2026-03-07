import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, CheckCircle, Smartphone } from "lucide-react"

export default function SecurePaymentPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Payment Methods</h1>
            <p className="text-xl text-gray-600">
              Pay safely using trusted options. Below are our available methods and how to use them.
            </p>
          </div>

          <div className="grid gap-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-6 h-6 text-blue-600 mr-3" />
                  Accepted Methods
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-green-50">
                  <div className="flex items-center">
                    <Smartphone className="w-5 h-5 text-green-700 mr-2" />
                    <span className="font-medium text-green-900">MTN MoMo Pay</span>
                  </div>
                  <span className="font-mono font-bold text-green-900">954379</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-red-50">
                  <div className="flex items-center">
                    <Smartphone className="w-5 h-5 text-red-700 mr-2" />
                    <span className="font-medium text-red-900">Airtel Pay</span>
                  </div>
                  <span className="font-mono font-bold text-red-900">6926467</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>How to Pay</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">MTN MoMo Pay</h3>
                  <ol className="list-decimal list-inside space-y-1 text-gray-700">
                    <li>Open your MTN MoMo app or dial the MTN MoMo USSD.</li>
                    <li>Choose MoMo Pay / Pay Merchant.</li>
                    <li>Enter Merchant Code <span className="font-mono font-semibold">954379</span>.</li>
                    <li>Enter the amount and confirm the payment.</li>
                    <li>Keep your transaction ID for reference.</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Airtel Pay</h3>
                  <ol className="list-decimal list-inside space-y-1 text-gray-700">
                    <li>Open Airtel Money or dial the Airtel Money USSD.</li>
                    <li>Choose Pay Merchant / Merchant Payments.</li>
                    <li>Enter Merchant Code <span className="font-mono font-semibold">6926467</span>.</li>
                    <li>Enter the amount and confirm the payment.</li>
                    <li>Keep your transaction ID for reference.</li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-6 h-6 text-emerald-600 mr-3" />
                  Security & Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>We will confirm your order details, delivery time, and preferred payment method before fulfillment.</li>
                  <li>Never share your mobile money PIN or OTP with anyone. We will never ask for it.</li>
                  <li>Payments are processed by your provider. Keep your receipt or transaction ID for any support requests.</li>
                </ul>
                <div className="mt-4 flex items-center text-emerald-700 bg-emerald-50 p-3 rounded-lg">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="text-sm">Refunds (if applicable) are processed back to the original payment method as per our policy.</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-3">If you have questions about payments, reach us:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-700">grocerynow@gmail.com</p>
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-700">+256 207808052</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
