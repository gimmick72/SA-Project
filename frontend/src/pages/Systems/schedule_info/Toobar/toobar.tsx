import React from 'react';
import type { ToolbarProps } from 'react-big-calendar';
import { Views } from 'react-big-calendar';
import './toobar.css'
import PickMonth from '../pickmonth/pickmonth';
import 'antd/dist/reset.css';

const CustomToolbar: React.FC<ToolbarProps> = ({ date, onNavigate, onView }) => {
    return (
        // toobar layout
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 8,
                alignItems: 'center',
            }}>

            {/* เลือกเดือนและปี */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '10px' }}>ปฏิทินแพทย์</div>
                <div>
                    <PickMonth
                        value={date}
                        onChange={(newDate) => onNavigate('DATE', newDate)}
                    />
                </div>
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
