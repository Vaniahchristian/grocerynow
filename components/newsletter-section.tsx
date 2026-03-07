import { Leaf } from "lucide-react";
import { ArrowRight } from "lucide-react";

export function NewsletterSection() {
  return (
  <div className="flex justify-center items-center min-h-[300px] sm:min-h-[500px] py-8 sm:py-12">
    <div className="relative w-full max-w-4xl h-auto sm:h-[400px] rounded-3xl overflow-hidden shadow-xl">
      {/* Background image */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=400&fit=crop')] bg-cover bg-center" />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-50" />

      {/* Content container */}
      <div className="relative z-10 flex flex-col justify-center h-full px-4 sm:px-10">
        <div className="text-center sm:text-left">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Stay Fresh with Our Newsletter
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto sm:mx-0">
            Get exclusive deals, fresh produce updates, and healthy recipes delivered to your inbox weekly
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto sm:mx-0">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 text-lg"
            />
            <button className="bg-white text-green-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-xl">
              Subscribe <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <p className="text-white/70 text-sm mt-4">🎁 Get 10% off your first order when you subscribe!</p>
        </div>
      </div>
    </div>
  </div>
  );
}
