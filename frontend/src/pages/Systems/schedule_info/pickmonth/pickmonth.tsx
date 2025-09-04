
import * as React from 'react';
import { DemoContainer } from '@c/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/th';
import 'antd/dist/reset.css';

interface PickMonthProps {
  value: Date;
  onChange: (date: Date) => void;
}

const PickMonth: React.FC<PickMonthProps> = ({ value, onChange }) => {
  // set locale เป็นไทย
  const thDayjs = dayjs(value).locale('th');

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
      <DemoContainer components={['DatePicker']}>
        <DatePicker
          label={'"เดือน / ปี"'}
          views={['year', 'month']}
          openTo="month"
          value={thDayjs}
          onChange={(newValue) => {
            if (newValue) {
              const jsDate = newValue.startOf('month').toDate();
              onChange(jsDate);
            }
          }}
          format="MMMM / YYYY"
          slotProps={{
            textField: {
              size: "small",
              fullWidth: true,
              InputProps: {
                sx: {
                  height: 40,
                  width: 200,
                  borderRadius: "12px",
                }
              },
            }
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
};

export default PickMonth;

