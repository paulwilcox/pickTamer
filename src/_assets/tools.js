export function dateFormat(date, format) {
  let padZero = (value) => value < 10 ? `0${value}` : value

  let hours = date.getHours()
  let hour12 = hours % 12 || 12

  let tokens = {
    yyyy: date.getFullYear(),
    yyy: date.getFullYear().toString().slice(-3),
    yy: date.getFullYear().toString().slice(-2),
    y: date.getFullYear().toString().slice(-1),
    MM: padZero(date.getMonth() + 1),
    M: date.getMonth() + 1,
    dd: padZero(date.getDate()),
    d: date.getDate(),
    HH: padZero(hours),
    H: hours,
    hh: padZero(hour12),
    h: hour12,
    mm: padZero(date.getMinutes()),
    m: date.getMinutes(),
    ss: padZero(date.getSeconds()),
    s: date.getSeconds(),
    t: hours >= 12 ? 'pm' : 'am',
  }

  return format.replace(
    /(yyyy|yyy|yy|y|MM|M|dd|d|HH|H|hh|h|mm|m|ss|s|t)/g, 
    (match) => tokens[match] || match
  )
}
  
