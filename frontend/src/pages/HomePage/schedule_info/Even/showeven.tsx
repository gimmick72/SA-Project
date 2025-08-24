import React from 'react';
import { Modal } from 'antd';
import type { Event as RBCEvent } from 'react-big-calendar';

type Props = {
  event: RBCEvent | null;
  visible: boolean;
  onClose: () => void;
};

const ShowEven: React.FC<Props> = ({ event, visible, onClose }) => {
  return (
    <Modal
      title="รายละเอียด"
      open={visible}
      onOk={onClose}
      onCancel={onClose}
      okText="ปิด"
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      {event ? (
        <>
          <p><strong>ห้อง:</strong> {event.title || 'ไม่ระบุชื่อ'}</p>
          <p><strong>เริ่ม:</strong> {event.start ? event.start.toLocaleString() : 'ไม่ระบุเวลาเริ่ม'}</p>
          <p><strong>สิ้นสุด:</strong> {event.end ? event.end.toLocaleString() : 'ไม่ระบุเวลาสิ้นสุด'}</p>
        </>
      ) : (
        <p>ไม่พบข้อมูลกิจกรรม</p>
      )}
    </Modal>
  );
};

export default ShowEven;
