const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

export interface CollectPaymentInput {
  amount: number;
  phone_number: string;
  order_id: number;
  description?: string;
}

export interface CollectPaymentResponse {
  success: boolean;
  message: string;
  data: {
    payment_id: number;
    reference: string;
    status: string;
    amount: number;
    provider: string;
  };
}

export interface PaymentStatusResponse {
  reference: string;
  status: string;
  payment_id: number;
  order_id: number;
  amount: number;
}

export async function collectPayment(input: CollectPaymentInput): Promise<CollectPaymentResponse> {
  const res = await fetch(`${API_BASE}/payments/collect`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Payment initiation failed");
  }
  return data;
}

export async function getPaymentStatus(reference: string): Promise<PaymentStatusResponse> {
  const res = await fetch(`${API_BASE}/payments/status/${encodeURIComponent(reference)}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to get payment status");
  }
  return data;
}
