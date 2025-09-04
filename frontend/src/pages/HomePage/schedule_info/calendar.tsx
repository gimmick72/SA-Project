import React, { useState, useRef, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import type { SlotInfo } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { th } from 'date-fns/locale';
import { Modal, message } from 'antd';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import CustomToolbar from './Toobar/toobar';
import AddEventModal from './Even/inputeven';
import ShowEven from './Even/showeven';
import EditEventModal from './Even/editeven';
import './calendar.custom.css';


const locales = { 'th-TH': th };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

// เพิ่ม id ให้ชัดเจน
interface EventType {
  id: number;
  title: string;
  start: Date;
  end: Date;
}

type EventData = {
  title: string;
  start: Date;
  end: Date;
};

// จำลองการอ่านข้อมูล events จากฐานข้อมูล (async)
function simulateFetchEventsFromDB(): Promise<EventType[]> {
  const today = new Date();

  const s1 = new Date(today);
  s1.setDate(today.getDate() + 0);
  s1.setHours(9, 0, 0, 0);
  const e1 = new Date(s1); e1.setHours(12, 0, 0, 0);

  const s2 = new Date(today);
  s2.setDate(today.getDate() + 1);
  s2.setHours(10, 0, 0, 0);
  const e2 = new Date(s2); e2.setHours(13, 0, 0, 0);

  const s3 = new Date(today);
  s3.setDate(today.getDate() + 2);
  s3.setHours(11, 0, 0, 0);
  const e3 = new Date(s3); e3.setHours(14, 0, 0, 0);

  const s4 = new Date(today);
  s4.setDate(today.getDate() + 3);
  s4.setHours(9, 0, 0, 0);
  const e4 = new Date(s4); e4.setHours(12, 0, 0, 0);

  const s5 = new Date(today);
  s5.setDate(today.getDate() + 4);
  s5.setHours(10, 0, 0, 0);
  const e5 = new Date(s5); e5.setHours(13, 0, 0, 0);

  const s6 = new Date(today);
  s6.setDate(today.getDate() + 5);
  s6.setHours(11, 0, 0, 0);
  const e6 = new Date(s6); e6.setHours(14, 0, 0, 0);

  const s7 = new Date(today);
  s7.setDate(today.getDate() + 6);
  s7.setHours(9, 0, 0, 0);
  const e7 = new Date(s7); e7.setHours(12, 0, 0, 0);

  const s8 = new Date(today);
  s8.setDate(today.getDate() + 7);
  s8.setHours(10, 0, 0, 0);
  const e8 = new Date(s8); e8.setHours(13, 0, 0, 0);

  const s9 = new Date(today);
  s9.setDate(today.getDate() + 8);
  s9.setHours(11, 0, 0, 0);
  const e9 = new Date(s9); e9.setHours(14, 0, 0, 0);

  const s10 = new Date(today);
  s10.setDate(today.getDate() + 15);
  s10.setHours(9, 0, 0, 0);
  const e10 = new Date(s10); e10.setHours(12, 0, 0, 0);

  const events: EventType[] = [
    { id: 1, title: 'กิจกรรมตัวอย่าง 1', start: s1, end: e1 },
    { id: 2, title: 'กิจกรรมตัวอย่าง 2', start: s2, end: e2 },
    { id: 3, title: 'กิจกรรมตัวอย่าง 3', start: s3, end: e3 },
    { id: 4, title: 'กิจกรรมตัวอย่าง 4', start: s4, end: e4 },
    { id: 5, title: 'กิจกรรมตัวอย่าง 5', start: s5, end: e5 },
    { id: 6, title: 'กิจกรรมตัวอย่าง 6', start: s6, end: e6 },
    { id: 7, title: 'กิจกรรมตัวอย่าง 7', start: s7, end: e7 },
    { id: 8, title: 'กิจกรรมตัวอย่าง 8', start: s8, end: e8 },
    { id: 9, title: 'กิจกรรมตัวอย่าง 9', start: s9, end: e9 },
    { id: 10, title: 'กิจกรรมตัวอย่าง 10', start: s10, end: e10 },
  ];

  return new Promise(resolve => setTimeout(() => resolve(events), 200));
}


const MyCalendar: React.FC = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [view, setView] = useState<typeof Views[keyof typeof Views]>(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const idRef = useRef(1);

  // โหลดข้อมูลจำลองจาก 'DB' เมื่อคอมโพเนนต์ mount
  useEffect(() => {
    let mounted = true;
    simulateFetchEventsFromDB().then(fetched => {
      if (!mounted) return;
      setEvents(fetched);
      idRef.current = fetched.length + 1;
    });
    return () => { mounted = false; };
  }, []);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventType>();
  const [showEventModal, setShowEventModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // เลือกช่องว่างเพื่อเพิ่ม
  const handleSelectSlot = (slot: SlotInfo) => {
    setSelectedSlot(slot);
    setShowAddModal(true);
  };

  // เพิ่ม event
  const handleAddEvent = (data: EventData) => {
    const newEvent: EventType = { id: idRef.current++, ...data };
    setEvents(prev => [...prev, newEvent]);
    setShowAddModal(false);
    setSelectedSlot(null);
    message.success('เพิ่มกิจกรรมสำเร็จ');
  };

  // แก้ไข event
  const handleEditEvent = (data: { title: string; start: Date; end: Date }) => {
    if (!selectedEvent) return;
    setEvents(prev => prev.map(ev => ev.id === selectedEvent.id ? { ...ev, ...data } : ev));
    setShowEditModal(false);
    setSelectedEvent(undefined);
    message.success('แก้ไขกิจกรรมสำเร็จ');
  };

  // ลบ event by id
  const handleDeleteEvent = (id: number, skipConfirm = false) => {
    const ev = events.find(e => e.id === id);
    const doDelete = () => {
      setEvents(prev => prev.filter(ev => ev.id !== id));
    };
    if (skipConfirm) {
      doDelete();
      return;
    }
  };

  // เลือก event เพื่อดูรายละเอียด
  const handleSelectEvent = (event: EventType) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  // คลิกแก้ไขจาก modal รายละเอียด
  const handleEditClick = () => {
    setShowEventModal(false);
    setShowEditModal(true);
  };

  return (
    <div style={{ height: '100%', margin: 10 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        view={view}
        onView={setView}
        date={date}
        onNavigate={setDate}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        components={{ toolbar: CustomToolbar as any }}
        culture="th-TH"
        formats={{
          weekdayFormat: (date: Date) => format(date, 'EEEE', { locale: th }).replace(/^วัน/, ''),
          dayHeaderFormat: (date: Date) => format(date, 'EEEE', { locale: th }).replace(/^วัน/, ''),
        } as any}
        style={{ height: '100%' }}
      />

      <AddEventModal
        visible={showAddModal}
        onAdd={handleAddEvent}
        onCancel={() => setShowAddModal(false)}
        selectedDate={selectedSlot ? selectedSlot.start : null}
      />

      {selectedEvent && (<><ShowEven
        event={selectedEvent}
        visible={showEventModal}
        onClose={() => setShowEventModal(false)}
        onEdit={handleEditClick}
        onDelete={handleDeleteEvent}
      />
        <EditEventModal
          event={selectedEvent}
          visible={showEditModal}
          onSave={handleEditEvent}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedEvent(undefined);
          }}
        />
      </>
      )
      }
    </div>
  );
};

export default MyCalendar;
