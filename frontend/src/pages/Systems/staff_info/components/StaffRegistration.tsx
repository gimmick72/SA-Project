// src/pages/staff_info/StaffRegistration.tsx
import React, { useState } from 'react';
import { Card, Alert, message, Spin } from 'antd';
import AddStaffForm from '../staffData/staffAdd';
import { StaffAPI } from '../../../../services/Staff/StaffAPI'
import type { NewStaffData } from '../../../../interface/Staff';


const StaffRegistration: React.FC = () => {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (values: NewStaffData) => {
    try {
      setError('');
      setSuccess('');
      setLoading(true);

      // เรียก API จริงเพื่อเพิ่ม staff
      const created = await StaffAPI.addStaff(values);

      setSuccess(`สร้างบัญชีเจ้าหน้าที่สำเร็จ: ${created.firstName ?? values.firstName} ${created.lastName ?? values.lastName}`);
      message.success('สร้างบัญชีเจ้าหน้าที่สำเร็จ');

      // ถ้าต้องการ redirect หรือ refresh list ให้ทำที่นี่
    } catch (err: any) {
      console.error(err);
      // ถ้า backend ส่งข้อความ error กลับมา
      const serverMsg = err?.response?.data?.message || err?.message;
      setError(serverMsg || 'เกิดข้อผิดพลาดในการสร้างบัญชีเจ้าหน้าที่');
      message.error(serverMsg || 'เกิดข้อผิดพลาดในการสร้างบัญชีเจ้าหน้าที่');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    console.log("ยกเลิกการสมัคร");
  };

  return (
    <Card 
      title="สร้างบัญชีเจ้าหน้าที่ใหม่" 
      style={{ maxWidth: "100%", margin: '0 auto' }}
    >
      {loading && (
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <Spin tip="กำลังบันทึกข้อมูล..." />
        </div>
      )}

      {error && (
        <Alert
          message="เกิดข้อผิดพลาด"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      )}
      {success && (
        <Alert
          message="สำเร็จ"
          description={success}
          type="success"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      )}

      <AddStaffForm
        onFormSubmit={handleFormSubmit}
        onFormCancel={handleCancel}
      />
    </Card>
  );
};

export default StaffRegistration;
