"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is Grocery Now the best online grocery store in Uganda?",
    answer: "Yes! Grocery Now is one of Uganda's leading online grocery stores, offering fresh products, competitive prices, and fast delivery in Kampala. We're committed to providing the best grocery shopping experience for Ugandan families."
  },
  {
    question: "Do you deliver groceries throughout Uganda?",
    answer: "Currently, we deliver fresh groceries to Kampala and surrounding areas. We're expanding our delivery network to serve more locations across Uganda. Check our delivery page for the latest coverage areas."
  },
  {
    question: "How fast is grocery delivery in Kampala?",
    answer: "We offer same-day delivery in Kampala for orders placed before 3 PM. Our delivery team ensures your fresh groceries arrive promptly at your doorstep, maintaining quality and freshness."
  },
  {
    question: "What payment methods do you accept for grocery orders?",
    answer: "We accept multiple payment methods including MTN Mobile Money, Airtel Money, cash on delivery, and other mobile payment options. This makes grocery shopping convenient for all our customers in Uganda."
  },
  {
    question: "Are your groceries fresh and organic?",
    answer: "Yes! We source fresh produce directly from local Ugandan farmers and trusted suppliers. Many of our products are organic and we ensure all groceries meet our high quality standards before delivery."
  },
  {
    question: "Can I order groceries online for same-day delivery?",
    answer: "Absolutely! Place your grocery order before 3 PM and we'll deliver it the same day in Kampala. For orders placed after 3 PM, delivery will be scheduled for the next day."
  },
  {
    question: "What makes Grocery Now different from other grocery stores in Uganda?",
    answer: "Grocery Now offers a seamless online shopping experience with fresh products, competitive prices, fast delivery, and excellent customer service. We're dedicated to making grocery shopping convenient and affordable for Ugandan families."
  },
  {
    question: "Do you offer discounts on grocery orders?",
    answer: "Yes! We regularly offer special discounts and promotions on various grocery items. Check our offers page and subscribe to our newsletter to stay updated on the latest deals and savings."
  }
];

export function FAQSection() {
  return (
    <section className="container mx-auto px-4 py-16 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions About Grocery Shopping in Uganda
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about shopping for groceries online with Grocery Now
          </p>
        </div>
        
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-white rounded-lg px-6 border border-gray-200"
            >
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-emerald-600">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

