// formatters.ts
export const currency = (value: number) => `$${value.toFixed(2)}`;
export const shortText = (text: string, length = 100) => text.length > length ? text.slice(0, length) + '…' : text;
