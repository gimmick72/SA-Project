import React from 'react';
import type { ToolbarProps } from 'react-big-calendar';
import { Views } from 'react-big-calendar';
import './style.css'

const CustomToolbar: React.FC<ToolbarProps> = ({ label, date, onNavigate, onView }) => {
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
        onView(e.target.value as Views);
    };
    // ถ้าข้างบนมันพังใช้อันนี้แทน
    // const handleViewChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //   onView(e.target.value as 'month' | 'week' | 'day');
    // };

    return (
        <div 
        style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: 8,
            }}>

            {/* ซ้าย: ปุ่มย้อน/ถัดไป */}
            <div className=' bottonday'
            style={{display: 'flex', gap: '8px', height: '30px' }}>
                <button onClick={() => onNavigate('PREV')}>〈</button>
                <button onClick={() => onNavigate('TODAY')}>วันนี้</button>
                <button onClick={() => onNavigate('NEXT')}>〉</button>

            </div>

            {/* กลาง: dropdown เดือน ปี */}
            <div className='dropdown_month_year'
            style={{ display: 'flex', gap: '8px',  height: '30px', marginRight: '100px' }}>

                <select value={month} onChange={handleMonthChange}>
                    {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={i}>
                            {new Date(0, i).toLocaleString('th-TH', { month: 'long' })}
                        </option>
                    ))}
                </select>

                <select value={year} onChange={handleYearChange}>
                    {Array.from({ length: 10 }, (_, i) => {
                        const y = 2020 + i;
                        return (
                            <option key={y} value={y}>
                                {y + 543}
                            </option>
                        );
                    })}
                </select>
            </div>

            {/* ขวา: dropdown view */}
            <div className='dropdown_viwe'
            style={{ display: 'flex', gap: '8px', height: '30px'}}>
                <select onChange={handleViewChange}>
                    <option value={Views.MONTH}>เดือน</option>
                    <option value={Views.WEEK}>สัปดาห์</option>
                    <option value={Views.DAY}>วัน</option>
                </select>
            </div>
        </div>
    );
};

export default CustomToolbar;
