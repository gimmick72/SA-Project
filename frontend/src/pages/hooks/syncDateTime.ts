import { useEffect } from "react";
import { FormInstance } from "antd";
import { combineDateTimeRFC3339Local } from "../../utils/dateTime";
import { Form } from "antd";

export const useSyncDateTime = (
  form: FormInstance,
  dateField: string,   // e.g. "visitDateOnly"
  timeField: string,   // e.g. "visitTimeOnly"
  outputField: string  // e.g. "visit"
) => {
  const dOnly = Form.useWatch(dateField, form);
  const tOnly = Form.useWatch(timeField, form);

  useEffect(() => {
    form.setFieldsValue({
      [outputField]: combineDateTimeRFC3339Local(dOnly as any, tOnly as any),
    });
  }, [dOnly, tOnly, form, outputField]);
};
