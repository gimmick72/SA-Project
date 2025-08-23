import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import type { Event as RBCEvent, SlotInfo } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { th } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import CustomToolbar from './Toobar/toobar';
import AddEventModal from './Even/inputeven';
import ShowEven from './Even/showeven';

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

const MyCalendar: React.FC = () => {
  const [view, setView] = useState<typeof Views[keyof typeof Views]>(Views.MONTH);
  const [date, setDate] = useState(new Date());

  const [room, setRoom] = useState<RBCEvent[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<RBCEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);


  // time
  const handleSelectSlot = ({ start, end }: SlotInfo) => {
    setSelectedSlot({ start, end });
    setShowAddModal(true);
  };

  // add even
  const handleAddEvent = (eventData: { title: string; start: Date; end: Date }) => {
    setRoom((prev) => [...prev, eventData]);
    setShowAddModal(false);
    setSelectedSlot(null);
  };

  // watch even
  const handleSelectEvent = (event: RBCEvent) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  return (
    <div style={{
      height: 500, marginLeft: '10px', marginRight: '10px', marginTop: '20px'
    }}>
      <Calendar
        localizer={localizer}
        events={room}
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

      <AddEventModal
        visible={showAddModal}
        onAdd={handleAddEvent}
        onCancel={() => setShowAddModal(false)}
      />

      <ShowEven
        event={selectedEvent}
        visible={showEventModal}
        onClose={() => setShowEventModal(false)}
      />
    </div>
  );
};

export default MyCalendar;
