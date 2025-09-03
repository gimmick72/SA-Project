import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function DatePickerViews() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker
          label={'"month" and "year" '}
          views={['year', 'month',]}
          openTo="month"
          format="MM/YYYY"
          slotProps={{
            textField: {
              size: "small",
              fullWidth: true,
              InputProps: {
                sx: {
                  height: 40,             // ปรับความสูงกรอบ input
                  borderRadius: "12px",
                  border: "1px solid #CBC6FF", // เส้นขอบ
                }
              },
              sx: { width: 200 } // ความกว้างรวม
            }
          }} />
      </DemoContainer>
    </LocalizationProvider>
  );
}

