import { Card, CardContent } from "@/components/ui/card"
import { Leaf, Truck, Users, Heart } from "lucide-react"

export function AboutSection() {
  return (
    <section className="py-16 bg-white">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">About Grocery Now</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Grocery Now is committed to making grocery shopping easier, more convenient, easy family meal planning for our customers with fresh and high-quality groceries right to your doorstep on time and in perfect condition.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <Card className="shadow-lg">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-2xl font-semibold text-gray-900">Our Mission</h3>
            <p className="text-gray-700 leading-relaxed">
              Our customers are at heart of everything we do and we're dedicated to providing exceptional service and ensuring that they're completely satisfied with your experience.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Ready to experience the best and quality convenience? Browse our selection of fresh produce, meats, dairy products, and more, and place your order.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-2xl font-semibold text-gray-900">Why Choose Us?</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start space-x-3">
                <Leaf className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <span className="font-semibold">Freshness Guaranteed:</span> We source directly from farms and trusted
                  suppliers to ensure peak freshness.
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Truck className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <span className="font-semibold">Convenient Delivery:</span> Fast and reliable delivery services across
                  Kampala and Wakiso district.
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Heart className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <span className="font-semibold">Customer Satisfaction:</span> Your happiness and good health are our priority.
                </div>
              </li>

            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-16 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="p-6 text-center shadow-md">
            <h4 className="font-semibold text-lg mb-2">Quality</h4>
            <p className="text-gray-600 text-sm">We never compromise on the quality of our products and services.</p>
          </Card>
          <Card className="p-6 text-center shadow-md">
            <h4 className="font-semibold text-lg mb-2">Reliability</h4>
            <p className="text-gray-600 text-sm">Count on us for timely and accurate deliveries.</p>
          </Card>
          <Card className="p-6 text-center shadow-md">
            <h4 className="font-semibold text-lg mb-2">Integrity</h4>
            <p className="text-gray-600 text-sm">Honesty and transparency in all our dealings.</p>
          </Card>
        </div>
      </div>
    </section>
  )
}
