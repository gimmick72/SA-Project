import React, { useState, useRef, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import type { SlotInfo } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { th } from 'date-fns/locale';
import { Modal, message } from 'antd';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import CustomToolbar from '../Toobar/toobar';
import AddEventModal from '../Even/inputeven';
import ShowEven from '../Even/showeven';
import EditEventModal from '../Even/editeven';
import './calendar.custom.css';
import { getAllDentists, DentistManagement, createDentist, updateDentist, deleteDentist } from "../../../../services/DentistMenagement/DentistMenagement"



const locales = { 'th-TH': th };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

// เพิ่ม id ให้ชัดเจน
interface EventType {
  id: number;
  room: string;
  start: Date;
  end: Date;
  dentist: string ;
}

// type EventData = {
//   room: string;
//   start: Date;
//   end: Date;
// };


const MyCalendar: React.FC = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [view, setView] = useState<typeof Views[keyof typeof Views]>(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const idRef = useRef(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventType>();
  const [showEventModal, setShowEventModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);



  // โหลดข้อมูลจาก DB เมื่อคอมโพเนนต์ mount
  useEffect(() => {
    let mounted = true;

    const fetchEvents = async () => {
      try {
        const data: DentistManagement[] = await getAllDentists();
        if (!mounted) return;

        console.log("โหลดข้อมูล1222:", data);
        // map ข้อมูลจาก backend ให้ตรงกับ EventType ของ Calendar
        const mappedEvents: EventType[] = data.map((item, index) => ({
          id: item.id ?? index + 1,
          room: item.room,  // ใช้ room ที่ backend ส่งมา
          start: new Date(item.time_in),
          end: new Date(item.time_out),
          dentist: item.dentist ?? "สมชาย", // ต้องเป็น string

        }));

        console.log("โหลดข้อมูล:", mappedEvents);
        setEvents(mappedEvents);
        idRef.current = mappedEvents.length + 1;
      } catch (err) {
        console.error("โหลดข้อมูลล้มเหลว:", err);

      }
    };

    fetchEvents();

    return () => {
      mounted = false;
    };
  }, []);



  // เลือกช่องว่างเพื่อเพิ่ม
  const handleSelectSlot = (slot: SlotInfo) => {
    setSelectedSlot(slot);
    setShowAddModal(true);
  };


  const handleAddEvent = async (event: { room: string; start: Date; end: Date; dentist: string }) => {
    try {
      // map EventData -> DentistManagement
      const data: DentistManagement = {
        room: event.room,
        dentist: event.dentist,
        time_in: event.start.toISOString(),   // ส่งเป็น string
        time_out: event.end.toISOString(),
      };

      // เรียก API
      const res = await createDentist(data);
      console.log('Created dentist schedule:', res);


      // ปิด modal หลังเพิ่ม
      setShowAddModal(false);

      // 2. อัปเดต state ของ calendar
      const newEvent = {
        id: res.id!,  // ใช้ id จาก API, ! บอก TypeScript ว่าไม่ null/undefined
        room: res.room,
        dentist: res.dentist,
        start: new Date(res.time_in),
        end: new Date(res.time_out),
      };

      setEvents(prev => [...prev, newEvent]);


    } catch (err) {
      console.error('Failed to create dentist schedule', err);
    }
  };


  const handleEditEvent = async (data: { room: string; start: Date; end: Date }) => {
    if (!selectedEvent) return;

    try {
      // map EventType -> DentistManagement
      const updateData: DentistManagement = {
        room: data.room,
        dentist: selectedEvent.dentist, // เก็บ dentist เดิม
        time_in: data.start.toISOString(),
        time_out: data.end.toISOString(),
      };

      // เรียก API อัปเดต
      const res = await updateDentist(selectedEvent.id, updateData);
      console.log('Updated dentist schedule:', res);

      // อัปเดต state ของ calendar
      setEvents(prev =>
        prev.map(ev =>
          ev.id === selectedEvent.id
            ? {
              id: res.id!,  // ใช้ id จาก API
              room: res.room,
              dentist: res.dentist,
              start: new Date(res.time_in),
              end: new Date(res.time_out),
            }
            : ev
        )
      );

      setShowEditModal(false);
      setSelectedEvent(undefined);
      message.success('แก้ไขกิจกรรมสำเร็จ');
    } catch (err) {
      console.error('Failed to update dentist schedule', err);
      message.error('ไม่สามารถแก้ไขกิจกรรมได้');
    }
  };


  const handleDeleteEvent = async (id: number, skipConfirm = false) => {
    const ev = events.find(e => e.id === id);
    if (!ev) return;

    const doDelete = async () => {
      try {
        // เรียก API ลบ
        await deleteDentist(id); // สมมติฟังก์ชัน deleteDentistSchedule อยู่ใน API service
        // ลบออกจาก state ของ calendar
        setEvents(prev => prev.filter(ev => ev.id !== id));
        message.success('ลบกิจกรรมสำเร็จ');
      } catch (err) {
        console.error('ลบกิจกรรมไม่สำเร็จ', err);
        message.error('ลบกิจกรรมไม่สำเร็จ');
      }
    };

    if (skipConfirm) {
      doDelete();
      return;
    };
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
        titleAccessor={(e: EventType) => `${e.room} — ${e.dentist}`}
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



