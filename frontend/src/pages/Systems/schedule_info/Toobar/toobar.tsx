import React from 'react';
import type { ToolbarProps } from 'react-big-calendar';
import { Views } from 'react-big-calendar';
import { CalendarOutlined } from "@ant-design/icons";
import './toobar.css'
import PickMonth from '../pickmonth/pickmonth';
import 'antd/dist/reset.css';

const CustomToolbar: React.FC<ToolbarProps> = ({ date, onNavigate }) => {
    return (
        // toobar layout
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 15,
                marginTop: -15,
                alignItems: 'center',
            }}>

            {/* เลือกเดือนและปี */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'center' }}>
                <h2 style={{ margin: 0, color: '#1a1a1a' }}><CalendarOutlined style={{ marginRight: '8px' }} />ปฏิทินแพทย์</h2>
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
