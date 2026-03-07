"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useCart } from "@/lib/cart-context"
import { collectPayment, getPaymentStatus } from "@/lib/paymentapi"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, Copy, CheckCircle2, Info } from "lucide-react"
import { getDeliveryFee } from "@/lib/delivery-fee"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"



export function CheckoutForm() {
  const { state, clearCart } = useCart()
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    zone: "",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentChoice, setPaymentChoice] = useState<"deposit" | "full">("deposit")
  const [consentChecked, setConsentChecked] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [orderReference, setOrderReference] = useState<string>("")
  const [orderId, setOrderId] = useState<number | null>(null)
  const [confirmedAmountDue, setConfirmedAmountDue] = useState<number>(0)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  // Mobile Money (MarzPay) flow
  const [momoPaymentMethod, setMomoPaymentMethod] = useState<"mtn" | "airtel" | "">("")
  const [momoPhone, setMomoPhone] = useState("")
  const [paymentReference, setPaymentReference] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "pending" | "processing" | "completed" | "failed">("idle")
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [isCollectingPayment, setIsCollectingPayment] = useState(false)

  const deliveryFee = getDeliveryFee(formData.zone || formData.location)
  const orderTotal = state.total + deliveryFee
  
  // Calculate 60% deposit, rounded to nearest 1,000 UGX
  const depositPercentage = 0.6
  const rawDeposit = orderTotal * depositPercentage
  const depositAmount = Math.round(rawDeposit / 1000) * 1000
  const amountDue = paymentChoice === "deposit" ? depositAmount : orderTotal

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!formData.name || !formData.phone || !formData.location || !formData.zone) {
      alert("Please fill in all required fields.")
      setIsSubmitting(false)
      return
    }

    if (!consentChecked) {
      alert("Please accept the payment policy to continue.")
      setIsSubmitting(false)
      return
    }

    try {
      // Prepare items for API
      const items = state.items.map(item => ({
        productId: Number(item.product_id),
        quantity: item.quantity,
        price: item.price
      }))
      
      // Add payment details to notes
      const paymentNote = `Payment: ${paymentChoice === "deposit" ? `80% deposit (UGX ${depositAmount.toLocaleString()})` : `Full payment (UGX ${orderTotal.toLocaleString()})`}. ${formData.notes ? `Notes: ${formData.notes}` : ''}`
      
      // Dynamically import API to avoid SSR issues
      const { createOrder } = await import("@/lib/orderapi")
      const order = await createOrder({
        customerName: formData.name,
        phone: formData.phone,
        location: formData.location,
        zone: formData.zone,
        notes: paymentNote,
        items
      })
      
      // Set order reference, id, and amount due for confirmation / MoMo
      setOrderReference(`ORDER-${order.id}`)
      setOrderId(order.id)
      setConfirmedAmountDue(amountDue)
      setShowConfirmation(true)
      setPaymentStatus("idle")
      setPaymentError(null)
      setPaymentReference(null)
      setMomoPaymentMethod("")
      setMomoPhone("")

      // Reset form
      setFormData({
        name: "",
        phone: "",
        location: "",
        zone: "",
        notes: "",
      })
      setConsentChecked(false)
      setPaymentChoice("deposit")
    } catch (error: any) {
      console.error("Error placing order:", error)
      alert(error.message || "There was an error placing your order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  // Poll payment status when waiting for user to approve on phone
  useEffect(() => {
    if (!paymentReference || (paymentStatus !== "pending" && paymentStatus !== "processing")) return
    const interval = setInterval(async () => {
      try {
        const data = await getPaymentStatus(paymentReference!)
        setPaymentStatus(data.status === "completed" ? "completed" : data.status === "failed" ? "failed" : "processing")
        if (data.status === "failed") setPaymentError("Payment was not approved. You can try again.")
        if (data.status === "completed" || data.status === "failed") clearInterval(interval)
      } catch (_) {}
    }, 2500)
    return () => clearInterval(interval)
  }, [paymentReference, paymentStatus])

  const handlePayWithMoMo = async () => {
    if (!orderId || !momoPaymentMethod || !momoPhone.trim()) {
      setPaymentError("Please select a payment method and enter your phone number.")
      return
    }
    const cleanPhone = momoPhone.replace(/\s+/g, "").trim()
    if (!/^(\+256|0)?[0-9]{9}$/.test(cleanPhone)) {
      setPaymentError("Please enter a valid Uganda phone number (e.g. 0712345678 or +256712345678).")
      return
    }
    setPaymentError(null)
    setIsCollectingPayment(true)
    try {
      const res = await collectPayment({
        amount: confirmedAmountDue,
        phone_number: cleanPhone,
        order_id: orderId,
        description: `Order ${orderReference}`,
      })
      setPaymentReference(res.data.reference)
      setPaymentStatus(res.data.status === "completed" ? "completed" : "processing")
    } catch (err: any) {
      setPaymentError(err.message || "Failed to initiate payment. Please try again.")
    } finally {
      setIsCollectingPayment(false)
    }
  }

  if (state.items.length === 0 && !showConfirmation) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No items in cart</h2>
        <p className="text-gray-600">Add some products before checkout</p>
      </div>
    )
  }

  return (
    <>
    <div className="grid lg:grid-cols-2 gap-8">
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle>Delivery Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-amber-900 mb-1">Payment Policy</h4>
                <p className="text-sm text-amber-800">
                  Orders commence once <strong>60% deposit is received</strong> or <strong>full payment is made</strong>. 
                  You have <strong>24 hours</strong> to complete payment after placing your order.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="e.g., +256701234567"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zone">Delivery Area *</Label>
              <Select value={formData.zone} onValueChange={(v) => setFormData({ ...formData, zone: v })} required>
                <SelectTrigger id="zone">
                  <SelectValue placeholder="Select area/zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kampala Central">Kampala Central</SelectItem>
                  <SelectItem value="Wakiso">Wakiso</SelectItem>
                  <SelectItem value="Other">Other areas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Delivery Address *</Label>
              <Textarea
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter your complete delivery address (e.g., Kampala, Nakawa Division, near Shell Station)"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Special Instructions</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any special delivery instructions (e.g., call when you arrive, leave at gate, etc.)"
                rows={3}
              />
            </div>

            <div className="space-y-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <Label className="text-base font-semibold text-green-900">Payment Option</Label>
              <RadioGroup value={paymentChoice} onValueChange={(v) => setPaymentChoice(v as "deposit" | "full")}>
                <div className="flex items-start space-x-3 p-3 bg-white rounded-md border border-green-200">
                  <RadioGroupItem value="deposit" id="deposit" className="mt-0.5" />
                  <div className="flex-1">
                    <Label htmlFor="deposit" className="font-medium cursor-pointer">
                      Pay 80% Deposit (Recommended)
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Pay UGX {depositAmount.toLocaleString()} now. Balance due on delivery.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-white rounded-md border border-green-200">
                  <RadioGroupItem value="full" id="full" className="mt-0.5" />
                  <div className="flex-1">
                    <Label htmlFor="full" className="font-medium cursor-pointer">
                      Pay Full Amount
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Pay UGX {orderTotal.toLocaleString()} now. Nothing due on delivery.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Checkbox 
                id="consent" 
                checked={consentChecked} 
                onCheckedChange={(checked) => setConsentChecked(checked as boolean)}
                className="mt-0.5"
              />
              <Label htmlFor="consent" className="text-sm cursor-pointer leading-relaxed">
                I understand that my order will only commence once the required payment is received within 48 hours. 
                I will use the order reference provided when making payment.
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 rounded-xl"
              size="lg"
              disabled={isSubmitting || !consentChecked}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              {isSubmitting ? "Placing Order..." : "Place Order"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {state.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">UGX {(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>UGX {state.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>UGX {deliveryFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>UGX {orderTotal.toLocaleString()}</span>
            </div>
            {paymentChoice === "deposit" && (
              <div className="flex justify-between text-green-700 font-semibold bg-green-50 p-3 rounded-lg">
                <span>80% Deposit Due Now</span>
                <span>UGX {depositAmount.toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Payment Methods</h4>
            <div className="space-y-2 text-sm text-green-700">
              <div className="flex justify-between">
                <span>MTN MoMo Pay:</span>
                <span className="font-mono font-bold">954379</span>
              </div>
              <div className="flex justify-between">
                <span>Airtel Pay:</span>
                <span className="font-mono font-bold">6926467</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Quick Ordering</h4>
            <p className="text-sm text-blue-700">
              Your order will be automatically sent to the team for quick processing. We'll contact
              you to confirm delivery details, timing, and payment method.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>

    <Dialog open={showConfirmation} onOpenChange={() => {}}>
      <DialogContent 
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <DialogTitle className="text-2xl text-center">Order Placed Successfully!</DialogTitle>
          <DialogDescription className="text-center">
            Your order has been received. Please complete payment to start processing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <Label className="text-sm text-gray-600 mb-2 block">Your Order Reference</Label>
            <div className="flex items-center justify-between gap-3">
              <code className="text-2xl font-bold text-gray-900">{orderReference}</code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(orderReference, "reference")}
              >
                {copiedField === "reference" ? (
                  <><CheckCircle2 className="w-4 h-4 mr-1" /> Copied</>
                ) : (
                  <><Copy className="w-4 h-4 mr-1" /> Copy</>
                )}
              </Button>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <Label className="text-sm text-green-700 mb-2 block">
              {paymentChoice === "deposit" ? "Deposit Amount Due" : "Full Payment Due"}
            </Label>
            <div className="text-3xl font-bold text-green-900">
              UGX {amountDue.toLocaleString()}
            </div>
            {paymentChoice === "deposit" && (
              <p className="text-sm text-green-700 mt-2">
                Balance of UGX {(orderTotal - depositAmount).toLocaleString()} due on delivery
              </p>
            )}
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Payment Instructions</h4>
            
            <div className="space-y-3">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">MTN MoMo Pay</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard("954379", "mtn")}
                  >
                    {copiedField === "mtn" ? (
                      <><CheckCircle2 className="w-4 h-4 mr-1" /> Copied</>
                    ) : (
                      <><Copy className="w-4 h-4 mr-1" /> Copy</>
                    )}
                  </Button>
                </div>
                <code className="text-xl font-bold text-gray-900">954379</code>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Airtel Pay</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard("6926467", "airtel")}
                  >
                    {copiedField === "airtel" ? (
                      <><CheckCircle2 className="w-4 h-4 mr-1" /> Copied</>
                    ) : (
                      <><Copy className="w-4 h-4 mr-1" /> Copy</>
                    )}
                  </Button>
                </div>
                <code className="text-xl font-bold text-gray-900">6926467</code>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h5 className="font-semibold text-amber-900 mb-2">Important:</h5>
              <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                <li>Use <strong>{orderReference}</strong> as your payment reference</li>
                {/* <li>Payment must be received within <strong>48 hours</strong></li> */}
                <li>We'll contact you once payment is confirmed</li>
                <li>Save this reference for your records</li>
              </ul>
            </div>
          </div>

          {/* Pay with Mobile Money (MarzPay) */}
          <div className="border-t pt-4 space-y-4">
            <h4 className="font-semibold text-gray-900">Pay with Mobile Money</h4>
            {paymentStatus === "completed" ? (
              <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-green-800 font-medium">Payment received. We'll process your order shortly.</span>
              </div>
            ) : paymentStatus === "processing" || paymentStatus === "pending" ? (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
                  <span className="font-medium text-blue-900">Waiting for approval</span>
                </div>
                <p className="text-sm text-blue-800">Check your phone and approve the mobile money request.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2">
                  {(["mtn", "airtel"] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setMomoPaymentMethod(method)}
                      className={`p-3 rounded-lg border-2 text-left text-sm font-medium transition ${
                        momoPaymentMethod === method
                          ? "border-green-600 bg-green-50 text-green-900"
                          : "border-gray-200 hover:border-green-300 text-gray-700"
                      }`}
                    >
                      {method === "mtn" ? "MTN MoMo" : "Airtel Money"}
                    </button>
                  ))}
                </div>
                {momoPaymentMethod && (
                  <div className="space-y-2">
                    <Label className="text-sm">Phone number ({momoPaymentMethod === "mtn" ? "MTN" : "Airtel"})</Label>
                    <Input
                      type="tel"
                      placeholder="0712345678 or +256712345678"
                      value={momoPhone}
                      onChange={(e) => setMomoPhone(e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                )}
                {paymentError && (
                  <p className="text-sm text-red-600 font-medium">{paymentError}</p>
                )}
                <Button
                  type="button"
                  onClick={handlePayWithMoMo}
                  disabled={!momoPaymentMethod || !momoPhone.trim() || isCollectingPayment}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  {isCollectingPayment ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Initiating...
                    </>
                  ) : (
                    <>Pay UGX {confirmedAmountDue.toLocaleString()} now</>
                  )}
                </Button>
              </>
            )}
          </div>

          <Button
            onClick={async () => { await clearCart(); setShowConfirmation(false) }}
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
          >
            Got it, Thanks!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}
