import {assert, describe, it} from 'vitest';
import "./index.js";
import {Unixtime} from "./unixtime";

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

describe('format test', () => {

    it('iso +1200 years', async () => {

        logs = [];
        let time = BigInt(new Date().getTime());

        for (let i = 0n; i < 438300n; i++) {
            // 1900 ~ 3003 years + (random time in day)
            const millis = ((i * 86400000n) + time) + BigInt(Math.floor(Math.random() * 86400000));

            const date = new Date(Number(millis));
            const unixtime = Unixtime.fromMillis(millis)

            if (i === 0n) {
                console.log('START', date.toISOString());
            }

            try {
                const d = date.toISOString();
                const u = unixtime.toIsoStringUtc();
                assert.equal(d, u);
            } catch (e) {
                push('FAIL', date.toISOString(), unixtime.toIsoStringUtc());
                out();
                throw e;
            }
            push('PASS', date.toISOString(), date.getUTCDay(), unixtime.toIsoString(), unixtime.getWeek(0));
        }
        console.log('...')
        out();
        console.log('ALL PASS');
    });

    it('iso +1200 years with timezone', async () => {

        logs = [];
        let time = BigInt(new Date().getTime());

        for (let i = 0n; i < 438300n; i++) {
            // 1900 ~ 3003 years + (random time in day)
            const millis = ((i * 86400000n) + time) + BigInt(Math.floor(Math.random() * 86400000));

            const date = new Date(Number(millis));
            const unixtime = Unixtime.from(
                date.getFullYear(),
                date.getMonth() + 1,
                date.getDate(),
                date.getHours(),
                date.getMinutes(),
                date.getSeconds(),
                date.getMilliseconds(),
            )

            if (i === 0n) {
                console.log('START', date.toISOString());
            }

            try {
                const d = date.toISOString();
                const u = unixtime.toIsoStringUtc();
                assert.equal(d, u);
            } catch (e) {
                push('FAIL', `${date.toISOString()} ${date.getUTCDay()} ${date.getDay()}`, `${unixtime.toIsoStringUtc()} ${unixtime.getWeek(0)} ${unixtime.getWeek()}`);
                out();
                throw e;
            }
            push('PASS', date.toString(), date.getUTCDay(), date.getDay(), unixtime.toString(), unixtime.getWeek(0), unixtime.getWeek());
        }
        console.log('...')
        out();
        console.log('ALL PASS');
    });
});
