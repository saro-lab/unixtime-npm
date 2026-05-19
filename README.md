# unlimite UNIXTIME


### [Online Demo](https://dat.saro.me/--/tool/times)

## Quick Start
```
npm install infinite-unixtime
```

## Unlimited Time Range
```javascript
console.log(Unixtime.fromUtc(23948921773421234n, 1, 31).toIsoStringUtc());
console.log(Unixtime.from(-3472472928838282881717114n, 12, 31).toIsoStringUtc());
```

## Example

### From unixtime (milliseconds / seconds)

```javascript
let u = Unixtime.fromMillis(0);
assert.equal(u.toIsoStringUtc(), '1970-01-01T00:00:00.000Z');
assert.equal(u.toIsoString(-540), '1970-01-01T09:00:00.000+09:00');
assert.equal(u.toIsoString(-720), '1970-01-01T12:00:00.000+12:00');
assert.equal(u.toIsoString(720), '1969-12-31T12:00:00.000-12:00');
console.log(u.toIsoStringUtc());
console.log();

u = Unixtime.fromSeconds(0);
assert.equal(u.toIsoStringUtc(), '1970-01-01T00:00:00.000Z');
assert.equal(u.toIsoString(-540), '1970-01-01T09:00:00.000+09:00');
assert.equal(u.toIsoString(-720), '1970-01-01T12:00:00.000+12:00');
assert.equal(u.toIsoString(720), '1969-12-31T12:00:00.000-12:00');
console.log(u.toIsoStringUtc());

u = Unixtime.fromMillis(0);
console.log(u.toIsoStringUtc());
u = Unixtime.fromMillis(-1);
console.log(u.toIsoStringUtc());
```

### From date

```javascript
let u = Unixtime.from(1969, 12, 31)
console.log(u.toIsoStringUtc());
console.log();

u = Unixtime.from(1969, 12, 30)
console.log(u.toIsoStringUtc());
console.log();

u = Unixtime.fromUtc(0, 1, 1);
assert.equal(u.time, -62167219200000n)
assert.equal(u.getWeekShort(0), 'Sat')
console.log(u.toIsoStringUtc());
console.log();

u = Unixtime.fromUtc(-2, 12, 31, 23, 59, 59);
assert.equal(u.time, -62198755201000n)
assert.equal(u.getWeekShort(0), 'Thu')
console.log(u.toIsoStringUtc());
console.log();

u = Unixtime.fromUtc(-4, 2, 29, 23, 59, 59);
assert.equal(u.time, -62288265601000n)
assert.equal(u.getWeekShort(0), 'Thu')
console.log(u.toIsoStringUtc());
console.log();

u = Unixtime.fromUtc(-2000, 2, 29, 23, 59, 59);
assert.equal(u.time, -125275939201000n)
assert.equal(u.getWeekShort(0), 'Tue')
console.log(u.toIsoStringUtc());
console.log();

u = Unixtime.fromUtc(-2000, 3, 1, 0, 0, 0);
assert.equal(u.time, -125275939200000n)
assert.equal(u.getWeekShort(0), 'Wed')
console.log(u.toIsoStringUtc());
console.log();
```

### Now
```javascript
let u = Unixtime.now();
console.log('string', u.toString())
console.log('string', u.toString())
console.log('datetime', u.toDateTimeDetail())
console.log('time', u.time)
assert.equal(u.toIsoStringUtc(), u.toIsoString(0));
console.log();
```

### Format
```javascript
let u = Unixtime.now();
u = Unixtime.now();
console.log(u.format(`yyyy yy MM dd HH hh mm ss SSS XXX a e EE E 'yyyy escape'`));
// 2026 2026 05 19 21 09 17 35 183 +09:00 PM 2 Tuesday Tue yyyy escape
console.log(u.format(`yyyy yy MM dd HH hh mm ss SSS XXX a e EE E 'yyyy escape'`, -60));
// 2026 2026 05 19 13 01 17 35 183 +01:00 PM 2 Tuesday Tue yyyy escape
console.log(u.formatUtc(`yyyy yy MM dd HH hh mm ss SSS XXX a e EE E 'yyyy escape'`));
// 2026 2026 05 19 12 12 17 35 183 Z PM 2 Tuesday Tue yyyy escape
```
