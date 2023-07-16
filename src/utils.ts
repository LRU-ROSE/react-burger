
type StringOrFalsish = string | false | null | undefined | 0;
export const cx = (...args: StringOrFalsish[]): string => args.filter((arg) => arg).join(" ");
