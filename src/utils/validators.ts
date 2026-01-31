// validators.ts
export const isEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
export const isNotEmpty = (value: string) => value.trim().length > 0;
