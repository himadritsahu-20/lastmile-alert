export const SMS_LIMIT = 160;
export function formatSMS(text = "") { return text.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim(); }
export function getSMSParts(text = "") { const value = formatSMS(text); return { text: value, length: value.length, parts: Math.max(1, Math.ceil(value.length / SMS_LIMIT)), remaining: SMS_LIMIT - (value.length % SMS_LIMIT || SMS_LIMIT) }; }