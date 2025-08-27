import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Views } from 'react-big-calendar';
import './toobar.css';
const CustomToolbar = ({ date, onNavigate, onView }) => {
    const month = date.getMonth();
    const year = date.getFullYear();
    const handleMonthChange = (e) => {
        const newDate = new Date(date);
        newDate.setMonth(parseInt(e.target.value));
        onNavigate('DATE', newDate);
    };
    const handleYearChange = (e) => {
        const newDate = new Date(date);
        newDate.setFullYear(parseInt(e.target.value));
        onNavigate('DATE', newDate);
    };
    const handleViewChange = (e) => {
        onView(e.target.value);
    };
    return (_jsxs("div", { style: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 8,
        }, children: [_jsxs("div", { className: ' bottonday', style: { display: 'flex', gap: '8px', height: '30px' }, children: [_jsx("button", { onClick: () => onNavigate('PREV'), children: "\u3008" }), _jsx("button", { onClick: () => onNavigate('TODAY'), children: "\u0E27\u0E31\u0E19\u0E19\u0E35\u0E49" }), _jsx("button", { onClick: () => onNavigate('NEXT'), children: "\u3009" })] }), _jsxs("div", { className: 'dropdown_month_year', style: { display: 'flex', gap: '8px', height: '30px', marginRight: '100px' }, children: [_jsx("select", { value: month, onChange: handleMonthChange, children: Array.from({ length: 12 }, (_, i) => (_jsx("option", { value: i, children: new Date(0, i).toLocaleString('th-TH', { month: 'long' }) }, i))) }), _jsx("select", { value: year, onChange: handleYearChange, children: Array.from({ length: 10 }, (_, i) => {
                            const y = 2020 + i;
                            return (_jsx("option", { value: y, children: y + 543 }, y));
                        }) })] }), _jsxs("div", { className: 'dropdown_viwe', style: { display: 'flex', gap: '8px', height: '30px', alignItems: 'center' }, children: [_jsx("div", { children: "\u0E42\u0E2B\u0E21\u0E14:" }), _jsxs("select", { onChange: handleViewChange, style: { height: '30px' }, children: [_jsx("option", { value: Views.MONTH, children: "\u0E40\u0E14\u0E37\u0E2D\u0E19" }), _jsx("option", { value: Views.WEEK, children: "\u0E2A\u0E31\u0E1B\u0E14\u0E32\u0E2B\u0E4C" }), _jsx("option", { value: Views.DAY, children: "\u0E27\u0E31\u0E19" })] })] })] }));
};
export default CustomToolbar;
