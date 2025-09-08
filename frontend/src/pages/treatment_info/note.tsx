// // frontend/src/pages/treatment_info/index.tsx
// import React, { type ChangeEvent, useEffect, useState } from "react";
// import { Card, Button, Typography, Modal, Form, Input, message, Popconfirm, Row, Col, DatePicker, Upload, InputNumber, Select, } from "antd";
// import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
// import type { UploadFile } from "antd/lib/upload/interface";
// import dayjs from "dayjs";
// import type { CaseData as CaseDataIface, Treatment as TreatmentIface, } from "../../interface/patient";
// import { CaseAPI } from "../../services/https/CaseAPI";
// // import { data } from "react-router-dom";    

// const { getAllCases, getCaseByID, addCaseFormData, updateCase, deleteCase } = CaseAPI;

// const { Title } = Typography;
// const { TextArea } = Input;

// type CaseRow = {
//     id: number;
//     patientId: number;
//     appointment_date?: string | null;
//     treatments: TreatmentIface[];
//     note?: string;
//     patient?: any; // can tighten type if you have Patient interface
//     SignDate?: string;
//     totalPrice?: number;   // ✅ new field
// };

// const TreatmentInfoPage: React.FC = () => {
//     const [cases, setCases] = useState<CaseRow[]>([]);
//     const [filteredCases, setFilteredCases] = useState<CaseRow[]>([]);
//     const [, setLoading] = useState<boolean>(false);

//     const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
//     const [editingCase, setEditingCase] = useState<CaseRow | null>(null);

//     const [form] = Form.useForm();
//     // const [previewVisible, setPreviewVisible] = useState(false);
//     // const [previewImage, setPreviewImage] = useState("");
//     // const [previewTitle, setPreviewTitle] = useState("");
//     const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);

//     const [dynamicFileLists, setDynamicFileLists] = useState<{ [key: string]: UploadFile[] }>({});
//     const [dynamicSelectedTeeth, setDynamicSelectedTeeth] = useState<{ [key: number]: string[] }>({});

//     const [searchText, setSearchText] = useState<string>("");

//     // derived patient list from cases (unique)
//     const [patientsList, setPatientsList] = useState<any[]>([]);
//     const [selectedPatient, setSelectedPatient] = useState<any | null>(null);

//     // fetch cases on mount
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 setLoading(true);
//                 const data: CaseDataIface[] = await getAllCases();
//                 // Map to local CaseRow shape
//                 const mapped: CaseRow[] = data.map((c) => ({
//                     id: (c.ID as number) || 0,
//                     patientId: (c.PatientID as number) || 0,
//                     appointment_date: (c as any).appointment_date || c.appointment_date || null,
//                     treatments: c.Treatment || [],
//                     note: c.Note || "",
//                     patient: (c as any).Patient || null,
//                 }));
//                 setCases(mapped);
//                 setFilteredCases(mapped);

//                 // build unique patient list
//                 const patientsMap = new Map<number, any>();
//                 mapped.forEach((r) => {
//                     if (r.patient && r.patient.ID) patientsMap.set(r.patient.ID, r.patient);
//                 });
//                 setPatientsList(Array.from(patientsMap.values()));
//             } catch (err) {
//                 console.error(err);
//                 message.error("โหลดข้อมูลล้มเหลว");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         void fetchData();
//     }, []);
//     // search / filter
//     useEffect(() => {
//         const trimmedText = searchText.trim();
//         if (!trimmedText) {
//             setFilteredCases(cases);
//             return;
//         }
//         const lower = trimmedText.toLowerCase();
//         const num = Number(trimmedText);

//         if (!isNaN(num)) {
//             const exact = cases.find((c) => c.id === num);
//             if (exact) {
//                 setFilteredCases([exact]);
//                 return;
//             }
//         }

//         const filtered = cases.filter((c) => {
//             const patient = patientsList.find((p) => p.ID === c.patientId) || c.patient;
//             const name = patient ? `${patient.FirstName || patient.firstName || ""} ${patient.LastName || patient.lastName || ""}` : "";
//             const nid = patient?.CitizenID || patient?.NationalID || "";
//             const treatmentNames = (c.treatments || []).map((t) => (t.TreatmentName || (t as any).treatment_name || "")).join(" ");
//             return name.toLowerCase().includes(lower) || String(nid).includes(lower) || treatmentNames.toLowerCase().includes(lower);
//         });
//         setFilteredCases(filtered);
//     }, [searchText, cases, patientsList]);
//     // // prepare modal for creating new
//     const handleAddClick = async () => {
//         try {
//             // 1️⃣ reset form และ state
//             setEditingCase(null);
//             setSelectedPatient(null);
//             form.resetFields();
//             // setIsSubmitDisabled(true);
//             setIsModalVisible(true);

//             // 2️⃣ ดึงค่า CitizenID จาก form ถ้ามี (หรือให้ user กรอกทีหลังก็ได้)
//             const citizenId = form.getFieldValue("citizenId"); // สมมติ form มี input field ชื่อ citizenId
//             if (!citizenId) return; // ถ้าไม่มี ให้ user กรอกก่อน

//             // 3️⃣ เรียก API ไปหา patient
//             const patient = await CaseAPI.getPatientByCitizenId(citizenId);

//             if (patient) {
//                 message.success("พบข้อมูลคนไข้");

//                 // 4️⃣ เติมข้อมูล patient ลง form
//                 form.setFieldsValue({
//                     patientId: patient.ID,
//                     patientName: `${patient.FirstName} ${patient.LastName}`,
//                     age: patient.Age,
//                     phoneNumber: patient.PhoneNumber,
//                     // preExistingConditions: patient.CongenitaDisease,
//                     allergyHistory: patient.DrugAllergy,
//                     // bloodType: patient.BloodType,
//                     // ...map ฟิลด์อื่นๆ ตามต้องการ
//                 });

//                 setSelectedPatient(patient);
//                 setIsSubmitDisabled(false); // Enable ปุ่ม submit
//             } else {
//                 message.error("ไม่พบข้อมูลคนไข้");
//             }
//         } catch (err) {
//             console.error(err);
//             message.error("เกิดข้อผิดพลาดในการค้นหาผู้ป่วย");
//         }
//     };

//     const handleCancel = () => {
//         setIsModalVisible(false);
//     };
//     // When National ID changes on form, try to find patient and populate fields
//     const handleNationalIdChange = async (e: ChangeEvent<HTMLInputElement> | string) => {
//         console.log("NationalIDChange")
//         const val = typeof e === "string" ? e : e.target.value;
//         form.setFieldValue("NationalID", val);

//         const nid = String(val || "").trim();
//         if (nid.length === 13) {
//             try {
//                 // เรียก API ดึง patient ตัวเต็ม
//                 const found = await CaseAPI.getPatientByCitizenId(nid);

//                 if (found) {
//                     setSelectedPatient(found);

//                     // ดึง InitialSymptomps ตัวแรกเหมือน handleEditClick
//                     const init = found.InitialSymptomps && found.InitialSymptomps.length
//                         ? found.InitialSymptomps[0]
//                         : null;

//                     form.setFieldsValue({
//                         fullName: `${found.Prefix ?? ""} ${found.FirstName ?? ""} ${found.LastName ?? ""}`.trim(),
//                         age: found.Age ?? "",
//                         preExistingConditions: found.CongenitaDisease ?? "",
//                         phone: found.PhoneNumber ?? "",
//                         allergyHistory: found.DrugAllergy ?? "",
//                         symptomps: init?.Symptomps ?? "",
//                         bloodPressure: init?.BloodPressure ?? "",
//                         heartRate: init?.HeartRate ?? "",
//                         weight: init?.Weight ?? "",
//                         height: init?.Height ?? "",
//                         bloodType: found.BloodType ?? "",
//                     });
//                     setIsSubmitDisabled(false);
//                 } else {
//                     message.error("ไม่พบหมายเลขบัตรประชาชนนี้");
//                     setIsSubmitDisabled(true);
//                 }
//             } catch (err) {
//                 console.error(err);
//                 message.error("เกิดข้อผิดพลาดในการค้นหาคนไข้");
//                 setIsSubmitDisabled(true);
//             }
//         } else {
//             setIsSubmitDisabled(true);
//         }
//     };
//     // edit existing case (row)
//     const handleEditClick = async (row: CaseRow) => {

//         console.log("🟢 คลิกแก้ไข Row:", row);
//         setEditingCase(row);
//         // prefer patient from row; avoid relying on async setSelectedPatient
//         const patient = row.patient || patientsList.find((x) => x.ID === row.patientId) || null;
//         if (patient) setSelectedPatient(patient);

//         const data = await getCaseByID(row.id);
//         console.log("📦 ข้อมูลที่ได้จาก API:", data);
//         const init =
//             data.Patient?.InitialSymptomps && data.Patient.InitialSymptomps.length
//                 ? data.Patient.InitialSymptomps[0]
//                 : null;


//         const formValues: any = {
//             dentist_Name: data.Department?.PersonalData ? `${data.Department.PersonalData.FirstName} ${data.Department.PersonalData.LastName}` : "",
//             NationalID: patient?.CitizenID || patient?.NationalID || undefined,
//             fullName: patient ? `${patient.Prefix || ""} ${patient.FirstName || (patient as any).firstName || ""} ${patient.LastName || (patient as any).lastName || ""}` : "",
//             age: patient?.Age || (patient as any).age,
//             preExistingConditions:
//                 patient?.CongenitaDisease ||
//                 (patient as any).preExistingConditions || "",
//             phone: patient?.PhoneNumber || (patient as any).phone,
//             allergyHistory: patient?.DrugAllergy || (patient as any).allergyHistory || "",
//             note: row.note,
//             appointment_date: row.appointment_date ? dayjs(row.appointment_date) : null,
//             treatments: (row.treatments || []).map((t) => ({
//                 treatment_name: t.TreatmentName || (t as any).treatment_name,
//                 price: t.Price || (t as any).price || 0,
//                 photo: t.Photo || (t as any).photo || null,
//             })),
//             SignDate: data.SignDate ? dayjs(data.SignDate) : null,

//             symptomps: init?.Symptomps || init?.symptomps || "",
//             bloodPressure: init?.BloodPressure || init?.bloodPressure || "",
//             heartRate: init?.HeartRate || init?.heart_rate || init?.heartRate || "",
//             weight: init?.Weight ?? init?.weight ?? "",
//             height: init?.Height ?? init?.height ?? "",
//             bloodType: patient?.BloodType || patient?.bloodType || "",
//         };

//         form.setFieldsValue(formValues);

//         // restore dynamicSelectedTeeth and dynamicFileLists if those are present on treatments
//         const newFiles: { [key: string]: UploadFile[] } = {};
//         const newTeeth: { [key: number]: string[] } = {};
//         (row.treatments || []).forEach((t, idx) => {
//             const photos = (t as any).photo_upload;
//             if (Array.isArray(photos) && photos.length)
//                 newFiles[`treatments_${idx}`] = photos as UploadFile[];
//             const sel = (t as any).selected_teeth;
//             if (Array.isArray(sel)) newTeeth[idx] = sel as string[];
//         });
//         setDynamicFileLists(newFiles);
//         setDynamicSelectedTeeth(newTeeth);

//         setIsSubmitDisabled(false);
//         setIsModalVisible(true);
//     };
//     // Create or update case (convert form values to backend shape)
//     const handleFormSubmit = async (values: any) => {
//         try {
//             // build payload
//             const patientIdToUse = selectedPatient?.ID || selectedPatient?.id || values.patientId || null;
//             if (!patientIdToUse) {
//                 message.error("กรุณาเลือกผู้ป่วยที่ถูกต้อง (National ID)");
//                 return;
//             }
//             const parseDate = (val?: string | null) => {
//                 if (!val || val.startsWith("0001-01-01")) return null;
//                 return dayjs(val);
//             };

//             const cleanISOString = (val?: any) => {
//                 if (!val) return null;
//                 const iso = typeof val === "string" ? val : val.toISOString?.();
//                 if (!iso || iso.startsWith("0001-01-01")) return null;
//                 return iso;
//             };

//             const payload: Partial<CaseDataIface> = {
//                 appointment_date: cleanISOString(values.appointment_date) || undefined,
//                 SignDate: cleanISOString(values.SignDate) || undefined,
//                 Note: values.note || values.notes || "",
//                 PatientID: patientIdToUse,
//                 DepartmentID: values.departmentId || 1, // choose default or form field
//                 Treatment: (values.treatments || []).map((t: any, idx: number) => {
//                     const treatmentObj: any = {
//                         // TreatmentDate: t.treatment_date ? t.treatment_date.toISOString() : new Date().toISOString(),
//                         TreatmentName: t.treatment_name,
//                         Price: Number(t.price || 0),
//                         // include selected teeth and photos as fields for frontend->backend (backend should accept or ignore)
//                         selected_teeth: dynamicSelectedTeeth[idx] || [],
//                         // photo_upload: (dynamicFileLists[`treatments_${idx}`] || []).map((f) => f.originFileObj ? (f.originFileObj as File) : f),
//                         // Quadrants mapping if you want:
//                         // Quadrants: (dynamicSelectedTeeth[idx] || []).map((tooth: string) => ({ Quadrant: tooth })),

//                     };
//                     return treatmentObj;
//                 }),
//             };

//             if (editingCase) {
//                 console.log("editingMode");
//                 // update existing
//                 const updated = await updateCase(editingCase.id, payload as CaseDataIface);
//                 // reflect update in UI — CaseAPI returns mapped CaseDataIface
//                 const updatedRow: CaseRow = {
//                     id: updated.ID as number,
//                     patientId: updated.PatientID as number,
//                     appointment_date: updated.appointment_date || "",
//                     treatments: updated.Treatment || [],
//                     note: updated.Note || "",
//                     patient: (updated as any).Patient || selectedPatient,
//                     SignDate: updated.SignDate || "",
//                     totalPrice: updated.TotalPrice || 0,


//                 };
//                 setCases((prev) => prev.map((r) => (r.id === editingCase.id ? updatedRow : r)));
//                 form.setFieldsValue({
//                     NationalID: updated.Patient?.CitizenID ?? updated.Patient?.NationalID ?? "",
//                     fullName: `${updated.Patient?.Prefix ?? ""} ${updated.Patient?.FirstName ?? ""} ${updated.Patient?.LastName ?? ""}`.trim(),
//                     age: updated.Patient?.Age ?? "",
//                     preExistingConditions: updated.Patient?.CongenitaDisease ?? "",
//                     phone: updated.Patient?.PhoneNumber ?? "",
//                     allergyHistory: updated.Patient?.DrugAllergy ?? "",
//                     symptomps: updated.Patient?.InitialSymptomps?.[0]?.Symptomps ?? "",
//                     bloodPressure: updated.Patient?.InitialSymptomps?.[0]?.BloodPressure ?? "",
//                     heartRate: updated.Patient?.InitialSymptomps?.[0]?.HeartRate ?? "",
//                     weight: updated.Patient?.InitialSymptomps?.[0]?.Weight ?? "",
//                     height: updated.Patient?.InitialSymptomps?.[0]?.Height ?? "",
//                     bloodType: updated.Patient?.BloodType ?? "",
//                     appointment_date: parseDate(updated.appointment_date),
//                     SignDate: parseDate(updated.SignDate),
//                     note: updated.Note ?? "",
//                     treatments: updated.Treatment?.map((t) => ({
//                         treatment_name: t.TreatmentName,
//                         price: t.Price,
//                         // appointment_date: t.appointment_date ? dayjs(t.appointment_date) : null,
//                     })) || [],
//                 });
//             } else {
//                 // create new
//                 const created = await addCaseFormData(payload as CaseDataIface);
//                 // map created to CaseRow shape
//                 const newRow: CaseRow = {
//                     id: (created.ID as number) || 0,
//                     patientId: created.PatientID as number,
//                     appointment_date: (created as any).FollowUpDate || null,
//                     treatments: created.Treatment || [],
//                     note: created.Note || "",
//                     patient: (created as any).Patient || selectedPatient,
//                     SignDate: created.SignDate || "",

//                 };
//                 setCases((prev) => [...prev, newRow]);
//                 message.success("เพิ่มการรักษาสำเร็จ");
//             }
//             setIsModalVisible(false);
//         } catch (err) {
//             console.error(err);
//             message.error("บันทึกล้มเหลว");
//         }
//     };

//     const handleDelete = async (id: number) => {
//         try {
//             await deleteCase(id);
//             setCases((prev) => prev.filter((r) => r.id !== id));
//             message.success("ลบเรียบร้อย");
//             setIsModalVisible(false);
//         } catch (err) {
//             console.error(err);
//             message.error("ลบไม่สำเร็จ");
//         }
//     };

//     // const handlePreview = async (file: UploadFile) => {
//     //     if (!file.url && !file.preview && file.originFileObj) {
//     //         file.preview = await getBase64(file.originFileObj as File);
//     //     }
//     //     setPreviewImage(file.url || (file.preview as string));
//     //     setPreviewTitle(file.name || "");
//     //     setPreviewVisible(true);
//     // };

//     // const handleDynamicChange = (index: number) => ({ fileList }: { fileList: UploadFile[] }) => {
//     //     setDynamicFileLists((prev) => ({ ...prev, [`treatments_${index}`]: fileList }));
//     // };
//     return (
//         <div style={{ padding: "16px", height: "95%", display: "flex", flexDirection: "column" }}>
//             <Title level={2} style={{ fontWeight: "bold", marginBottom: "20px", marginTop: "0px" }}>
//                 ข้อมูลการรักษา
//             </Title>

//             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 30 }}>
//                 <Input
//                     placeholder="ค้นหาด้วยรหัสการรักษา, ชื่อผู้ป่วย, เลขบัตรประชาชน, หรือชื่อการรักษา"
//                     value={searchText}
//                     onChange={(e) => setSearchText(e.target.value)}
//                     style={{ width: 300, borderRadius: 25 }}
//                     allowClear
//                 />
//                 <Button
//                     type="primary"
//                     icon={<PlusOutlined />}
//                     onClick={handleAddClick}
//                     style={{
//                         backgroundColor: "#B19CD9",
//                         borderColor: "#B19CD9",
//                         color: "white",
//                         borderRadius: 25,
//                     }}
//                 >
//                     เพิ่มการรักษา
//                 </Button>
//             </div>

//             {/* header */}
//             <div
//                 style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     padding: "10px 16px",
//                     backgroundColor: "#f8f8f8",
//                     borderRadius: "4px 4px 0 0",
//                     borderBottom: "1px solid #e0e0e0",
//                     fontWeight: "bold",
//                     color: "#555",
//                     overflowX: "auto",
//                     whiteSpace: "nowrap",
//                 }}
//             >
//                 <span style={{ flex: "1 0 120px" }}>รหัสการรักษา</span>
//                 <span style={{ flex: "1 0 180px" }}>รหัสบัตรประชาชน</span>
//                 <span style={{ flex: "2 0 200px" }}>ชื่อ-นามสกุล</span>
//                 <span style={{ flex: "1 0 160px" }}>นัดหมายครั้งถัดไป</span>
//                 <span style={{ flex: "1 0 120px" }}>ราคา</span>
//             </div>

//             <Card style={{ borderRadius: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.1)", flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
//                 <div style={{ flex: 1, border: "1px solid #f0f0f0", borderTop: "none", borderRadius: "0 0 4px 4px", overflowY: "auto", overflowX: "auto" }}>
//                     {filteredCases.length > 0 ? (
//                         filteredCases.map((r) => {
//                             const patient = patientsList.find((p) => p.ID === r.patientId) || r.patient;
//                             const patientName = patient ? `${patient.FirstName || patient.firstName || ""} ${patient.LastName || patient.lastName || ""}` : "-";
//                             const nationalId = patient?.CitizenID || "";
//                             const appointment = r.appointment_date ? dayjs(r.appointment_date).format("DD/MM/YYYY") : "ไม่มี";
//                             const totalPrice = (r.treatments || []).reduce((s, t) => s + (Number(t.Price || (t as any).price || 0)), 0);
//                             return (
//                                 <div
//                                     key={r.id}
//                                     style={{
//                                         display: "flex",
//                                         justifyContent: "space-between",
//                                         alignItems: "center",
//                                         padding: "10px 16px",
//                                         borderBottom: "1px dotted #eee",
//                                         cursor: "pointer",
//                                         backgroundColor: "#fff",
//                                         whiteSpace: "nowrap",
//                                     }}
//                                     onClick={() => handleEditClick(r)}
//                                 >
//                                     <span style={{ flex: "1 0 120px" }}>{r.id}</span>
//                                     <span style={{ flex: "1 0 180px" }}>{nationalId}</span>
//                                     <span style={{ flex: "2 0 200px" }}>{patientName}</span>
//                                     <span style={{ flex: "1 0 160px" }}>{appointment}</span>
//                                     <span style={{ flex: "1 0 120px" }}>{totalPrice.toLocaleString()} บาท</span>
//                                 </div>
//                             );
//                         })
//                     ) : (
//                         <div style={{ textAlign: "center", padding: "50px", color: "#999" }}>ไม่พบข้อมูลการรักษาที่ตรงกับเงื่อนไข</div>
//                     )}
//                 </div>
//             </Card>

//             <Modal
//                 title="การรักษา/ข้อมูลผู้รับบริการ"
//                 open={isModalVisible}
//                 onCancel={handleCancel}
//                 footer={[
//                     editingCase && (
//                         <Popconfirm
//                             key="delete"
//                             title="คุณต้องการลบข้อมูลนี้หรือไม่?"
//                             onConfirm={() => {
//                                 if (editingCase) handleDelete(editingCase.id);
//                             }}
//                             okText="ใช่"
//                             cancelText="ไม่"
//                         >
//                             <Button type="text" danger icon={<DeleteOutlined />} style={{ color: "red" }}>
//                                 ลบข้อมูล
//                             </Button>
//                         </Popconfirm>
//                     ),
//                     <Button key="back" onClick={handleCancel} style={{ borderRadius: 25, border: "1px solid #B19CD9", color: "#B19CD9" }}>
//                         ย้อนกลับ
//                     </Button>,
//                     <Button key="submit" type="primary" onClick={() => form.submit()} disabled={isSubmitDisabled} style={{ backgroundColor: "#B19CD9", borderColor: "#B19CD9", color: "white", borderRadius: 25 }}>
//                         บันทึกข้อมูล
//                     </Button>,
//                 ]}
//                 width={900}
//             >
//                 <Form form={form} layout="vertical" onFinish={handleFormSubmit} >
//                     {/* Patient info */}
//                     <div style={{ border: "1px solid #d9d9d9", borderRadius: 8, padding: 16, marginBottom: 24 }}>
//                         <Row gutter={16}><Col span={8}>
//                             <Form.Item
//                                 name="NationalID"
//                                 label="เลขบัตรประชาชน"
//                                 rules={[
//                                     { required: true, message: "กรุณากรอกเลขบัตรประชาชน" },
//                                     {
//                                         validator: (_, value) => {
//                                             if (!value) return Promise.resolve();
//                                             if (value.length !== 13) return Promise.reject(new Error("เลขบัตรประชาชนต้องมีความยาว 13 หลัก"));
//                                             return Promise.resolve();
//                                         },
//                                     },
//                                 ]}
//                             >
//                                 <Input maxLength={13} inputMode="numeric" pattern="[0-9]*" onChange={handleNationalIdChange} />
//                             </Form.Item>

//                         </Col><Col span={8}>
//                                 <Form.Item label="กรณีมีนัดหมายต่อเนื่อง" name="appointment_date">
//                                     <DatePicker style={{ width: "100%" }} />
//                                 </Form.Item></Col>

//                         </Row>
//                         <Row gutter={16}>

//                             <Col span={8}>
//                                 <Form.Item label="ชื่อ-นามสกุล" name="fullName">
//                                     <Input disabled />
//                                 </Form.Item>
//                             </Col>
//                             <Col span={8}>
//                                 <Form.Item label="อายุ" name="age">
//                                     <Input disabled />
//                                 </Form.Item>
//                             </Col>
//                             <Col span={8}>
//                                 <Form.Item label="โรคประจำตัว" name="preExistingConditions">
//                                     <Input disabled />
//                                 </Form.Item>
//                             </Col>
//                             <Col span={8}>
//                                 <Form.Item label="หมู่เลือด" name="bloodType">
//                                     <Input disabled />
//                                 </Form.Item>
//                             </Col>
//                             <Col span={8}>
//                                 <Form.Item label="อัตราการเต้นหัวใจ" name="heartRate">
//                                     <Input disabled />
//                                 </Form.Item>
//                             </Col>
//                             <Col span={8}>
//                                 <Form.Item label="ความดัน" name="bloodPressure">
//                                     <Input disabled />
//                                 </Form.Item>
//                             </Col>
//                             <Col span={8}>
//                                 <Form.Item label="อาการ" name="symptomps">
//                                     <Input disabled />
//                                 </Form.Item>
//                             </Col>
//                             <Col span={8}>
//                                 <Form.Item label="ประวัติแพ้ยา" name="allergyHistory">
//                                     <Input disabled />
//                                 </Form.Item>
//                             </Col>
//                             <Col span={8}>
//                                 <Form.Item label="เบอร์โทรศัพท์" name="phone">
//                                     <Input disabled />
//                                 </Form.Item>
//                             </Col>

//                         </Row>

//                         <Row gutter={16}>
//                         </Row>


//                         <Row gutter={16} style={{ marginTop: -10 }}>
//                             <Col span={10}>
//                                 <Form.Item label="ลงชื่อทันตแพทย์" name="dentist_Name">
//                                     <Input />
//                                 </Form.Item>
//                             </Col>
//                             <Col span={10}>
//                                 <Form.Item label="วันที่ลงชื่อ" name="SignDate">
//                                     <DatePicker style={{ width: "100%" }} />
//                                 </Form.Item>
//                             </Col>
//                         </Row>
//                         <Row gutter={10}>
//                             <Col span={23}>
//                                 <Form.Item label="หมายเหตุ" name="note">
//                                     <TextArea rows={6} />
//                                 </Form.Item>
//                             </Col>
//                         </Row>
//                     </div>

//                     {/* Treatment List */}
//                     <div style={{ border: "1px solid #d9d9d9", borderRadius: 8, padding: 16, marginBottom: 24 }}>
//                         <Title level={4}>แผนการรักษา</Title>
//                         <Form.List name="treatments">
//                             {(fields, { add, remove }) => (
//                                 <>
//                                     {fields.map(({ key, name, ...restField }, index) => (
//                                         <div key={key} style={{ border: "1px dashed #d9d9d9", padding: 16, marginBottom: 16 }}>
//                                             <Row gutter={16}>
//                                                 <Col span={10}>
//                                                     <Form.Item {...restField} name={[name, "treatment_name"]} label="ชื่อการรักษา" rules={[{ required: true, message: "กรุณาเลือกชื่อการรักษา" }]}>
//                                                         <Select
//                                                             placeholder="เลือกชื่อการรักษา"
//                                                             options={[
//                                                                 { label: "อุดฟัน", value: "อุดฟัน" },
//                                                                 { label: "ถอนฟัน", value: "ถอนฟัน" },
//                                                                 { label: "ขูดหินน้ำลาย", value: "ขูดหินน้ำลาย" },
//                                                                 { label: "เกลารากฟัน", value: "เกลารากฟัน" },
//                                                                 { label: "รักษารากฟัน", value: "รักษารากฟัน" },
//                                                                 { label: "ใส่ฟันเทียมทดแทน", value: "ใส่ฟันเทียมทดแทน" },
//                                                                 { label: "อื่นๆ", value: "อื่นๆ" },
//                                                             ]}
//                                                             style={{ width: "100%" }}
//                                                         />
//                                                     </Form.Item>
//                                                 </Col>

//                                                 <Col span={10}>
//                                                     <Form.Item {...restField} name={[name, "price"]} label="ราคารวม" rules={[{ required: true, message: "กรุณาใส่ราคารวม" }]}>
//                                                         <InputNumber
//                                                             style={{ width: "100%" }}
//                                                             min={0}
//                                                             formatter={(value?: number | string) => (value === undefined || value === null || value === "" ? "" : String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ","))}
//                                                             parser={(displayValue?: string) => {
//                                                                 if (!displayValue) return 0;
//                                                                 const cleaned = displayValue.toString().replace(/,/g, "");
//                                                                 const n = Number(cleaned);
//                                                                 return Number.isFinite(n) ? n : 0;
//                                                             }}
//                                                         />
//                                                     </Form.Item>
//                                                 </Col>

//                                                 <Col span={4} style={{ display: "flex", alignItems: "center", marginTop: 24 }}>
//                                                     <Button
//                                                         type="dashed"
//                                                         danger
//                                                         onClick={() => {
//                                                             remove(name);
//                                                             const newDynamicFileLists = { ...dynamicFileLists };
//                                                             delete newDynamicFileLists[`treatments_${index}`];
//                                                             setDynamicFileLists(newDynamicFileLists);
//                                                             const newDynamicSelected = { ...dynamicSelectedTeeth };
//                                                             delete newDynamicSelected[index];
//                                                             setDynamicSelectedTeeth(newDynamicSelected);
//                                                         }}
//                                                         icon={<DeleteOutlined />}
//                                                     />
//                                                 </Col>
//                                             </Row>

//                                             {/* Tooth selector (same as your original UI) */}
//                                             {/* ... keep same markup as you had for tooth selection ... */}
//                                             {/* For brevity, omitted here — keep your current tooth selector code */}
//                                             {/* Photo upload */}
//                                             {/* <Form.Item style={{ marginTop: 10 }} label="อัปโหลดรูปภาพ">
//                                                 <Upload
//                                                     listType="picture-card"
//                                                     fileList={dynamicFileLists[`treatments_${index}`] || []}
//                                                     onPreview={handlePreview}
//                                                     onChange={handleDynamicChange(index)}
//                                                     beforeUpload={() => false}
//                                                     multiple
//                                                     maxCount={5}
//                                                     accept="image/*"
//                                                     style={{ width: 80, height: 80 }}
//                                                 >
//                                                     {(dynamicFileLists[`treatments_${index}`]?.length || 0) >= 5 ? null : (
//                                                         <div style={{ color: "#8c8c8c", fontSize: 12 }}>
//                                                             <PlusOutlined style={{ fontSize: 18 }} />
//                                                             <div style={{ marginTop: 4 }}>อัปโหลด</div>
//                                                         </div>
//                                                     )}
//                                                 </Upload>
//                                             </Form.Item> */}
//                                         </div>
//                                     ))}

//                                     <Form.Item>
//                                         <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
//                                             เพิ่มการรักษา
//                                         </Button>
//                                     </Form.Item>
//                                 </>
//                             )}
//                         </Form.List>
//                     </div>
//                 </Form>
//             </Modal>

//             {/* <Modal open={previewVisible} title={previewTitle} footer={null} onCancel={() => setPreviewVisible(false)}>
//                 <img alt="preview" style={{ width: "100%" }} src={previewImage} />
//             </Modal> */}
//         </div>
//     );
// };

// export default TreatmentInfoPage;
// // function getBase64(_arg0: File): any {
// //     throw new Error("Function not implemented.");
// // }

