const historyKey = "ood_email_hint";

export function readEmailHint() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(historyKey) ?? "";
}

export function writeEmailHint(email: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(historyKey, email);
}
