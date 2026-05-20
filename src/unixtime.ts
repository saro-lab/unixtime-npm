import {
    _format, _get_last_day_of_month,
    _merge_all,
    _to_date_time_detail, _to_E, _to_EE,
    _to_time_detail,
    _to_week_un_timezone,
    _with_timezone_offset,
    MD1,
    MH1,
    MM1,
    MS1
} from "./util";
import {DateTimeDetail, TimeDetail} from "./index";

export class Unixtime {
    readonly timestamp: bigint;
    constructor(umillis: bigint) {
        this.timestamp = umillis;
    }
    get $timestamp(): number {
        return Number(this.timestamp);
    }
    get time(): bigint {
        return this.timestamp / 1000n;
    }
    get $time(): number {
        return Number(this.timestamp / 1000n);
    }

    public static now() {
        return new Unixtime(BigInt(new Date().getTime()));
    }
    public static fromDate(date: Date): Unixtime {
        return new Unixtime(BigInt(date.getTime()));
    }
    public static fromMillis(unixMillis: bigint|number|string|Unixtime|Date): Unixtime {
        if (unixMillis instanceof Unixtime) {
            return unixMillis;
        } else if (unixMillis instanceof Date) {
            return new Unixtime(BigInt(unixMillis.getTime()));
        }
        return new Unixtime(BigInt(typeof unixMillis === 'number' ? Math.floor(unixMillis) : unixMillis));
    }
    public static fromSeconds(unixSeconds: bigint|number|string|Unixtime|Date): Unixtime {
        if (unixSeconds instanceof Unixtime) {
            return unixSeconds;
        } else if (unixSeconds instanceof Date) {
            return new Unixtime(BigInt(unixSeconds.getTime()));
        }
        return new Unixtime(BigInt(typeof unixSeconds === 'number' ? Math.floor(unixSeconds) : unixSeconds) * 1000n);
    }
    public static from(
        year: number|bigint = 1, month: number|bigint = 1, day: number|bigint = 1,
        hour: number|bigint = 0, minute: number|bigint = 0, second: number|bigint = 0, millisecond: number|bigint = 0,
        timezoneOffset = new Date().getTimezoneOffset(),
    ): Unixtime {
        return new Unixtime(_merge_all(year, month, day, hour, minute, second, millisecond, timezoneOffset));
    }
    public static fromUtc(
        year: number|bigint = 1, month: number|bigint = 1, day: number|bigint = 1,
        hour: number|bigint = 0, minute: number|bigint = 0, second: number|bigint = 0, millisecond: number|bigint = 0,
    ): Unixtime {
        return new Unixtime(_merge_all(year, month, day, hour, minute, second, millisecond, 0));
    }

    public toTimeDetail(timezoneOffset = new Date().getTimezoneOffset()): TimeDetail {
        return _to_time_detail(this.timestamp, timezoneOffset);
    }

    public toDateTimeDetail(timezoneOffset = new Date().getTimezoneOffset()): DateTimeDetail {
        return _to_date_time_detail(this.timestamp, timezoneOffset);
    }

    public format(dateFormat: string, timezoneOffset = new Date().getTimezoneOffset()): string {
        return _format(this.toDateTimeDetail(timezoneOffset), dateFormat);
    }

    public formatUtc(dateFormat: string): string {
        return _format(this.toDateTimeDetail(0), dateFormat);
    }

    public toString(timezoneOffset = new Date().getTimezoneOffset()): string {
        return this.format(`yyyy-MM-dd (E) a hh:mm ss.SSS XXX`, timezoneOffset);
    }

    public getYear(timezoneOffset = new Date().getTimezoneOffset()): bigint {
        return this.toDateTimeDetail(timezoneOffset).year;
    }

    public getYearNumber(timezoneOffset = new Date().getTimezoneOffset()): number {
        return Number(this.toDateTimeDetail(timezoneOffset).year);
    }

    public getMonth(timezoneOffset = new Date().getTimezoneOffset()): number {
        return this.toDateTimeDetail(timezoneOffset).month;
    }

    public getLastDayOfMonth(timezoneOffset = new Date().getTimezoneOffset()): number {
        const detail = this.toDateTimeDetail(timezoneOffset);
        return _get_last_day_of_month(detail.month, detail.leapYear);
    }

    public getDay(timezoneOffset = new Date().getTimezoneOffset()): number {
        return this.toDateTimeDetail(timezoneOffset).day;
    }

    public isLeapYear(timezoneOffset = new Date().getTimezoneOffset()): boolean {
        return this.toDateTimeDetail().leapYear;
    }

    public getWeek(timezoneOffset = new Date().getTimezoneOffset()): number {
        return _to_week_un_timezone(_with_timezone_offset(this.timestamp, timezoneOffset))
    }

    public getWeekShort(timezoneOffset = new Date().getTimezoneOffset()): string {
        return _to_E(this.getWeek(timezoneOffset));
    }

    public getWeekLong(timezoneOffset = new Date().getTimezoneOffset()): string {
        return _to_EE(this.getWeek(timezoneOffset));
    }

    public getHours(timezoneOffset = new Date().getTimezoneOffset()): number {
        return this.toTimeDetail(timezoneOffset).hours;
    }

    public getHours12(timezoneOffset = new Date().getTimezoneOffset()): number {
        return this.toTimeDetail(timezoneOffset).hours % 12 || 12;
    }

    public getAmPm(timezoneOffset = new Date().getTimezoneOffset()): string {
        return this.getHours(timezoneOffset) < 12 ? "AM" : "PM";
    }

    public getMinutes(timezoneOffset = new Date().getTimezoneOffset()): number {
        return this.toTimeDetail(timezoneOffset).minutes;
    }

    public getSeconds(timezoneOffset = new Date().getTimezoneOffset()): number {
        return this.toTimeDetail(timezoneOffset).seconds;
    }

    public getMilliseconds(timezoneOffset = new Date().getTimezoneOffset()): number {
        return this.toTimeDetail(timezoneOffset).milliseconds;
    }

    public toStringUtc(): string {
        return this.formatUtc(`yyyy-MM-dd (E) a hh:mm ss.SSS XXX`);
    }

    public toIsoString(timezoneOffset = new Date().getTimezoneOffset()): string {
        return this.format(`yyyy-MM-ddTHH:mm:ss.SSSXXX`, timezoneOffset);
    }

    public toIsoStringUtc(): string {
        return this.formatUtc(`yyyy-MM-ddTHH:mm:ss.SSSXXX`);
    }

    public plusMillis(milliseconds: number|bigint): Unixtime {
        return new Unixtime(this.timestamp + BigInt(milliseconds));
    }

    public plusSeconds(seconds: number|bigint): Unixtime {
        return new Unixtime(this.timestamp + (BigInt(seconds) * MS1));
    }

    public plusMinutes(minutes: number|bigint): Unixtime {
        return new Unixtime(this.timestamp + (BigInt(minutes) * MM1));
    }

    public plusHours(hours: number|bigint): Unixtime {
        return new Unixtime(this.timestamp + (BigInt(hours) * MH1));
    }

    public plusDays(days: number|bigint): Unixtime {
        return new Unixtime(this.timestamp + (BigInt(days) * MD1));
    }

    public before(time: Unixtime|number|bigint|Date, seconds: boolean = false): boolean {
        return this.timestamp < (seconds ? Unixtime.fromSeconds(time) : Unixtime.fromMillis(time)).timestamp;
    }

    public beforeEq(time: Unixtime|number|bigint|Date, seconds: boolean = false): boolean {
        return this.timestamp <= (seconds ? Unixtime.fromSeconds(time) : Unixtime.fromMillis(time)).timestamp;
    }

    public after(time: Unixtime|number|bigint|Date, seconds: boolean = false): boolean {
        return this.timestamp > (seconds ? Unixtime.fromSeconds(time) : Unixtime.fromMillis(time)).timestamp;
    }

    public afterEq(time: Unixtime|number|bigint|Date, seconds: boolean = false): boolean {
        return this.timestamp >= (seconds ? Unixtime.fromSeconds(time) : Unixtime.fromMillis(time)).timestamp;
    }

    public between(start: Unixtime|number|bigint|Date, end: Unixtime|number|bigint|Date, seconds: boolean = false): boolean {
        return this.afterEq(start, seconds) && this.beforeEq(end, seconds);
    }
}
