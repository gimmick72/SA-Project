// src/pages/staff_info/index.tsx
import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Row, Col, Typography, message, Drawer, Spin } from 'antd'; // Import Spin
import { SearchOutlined, RightOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AddStaffForm from './staffAdd';
import { StaffController } from '../../controllers/staffController';


const { Title } = Typography;


// ... (Staff interface, NewStaffData interface, and initialStaffData dummy data) ...
export interface Staff {
  Employee_ID: number;
  Title: string;
  firstName: string;
  lastName: string;
  position: string;
  phone: string;
  gender: string;
  startDate: string;
  age: number;
  idCard: string;
  address: string;
  email: string;
  employeeType: string;
  licenseNumber: string;
}
  
interface NewStaffData {
  title: string;
  firstName: string;
  lastName: string;
  gender: string;
  startDate: string;
  employeeId: string;
  age: number;
  idCard: string;
  phone: string;
  addressHouseNo: string;
  addressMoo: string;
  addressSubDistrict: string;
  addressDistrict: string;
  email: string;
  position: string;
  employeeType: string;
  branch: string;
  licenseNumber?: string;
}

// const initialStaffData: Staff[] = [
//   { Employee_ID: 1, Title: "ทพ.", firstName: "Somsak", lastName: "Thongdee", position: "ทันตแพทย์", phone: "081-234-5678", gender: "ชาย", startDate: "2010-01-15", age: 45, idCard: "1234567890123", address: "123 Moo 1, T.Nongprue, A.Muang, N.Ratchasima", email: "somsak@clinic.com", employeeType: "Full-time", licenseNumber: "D12345", },
//   { Employee_ID: 2, Title: "ทพ.ญ.", firstName: "Suda", lastName: "Kanya", position: "ทันตแพทย์", phone: "089-111-2222", gender: "หญิง", startDate: "2015-03-01", age: 38, idCard: "9876543210987", address: "456 Sukhumvit Rd, BKK", email: "suda@clinic.com", employeeType: "Part-time", licenseNumber: "D54321", },
//   { Employee_ID: 3, Title: "นาย", firstName: "Anan", lastName: "Chaiyos", position: "ผู้ช่วย", phone: "089-555-1111", gender: "ชาย", startDate: "2021-09-10", age: 29, idCard: "1122334455667", address: "88 Rama 2 Rd, BKK", email: "anan@clinic.com", employeeType: "Full-time", licenseNumber: "A00002", },
//   { Employee_ID: 4, Title: "นางสาว", firstName: "Jiraporn", lastName: "Meechai", position: "เจ้าหน้าที่แผนกต้อนรับ", phone: "091-234-4567", gender: "หญิง", startDate: "2018-11-01", age: 32, idCard: "2233445566778", address: "12 Soi Latkrabang, BKK", email: "jiraporn@clinic.com", employeeType: "Full-time", licenseNumber: "", },
//   { Employee_ID: 5, Title: "ทพ.", firstName: "Nattapong", lastName: "Preecha", position: "ทันตแพทย์", phone: "080-999-0000", gender: "ชาย", startDate: "2013-06-25", age: 40, idCard: "3344556677889", address: "567 Moo 5, Chiang Mai", email: "nattapong@clinic.com", employeeType: "Full-time", licenseNumber: "D67890", },
//   { Employee_ID: 6, Title: "ทพ.ญ.", firstName: "Chanida", lastName: "Ruangroj", position: "ทันตแพทย์", phone: "083-456-7890", gender: "หญิง", startDate: "2019-04-10", age: 34, idCard: "5566778899001", address: "23 Rama 4 Rd, BKK", email: "chanida@clinic.com", employeeType: "Part-time", licenseNumber: "D09876", },
//   { Employee_ID: 7, Title: "นางสาว", firstName: "Sirilak", lastName: "Thongchai", position: "ผู้ช่วยทันตแพทย์", phone: "082-888-9999", gender: "หญิง", startDate: "2022-01-05", age: 26, idCard: "6655443322110", address: "101 Ratchada Rd, BKK", email: "sirilak@clinic.com", employeeType: "Full-time", licenseNumber: "A12345", },
//   { Employee_ID: 8, Title: "นาย", firstName: "Pongsak", lastName: "Dechmongkol", position: "เจ้าหน้าที่การเงิน", phone: "085-333-4444", gender: "ชาย", startDate: "2016-08-12", age: 36, idCard: "7788990011223", address: "66 Ladprao Rd, BKK", email: "pongsak@clinic.com", employeeType: "Full-time", licenseNumber: "", },
//   { Employee_ID: 9, Title: "ทพ.", firstName: "Kasem", lastName: "Prasert", position: "ทันตแพทย์", phone: "086-111-2222", gender: "ชาย", startDate: "2009-12-01", age: 50, idCard: "1122446688990", address: "234 Moo 3, A.Tha Muang, Kanchanaburi", email: "kasem@clinic.com", employeeType: "Full-time", licenseNumber: "D00123", },
//   { Employee_ID: 10, Title: "ทพ.ญ.", firstName: "Panida", lastName: "Srisuk", position: "ทันตแพทย์", phone: "084-777-8888", gender: "หญิง", startDate: "2023-06-10", age: 30, idCard: "9988776655443", address: "90 Huay Kwang, BKK", email: "panida@clinic.com", employeeType: "Part-time", licenseNumber: "D87654", },
//   { Employee_ID: 11, Title: "นางสาว", firstName: "Kamonwan", lastName: "Chalermchai", position: "เจ้าหน้าที่แผนกต้อนรับ", phone: "087-999-1122", gender: "หญิง", startDate: "2020-02-20", age: 27, idCard: "4455667788991", address: "19 Bangna-Trad Rd, BKK", email: "kamonwan@clinic.com", employeeType: "Full-time", licenseNumber: "", },
//   { Employee_ID: 12, Title: "นาย", firstName: "Arthit", lastName: "Krittayapong", position: "ช่างซ่อมบำรุง", phone: "088-123-4567", gender: "ชาย", startDate: "2017-10-15", age: 41, idCard: "3344667788992", address: "55 Moo 2, Nakhon Pathom", email: "arthit@clinic.com", employeeType: "Full-time", licenseNumber: "", },
// ];

const formatEmployeeIdForDisplay = (id: number): string => {
  return String(id).padStart(2, '0');
};

const StaffInfoPaeg: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [staffData, setStaffData] = useState<Staff[]>([]); // Initialize with an empty array
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
  const [isAddDrawerVisible, setIsAddDrawerVisible] = useState(false);
  const [loading, setLoading] = useState<boolean>(true); // Add a new loading state
  const navigate = useNavigate();

useEffect(() => {
  setLoading(true);
  StaffController.getAllStaff().then((data) => {
    setStaffData(data);
    setLoading(false);
  });
}, []);

  // // Simulate data fetching with a delay
  // useEffect(() => {
  //   setLoading(true);
  //   const timer = setTimeout(() => {
  //     setStaffData(initialStaffData);
  //     setLoading(false);
  //   }, 1000); // 1-second delay

  //   return () => clearTimeout(timer);
  // }, []);

  const applySearchFilter = () => {
    const trimmedText = searchText.trim();
    const lowerCaseSearchText = trimmedText.toLowerCase();
    const searchId = Number(trimmedText);

    if (!trimmedText) {
      setFilteredStaff(staffData); // แสดงทั้งหมดถ้าไม่มีคำค้น
      return;
    }

    // ถ้าเป็นตัวเลข → ตรวจสอบ Employee_ID ก่อน
    if (!isNaN(searchId)) {
      const exactMatch = staffData.find(staff => staff.Employee_ID === searchId);
      if (exactMatch) {
        setFilteredStaff([exactMatch]); // เจอ Employee_ID → แสดงเฉพาะคนเดียว
        return;
      }
    }

    // ถ้าไม่ใช่ Employee_ID หรือไม่เจอ → ค้นหาด้วย string อื่น ๆ
    const newFilteredStaff = staffData.filter(staff => {
      return (
        staff.firstName.toLowerCase().includes(lowerCaseSearchText) ||
        staff.lastName.toLowerCase().includes(lowerCaseSearchText) ||
        staff.position.toLowerCase().includes(lowerCaseSearchText) ||
        staff.idCard.includes(lowerCaseSearchText) ||
        staff.email.toLowerCase().includes(lowerCaseSearchText)
      );
    });

    setFilteredStaff(newFilteredStaff);
  };


  useEffect(() => {
    applySearchFilter();
  }, [searchText, staffData]);

  const handleAddStaffClick = () => {
    setIsAddDrawerVisible(true);
  };

  const handleAddFormSubmit = (newStaff: NewStaffData) => {
    const newId = Math.max(...staffData.map(s => s.Employee_ID)) + 1;
    const newStaffWithId: Staff = {
      Employee_ID: newId,
      Title: newStaff.title,
      firstName: newStaff.firstName,
      lastName: newStaff.lastName,
      position: newStaff.position,
      phone: newStaff.phone,
      gender: newStaff.gender,
      startDate: newStaff.startDate,
      age: newStaff.age,
      idCard: newStaff.idCard,
      address: `${newStaff.addressHouseNo}, ${newStaff.addressMoo ? 'Moo ' + newStaff.addressMoo + ', ' : ''}${newStaff.addressSubDistrict}, ${newStaff.addressDistrict}`,
      email: newStaff.email,
      employeeType: newStaff.employeeType,
      licenseNumber: newStaff.licenseNumber || '',
    };
    setStaffData(prevData => [...prevData, newStaffWithId]);
    message.success('เพิ่มข้อมูลบุคลากรใหม่เรียบร้อย!');
    setIsAddDrawerVisible(false);
  };

  const handleAddFormCancel = () => {
    setIsAddDrawerVisible(false);
  };

  return (
    <div style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* hide scrollbars but keep scrolling */}
      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; } /* Chrome, Safari, Opera */
      `}</style>

      <Title level={2} style={{ fontWeight: 'bold', marginBottom: '20px', marginTop: '0px' }}>
        บุคลากร
      </Title>
      {/* Consolidated both Search and Button into a single Row */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 30 }}>
        <Col>
          <Input
            placeholder="Search by ID, Name, Position, ID Card"
            prefix={<SearchOutlined style={{ color: '#aaa' }} />}
            size="large"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              width: '300px',
              borderRadius: '25px',
            }}
          />
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{
              borderRadius: '25px',
              backgroundColor: '#9c7ed3ff',
              borderColor: '#9c7ed3ff',
              color: 'white',
            }}
            onClick={handleAddStaffClick}
          >
            เพิ่มรายชื่อ
          </Button>
        </Col>
      </Row>


      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 16px',
        backgroundColor: '#f8f8f8',
        borderRadius: '4px 4px 0 0',
        borderBottom: '1px solid #e0e0e0',
        fontWeight: 'bold',
        color: '#555',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
      }}>
        <span style={{ flex: '1 0 100px' }}>รหัสพนักงาน</span>
        <span style={{ flex: '1 0 100px' }}>ตำแหน่งงาน</span>
        <span style={{ flex: '1 0 100px' }}>คำนำหน้าชื่อ</span>
        <span style={{ flex: '2 0 150px' }}>ชื่อ</span>
        <span style={{ flex: '2 0 150px' }}>นามสกุล</span>
        <span style={{ width: '30px', flexShrink: 0, visibility: 'hidden' }}></span>
      </div>

      <Card
        style={{
          borderRadius: 10,
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
        }}
      >


        <div className="hide-scrollbar" style={{
          flex: 1,
          border: '1px solid #f0f0f0',
          borderTop: 'none',
          borderRadius: '0 0 4px 4px',
          overflowY: 'auto',
          overflowX: 'auto',
          maxHeight: 10000,  //display border
        }}>
          {loading ? ( // Check the loading state
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <Spin size="large" tip="กำลังโหลดข้อมูลบุคลากร..." />
            </div>
          ) : filteredStaff.length > 0 ? (
            filteredStaff.map((staff) => (
              <div
                key={staff.Employee_ID}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 16px',
                  borderBottom: '1px dotted #eee',
                  cursor: 'pointer',
                  backgroundColor: '#fff',
                  whiteSpace: 'nowrap',
                }}
                onClick={() => navigate(`/staff/PersonalData/${staff.Employee_ID}`)}
              >
                <span style={{ flex: '1 0 100px' }}>{formatEmployeeIdForDisplay(staff.Employee_ID)}</span>
                <span style={{ flex: '1 0 100px' }}>{staff.position}</span>
                <span style={{ flex: '1 0 100px' }}>{staff.Title}</span>
                <span style={{ flex: '2 0 150px' }}>{staff.firstName}</span>
                <span style={{ flex: '2 0 150px' }}>{staff.lastName}</span>
                <RightOutlined style={{ fontSize: '14px', color: '#ccc', flexShrink: 0, marginLeft: '10px' }} />
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
              ไม่พบข้อมูลบุคลากรที่ตรงกับเงื่อนไข
            </div>
          )}
        </div>
      </Card>
      <Drawer
        title={
          <Title level={4} style={{ margin: 0, fontWeight: 'bold' }}>
            เพิ่มข้อมูลบุคลากร
          </Title>
        }
        placement="top"
        open={isAddDrawerVisible}
        onClose={handleAddFormCancel}
        height="85vh"

      >
        <AddStaffForm
          onFormSubmit={handleAddFormSubmit}
          onFormCancel={handleAddFormCancel}
        />
      </Drawer>
    </div>
  );
};

export default StaffInfoPaeg;