type UpiPaymentOptions = {
  upiId: string;
  payeeName: string;
  amount: number;
  transactionRef: string;
  note?: string;
};

const truncate = (str: string, max: number) => str.slice(0, max);

export function buildUpiPaymentUrl({
  upiId,
  payeeName,
  amount,
  transactionRef,
  note,
}: UpiPaymentOptions) {
  const params = new URLSearchParams({
    pa: upiId,
    pn: truncate(payeeName, 50),
    am: amount.toFixed(2),
    cu: "INR",
    tr: truncate(transactionRef, 35),
    tn: truncate(note || `Change Life donation ${transactionRef}`, 50),
    mc: "8398",
  });

  return `upi://pay?${params.toString()}`;
}

export function openUpiDeepLink(options: UpiPaymentOptions): void {
  const query = new URLSearchParams({
    pa: options.upiId,
    pn: truncate(options.payeeName, 50),
    am: options.amount.toFixed(2),
    cu: "INR",
    tr: truncate(options.transactionRef, 35),
    tn: truncate(options.note || `Change Life donation ${options.transactionRef}`, 50),
    mc: "8398",
  }).toString();

  // Try to open via a hidden anchor — most reliable way to trigger deep links on mobile
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = `upi://pay?${query}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
