// unixtime = unixtime seconds
// umillis = unixtime milliseconds

// Y = YEAR, L = LEAP 1 DAY
import {DateTimeDetail, TimeDetail} from "./index";

const Y1 = 365n; // 1 year
const Y1L = Y1 + 1n; // 1 year (leap)
const Y4 = (Y1 * 4n) + 1n; // 4 years
const Y100 = (Y4 * 25n) - 1n; // 100 years
const Y400 = (Y100 * 4n) + 1n; // 400 years

// M = MILLISECOND
export const MS1 = 1000n;
export const MM1 = MS1 * 60n;
export const MH1 = MM1 * 60n;
export const MD1 = MH1 * 24n;
export const MY400 = Y400 * MD1;

// unix millis to y2k (2000/01/01)
const Y2K_UMILLIS = 946684800000n;
// unix millis to - year zero (0000/01/01)
const ZY_UMILLIS = -62167219200000n;

const DAY_LEN_IN_MONTH = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const DAY_LEN_IN_MONTH_ACC = [0, 0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];

function zerofill(n: number|bigint|string, fill: number): string {
    if (typeof n === 'string') {
        let sign = n.startsWith("-") ? "-" : "";
        return sign + n.substring(sign.length).padStart(fill, "0");
    } else if (typeof n === 'bigint') {
        return zerofill(n.toString(), fill);
    } else if (typeof n === 'number') {
        return zerofill(n.toString(), fill);
    }
    throw new Error(`is not number or bigint: ${n}`);
}

function toIntRange(n: number|bigint, min: number|null = null, max: number|null = null): number {
    if (typeof n === 'bigint') {
        return toIntRange(Number(n), min, max);
    }
    if (typeof n === 'number') {
        if (Number.isSafeInteger(n)) {
            if (min == null || n >= min) {
                if (max == null || n <= max) {
                    return n;
                }
            }
        }
    }
    throw new Error(`is not range of int: ${n}`);
}

function toBigIntRange(n: number|bigint, min: bigint|null = null, max: bigint|null = null): bigint {
    if (typeof n === 'number') {
        return toBigIntRange(BigInt(n));
    } else if (typeof n === 'bigint') {
        if (min == null || n >= min) {
            if (max == null || n <= max) {
                return n;
            }
        }
    }
    throw new Error(`is not range of bigint: ${n}`);
}

export function _to_XXX(detail: DateTimeDetail): string {
    let tz = detail.timezoneOffset * -1;
    if (tz === 0) {
        return 'Z';
    }
    const sign = tz > 0 ? '+' : '-';
    tz = Math.abs(tz);
    const h = Math.floor(tz / 60);
    const m = tz % 60;
    return `${sign}${zerofill(h, 2)}:${zerofill(m, 2)}`;
}

export function _to_a(detail: DateTimeDetail): string {
    return detail.hours >= 12 ? 'PM' : 'AM';
}

export function _to_E(week: number): string {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][week % 7];
}

export function _to_EE(week: number): string {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][week % 7];
}

export function _with_timezone_offset(millis: bigint, timezoneOffset: number): bigint {
    return millis - (BigInt(timezoneOffset) * MM1)
}

// [leapYear, leapCount]
export function _get_leap_info(year: bigint): [boolean, bigint] {
    const leapYear = ((year % 4n === 0n) && (year % 100n !== 0n)) || (year % 400n === 0n);
    const offset = (year >= 0n ? 1n : 0n) + (leapYear ? -1n : 0n);
    year = year < 0 ? -year : year;
    return [leapYear, (year / 4n) - (year / 100n) + (year / 400n) + offset];
}

export function _get_last_day_of_month(month: number, leapYear: boolean): number {
    if (month === 2 && !leapYear) {
        return DAY_LEN_IN_MONTH[month] - 1;
    }
    return DAY_LEN_IN_MONTH[month];
}

export function _merge_month_day(month: number, day: number, leapYear: boolean): number {
    const t = DAY_LEN_IN_MONTH_ACC[month] + (day - 1);
    return !leapYear && t >= 60 ? t - 1 : t;
}

export function _merge_all(
    _year: number|bigint = 1,
    _month: number|bigint = 1,
    _day: number|bigint = 1,
    _hours: number|bigint = 0,
    _minutes: number|bigint = 0,
    _seconds: number|bigint = 0,
    _milliseconds: number|bigint = 0,
    _timezoneOffset = new Date().getTimezoneOffset(),
): bigint {
    try {
        _year = BigInt(_year);
        let reverse = _year < 0n;
        let year = reverse ? -_year : _year;
        let [leapYear, leapCount] = _get_leap_info(_year);
        let month = toIntRange(_month, 1, 12);
        let day = toIntRange(_day, 1, _get_last_day_of_month(month, leapYear));
        let dayOfYear = BigInt(_merge_month_day(month, day, leapYear));
        let tz = toBigIntRange(_timezoneOffset, -1440n, 1440n) * MM1;
        let inDay = (
            (toBigIntRange(_hours, 0n, 23n) * MH1) +
            (toBigIntRange(_minutes, 0n, 59n) * MM1) +
            (toBigIntRange(_seconds, 0n, 59n) * MS1) +
            toBigIntRange(_milliseconds, 0n, 999n)
        );
        let time: bigint;
        if (reverse) {
            year = year - 1n;
            const maskYear = (leapYear ? Y1L : Y1) * MD1;
            const inYear = maskYear - ((dayOfYear * MD1) + inDay);
            const rt = (((year * Y1) + leapCount) * MD1) + inYear;
            time = -rt + ZY_UMILLIS + tz
        } else {
            time = (((year * Y1) + leapCount + dayOfYear) * MD1) + inDay + ZY_UMILLIS + tz
        }
        return time;
    } catch (e) {
        throw new Error(`Unixtime: Invalid Date: ${_year}-${_month}-${_day} ${_hours}:${_minutes}:${_seconds}.${_milliseconds}`);
    }
}

export function _split_day_of_year(dayOfYear: number, leapYear: boolean): [number, number] {
    const days = (!leapYear && dayOfYear >= 59) ? (dayOfYear + 1) : dayOfYear;
    for (let i = 12; i >= 2; i--) {
        if (days >= DAY_LEN_IN_MONTH_ACC[i]) {
            return [i, (days - DAY_LEN_IN_MONTH_ACC[i]) + 1];
        }
    }
    return [1, days + 1];
}

export function _to_week_un_timezone(umillis: bigint): number {
    let t: bigint;
    if (umillis >= 0) {
        t = ((umillis / MD1) + 4n) % 7n;
    } else {
        t = ((umillis + 1n) / MD1) - 1n;
        t = ((t + 4n) % 7n + 7n) % 7n;
    }
    return Number(t)
}

// year, leap, dayYear, milliseconds
export function _split_year(umillis: bigint): [bigint, boolean, number, bigint] {
    let year = 2000n;
    let y2kMillis = umillis - Y2K_UMILLIS;
    let t: bigint;
    if (y2kMillis >= 0) {
        year += (y2kMillis / MY400) * 400n;
        t = y2kMillis % MY400;
    } else {
        year += (((y2kMillis / MY400) - 1n) * 400n);
        t = y2kMillis = MY400 + (y2kMillis % MY400);
    }

    // in day
    let milliseconds = y2kMillis % MD1;

    // left time (day)
    // 0 <= t < (day of 400 Year)
    t /= MD1;

    const y100c = (t - 1n) / Y100;
    let leap: boolean = y100c === 0n;
    // t > 100 years = not leap year
    if (!leap) {
        year += (y100c * 100n);
        t = (t - 1n) % Y100;

        // if (t > 100 years and first 4 years) is not leap year
        if (t >= (Y1 * 4n)) {
            year += 4n;
            t -= (Y1 * 4n);
            leap = true;
        }
    } // else leap year

    // 4 years - un leap year
    if (leap) {
        let y4c = t / Y4;
        if (y4c > 0n) {
            year += (y4c * 4n);
            t = t % Y4;
            leap = true;
        }
    }

    // 1 year
    const d1l = leap ? 1n : 0n;
    const y1c = (t - d1l) / Y1;
    if (y1c > 0n) {
        year += y1c;
        t -= ((y1c * Y1) + (y1c > 0n ? d1l : 0n));
        leap = false;
    }

    return [year, leap, Number(t), milliseconds];
}

// hours, minutes, seconds, millis
export function _split_day(millisInDay: bigint): [number, number, number, number] {
    return ([
        Number(millisInDay / MH1),
        Number((millisInDay % MH1) / MM1),
        Number((millisInDay % MM1) / MS1),
        Number(millisInDay % MS1)
    ])
}

export function _to_date_time_detail(umillis: bigint, timezoneOffset: number): DateTimeDetail {
    const t = _with_timezone_offset(umillis, timezoneOffset);
    const week = _to_week_un_timezone(t);
    const [year, leapYear, dayOfYear, millisOfDay] = _split_year(t);
    const [month, day] = _split_day_of_year(dayOfYear, leapYear);
    const [hours, minutes, seconds, milliseconds] = _split_day(millisOfDay);
    return ({ leapYear, year, month, day, week, hours, minutes, seconds, milliseconds, timezoneOffset });
}

export function _to_time_detail(umillis: bigint, timezoneOffset: number): TimeDetail {
    const t = _with_timezone_offset(umillis, timezoneOffset);
    const [hours, minutes, seconds, milliseconds] = _split_day(t % MD1);
    return { hours, minutes, seconds, milliseconds, timezoneOffset };
}

export function _format(detail: DateTimeDetail, format: string): string {
    return format.split(/'/).map((s, i) => {
        if (i % 2 === 0) {
            return (s
                    .replace(/yyyy|yy|MM|dd|HH|hh|mm|ss|SSS|XXX|a|e|EE|E/g, (e) => {
                        switch (e) {
                            case 'yyyy': return zerofill(detail.year, 4);
                            case 'yy': return zerofill(detail.year, 2);
                            case 'MM': return zerofill(detail.month, 2);
                            case 'dd': return zerofill(detail.day, 2);
                            case 'HH': return zerofill(detail.hours, 2);
                            case 'hh': return zerofill(detail.hours % 12 || 12, 2);
                            case 'mm': return zerofill(detail.minutes, 2);
                            case 'ss': return zerofill(detail.seconds, 2);
                            case 'SSS': return zerofill(detail.milliseconds, 3);
                            case 'XXX': return _to_XXX(detail);
                            case 'a': return _to_a(detail);
                            case 'e': return detail.week.toString();
                            case 'E': return _to_E(detail.week);
                            case 'EE': return _to_EE(detail.week);
                        }
                        return e;
                    })
            )
        } else {
            return s;
        }
    }).join('');
}

export function __parse_iso(isoFormat: string): string {
    // TODO
    throw new Error('TODO');
}

export function __parse(data: string, format: string): string {
    if (!data) {
        return '';
    }
    if (1 === 1) {
        throw new Error('TODO');
    }
    return format.split(/'/).map((s, i) => {
        if (i % 2 === 0) {
            return (s
                    .replace(/yyyy|yy|MM|dd|HH|hh|mm|ss|SSS|XXX|a|e|EE|E/g, (e) => {

                        return e;
                    })
            )
        } else {
            return s;
        }
    }).join('');
}
