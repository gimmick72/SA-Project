import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
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
const MyCalendar = () => {
    const [view, setView] = useState(Views.MONTH);
    const [date, setDate] = useState(new Date());
    const [room, setRoom] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showEventModal, setShowEventModal] = useState(false);
    // time
    const handleSelectSlot = ({ start, end }) => {
        setSelectedSlot({ start, end });
        setShowAddModal(true);
    };
    // add even
    const handleAddEvent = (eventData) => {
        setRoom((prev) => [...prev, eventData]);
        setShowAddModal(false);
        setSelectedSlot(null);
    };
    // watch even
    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setShowEventModal(true);
    };
    return (_jsxs("div", { style: {
            height: 500, marginLeft: '10px', marginRight: '10px', marginTop: '20px'
        }, children: [_jsx(Calendar, { localizer: localizer, events: room, startAccessor: "start", endAccessor: "end", selectable: true, views: [Views.MONTH, Views.WEEK, Views.DAY], view: view, onView: (newView) => setView(newView), date: date, onNavigate: (newDate) => setDate(newDate), onSelectSlot: handleSelectSlot, onSelectEvent: handleSelectEvent, style: { height: '100%' }, components: { toolbar: CustomToolbar } }), _jsx(AddEventModal, { visible: showAddModal, onAdd: handleAddEvent, onCancel: () => setShowAddModal(false) }), _jsx(ShowEven, { event: selectedEvent, visible: showEventModal, onClose: () => setShowEventModal(false) })] }));
};
export default MyCalendar;
