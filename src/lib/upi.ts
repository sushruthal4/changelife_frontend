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
  });

  return `upi://pay?${params.toString()}`;
}

export function openUpiDeepLink(options: UpiPaymentOptions): void {
  window.location.href = buildUpiPaymentUrl(options);
}
