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
import { dentists } from './../../../First_pages/First_pages/OurDentistsPage/dentistsData';



const locales = { 'th-TH': th };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

// เพิ่ม id ให้ชัดเจน
interface EventType {
  id: number;
  room: string;
  start: Date;
  end: Date;
  dentist: string;
}

type EventData = {
  room: string;
  start: Date;
  end: Date;
};

// จำลองการอ่านข้อมูล events จากฐานข้อมูล (async)
// function simulateFetchEventsFromDB(): Promise<EventType[]> {
//   const today = new Date();

//   const s1 = new Date(today);
//   s1.setDate(today.getDate() + 0);
//   s1.setHours(9, 0, 0, 0);
//   const e1 = new Date(s1); e1.setHours(12, 0, 0, 0);

//   const s2 = new Date(today);
//   s2.setDate(today.getDate() + 1);
//   s2.setHours(10, 0, 0, 0);
//   const e2 = new Date(s2); e2.setHours(13, 0, 0, 0);

//   const s3 = new Date(today);
//   s3.setDate(today.getDate() + 2);
//   s3.setHours(11, 0, 0, 0);
//   const e3 = new Date(s3); e3.setHours(14, 0, 0, 0);

//   const s4 = new Date(today);
//   s4.setDate(today.getDate() + 3);
//   s4.setHours(9, 0, 0, 0);
//   const e4 = new Date(s4); e4.setHours(12, 0, 0, 0);

//   const s5 = new Date(today);
//   s5.setDate(today.getDate() + 4);
//   s5.setHours(10, 0, 0, 0);
//   const e5 = new Date(s5); e5.setHours(13, 0, 0, 0);

//   const s6 = new Date(today);
//   s6.setDate(today.getDate() + 5);
//   s6.setHours(11, 0, 0, 0);
//   const e6 = new Date(s6); e6.setHours(14, 0, 0, 0);

//   const s7 = new Date(today);
//   s7.setDate(today.getDate() + 6);
//   s7.setHours(9, 0, 0, 0);
//   const e7 = new Date(s7); e7.setHours(12, 0, 0, 0);

//   const s8 = new Date(today);
//   s8.setDate(today.getDate() + 7);
//   s8.setHours(10, 0, 0, 0);
//   const e8 = new Date(s8); e8.setHours(13, 0, 0, 0);

//   const s9 = new Date(today);
//   s9.setDate(today.getDate() + 8);
//   s9.setHours(11, 0, 0, 0);
//   const e9 = new Date(s9); e9.setHours(14, 0, 0, 0);

//   const s10 = new Date(today);
//   s10.setDate(today.getDate() + 15);
//   s10.setHours(9, 0, 0, 0);
//   const e10 = new Date(s10); e10.setHours(12, 0, 0, 0);

//   const events: EventType[] = [
//     { id: 1, room: 'กิจกรรมตัวอย่าง 1', start: s1, end: e1 },
//     { id: 2, room: 'กิจกรรมตัวอย่าง 2', start: s2, end: e2 },
//     { id: 3, room: 'กิจกรรมตัวอย่าง 3', start: s3, end: e3 },
//     { id: 4, room: 'กิจกรรมตัวอย่าง 4', start: s4, end: e4 },
//     { id: 5, room: 'กิจกรรมตัวอย่าง 5', start: s5, end: e5 },
//     { id: 6, room: 'กิจกรรมตัวอย่าง 6', start: s6, end: e6 },
//     { id: 7, room: 'กิจกรรมตัวอย่าง 7', start: s7, end: e7 },
//     { id: 8, room: 'กิจกรรมตัวอย่าง 8', start: s8, end: e8 },
//     { id: 9, room: 'กิจกรรมตัวอย่าง 9', start: s9, end: e9 },
//     { id: 10, room: 'กิจกรรมตัวอย่าง 10', start: s10, end: e10 },
//   ];

//   return new Promise(resolve => setTimeout(() => resolve(events), 200));
// }


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

  const [dentist, setDentist] = useState<string>("สมชาย");


  // โหลดข้อมูลจำลองจาก 'DB' เมื่อคอมโพเนนต์ mount
  // useEffect(() => {
  //   let mounted = true;
  //   simulateFetchEventsFromDB().then(fetched => {
  //     if (!mounted) return;
  //     setEvents(fetched);
  //     idRef.current = fetched.length + 1;
  //   });
  //   return () => { mounted = false; };
  // }, []);


  // โหลดข้อมูลจาก DB เมื่อคอมโพเนนต์ mount
  useEffect(() => {
    let mounted = true;

    const fetchEvents = async () => {
      try {
        const data: DentistManagement[] = await getAllDentists();
        if (!mounted) return;


        // map ข้อมูลจาก backend ให้ตรงกับ EventType ของ Calendar
        const mappedEvents: EventType[] = data.map((item, index) => ({
          id: item.id ?? index + 1,
          room: item.room,  // ใช้ room ที่ backend ส่งมา
          start: new Date(item.time_in),
          end: new Date(item.time_out),
          dentist: item.dentist ?? "สมชาย", // ต้องเป็น string

        }));


        // const mappedEventss: EventType[] = data.map((item, index) => {
        //   const event: EventType = {
        //     id: item.id ?? index + 1,
        //     room: item.room,
        //     start: new Date(item.time_in),
        //     end: new Date(item.time_out),
        //   };

        //   console.log("startdb", item.time_in);
        //   console.log("enddb", item.time_out);  
        //   console.log("start", event.start);    
        //   console.log("end", event.end);

        //   return event;
        // });

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

  // เพิ่ม event
  // const handleAddEvent = (data: EventData) => {
  //   const newEvent: EventType = { id: idRef.current++, ...data };
  //   setEvents(prev => [...prev, newEvent]);
  //   setShowAddModal(false);
  //   setSelectedSlot(null);
  //   message.success('เพิ่มกิจกรรมสำเร็จ');
  // };

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



  // แก้ไข event
  // const handleEditEvent = (data: { room: string; start: Date; end: Date }) => {
  //   if (!selectedEvent) return;
  //   setEvents(prev => prev.map(ev => ev.id === selectedEvent.id ? { ...ev, ...data } : ev));
  //   setShowEditModal(false);
  //   setSelectedEvent(undefined);
  //   message.success('แก้ไขกิจกรรมสำเร็จ');
  // };

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


  // ลบ event by id
  // const handleDeleteEvent = (id: number, skipConfirm = false) => {
  //   const ev = events.find(e => e.id === id);
  //   const doDelete = () => {
  //     setEvents(prev => prev.filter(ev => ev.id !== id));
  //   };
  //   if (skipConfirm) {
  //     doDelete();
  //     return;
  //   }
  // };



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
        titleAccessor="room"
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

      {/* 
      <AddEventModal
        visible={modalVisible}
        selectedDate={selectedDate}
        onAdd={handleAddEvent}
        onCancel={() => setModalVisible(false)}
      /> */}

      {/* <AddEventModal
        visible={showAddModal}
        onAdd={(newEvent) => {
          setEvents(prev => [
            ...prev,
            {
              id: prev.length + 1,
              room: newEvent.room,
              start: newEvent.start,
              end: newEvent.end
            }
          ]);
          setShowAddModal(false);
        }}
        onCancel={() => setShowAddModal(false)}
        selectedDate={selectedSlot ? selectedSlot.start : null}
      /> */}

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



