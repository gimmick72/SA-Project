// src/pages/staff_info/index.tsx
import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Row, Col, Typography, message, Drawer, Spin } from 'antd'; // Import Spin
import { SearchOutlined, RightOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AddStaffForm from './staffAdd';
import { StaffAPI } from '../../../../services/Staff/StaffAPI';
import type { NewStaffData, Staff } from '../../../../interface/Staff';
const { Title } = Typography;


const formatEmployeeIdForDisplay = (id: number): string => {
  return String(id).padStart(2, '0');
};

const StaffDataPaeg: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [staffData, setStaffData] = useState<Staff[]>([]); // Initialize with an empty array
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
  const [isAddDrawerVisible, setIsAddDrawerVisible] = useState(false);
  const [loading, setLoading] = useState<boolean>(true); // Add a new loading state
  const navigate = useNavigate();

  // Fetch All Staff Data from backend on component mount
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true); // เริ่ม loading
        const data = await StaffAPI.getAllStaff(); // fetch จาก backend

        setStaffData(data); // set state
        setFilteredStaff(data); // set filtered 
      } catch (error: any) {
        message.error('ไม่สามารถโหลดข้อมูลบุคลากรได้');
        console.error(error);
      } finally {
        setLoading(false); // ปิด loading
      }
    };

    fetchStaff();
  }, []);

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
      console.log("Enter search")

      const exactMatch = staffData.find(staff => staff.Employee_ID === searchId);
      if (exactMatch) {
        console.log("numID search")
        setFilteredStaff([exactMatch]); // เจอ Employee_ID → แสดงเฉพาะคนเดียว
        return;
      }
      // else {
      //   console.log("string search")
      //   if (trimmedText.length === 13) {
      //     console.log("length = 13")
      //     const idCardMatches = staffData.filter(staff =>
      //       (staff.idCard).includes(trimmedText)
      //     );
      //     if (idCardMatches.length > 0) {
      //       console.log("Found by idCard");
      //       setFilteredStaff(idCardMatches);
      //       return;
      //     }
      //   }
      // }

    }

    // ถ้าไม่ใช่ Employee_ID หรือไม่เจอ → ค้นหาด้วย string อื่น ๆ
    const newFilteredStaff = staffData.filter((staff) => {
      const firstName = staff.firstName || "";
      const lastName = staff.lastName || "";
      const position = staff.position || "";
      // const idCard = staff.idCard || "";;
      const email = staff.email || "";

      return (
        console.log("Text search"),
        firstName.toLowerCase().includes(lowerCaseSearchText) ||
        lastName.toLowerCase().includes(lowerCaseSearchText) ||
        position.toLowerCase().includes(lowerCaseSearchText) ||
        // idCard.includes(trimmedText) ||
        email.toLowerCase().includes(lowerCaseSearchText)
      );
    });


    setFilteredStaff(newFilteredStaff);
  };
  //Search box
  useEffect(() => {
    applySearchFilter();
  }, [searchText, staffData]);

  const handleAddFormSubmit = async (newStaff: NewStaffData) => {
    try {
      setLoading(true);
      await StaffAPI.addStaff(newStaff);  // เรียก service เพิ่มข้อมูล

      // โหลดข้อมูลล่าสุดทั้งหมดจาก backend
      const allStaff = await StaffAPI.getAllStaff();
      setStaffData(allStaff);
      setFilteredStaff(allStaff);

      message.success('เพิ่มข้อมูลบุคลากรใหม่เรียบร้อย!');
      setIsAddDrawerVisible(false);
    } catch (err) {
      console.error(err);
      message.error('เกิดข้อผิดพลาดในการเพิ่มบุคลากร');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaffClick = () => {
    setIsAddDrawerVisible(true);
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
      <Row justify="space-between" align="middle" style={{ display: "flex", justifyContent: "space-between", marginBottom: 30 }}>
        <Col>
          <Input
            placeholder="   Search by ID, Name, Position, ID Card"
            prefix={<SearchOutlined style={{ color: '#aaa' }} />}
            size="large"
            value={searchText}
            onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setSearchText(e.target.value)}
            style={{
              width: '350px',
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
        borderRadius: '20px 20px 0 0',
        borderBottom: '1px solid #e0e0e0',
        fontWeight: 'bold',
        color: '#555',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
      }}>
        <span style={{ flex: '1 0 100px' }}>รหัสพนักงาน</span>
        <span style={{ flex: '1 0 150px' }}>คำนำหน้าชื่อ</span>
        <span style={{ flex: '2 0 100px' }}>ชื่อ</span>
        <span style={{ flex: '2 0 150px' }}>นามสกุล</span>
        <span style={{ flex: '1 0 150px' }}>ตำแหน่งงาน</span>
        <span style={{ width: '30px', flexShrink: 0, visibility: 'hidden' }}></span>
      </div>

      <Card
        style={{
          borderRadius: 0,
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
            filteredStaff.map((staff, index) => (
              <div
                key={`${staff.Employee_ID ?? 'id'}-${index}`} // combine ID กับ index
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
                onClick={() => navigate(`/admin/PersonalData/${staff.Employee_ID}`)}
              >
                <span style={{ flex: '1 0 100px' }}>{formatEmployeeIdForDisplay(staff.Employee_ID)}</span>
                <span style={{ flex: '1 0 150px' }}>{staff.title}</span>
                <span style={{ flex: '2 0 150px' }}>{staff.firstName}</span>
                <span style={{ flex: '2 0 150px' }}>{staff.lastName}</span>
                <span style={{ flex: '1 0 150px' }}>{staff.position}</span>
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

export default StaffDataPaeg;