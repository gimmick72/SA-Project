import React from 'react';
import type { ToolbarProps } from 'react-big-calendar';
import { Views } from 'react-big-calendar';
import './toobar.css'
import PickMonth from '../pickmonth/pickmonth';
import Pick2 from '../pickmonth/pick2';

const CustomToolbar: React.FC<ToolbarProps> = ({ date, onNavigate, onView }) => {
    const month = date.getMonth();
    const year = date.getFullYear();

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newDate = new Date(date);
        newDate.setMonth(parseInt(e.target.value));
        onNavigate('DATE', newDate);
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newDate = new Date(date);
        newDate.setFullYear(parseInt(e.target.value));
        onNavigate('DATE', newDate);
    };

    const handleViewChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onView(e.target.value as typeof Views[keyof typeof Views]);
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 8,
                alignItems: 'center',
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '10px' }}>ปฏิทินแพทย์</div>
                <div><PickMonth /></div>
            </div>

            {/* ซ้าย: ปุ่มย้อน/ถัดไป */}
            <div className=' bottonday'
                style={{ display: 'flex', gap: '8px', height: '30px' }}>
                <button onClick={() => onNavigate('PREV')}>〈</button>
                <button onClick={() => onNavigate('TODAY')}>วันนี้</button>
                <button onClick={() => onNavigate('NEXT')}>〉</button>
            </div>

        </div>
    );
};

export default CustomToolbar;
