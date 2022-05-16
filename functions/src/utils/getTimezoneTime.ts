import * as moment from "moment-timezone";

/**
 * @param {string} format Format as a moment.js string input.
 * @param {Date} date Date default is Date.now().
 * @param {string} zone Timezone default is America/Los_Angeles.
 * @return {string | number} Returns a moment.js timestamp in the format you want.
 */
export function getTimezoneTime(
  format: string,
  date?: Date,
  zone = "America/Los_Angeles"
) {
  const m = date ? date : new Date();
  if (format === "x" || format === "X") {
    return Number.parseInt(moment(m).tz(zone).format(format));
  }
  return moment(m).tz(zone).format(format);
}
