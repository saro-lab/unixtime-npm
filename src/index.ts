export * from "./unixtime.js";

export type DateTimeDetail = {
    readonly leapYear: boolean;
    readonly year: bigint;
    readonly month: number;
    readonly day: number;
    readonly hours: number;
    readonly minutes: number;
    readonly seconds: number;
    readonly milliseconds: number;
    readonly week: number;
    readonly timezoneOffset: number;
}

export type TimeDetail = {
    readonly hours: number;
    readonly minutes: number;
    readonly seconds: number;
    readonly milliseconds: number;
    readonly timezoneOffset: number;
}
