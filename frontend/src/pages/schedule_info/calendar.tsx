// src/components/MyCalendar.tsx
import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer, Views} from 'react-big-calendar';
import type { Event as RBCEvent } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { th } from 'date-fns/locale/th';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './style.css'
import CustomToolbar from './toobar';

const locales = {
  'th-TH': th,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

type Event = {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
};

// ลงเวลาทำงาน
const MyCalendar: React.FC = () => {

  const [view, setView] = useState<typeof Views[keyof typeof Views]>(Views.MONTH);  // เก็บ view ปัจจุบัน
  const [date, setDate] = useState(new Date());

  const [events, setEvents] = useState<RBCEvent[]>([
    {
      title: 'นัดประชุม',
      start: new Date(2025, 7, 5, 10, 0),
      end: new Date(2025, 7, 5, 11, 0),
    },
  ]);

  //input even
  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    const title = prompt('ตั้งชื่ออีเวนต์:');
    if (title) {
      setEvents((prev) => [...prev, { start, end, title }]);
    }
  };

  //alert even onclick
  const handleSelectEvent = (event: RBCEvent) => {
    alert(`Event: ${event.title}\nเริ่ม: ${event.start}\nสิ้นสุด: ${event.end}`);
  };

  //calendar
  return (
    <div
      style={{
        height: 500,
        margin: "2rem",
      }}
    >

      {/* calendar */}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        view={view}
        onView={(newView) => setView(newView)}
        date={date}
        onNavigate={(newDate) => setDate(newDate)}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        style={{ height: '100%' }}
        components={{ toolbar: CustomToolbar }}
      />
    </div>
  );
};

export default MyCalendar;
