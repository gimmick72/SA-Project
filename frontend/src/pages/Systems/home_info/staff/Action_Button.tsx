import React from "react";
import { Card, Typography, Tag, Empty, Button, Space } from "antd";

const { Paragraph, Text } = Typography;


const ActionButtonStaff: React.FC = ({ }) => {
    return (
        <div style={{ border: '1px none #ccc', height: '205px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20, padding: '0 16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column',justifyContent: 'center', alignItems: 'center', width: '100%',gap: '20px' }}>
                <Button type="primary" style={{ width: "100%", height: 40 }}>ประวัติคนไข้</Button>
                <Button type="primary" style={{ width: '100%', height: 40 }}>จองห้องและคิว</Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Button type="primary" style={{ width: '45%', height: 40, backgroundColor: '#87EA85', border: '1px solid #000000', color:'#000000' }}>สำเร็จ</Button>
                <Button type="primary" style={{ width: '45%', height: 40, backgroundColor: '#F44336', border: '1px solid #000000', color:'#000000' }}>ลบ</Button>
            </div>
        </div>

    );
};

export default ActionButtonStaff;