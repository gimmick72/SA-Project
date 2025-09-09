// frontend/src/pages/treatment_info/index.tsx
import React, { type ChangeEvent, useEffect, useState } from "react";
import { Card, Button, Typography, Modal, Form, Input, message, Popconfirm, Row, Col, DatePicker, InputNumber, Select, } from "antd";
import { PlusOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/lib/upload/interface";
import dayjs from "dayjs";
import type { CaseData as CaseData, CaseRow } from "../../interface/Case";
import { CaseAPI } from "../../services/https/CaseAPI";
// import { StaffAPI } from '../../services/https/StaffAPI';

const { getAllCases, deleteCase } = CaseAPI;

const { Title } = Typography;
const { TextArea } = Input;

const TreatmentInfoPage: React.FC = () => {
    const [cases, setCases] = useState<CaseRow[]>([]);
    const [filteredCases, setFilteredCases] = useState<CaseRow[]>([]);
    const [, setLoading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [editingCase, setEditingCase] = useState<CaseRow | null>(null);
    const [form] = Form.useForm();
    const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
    const [dynamicFileLists, setDynamicFileLists] = useState<{ [key: string]: UploadFile[] }>({});
    const [dynamicSelectedTeeth, setDynamicSelectedTeeth] = useState<{ [key: number]: string[] }>({});
    const [searchText, setSearchText] = useState<string>("");
    const [patientsList, setPatientsList] = useState<any[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
    const [departments, setDepartments] = useState<any[]>([]);

    // 🔹 ดึงข้อมูล Department ทั้งหมดจาก /staff (หรือจะทำ API แยกก็ได้)
    useEffect(() => {
        fetch("http://localhost:8080/staff")
            .then(res => res.json())
            .then(data => setDepartments(data))
            .catch(err => console.error("Error fetching departments:", err));
    }, []);

    // fetch cases on mount 
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data: CaseData[] = await getAllCases();
                // Map to local CaseRow shape
                const mapped: CaseRow[] = data.map((c) => ({
                    id: (c.ID as number) || 0,
                    patientId: (c.PatientID as number) || 0,
                    appointment_date: (c as any).appointment_date || c.appointment_date || null,
                    treatments: c.Treatment || [],
                    note: c.Note || "",
                    patient: (c as any).Patient || null,
                }));
                setCases(mapped);
                setFilteredCases(mapped);

                // build unique patient list
                const patientsMap = new Map<number, any>();
                mapped.forEach((r) => {
                    if (r.patient && r.patient.ID) patientsMap.set(r.patient.ID, r.patient);
                });
                setPatientsList(Array.from(patientsMap.values()));
            } catch (err) {
                console.error(err);
                message.error("โหลดข้อมูลล้มเหลว");
            } finally {
                setLoading(false);
            }
        };
        void fetchData();
    }, []);

    // search / filter
    useEffect(() => {
        const trimmed = searchText.trim().toLowerCase();

        if (!trimmed) {
            setFilteredCases(cases);
            return;
        }

        const num = Number(trimmed);

        // 🔹 exact match by Case ID
        if (!isNaN(num)) {
            const exact = cases.find((c) => c.id === num);
            if (exact) {
                setFilteredCases([exact]);
                return;
            }
        }

        const filtered = cases.filter((c) => {
            const patient = patientsList.find((p) => p.ID === c.patientId) || c.patient;

            const firstName = (patient?.FirstName || patient?.firstName || "").toLowerCase();
            const lastName = (patient?.LastName || patient?.lastName || "").toLowerCase();
            const fullName = `${firstName} ${lastName}`.trim();

            const nid = String(patient?.CitizenID || "").toLowerCase();

            // 🔹 check treatments more strictly
            const hasTreatment = (c.treatments || []).some((t) =>
                (t.TreatmentName || (t as any).treatment_name || "")
                    .toLowerCase()
                    .includes(trimmed)
            );

            return (
                fullName.includes(trimmed) ||
                firstName.includes(trimmed) ||
                lastName.includes(trimmed) ||
                (trimmed.length >= 13 && nid.includes(trimmed)) || // ✅ ค้นหาเฉพาะเมื่อกรอก >= 13
                hasTreatment
            );
        });

        setFilteredCases(filtered);
    }, [searchText, cases, patientsList]);

    // // prepare modal for creating new
    const handleAddClick = async () => {
        try {
            // 1️⃣ reset form และ state
            setEditingCase(null);
            setSelectedPatient(null);
            form.resetFields();
            // setIsSubmitDisabled(true);
            setIsModalVisible(true);

            // 2️⃣ ดึงค่า CitizenID จาก form ถ้ามี (หรือให้ user กรอกทีหลังก็ได้)
            const citizenId = form.getFieldValue("citizenId"); // สมมติ form มี input field ชื่อ citizenId
            if (!citizenId) return; // ถ้าไม่มี ให้ user กรอกก่อน

            // 3️⃣ เรียก API ไปหา patient
            const patient = await CaseAPI.getPatientByCitizenId(citizenId);

            if (patient) {
                message.success("พบข้อมูลคนไข้");

                setSelectedPatient(patient);
                setIsSubmitDisabled(false); // Enable ปุ่ม submit
            } else {
                message.error("ไม่พบข้อมูลคนไข้");
            }
        } catch (err) {
            console.error(err);
            message.error("เกิดข้อผิดพลาดในการค้นหาผู้ป่วย");
        }
    };

    // When National ID changes on form, try to find patient and populate fields
    const handleNationalIdChange = async (e: ChangeEvent<HTMLInputElement> | string) => {
        console.log("NationalIDChange");
        const val = typeof e === "string" ? e : e.target.value;
        form.setFieldValue("NationalID", val);

        const nid = String(val || "").trim();
        try {
            const { patient, formValues } = await CaseAPI.getPatientFormValuesByCitizenId(nid);

            if (patient && formValues) {
                setSelectedPatient(patient);
                form.setFieldsValue(formValues);
                setIsSubmitDisabled(false);
            } else {
                message.error("ไม่พบหมายเลขบัตรประชาชนนี้");
                setIsSubmitDisabled(true);
            }
        } catch (err) {
            console.error(err);
            message.error("เกิดข้อผิดพลาดในการค้นหาคนไข้");
            setIsSubmitDisabled(true);
        }
    };

    // edit existing case (row)
    const handleEditClick = async (row: CaseRow) => {
        console.log("🟢 คลิกแก้ไข Row:", row);
        setEditingCase(row);

        const { formValues, patient } =
            await CaseAPI.getCaseFormValuesByID(row.id, row, patientsList);

        if (patient) setSelectedPatient(patient);

        form.setFieldsValue(formValues);

        setIsSubmitDisabled(false);
        setIsModalVisible(true);
    };

    // Create or update case (convert form values to backend shape)
    const handleFormSubmit = async (values: any) => {
        try {
            if (!values.treatments || values.treatments.length === 0) {
                message.error("กรุณาเพิ่มอย่างน้อย 1 รายการการรักษาก่อนบันทึก");
                return;
            }

            const newCases = await CaseAPI.saveCase(
                values,
                selectedPatient,

                editingCase,
                cases
            );

            setCases(newCases);
            message.success(editingCase ? "แก้ไขการรักษาสำเร็จ" : "เพิ่มการรักษาสำเร็จ");
            setIsModalVisible(false);
        } catch (err) {
            console.error(err);
            message.error("บันทึกล้มเหลว");
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteCase(id);
            setCases((prev) => prev.filter((r) => r.id !== id));
            message.success("ลบเรียบร้อย");
            setIsModalVisible(false);
        } catch (err) {
            console.error(err);
            message.error("ลบไม่สำเร็จ");
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div style={{ padding: "16px", height: "95%", display: "flex", flexDirection: "column" }}>
            <Title level={2} style={{ fontWeight: "bold", marginBottom: "20px", marginTop: "0px" }}>
                ข้อมูลการรักษา
            </Title>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 30 }}>
                <Input
                    size="large"
                    placeholder="   Search by ID, Name, ID Card"
                    prefix={<SearchOutlined style={{ color: '#aaa' }} />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{
                        width: '350px',
                        borderRadius: '25px',
                    }}
                    allowClear
                />
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddClick}
                    style={{
                        backgroundColor: "#B19CD9",
                        borderColor: "#B19CD9",
                        color: "white",
                        borderRadius: 25,
                    }}
                >
                    เพิ่มการรักษา
                </Button>
            </div>

            {/* header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 16px",
                    backgroundColor: "#f8f8f8",
                    borderRadius: "20px 20px 0 0",
                    borderBottom: "1px solid #e0e0e0",
                    fontWeight: "bold",
                    color: "#555",
                    overflowX: "auto",
                    whiteSpace: "nowrap",
                }}
            >
                <span style={{ flex: "1 0 120px" }}>รหัสการรักษา</span>
                <span style={{ flex: "1 0 160px" }}>รหัสบัตรประชาชน</span>
                <span style={{ flex: "1 0 160px" }}>คำนำหน้าชื่อ</span>
                <span style={{ flex: "2 0 160px" }}>ชื่อ-นามสกุล</span>
                <span style={{ flex: "1 0 160px" }}>นัดหมายครั้งถัดไป</span>
                <span style={{ flex: "1 0 120px" }}>ราคา</span>
            </div>

            <Card style={{ borderRadius: 0, boxShadow: "0 2px 6px rgba(0,0,0,0.1)", flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
                <div style={{ flex: 1, border: "1px solid #f0f0f0", borderTop: "none", borderRadius: "0 0 4px 4px", overflowY: "auto", overflowX: "auto" }}>
                    {filteredCases.length > 0 ? (
                        filteredCases.map((r) => {

                            const patient = patientsList.find((p) => p.ID === r.patientId) || r.patient;
                            const title = patient?.Prefix || patient?.prefix || "";
                            const patientName = patient ? `${patient.FirstName || patient.firstName || ""} ${patient.LastName || patient.lastName || ""}` : "-";
                            const nationalId = patient?.CitizenID || "";
                            const appointment = r.appointment_date ? dayjs(r.appointment_date).format("DD/MM/YYYY") : "ไม่มี";
                            const totalPrice = (r.treatments || []).reduce((s, t) => s + (Number(t.Price || (t as any).price || 0)), 0);
                            return (
                                <div
                                    key={r.id}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "10px 16px",
                                        borderBottom: "1px dotted #eee",
                                        cursor: "pointer",
                                        backgroundColor: "#fff",
                                        whiteSpace: "nowrap",
                                    }}
                                    onClick={() => handleEditClick(r)}
                                >
                                    <span style={{ flex: "1 0 120px" }}>{r.id}</span>
                                    <span style={{ flex: "1 0 180px" }}>{nationalId}</span>
                                    <span style={{ flex: "1 0 180px" }}>{title}</span>
                                    <span style={{ flex: "2 0 200px" }}>{patientName}</span>
                                    <span style={{ flex: "1 0 160px" }}>{appointment}</span>
                                    <span style={{ flex: "1 0 120px" }}>{totalPrice.toLocaleString()} บาท</span>
                                </div>
                            );
                        })
                    ) : (
                        <div style={{ textAlign: "center", padding: "50px", color: "#999" }}>ไม่พบข้อมูลการรักษาที่ตรงกับเงื่อนไข</div>
                    )}
                </div>
            </Card>

            <Modal
                title="การรักษา/ข้อมูลผู้รับบริการ"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    editingCase && (
                        <Popconfirm
                            key="delete"
                            title="คุณต้องการลบข้อมูลนี้หรือไม่?"
                            onConfirm={() => {
                                if (editingCase) handleDelete(editingCase.id);
                            }}
                            okText="ใช่"
                            cancelText="ไม่"
                        >
                            <Button type="text" danger icon={<DeleteOutlined />} style={{ color: "red" }}>
                                ลบข้อมูล
                            </Button>
                        </Popconfirm>
                    ),
                    <Button key="back" onClick={handleCancel} style={{ borderRadius: 25, border: "1px solid #B19CD9", color: "#B19CD9" }}>
                        ย้อนกลับ
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => form.submit()} disabled={isSubmitDisabled} style={{ backgroundColor: "#B19CD9", borderColor: "#B19CD9", color: "white", borderRadius: 25 }}>
                        บันทึกข้อมูล
                    </Button>,
                ]}
                width={900}
            >
                <Form form={form} layout="vertical" onFinish={handleFormSubmit} >
                    {/* Patient info */}
                    <div style={{ border: "1px solid #d9d9d9", borderRadius: 8, padding: 16, marginBottom: 24 }}>
                        <Row gutter={16}><Col span={8}>
                            <Form.Item
                                name="NationalID"
                                label="เลขบัตรประชาชน"
                                rules={[
                                    { required: true, message: "กรุณากรอกเลขบัตรประชาชน" },
                                    {
                                        validator: (_, value) => {
                                            if (!value) return Promise.resolve();
                                            if (value.length !== 13) return Promise.reject(new Error("เลขบัตรประชาชนต้องมีความยาว 13 หลัก"));
                                            return Promise.resolve();
                                        },
                                    },
                                ]}
                            >
                                <Input placeholder="กรุณากรอกเลขบัตรประชาชน" maxLength={13} inputMode="numeric" pattern="[0-9]*" onChange={handleNationalIdChange} />
                            </Form.Item>

                        </Col><Col span={8}>
                                <Form.Item label="กรณีมีนัดหมายต่อเนื่อง" name="appointment_date">
                                    <DatePicker style={{ width: "100%" }} />
                                </Form.Item></Col>

                        </Row>
                        <Row gutter={16}>

                            <Col span={8}>
                                <Form.Item label="ชื่อ-นามสกุล" name="fullName">
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="อายุ" name="age">
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="โรคประจำตัว" name="preExistingConditions">
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="หมู่เลือด" name="bloodType">
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="อัตราการเต้นหัวใจ" name="heartRate">
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="ความดัน" name="bloodPressure">
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="อาการ" name="symptomps">
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="ประวัติแพ้ยา" name="allergyHistory">
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="เบอร์โทรศัพท์" name="phone">
                                    <Input disabled />
                                </Form.Item>
                            </Col>

                        </Row>

                        <Row gutter={16}>
                        </Row>


                        <Row gutter={16} style={{ marginTop: 20 }}>
                            <Col span={7}>
                                <Form.Item label="รหัสบุคลากร" name="departmentID" rules={[
                                    { required: true, message: "กรุณากรอกรหัสบุคลากร" },

                                ]}>
                                    <Input placeholder="กรุณากรอกรหัสบุคลากร"
                                        onChange={(e) => {
                                            const depId = Number(e.target.value); // 👈 แปลงตรงนี้ด้วย
                                            const dept = departments.find((d) => d.ID === depId);
                                            form.setFieldsValue({
                                                departmentID: depId, // 👈 เก็บเป็น number แทน string
                                                dentist_Name: dept?.PersonalData
                                                    ? `${dept.PersonalData.FirstName} ${dept.PersonalData.LastName}`
                                                    : "",
                                            });
                                        }}
                                    />
                                </Form.Item>

                            </Col>

                        </Row>
                        <Row gutter={15} style={{ marginTop: 10 }}>
                            <Col span={10}>
                                <Form.Item label="ลงชื่อทันตแพทย์" name="dentist_Name">
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col span={10}>

                                <Form.Item label="วันที่ลงชื่อ" name="SignDate">
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={10}>
                            <Col span={23}>
                                <Form.Item label="หมายเหตุ" name="note">
                                    <TextArea placeholder="เพิ่มข้อความ"
                                        rows={6} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>

                    {/* Treatment List */}
                    <div style={{ border: "1px solid #d9d9d9", borderRadius: 8, padding: 16, marginBottom: 24 }}>
                        <Title level={4}>แผนการรักษา</Title>
                        <Form.List name="treatments" rules={[
                            {
                                validator: async (_, treatments) => {
                                    if (!treatments || treatments.length === 0) {
                                        return Promise.reject(new Error("กรุณาเพิ่มอย่างน้อย 1 รายการการรักษา"));
                                    }
                                },
                            },
                        ]}>
                            {(fields, { add, remove }, { errors }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }, index) => (
                                        <div key={key} style={{ border: "1px dashed #d9d9d9", padding: 16, marginBottom: 16 }}>
                                            <Row gutter={16}>
                                                <Col span={10}>
                                                    <Form.Item {...restField} name={[name, "treatment_name"]} label="ชื่อการรักษา" rules={[{ required: true, message: "กรุณาเลือกชื่อการรักษา" }]}>
                                                        <Select
                                                            placeholder="เลือกชื่อการรักษา"
                                                            options={[
                                                                { label: "อุดฟัน", value: "อุดฟัน" },
                                                                { label: "ถอนฟัน", value: "ถอนฟัน" },
                                                                { label: "ขูดหินน้ำลาย", value: "ขูดหินน้ำลาย" },
                                                                { label: "เกลารากฟัน", value: "เกลารากฟัน" },
                                                                { label: "รักษารากฟัน", value: "รักษารากฟัน" },
                                                                { label: "ใส่ฟันเทียมทดแทน", value: "ใส่ฟันเทียมทดแทน" },
                                                                { label: "อื่นๆ", value: "อื่นๆ" },
                                                            ]}
                                                            style={{ width: "100%" }}
                                                        />
                                                    </Form.Item>
                                                </Col>

                                                <Col span={10}>
                                                    <Form.Item {...restField} name={[name, "price"]} label="ราคา" rules={[{ required: true, message: "กรุณาใส่ราคารวม" }]}>
                                                        <InputNumber placeholder="ใส่ราคา"
                                                            style={{ width: "100%" }}
                                                            min={0}
                                                            formatter={(value?: number | string) => (value === undefined || value === null || value === "" ? "" : String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ","))}
                                                            parser={(displayValue?: string) => {
                                                                if (!displayValue) return 0;
                                                                const cleaned = displayValue.toString().replace(/,/g, "");
                                                                const n = Number(cleaned);
                                                                return Number.isFinite(n) ? n : 0;
                                                            }}
                                                        />
                                                    </Form.Item>
                                                </Col>

                                                <Col span={2} style={{ display: "flex", alignItems: "center", marginTop: 4 }}>
                                                    <Button
                                                        type="dashed"
                                                        danger
                                                        onClick={() => {
                                                            remove(name);
                                                            const newDynamicFileLists = { ...dynamicFileLists };
                                                            delete newDynamicFileLists[`treatments_${index}`];
                                                            setDynamicFileLists(newDynamicFileLists);
                                                            const newDynamicSelected = { ...dynamicSelectedTeeth };
                                                            delete newDynamicSelected[index];
                                                            setDynamicSelectedTeeth(newDynamicSelected);
                                                        }}
                                                        icon={<DeleteOutlined />}
                                                    />
                                                </Col>
                                            </Row>

                                            {/* Tooth selector (same as your original UI) */}
                                            {/* ... keep same markup as you had for tooth selection ... */}
                                            {/* For brevity, omitted here — keep your current tooth selector code */}
                                            {/* Photo upload */}

                                        </div>
                                    ))}

                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            เพิ่มการรักษา
                                        </Button>
                                        <Form.ErrorList errors={errors} />
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </div>
                </Form>
            </Modal>

        </div>
    );
};

export default TreatmentInfoPage;