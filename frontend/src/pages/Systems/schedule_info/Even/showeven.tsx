import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import 'antd/dist/reset.css';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { dentists } from './../../../Home_page/First_pages/OurDentistsPage/dentistsData';

type EventType = {
  id: number;
  room: string;
  start: Date;
  end: Date;
  dentists: string;
};

type Props = {
  event: EventType;
  visible: boolean;
  onClose: () => void;
  onEdit?: (event: EventType) => void;
  onDelete: (id: number, skipConfirm: boolean) => void;
};

const ShowEven: React.FC<Props> = ({ event, visible, onClose, onEdit, onDelete }) => {
  const [confirmVisible, setConfirmVisible] = useState(false);

  const handleDelete = () => {
    if (!event || !onDelete) return;
    console.debug('[ShowEven] delete clicked, event id =', event.id);
    setConfirmVisible(true);
  };

  return (
    <Modal
      open={visible}
      title={event ? event.room : 'รายละเอียดกิจกรรม'}
      footer={null}
      onCancel={onClose}
    >
      <div style={{ marginBottom: 16 }}>
         <p><strong>ชื่อหมอ:</strong> {event?.dentists || '-'}</p>
         
        <p><strong>ห้อง:</strong> {event?.room}</p>
        <p>
          <strong>วัน:</strong> {event ? format(event.start, 'dd/MM/yyyy', { locale: th }) : '-'}
        </p>
        <p>
          <strong>เวลาเข้างาน:</strong>{' '}
          {event ? `${format(event.start, 'HH:mm', { locale: th })}` : '-'}
        </p>
        <p>
          <strong>เวลาออกงาน:</strong>{' '}
          {event ? `${format(event.end, 'HH:mm', { locale: th })}` : '-'}
        </p>
      </div>

      {/* ยืนยันการลบกิจกรรม */}
      <Modal
        open={confirmVisible}
        title="ยืนยันการลบ"
        onCancel={() => setConfirmVisible(false)}
        footer={null}
      >
        <p>คุณต้องการลบกิจกรรมนี้จริงหรือไม่?</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 12 }}>
          <Button danger style={{ width: 120 }} onClick={() => {
            setConfirmVisible(false);
            setTimeout(() => {
              onDelete(event.id, true);
              onClose();
            },);
          }}>
            ลบ
          </Button>
          <Button style={{ width: 120 }} onClick={() => setConfirmVisible(false)}>ยกเลิก</Button>
        </div>
      </Modal>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 16 }}>
        <Button
          type="primary"
          onClick={() => { if (event && onEdit) onEdit(event); }}
          style={{ width: 120 }}
        >
          แก้ไข
        </Button>

        <Button
          danger
          onClick={handleDelete}
          style={{ width: 120 }}
        >
          ลบ
        </Button>

        <Button onClick={onClose} style={{ width: 120 }}>
          ปิด
        </Button>
      </div>
    </Modal>
  );
};

export default ShowEven;
