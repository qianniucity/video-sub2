type Time = string;
type Duration = number | string;

function checkTime(time: Time): boolean {
  console.log("timetimetimetimetime", time);
  console.log("timetime", /^(\d+:)?([0-5][0-9]:)?([0-5][0-9])(\.\d{1,3})?$/.test(time));
  console.log("timetime", /^(\d+:)?([0-5][0-9]:)?([0-5][0-9])(\.\d{1,3})?$/.test(time));
  console.log("timetime", /^(\d+:)?([0-5][0-9]:)?([0-5][0-9])(\.\d{1,3})?$/.test(time));
  console.log("timetime", /^(\d+:)?([0-5][0-9]:)?([0-5][0-9])(\.\d{1,3})?$/.test(time));
  return /^(\d+:)?([0-5][0-9]:)?([0-5][0-9])(\.\d{1,3})?$/.test(time);
}

function checkDuration(duration: Duration): boolean {
  const durationStr = String(duration);
  return /^(\d+)(\.\d{1,3})?$/.test(durationStr);
}

function padEnd(str: string, targetLength: number, padString: string): string {
  if (str.length > targetLength) {
    return String(str);
  } else {
    let padLength = targetLength - str.length;
    if (padLength > padString.length) {
      padString += padString.repeat(padLength / padString.length);
    }
    return String(str) + padString.slice(0, padLength);
  }
}


const DT = {
  d2t: function (duration: Duration): string {
    const durationNum = parseFloat(Number(duration).toFixed(3));
    if (checkDuration(durationNum)) {
      let totalSeconds = Math.floor(durationNum);
      const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
      totalSeconds %= 3600;
      const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
      const seconds = (totalSeconds % 60).toString().padStart(2, '0');
      const milliseconds = durationNum.toString().split('.')[1] || '0';
      const formattedMilliseconds = milliseconds.padEnd(3, '0').substring(0, 3);

      return `${hours}:${minutes}:${seconds}.${formattedMilliseconds}`;
    } else {
      throw new Error("The format of the duration is incorrect: " + duration);
    }
  },
  t2d: function (time: Time): number {
    console.log("t2d-time", time);
    if (checkTime(time)) {
      const arr = time.split(".");
      const left = arr[0].split(":") || [];
      const right = padEnd(arr[1] || "0", 3, "0");
      const ms = Number(right) / 1000;

      const h = Number(left[left.length - 3] || 0) * 3600;
      const m = Number(left[left.length - 2] || 0) * 60;
      const s = Number(left[left.length - 1] || 0);
      return h + m + s + ms;
    } else {
      throw new Error("The format of the time is incorrect: " + time);
    }
  },



};

export { DT };