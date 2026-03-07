import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, MapPin, Truck, AlertCircle } from "lucide-react"

export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Delivery Information</h1>
            <p className="text-xl text-gray-600">
              Fast and reliable delivery services across Kampala and Wakiso district
            </p>
          </div>

          <div className="grid gap-8">
            {/* Delivery Areas */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-6 h-6 text-green-600 mr-3" />
                  Delivery Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Our deliveries are within Kampala and Wakiso district.
                </p>
              </CardContent>
            </Card>

            {/* Delivery Times */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-6 h-6 text-blue-600 mr-3" />
                  Delivery Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-blue-900">Standard Delivery</h4>
                      <p className="text-blue-700">Most popular option</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-900">1-2 hours</p>
                      <p className="text-sm text-blue-600">after order confirmation</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-green-900">Express Delivery</h4>
                      <p className="text-green-700">Available in select areas with extra fees</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-900">30-60 minutes</p>
                      <p className="text-sm text-green-600">after order confirmation</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Fees */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="w-6 h-6 text-orange-600 mr-3" />
                  Delivery Fees
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Kampala</h4>
                      <p className="text-gray-600">Depending on location and order value</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">UGX 5,000 - 10,000</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Wakiso</h4>
                      <p className="text-gray-600">Depending on location and order value</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">UGX 10,000 - 15,000</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Cut-Off Times */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
                  Order Cut-Off Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 mb-2">Same-Day Delivery</h4>
                    <p className="text-yellow-800">
                      Orders placed before <span className="font-bold">5 PM</span> will be delivered on the same day.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Next-Day Delivery</h4>
                    <p className="text-gray-800">
                      Orders placed after <span className="font-bold">5 PM</span> will be delivered the following day.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracking */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Tracking and Delivery Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  You'll receive real-time updates on your order status and delivery tracking information. 
                  Contact us for any delays or questions about your delivery.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}