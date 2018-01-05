export type PrefixStringFunction = (prefix: string, s: string) => string

export const prefixString: PrefixStringFunction = (prefix, s) => `[${prefix}] ${s}`