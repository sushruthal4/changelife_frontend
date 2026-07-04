type UpiPaymentOptions = {
  upiId: string;
  payeeName: string;
  amount: number;
  transactionRef: string;
  note?: string;
};

export function buildUpiPaymentUrl({
  upiId,
  payeeName,
  amount,
  transactionRef,
  note,
}: UpiPaymentOptions) {
  const params = new URLSearchParams({
    pa: upiId,
    pn: payeeName,
    am: amount.toFixed(2),
    cu: "INR",
    tr: transactionRef,
    tn: note || `Heart Fuel donation ${transactionRef}`,
  });

  return `upi://pay?${params.toString()}`;
}

// Opens UPI deep link — tries app-specific schemes first, falls back to generic upi://
export function openUpiDeepLink(options: UpiPaymentOptions): void {
  const query = new URLSearchParams({
    pa: options.upiId,
    pn: options.payeeName,
    am: options.amount.toFixed(2),
    cu: "INR",
    tr: options.transactionRef,
    tn: options.note || `Heart Fuel donation ${options.transactionRef}`,
  }).toString();

  // Try to open via a hidden anchor — most reliable way to trigger deep links on mobile
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = `upi://pay?${query}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
