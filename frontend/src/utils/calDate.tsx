import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

// ตั้ง timezone ไทยเป็นค่า default
dayjs.tz.setDefault("Asia/Bangkok");

export const DateOnly = (d?: Dayjs | Date | string | null): string | undefined => {
  if (!d) return undefined;
  const t = dayjs.isDayjs(d) ? d : dayjs(d);
  return t.isValid() ? t.tz("Asia/Bangkok").format("YYYY-MM-DD") : undefined;
};
