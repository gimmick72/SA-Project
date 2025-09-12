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
import { roomScheduleAPI, ScheduleEvent, RoomSchedule } from '../../../../services/api';



const locales = { 'th-TH': th };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

// Use ScheduleEvent from API instead of local EventType
type EventType = ScheduleEvent & {
  dentists?: string; // Add optional dentists property for compatibility
};

// type EventData = {
//   room: string;
//   start: Date;
//   end: Date;
// };


const MyCalendar: React.FC = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [view, setView] = useState<typeof Views[keyof typeof Views]>(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventType>();
  const [showEventModal, setShowEventModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleSelectSlot = (slot: SlotInfo) => {
    setSelectedSlot(slot);
    setShowAddModal(true);
  };

  const handleSelectEvent = (event: EventType) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleEditClick = () => {
    setShowEventModal(false);
    setShowEditModal(true);
  };

  const loadSchedule = async (selectedDate: Date) => {
    setLoading(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      const roomSchedules = await roomScheduleAPI.getSchedule(dateStr);
      const events = roomScheduleAPI.convertToEvents(roomSchedules, dateStr);
      setEvents(events);
    } catch (error) {
      console.error('Error loading schedule:', error);
      message.error('ไม่สามารถโหลดตารางงานได้');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedule(date);
  }, [date]);

  const handleAddEvent = async (eventData: any) => {
    try {
      const dateStr = eventData.start.toISOString().split('T')[0];
      const timeStr = eventData.start.toTimeString().slice(0, 5); // HH:MM format

      await roomScheduleAPI.assignSchedule({
        date: dateStr,
        roomId: eventData.roomId || '1',
        time: timeStr,
        patientId: eventData.patientId,
        patientName: eventData.patientName,
        type: eventData.type || 'appointment',
        note: eventData.note,
        durationMin: eventData.durationMin || 60
      });

      // Reload schedule to get updated data
      await loadSchedule(date);
      setShowAddModal(false);
      message.success('เพิ่มนัดหมายสำเร็จ');
    } catch (error) {
      console.error('Error adding appointment:', error);
      message.error('ไม่สามารถเพิ่มนัดหมายได้');
    }
  };

  const handleEditEvent = async (eventData: any) => {
    try {
      if (!selectedEvent) return;
      
      const dateStr = eventData.start.toISOString().split('T')[0];
      const timeStr = eventData.start.toTimeString().slice(0, 5);
      
      await roomScheduleAPI.assignSchedule({
        date: dateStr,
        roomId: eventData.roomId || '1',
        time: timeStr,
        patientId: selectedEvent.patient_id,
        patientName: eventData.patientName,
        type: eventData.type || 'appointment',
        note: eventData.note,
        durationMin: eventData.durationMin || 60
      });
      
      // Reload schedule to get updated data
      await loadSchedule(date);
      setShowEditModal(false);
      setSelectedEvent(undefined);
      message.success('แก้ไขนัดหมายสำเร็จ');
    } catch (error) {
      console.error('Error updating appointment:', error);
      message.error('ไม่สามารถแก้ไขนัดหมายได้');
    }
  };

  const handleDeleteEvent = async () => {
    try {
      if (!selectedEvent) return;
      
      const dateStr = selectedEvent.start.toISOString().split('T')[0];
      const timeStr = selectedEvent.start.toTimeString().slice(0, 5);
      
      // Delete by setting patientId to null
      await roomScheduleAPI.assignSchedule({
        date: dateStr,
        roomId: '1', // Extract from room name or use default
        time: timeStr,
        patientId: undefined // This will delete the appointment
      });
      
      // Reload schedule to get updated data
      await loadSchedule(date);
      setShowEventModal(false);
      setSelectedEvent(undefined);
      message.success('ลบนัดหมายสำเร็จ');
    } catch (error) {
      console.error('Error deleting appointment:', error);
      message.error('ไม่สามารถลบนัดหมายได้');
    }
  };

  return (
    <div style={{ height: '100%', margin: 10 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        view={view}
        date={date}
        onView={setView}
        onNavigate={(newDate) => {
          setDate(newDate);
          loadSchedule(newDate);
        }}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        selectable
        components={{}}
        culture="th-TH"
        messages={{
          next: 'ถัดไป',
          previous: 'ก่อนหน้า',
          today: 'วันนี้',
          month: 'เดือน',
          week: 'สัปดาห์',
          day: 'วัน',
          agenda: 'กำหนดการ',
          date: 'วันที่',
          time: 'เวลา',
          event: 'กิจกรรม',
          noEventsInRange: 'ไม่มีนัดหมายในช่วงเวลานี้',
          showMore: (total) => `+${total} เพิ่มเติม`,
        }}
      />

      <AddEventModal
        visible={showAddModal}
        onAdd={handleAddEvent}
        onCancel={() => setShowAddModal(false)}
        selectedDate={selectedSlot ? selectedSlot.start : null}
      />

      {selectedEvent && (<><ShowEven
        event={selectedEvent as any}
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



