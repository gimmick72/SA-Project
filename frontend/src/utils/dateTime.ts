import dayjs, { Dayjs } from "dayjs";
export type DateInput = Dayjs | Date | string | null | undefined;

const toDayjs = (v: DateInput): Dayjs | undefined => {
  if (v == null) return undefined;
  const d = dayjs(v);
  return d.isValid() ? d : undefined;
};

// รวม dateOnly + timeOnly → สตริง RFC3339 ตามโซนเครื่องผู้ใช้ เช่น +07:00
export const combineDateTimeRFC3339Local = (
  dateOnly: DateInput,
  timeOnly: DateInput
): string | undefined => {
  const d = toDayjs(dateOnly);
  const t = toDayjs(timeOnly);
  if (!d || !t) return undefined;
  const combined = d.hour(t.hour()).minute(t.minute()).second(t.second()).millisecond(0);
  return combined.format("YYYY-MM-DDTHH:mm:ssZ"); // << มี offset local
};

// แตกสตริง (RFC3339/ISO) → สำหรับเติมลง DatePicker/TimePicker
export const splitToDateAndTime = (v: DateInput) => {
  const d = toDayjs(v);
  return d ? { dateOnly: d, timeOnly: d } : { };
};
