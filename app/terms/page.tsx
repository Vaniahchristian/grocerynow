import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Return and Refund Policy</h1>
            <p className="text-xl text-gray-600">
              Your satisfaction is our priority. Please read our return and refund policy carefully.
            </p>
          </div>

          <div className="grid gap-8">
            {/* Customer Responsibility */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-6 h-6 text-blue-600 mr-3" />
                  1. Customer Responsibility
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Customers are responsible for receiving, inspecting, and reporting any issues promptly upon their delivered orders.
                </p>
              </CardContent>
            </Card>

            {/* Incorrect or Missing Items */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-6 h-6 text-orange-600 mr-3" />
                  2. Incorrect or Missing Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Any incorrect, missing, damaged or spoiled products received, please reach out within 
                  <span className="font-bold text-orange-600"> 12 hours of delivery</span>, we arrange for the correct items to be delivered or provide a refund.
                </p>
              </CardContent>
            </Card>

            {/* Return Procedure */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                  3. Return Procedure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    If in need to return any products, please reach out within 
                    <span className="font-bold text-green-600"> 12 hours of delivery</span> for a return pickup.
                  </p>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Return Requirements:</h4>
                    <ul className="list-disc list-inside text-green-800 space-y-1">
                      <li>Products must be in their original packaging</li>
                      <li>Products must be in good condition</li>
                      <li>Must have receipt or proof of purchase</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Non-Refundable Items */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <XCircle className="w-6 h-6 text-red-600 mr-3" />
                  4. Non-Refundable Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-900 mb-3">Perishable goods may be non-refundable:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="text-red-800">
                      <p className="font-medium">Leafy Greens:</p>
                      <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                        <li>Spinach</li>
                        <li>Kale (sukuma wiki)</li>
                        <li>Amaranths (dodo)</li>
                        <li>Lettuce</li>
                        <li>Jute</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Refund Process */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-6 h-6 text-purple-600 mr-3" />
                  5. Refund Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-purple-800">
                    Refunds will be processed within <span className="font-bold">12 hours</span> to the original payment method after your notification.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  If you have any questions about our return and refund policy, please don't hesitate to contact us:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-green-600">📧</span>
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-600">grocerynow@gmail.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600">📞</span>
                    </div>
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-gray-600">+256 207808052</p>
                    </div>
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