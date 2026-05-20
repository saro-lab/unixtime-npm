import { Unixtime } from "./unixtime.js";

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

if (typeof window !== 'undefined' && typeof (window as any).Unixtime === 'undefined') {
    (window as any).Unixtime = Unixtime;
}

export { Unixtime }
