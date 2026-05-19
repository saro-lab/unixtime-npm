import {assert, describe, it} from 'vitest';
import "./index.js";
import {_merge_all, _split_day, _split_day_of_year, _split_year, _to_week_un_timezone} from "./util";

let logs: any[][] = [];

const push = (...args: any[]) => {
    logs.push(args);
    if (logs.length > 3) {
        logs.shift();
    }
}

const out = () => {
    logs.forEach(e => console.log(...e));
    logs = [];
}

describe('util test', () => {

    it('split 1900 ~ 3003 years', async () => {

        logs = [];

        for (let i = 0n; i < 402871n; i++) {
            // 1900 ~ 3003 years + (random time in day)
            const millis = ((i * 86400000n) -2208988800000n) + BigInt(Math.floor(Math.random() * 86400000));

            const date = new Date(Number(millis));
            let [year, leapYear, dayOfYear, millisOfDay] = _split_year(millis);
            let week = _to_week_un_timezone(millis);
            let [hours, minutes, seconds, milliseconds] = _split_day(millisOfDay);
            let [month, day] = _split_day_of_year(dayOfYear, leapYear);

            if (i === 0n) {
                console.log('START', year, month, day, dayOfYear, leapYear, date.getTime());
            }

            try {
                const d = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()} ${date.getUTCDay()} ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}.${date.getMilliseconds()}`;
                const u = `${year}-${month}-${day} ${week} ${hours}:${minutes}:${seconds}.${milliseconds}`;
                assert.equal(d, u);
            } catch (e) {
                push('FAIL', year, month, day, dayOfYear, leapYear, date.getTime());
                out();
                throw e;
            }
            push('PASS', year, month, day, dayOfYear, leapYear, date.getTime());
        }
        console.log('...')
        out();
        console.log('ALL PASS');
    });

    it('merge 1900 ~ 3003 years', async () => {

        logs = [];

        for (let i = 0n; i < 402871n; i++) {
            // 1900 ~ 3003 years + (random time in day)
            const millis = ((i * 86400000n) -2208988800000n) + BigInt(Math.floor(Math.random() * 86400000));

            const date = new Date(Number(millis));
            let umillis = _merge_all(
                date.getUTCFullYear(),
                date.getUTCMonth() + 1,
                date.getUTCDate(),
                date.getUTCHours(),
                date.getUTCMinutes(),
                date.getUTCSeconds(),
                date.getUTCMilliseconds(),
                0
            );

            if (i === 0n) {
                console.log('START', date.toUTCString());
            }

            try {
                assert.equal(date.getTime(), Number(umillis));
            } catch (e) {
                push('FAIL', date.toUTCString(), date.getTime(), umillis);
                out();
                throw e;
            }
            push('PASS', date.toUTCString());
        }
        console.log('...')
        out();
        console.log('ALL PASS');
    });
});
