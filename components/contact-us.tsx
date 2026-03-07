"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Mail, Phone, MapPin, Clock, Send, Facebook, Twitter, Instagram } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"
import Link from "next/link"
import { FadeIn } from "@/components/fade-in"

const ContactSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Please enter your full name" })
    .max(80, { message: "Name is too long" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /[0-9+()\-\s]{7,}/.test(val), {
      message: "Please enter a valid phone number",
    }),
  subject: z.string().max(120).optional(),
  message: z.string().min(10, { message: "Please enter at least 10 characters" }).max(2000),
})

type ContactFormValues = z.infer<typeof ContactSchema>

export function ContactUs() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(ContactSchema),
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "" },
    mode: "onTouched",
  })

  const [isSubmitting, setIsSubmitting] = React.useState(false)

  async function onSubmit(values: ContactFormValues) {
    try {
      setIsSubmitting(true)
      // Placeholder: post to your backend or a service like Resend/SendGrid here
      await new Promise((r) => setTimeout(r, 900))
      toast({
        title: "Message sent",
        description: "Thanks for reaching out. We'll get back to you shortly.",
      })
      form.reset()
    } catch (err) {
      toast({
        title: "Something went wrong",
        description: "Please try again or use the email/phone provided.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden">
  
      <div className="absolute inset-0 bg-white rounded-xl" />
      <div className="relative container mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-10">
          <span className="inline-block bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium mb-3">
            Get in touch
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Contact Us</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-2xl mx-auto">
            Questions, feedback, or special requests? We're here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto rounded-full">
          {/* Info card */}
          <FadeIn>
            <Card className="bg-white border-gray-200 rounded-xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  
                  <div>
                    <CardTitle>Grocery Now</CardTitle>
                    <CardDescription>Fresh • Fast • Affordable</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <a href="mailto:grocerynow@gmail.com" className="font-medium text-gray-900 hover:text-emerald-700">
                        grocerynow@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <a href="tel:+256207808052" className="font-medium text-gray-900 hover:text-emerald-700">
                        +256 207 808052
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium text-gray-900">Nakasero, Kampala</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Support</p>
                      <p className="font-medium text-gray-900">24/7 Customer Support</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-dashed border-gray-200 p-5 bg-white">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Prefer a quick chat? Reach out on our socials:
                  </p>
                  <div className="flex items-center gap-3">
                    <a
                      href="https://www.facebook.com/share/17EAeaQjA6/"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Facebook"
                      className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a
                      href="https://x.com/BrwxrTy?t=FaAB0M7cYPp6O1mzzFMRTw&s=08"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Twitter"
                      className="w-10 h-10 rounded-full bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a
                      href="https://www.instagram.com/grocerynow25?utm_source=qr&igsh=MTI0OWM3MHZzcnRzZg=="
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Instagram"
                      className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center transition-colors"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">
                    You can also visit our <Link href="/about" className="text-emerald-700 font-medium hover:underline">About</Link> page to learn more.
                  </p>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Form card */}
          <FadeIn delay={80}>
            <Card className="bg-white border-gray-200 rounded-xl  ">
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <CardDescription>We typically respond within a few hours.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full name</FormLabel>
                            <FormControl>
                              <Input placeholder="Jane Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="jane@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone (optional)</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="+256 700 000000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject (optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Order inquiry, partnership, feedback..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your message</FormLabel>
                          <FormControl>
                            <Textarea rows={6} placeholder="Write your message here..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center justify-between gap-3 pt-2">
                      <p className="text-xs text-gray-500">
                        By sending this message you agree to our terms and privacy policy.
                      </p>
                      <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 rounded-xl">
                        {isSubmitting ? (
                          <>Sending...</>
                        ) : (
                          <>
                            Send message
                            <Send className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
