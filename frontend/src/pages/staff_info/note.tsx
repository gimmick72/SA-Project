// // src/pages/staff_info/index.tsx
// import React, { useState, useEffect } from 'react';
// import { Card, Input, Button, Row, Col, Typography, message, Drawer, Spin } from 'antd'; // Import Spin
// import { SearchOutlined, RightOutlined, PlusOutlined } from '@ant-design/icons';
// import { useNavigate } from 'react-router-dom';
// import AddStaffForm from './staffAdd';
// import { StaffController } from '../../services/https/Staff';
// import type{ NewStaffData } from '../../interface/types';
// import type { Staff } from '../../services/https/Staff';
// const { Title } = Typography;

//   const handleAddFormSubmit = (newStaff: NewStaffData) => {
//     const newId = Math.max(...staffData.map(s => s.Employee_ID)) + 1;
//     const newStaffWithId: Staff = {
//       Department: null, // หรือ {} ตาม type ของคุณ
//       ID: undefined, // หรือ 0
//       Employee_ID: newId,
//       title: newStaff.title,
//       firstName: newStaff.firstName,
//       lastName: newStaff.lastName,
//       position: newStaff.position,
//       phone: newStaff.phone,
//       gender: newStaff.gender,
//       startDate: newStaff.startDate,
//       age: newStaff.age,
//       idCard: newStaff.idCard,
//       address: `${newStaff.addressHouseNo}, ${newStaff.addressMoo ? 'Moo ' + newStaff.addressMoo + ', ' : ''}${newStaff.addressSubDistrict}, ${newStaff.addressDistrict}`,
//       email: newStaff.email,
//       employeeType: newStaff.employeeType,
//       licenseNumber: newStaff.licenseNumber || '',
//       Specialization: '',
//       HouseNumber: newStaff.addressHouseNo || '',
//       Subdistrict: newStaff.addressSubDistrict || '',
//       District: newStaff.addressDistrict || '',
//       VillageNumber: newStaff.addressMoo || '',
//       CompRate: 0
//     };
//     setStaffData(prevData => [...prevData, newStaffWithId]);
//     message.success('เพิ่มข้อมูลบุคลากรใหม่เรียบร้อย!');
//     setIsAddDrawerVisible(false);
//   };

//   const handleAddFormCancel = () => {
//     setIsAddDrawerVisible(false);
//   };

//   return (
//     <div style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column' }}>
//       {/* hide scrollbars but keep scrolling */}
//       <style>{`
//         .hide-scrollbar {
//           -ms-overflow-style: none; /* IE and Edge */
//           scrollbar-width: none; /* Firefox */
//         }
//         .hide-scrollbar::-webkit-scrollbar { display: none; } /* Chrome, Safari, Opera */
//       `}</style>

//       <Title level={2} style={{ fontWeight: 'bold', marginBottom: '20px', marginTop: '0px' }}>
//         บุคลากร
//       </Title>
//       {/* Consolidated both Search and Button into a single Row */}
//       <Row justify="space-between" align="middle" style={{ marginBottom: 30 }}>
//         <Col>
//           <Input
//             placeholder="Search by ID, Name, Position, ID Card"
//             prefix={<SearchOutlined style={{ color: '#aaa' }} />}
//             size="large"
//             value={searchText}
//             onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setSearchText(e.target.value)}
//             style={{
//               width: '300px',
//               borderRadius: '25px',
//             }}
//           />
//         </Col>
//         <Col>
//           <Button
//             type="primary"
//             icon={<PlusOutlined />}
//             style={{
//               borderRadius: '25px',
//               backgroundColor: '#9c7ed3ff',
//               borderColor: '#9c7ed3ff',
//               color: 'white',
//             }}
//             onClick={handleAddStaffClick}
//           >
//             เพิ่มรายชื่อ
//           </Button>
//         </Col>
//       </Row>


//       <div style={{
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         padding: '10px 16px',
//         backgroundColor: '#f8f8f8',
//         borderRadius: '4px 4px 0 0',
//         borderBottom: '1px solid #e0e0e0',
//         fontWeight: 'bold',
//         color: '#555',
//         overflowX: 'auto',
//         whiteSpace: 'nowrap',
//       }}>
//         <span style={{ flex: '1 0 100px' }}>รหัสพนักงาน</span>
//         <span style={{ flex: '1 0 100px' }}>ตำแหน่งงาน</span>
//         <span style={{ flex: '1 0 100px' }}>คำนำหน้าชื่อ</span>
//         <span style={{ flex: '2 0 150px' }}>ชื่อ</span>
//         <span style={{ flex: '2 0 150px' }}>นามสกุล</span>
//         <span style={{ width: '30px', flexShrink: 0, visibility: 'hidden' }}></span>
//       </div>

//       <Card
//         style={{
//           borderRadius: 10,
//           boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
//           flex: 1,
//           display: 'flex',
//           flexDirection: 'column',
//           overflow: 'auto',
//         }}
//       >


//         <div className="hide-scrollbar" style={{
//           flex: 1,
//           border: '1px solid #f0f0f0',
//           borderTop: 'none',
//           borderRadius: '0 0 4px 4px',
//           overflowY: 'auto',
//           overflowX: 'auto',
//           maxHeight: 10000,  //display border
//         }}>
//           {loading ? ( // Check the loading state
//             <div style={{ textAlign: 'center', padding: '50px' }}>
//               <Spin size="large" tip="กำลังโหลดข้อมูลบุคลากร..." />
//             </div>
//           ) : filteredStaff.length > 0 ? (
//             filteredStaff.map((staff) => (
//               <div
//                 key={staff.Employee_ID}
//                 style={{
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   alignItems: 'center',
//                   padding: '10px 16px',
//                   borderBottom: '1px dotted #eee',
//                   cursor: 'pointer',
//                   backgroundColor: '#fff',
//                   whiteSpace: 'nowrap',
//                 }}
//                 onClick={() => navigate(`/staff/PersonalData/${staff.Employee_ID}`)}
//               >
//                 <span style={{ flex: '1 0 100px' }}>{formatEmployeeIdForDisplay(staff.Employee_ID)}</span>
//                 <span style={{ flex: '1 0 100px' }}>{staff.position}</span>
//                 <span style={{ flex: '1 0 100px' }}>{staff.title}</span>
//                 <span style={{ flex: '2 0 150px' }}>{staff.firstName}</span>
//                 <span style={{ flex: '2 0 150px' }}>{staff.lastName}</span>
//                 <RightOutlined style={{ fontSize: '14px', color: '#ccc', flexShrink: 0, marginLeft: '10px' }} />
//               </div>
//             ))
//           ) : (
//             <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
//               ไม่พบข้อมูลบุคลากรที่ตรงกับเงื่อนไข
//             </div>
//           )}
//         </div>
//       </Card>
//       <Drawer
//         title={
//           <Title level={4} style={{ margin: 0, fontWeight: 'bold' }}>
//             เพิ่มข้อมูลบุคลากร
//           </Title>
//         }
//         placement="top"
//         open={isAddDrawerVisible}
//         onClose={handleAddFormCancel}
//         height="85vh"

//       >
//         <AddStaffForm
//           onFormSubmit={handleAddFormSubmit}
//           onFormCancel={handleAddFormCancel}
//         />
//       </Drawer>
//     </div>
//   );
// };

// export default StaffInfoPaeg;