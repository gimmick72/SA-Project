// TreatmentInfoPage.tsx
import React, { useEffect, useState } from 'react';
import { Card, Button, Typography, Modal, Form, Input, message, Popconfirm, Row, Col, DatePicker, Upload, InputNumber, Select } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/lib/upload/interface';
import dayjs from 'dayjs';
import { initialPatientData, initialTreatmentData } from './Data';

const { Title } = Typography;
const { TextArea } = Input;

interface Patient {
    patientId: number;
    title: string;
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    NationalID: string;
    phone: string;
    email: string;
    nickname?: string;
    preExistingConditions: string;
    allergyHistory: string;
    registeredAddress: {
        houseNo: string;
        moo?: string;
        subDistrict: string;
        district: string;
        province: string;
        postalCode: string;
    };
}

interface DynamicTreatment {
    selected_teeth: string[];
    treatment_name: string;
    photo_upload?: UploadFile[];
    price: number;
}

interface Treatment {
    [x: string]: any;
    id: number;
    patientId: number;
    treatmentName?: string;
    description?: string;
    treatments?: DynamicTreatment[];
    dentist_name?: string;
    date?: dayjs.Dayjs | null;
    notes?: string;
    appointment_date?: dayjs.Dayjs | null;
    others_detail?: string;
    photo_upload?: UploadFile[];
    patientName?: string;
}

// helper for Upload preview
const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const TreatmentInfoPage: React.FC = () => {
    const [treatments, setTreatments] = useState<Treatment[]>([]);
    const [, setLoading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [form] = Form.useForm(); const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
    const [dynamicFileLists, setDynamicFileLists] = useState<{ [key: string]: UploadFile[] }>({});
    const [dynamicSelectedTeeth, setDynamicSelectedTeeth] = useState<{ [key: number]: string[] }>({});
    const [searchText, setSearchText] = useState<string>('');
    const [filteredTreatments, setFilteredTreatments] = useState<Treatment[]>([]);

    const toggleTooth = (index: number, num: string) => {
        setDynamicSelectedTeeth(prev => {
            const current = prev[index] || [];
            return {
                ...prev,
                [index]: current.includes(num)
                    ? current.filter(n => n !== num)
                    : [...current, num]
            };
        });
    };

    useEffect(() => {
        setLoading(true);
        // map initialTreatmentData to include patientName for table convenience (non-destructive)
        const mapped = initialTreatmentData.map(rec => {
            const patient = initialPatientData.find(p => p.patientId === rec.patientId);
            return {
                ...rec,
                patientName: patient ? `${patient.firstName} ${patient.lastName}` : undefined,
            } as Treatment;
        });
        setTimeout(() => {
            setTreatments(mapped);
            setLoading(false);
        }, 300);
    }, []);

    // when selectedPatient changes, set readonly display fields in the form
    useEffect(() => {
        if (selectedPatient) {
            // Line 118
            form.setFieldsValue({
                fullName: `${selectedPatient.title} ${selectedPatient.firstName} ${selectedPatient.lastName}`,
                age: selectedPatient.age,
                preExistingConditions: selectedPatient.preExistingConditions,
                NationalID: selectedPatient.NationalID,
                phone: selectedPatient.phone,
                allergyHistory: selectedPatient.allergyHistory,
            });
        } else {
            form.resetFields(['fullName', 'age', 'preExistingConditions', 'NationalID', 'phone', 'allergyHistory']);
        }
    }, [selectedPatient, form]);

    useEffect(() => {
        if (!editingTreatment && !selectedPatient) setIsSubmitDisabled(true);
        else setIsSubmitDisabled(false);
    }, [selectedPatient, editingTreatment]);

    const handleNationalIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const nationalId = e.target.value.trim();
        form.setFieldValue('NationalID', nationalId);
        const foundPatient = initialPatientData.find(p => p.NationalID === nationalId);
        setSelectedPatient(foundPatient || null);
        if (!editingTreatment) setIsSubmitDisabled(!foundPatient);
    };

    const handleAddClick = () => {
        setEditingTreatment(null);
        setSelectedPatient(null);
        form.resetFields();
        setDynamicFileLists({});
        setIsModalVisible(true);
        setIsSubmitDisabled(true);
    };

    const handleEditClick = (record: Treatment) => {
        setEditingTreatment(record);
        const patient = initialPatientData.find(p => p.patientId === record.patientId) || null;
        setSelectedPatient(patient);
        setIsSubmitDisabled(false);

        // prepare form values:
        const formValues: any = {
            ...record,
            NationalID: patient?.NationalID,
            fullName: patient ? `${patient.title} ${patient.firstName} ${patient.lastName}` : '',
            age: patient?.age,
            preExistingConditions: patient?.preExistingConditions,
            phone: patient?.phone,
            allergyHistory: patient?.allergyHistory,
            // convert appointment_date/date to dayjs for DatePicker form items if present
            appointment_date: record.appointment_date ? dayjs(record.appointment_date) : null,
            date: record.date ? dayjs(record.date) : null,
            // ensure treatments list in the form is in shape with all optional fields
            treatments: (record.treatments || []).map((t: DynamicTreatment, _idx: number) => ({
                treatment_name: t.treatment_name,
                price: t.price,
                scaling_stone: record.scaling_stone,
                scaling_root: record.scaling_root,
                root_canal_detail: record.root_canal_detail,
                fake_teeth_detail: record.fake_teeth_detail,
                others_detail: record.others_detail,
                notes: record.notes,
                appointment_date: record.appointment_date,
                dentist_name: record.dentist_name,
                date: record.date,
            })),
            // The following fields should not be at the top level
            // dentist_name: record.dentist_name || undefined,
            // notes: record.notes || undefined,
        };

        form.setFieldsValue(formValues);

        // restore dynamic file lists (if any exist on the record.treatments)
        const newDynamicFileLists: { [key: string]: UploadFile[] } = {};
        (record.treatments || []).forEach((t, idx) => {
            if (t.photo_upload && t.photo_upload.length) {
                newDynamicFileLists[`treatments_${idx}`] = t.photo_upload;
            }
        });
        setDynamicFileLists(newDynamicFileLists);

        // restore dynamic selected teeth per treatment
        const newDynamicSelectedTeeth: { [key: number]: string[] } = {};
        (record.treatments || []).forEach((t, idx) => {
            if (t.selected_teeth && Array.isArray(t.selected_teeth)) {
                newDynamicSelectedTeeth[idx] = t.selected_teeth;
            }
        });
        setDynamicSelectedTeeth(newDynamicSelectedTeeth);

        setIsModalVisible(true);
    };

    const handleDelete = (id: number) => {
        setTreatments(prev => prev.filter(t => t.id !== id));
        message.success('ลบข้อมูลเรียบร้อย');
    };

    const handleFormSubmit = async (values: any) => {
        try {
            let patient = selectedPatient;
            if (!patient && values.NationalID) {
                patient = initialPatientData.find(p => p.NationalID === values.NationalID) || null;
            }
            if (!patient) {
                message.error('ไม่พบข้อมูลผู้ป่วย กรุณาตรวจสอบเลขบัตรประชาชน');
                return;
            }

            // Process dynamic treatments
            const mappedDyn: DynamicTreatment[] = await Promise.all(
                (values.treatments || []).map(async (t: any, idx: number) => {
                    const fileList = dynamicFileLists[`treatments_${idx}`] || [];
                    // convert to base64 if needed
                    const filesWithBase64 = await Promise.all(
                        fileList.map(async (file) => ({
                            ...file,
                            base64: file.originFileObj ? await getBase64(file.originFileObj as File) : undefined,
                        }))
                    );
                    return {
                        treatment_name: t.treatment_name,
                        price: Number(t.price) || 0,
                        photo_upload: filesWithBase64,
                        selected_teeth: dynamicSelectedTeeth[idx] || [],
                        notes: t.notes,
                        appointment_date: t.appointment_date,
                        dentist_name: t.dentist_name,
                        date: t.date,
                    } as DynamicTreatment;
                })
            );

            const firstTreatmentItem = values.treatments ? values.treatments[0] : {};
            const newRecord: Treatment = {
                id: editingTreatment ? editingTreatment.id : Math.max(0, ...treatments.map(x => x.id)) + 1,
                patientId: patient.patientId,
                patientName: `${patient.firstName} ${patient.lastName}`,
                treatments: mappedDyn,
                dentist_name: firstTreatmentItem.dentist_name || '',
                date: firstTreatmentItem.date ?? null,
                notes: firstTreatmentItem.notes || '',
                appointment_date: firstTreatmentItem.appointment_date ?? null,
                scaling_stone: firstTreatmentItem.scaling_stone || false,
                scaling_root: firstTreatmentItem.scaling_root || false,
                root_canal_detail: firstTreatmentItem.root_canal_detail || '',
                fake_teeth_detail: firstTreatmentItem.fake_teeth_detail || '',
                others_detail: firstTreatmentItem.others_detail || '',
            };

            if (editingTreatment) {
                setTreatments(prev => prev.map(t => (t.id === editingTreatment.id ? newRecord : t)));
            } else {
                setTreatments(prev => [...prev, newRecord]);
            }

            setIsModalVisible(false);
            message.success('บันทึกข้อมูลสำเร็จ');
        } catch (err) {
            console.error(err);
            message.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview && file.originFileObj) {
            file.preview = await getBase64(file.originFileObj as File);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewTitle(file.name || '');
        setPreviewVisible(true);
    };

    const handleDynamicChange = (index: number) => ({ fileList }: { fileList: UploadFile[] }) => {
        setDynamicFileLists(prev => ({ ...prev, [`treatments_${index}`]: fileList }));
    };

    // Search/filter logic
    const applySearchFilter = () => {
        const trimmedText = searchText.trim();
        const lowerCaseSearchText = trimmedText.toLowerCase();
        const searchId = Number(trimmedText);

        if (!trimmedText) {
            setFilteredTreatments(treatments);
            return;
        }

        // If numeric, check for treatment ID
        if (!isNaN(searchId)) {
            const exactMatch = treatments.find(t => t.id === searchId);
            if (exactMatch) {
                setFilteredTreatments([exactMatch]);
                return;
            }
        }

        // Otherwise, filter by patient name, NationalID, or treatment name
        const newFiltered = treatments.filter(t => {
            const patient = initialPatientData.find(p => p.patientId === t.patientId);
            const patientName = patient ? `${patient.firstName} ${patient.lastName}` : '';
            const nationalId = patient?.NationalID || '';
            const treatmentNames = (t.treatments || []).map(tr => tr.treatment_name).join(' ');
            return (
                patientName.toLowerCase().includes(lowerCaseSearchText) ||
                nationalId.includes(lowerCaseSearchText) ||
                treatmentNames.toLowerCase().includes(lowerCaseSearchText)
            );
        });

        setFilteredTreatments(newFiltered);
    };

    useEffect(() => {
        applySearchFilter();
    }, [searchText, treatments]);


    return (
        <div style={{ padding: '16px', height: '95%', display: 'flex', flexDirection: 'column' }}>
            <Title level={2} style={{ fontWeight: 'bold', marginBottom: '20px', marginTop: '0px' }}>
                ข้อมูลการรักษา
            </Title>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 30 }}>
                <Input
                    placeholder="ค้นหาด้วยรหัสการรักษา, ชื่อผู้ป่วย, เลขบัตรประชาชน, หรือชื่อการรักษา"
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    style={{ width: 300, borderRadius: 25 }}
                    allowClear
                />
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddClick}
                    style={{
                        backgroundColor: '#B19CD9',
                        borderColor: '#B19CD9',
                        color: 'white',
                        borderRadius: 25,
                    }}
                >
                    เพิ่มการรักษา
                </Button>
            </div>
            {/* Custom table header row */}
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
                <span style={{ flex: '1 0 120px' }}>รหัสการรักษา</span>
                <span style={{ flex: '1 0 180px' }}>รหัสบัตรประชาชน</span>
                <span style={{ flex: '2 0 200px' }}>ชื่อ-นามสกุล</span>
                <span style={{ flex: '1 0 160px' }}>นัดหมายครั้งถัดไป</span>
                <span style={{ flex: '1 0 120px' }}>ราคา</span>
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
                <div style={{
                    flex: 1,
                    border: '1px solid #f0f0f0',
                    borderTop: 'none',
                    borderRadius: '0 0 4px 4px',
                    overflowY: 'auto',
                    overflowX: 'auto',
                    maxHeight: 10000,
                }}>
                    {filteredTreatments.length > 0 ? (
                        filteredTreatments.map((treatment) => {
                            const patient = initialPatientData.find(p => p.patientId === treatment.patientId);
                            const patientName = patient ? `${patient.firstName} ${patient.lastName}` : treatment.patientName || '-';
                            const nationalId = patient?.NationalID ?? '';
                            const appointmentDate = treatment.appointment_date ? dayjs(treatment.appointment_date).format('DD/MM/YYYY') : 'ไม่มี';
                            const totalPrice = treatment.treatments?.reduce((sum, cur) => sum + (cur.price || 0), 0) || 0;
                            return (
                                <div
                                    key={treatment.id}
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
                                    onClick={() => handleEditClick(treatment)}
                                >
                                    <span style={{ flex: '1 0 120px' }}>{treatment.id}</span>
                                    <span style={{ flex: '1 0 180px' }}>{nationalId}</span>
                                    <span style={{ flex: '2 0 200px' }}>{patientName}</span>
                                    <span style={{ flex: '1 0 160px' }}>{appointmentDate}</span>
                                    <span style={{ flex: '1 0 120px' }}>{totalPrice.toLocaleString()} บาท</span>
                                </div>
                            );
                        })
                    ) : (
                        <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
                            ไม่พบข้อมูลการรักษาที่ตรงกับเงื่อนไข
                        </div>
                    )}
                </div>
            </Card>
            <Modal
                title="การรักษา/ข้อมูลผู้รับบริการ"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    editingTreatment && (
                        <Popconfirm
                            key="delete"
                            title="คุณต้องการลบข้อมูลนี้หรือไม่?"
                            onConfirm={() => {
                                if (editingTreatment) handleDelete(editingTreatment.id);
                                setIsModalVisible(false);
                            }}
                            okText="ใช่"
                            cancelText="ไม่"
                        >
                            <Button type="text" danger icon={<DeleteOutlined />} style={{ color: 'red' }}>
                                ลบข้อมูล
                            </Button>
                        </Popconfirm>
                    ),
                    <Button key="back" onClick={handleCancel} style={{ borderRadius: 25, border: '1px solid #B19CD9', color: '#B19CD9' }}>
                        ย้อนกลับ
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => form.submit()} disabled={isSubmitDisabled} style={{ backgroundColor: '#B19CD9', borderColor: '#B19CD9', color: 'white', borderRadius: 25 }}>
                        บันทึกข้อมูล
                    </Button>,
                ]}
                width={800}
            >
                <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
                    {/* Patient Info */}
                    <div style={{ border: '1px solid #d9d9d9', borderRadius: 8, padding: 16, marginBottom: 24 }}>
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
                        </Row>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    name="NationalID"
                                    label="เลขบัตรประชาชน"
                                    rules={[
                                        { required: true, message: 'กรุณากรอกเลขบัตรประชาชน' },
                                        {
                                            validator: (_, value) => {
                                                if (!value) return Promise.resolve();

                                                // ตรวจสอบว่ามีใน initialPatientData ไหม
                                                const foundPatient = initialPatientData.find(
                                                    (p) => p.NationalID === value
                                                );

                                                if (!foundPatient) {
                                                    return Promise.reject(
                                                        new Error('ไม่พบหมายเลขดังกล่าว')
                                                    );
                                                }

                                                // ตรวจสอบว่ามีซ้ำกับคนอื่นไหม (เฉพาะใน treatments table)
                                                const isDuplicate = treatments.some(
                                                    (t) => {
                                                        const patient = initialPatientData.find(p => p.patientId === t.patientId);
                                                        return patient?.NationalID === value &&
                                                            t.patientId !== (editingTreatment?.patientId ?? null);
                                                    }
                                                );

                                                if (isDuplicate) {
                                                    return Promise.reject(
                                                        new Error('เลขบัตรประชาชนนี้มีอยู่แล้วในข้อมูลการรักษา')
                                                    );
                                                }

                                                // ตรวจสอบความยาว
                                                if (value.length !== 13) {
                                                    return Promise.reject(
                                                        new Error('เลขบัตรประชาชนต้องมีความยาว 13 หลัก')
                                                    );
                                                }

                                                return Promise.resolve();
                                            },
                                        },
                                    ]}
                                >
                                    <Input
                                        maxLength={13}
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        onChange={handleNationalIdChange}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item label="เบอร์โทรศัพท์" name="phone">
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="ประวัติแพ้ยา" name="allergyHistory">
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>

                    {/* Treatment Plan and Dynamic List */}
                    <div style={{ border: '1px solid #d9d9d9', borderRadius: 8, padding: 16, marginBottom: 24 }}>
                        <Title level={4}>แผนการรักษา</Title>


                        <Form.List name="treatments">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }, index) => (
                                        <div key={key} style={{ border: '1px dashed #d9d9d9', padding: 16, marginBottom: 16 }}>
                                            <Row gutter={16}>
                                                <Col span={10}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'treatment_name']}
                                                        label="ชื่อการรักษา"
                                                        rules={[{ required: true, message: 'กรุณาเลือกชื่อการรักษา' }]}
                                                    >
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
                                                            style={{ width: '100%' }}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={10}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'price']}
                                                        label="ราคารวม"
                                                        rules={[{ required: true, message: 'กรุณาใส่ราคารวม' }]}
                                                    >
                                                        <InputNumber
                                                            style={{ width: '100%' }}
                                                            min={0}
                                                            formatter={(value?: number | string) =>
                                                                value === undefined || value === null || value === ''
                                                                    ? ''
                                                                    : String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                            }
                                                            parser={(displayValue?: string) => {
                                                                if (!displayValue) return 0;
                                                                const cleaned = displayValue.toString().replace(/,/g, '');
                                                                const n = Number(cleaned);
                                                                return Number.isFinite(n) ? n : 0;
                                                            }}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={4} style={{ display: 'flex', alignItems: 'center', marginTop: 24 }}>
                                                    <Button
                                                        type="dashed"
                                                        danger
                                                        onClick={() => {
                                                            remove(name);
                                                            const newDynamicFileLists = { ...dynamicFileLists };
                                                            delete newDynamicFileLists[`treatments_${index}`];
                                                            setDynamicFileLists(newDynamicFileLists);
                                                        }}
                                                        icon={<DeleteOutlined />}
                                                    />
                                                </Col>
                                            </Row>
                                            {/* 4 Quadrants for อุดฟัน/ถอนฟัน */}
                                            <Row gutter={16}>
                                                <Col span={24}>
                                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 12 }}>
                                                        {/* ซ้ายบน */}
                                                        <div style={{ flex: "1 1 45%", border: "1px solid #d9d9d9", borderRadius: 8, padding: 8 }}>
                                                            <div style={{ fontWeight: "bold", marginBottom: 4 }}>ซ้ายบน</div>
                                                            <div style={{ display: "flex", justifyContent: "center" }}>
                                                                {["8", "7", "6", "5", "4", "3", "2", "1"].map((num) => (
                                                                    <span
                                                                        key={`LU-${num}`}
                                                                        onClick={() => toggleTooth(index, `LU-${num}`)}
                                                                        style={{
                                                                            cursor: "pointer",
                                                                            padding: "4px 8px",
                                                                            margin: "0 2px",
                                                                            border: "1px solid #d9d9d9",
                                                                            borderRadius: 4,
                                                                            background: (dynamicSelectedTeeth[index] || []).includes(`LU-${num}`) ? "#B19CD9" : "white",
                                                                            color: (dynamicSelectedTeeth[index] || []).includes(`LU-${num}`) ? "white" : "black",
                                                                            userSelect: "none",
                                                                        }}
                                                                    >
                                                                        {num}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        {/* ขวาบน */}
                                                        <div style={{ flex: "1 1 45%", border: "1px solid #d9d9d9", borderRadius: 8, padding: 8 }}>
                                                            <div style={{ fontWeight: "bold", marginBottom: 4 }}>ขวาบน</div>
                                                            <div style={{ display: "flex", justifyContent: "center" }}>
                                                                {["1", "2", "3", "4", "5", "6", "7", "8"].map((num) => (
                                                                    <span
                                                                        key={`RU-${num}`}
                                                                        onClick={() => toggleTooth(index, `RU-${num}`)}
                                                                        style={{
                                                                            cursor: "pointer",
                                                                            padding: "4px 8px",
                                                                            margin: "0 2px",
                                                                            border: "1px solid #d9d9d9",
                                                                            borderRadius: 4,
                                                                            background: (dynamicSelectedTeeth[index] || []).includes(`RU-${num}`) ? "#B19CD9" : "white",
                                                                            color: (dynamicSelectedTeeth[index] || []).includes(`RU-${num}`) ? "white" : "black",
                                                                            userSelect: "none",
                                                                        }}
                                                                    >
                                                                        {num}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        {/* ซ้ายล่าง */}
                                                        <div style={{ flex: "1 1 45%", border: "1px solid #d9d9d9", borderRadius: 8, padding: 8 }}>
                                                            <div style={{ fontWeight: "bold", marginBottom: 4 }}>ซ้ายล่าง</div>
                                                            <div style={{ display: "flex", justifyContent: "center" }}>
                                                                {["8", "7", "6", "5", "4", "3", "2", "1"].map((num) => (
                                                                    <span
                                                                        key={`LL-${num}`}
                                                                        onClick={() => toggleTooth(index, `LL-${num}`)}
                                                                        style={{
                                                                            cursor: "pointer",
                                                                            padding: "4px 8px",
                                                                            margin: "0 2px",
                                                                            border: "1px solid #d9d9d9",
                                                                            borderRadius: 4,
                                                                            background: (dynamicSelectedTeeth[index] || []).includes(`LL-${num}`) ? "#B19CD9" : "white",
                                                                            color: (dynamicSelectedTeeth[index] || []).includes(`LL-${num}`) ? "white" : "black",
                                                                            userSelect: "none",
                                                                        }}
                                                                    >
                                                                        {num}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        {/* ขวาล่าง */}
                                                        <div style={{ flex: "1 1 45%", border: "1px solid #d9d9d9", borderRadius: 8, padding: 8 }}>
                                                            <div style={{ fontWeight: "bold", marginBottom: 4 }}>ขวาล่าง</div>
                                                            <div style={{ display: "flex", justifyContent: "center" }}>
                                                                {["1", "2", "3", "4", "5", "6", "7", "8"].map((num) => (
                                                                    <span
                                                                        key={`LR-${num}`}
                                                                        onClick={() => toggleTooth(index, `LR-${num}`)}
                                                                        style={{
                                                                            cursor: "pointer",
                                                                            padding: "4px 8px",
                                                                            margin: "0 2px",
                                                                            border: "1px solid #d9d9d9",
                                                                            borderRadius: 4,
                                                                            background: (dynamicSelectedTeeth[index] || []).includes(`LR-${num}`) ? "#B19CD9" : "white",
                                                                            color: (dynamicSelectedTeeth[index] || []).includes(`LR-${num}`) ? "white" : "black",
                                                                            userSelect: "none",
                                                                        }}
                                                                    >
                                                                        {num}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row gutter={10}>
                                                <Col span={23}>
                                                    <Form.Item {...restField} name={[name, 'notes']} label="หมายเหตุ">
                                                        <TextArea rows={6} />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row gutter={16}>
                                                <Col span={7}>
                                                    <Form.Item {...restField} name={[name, 'appointment_date']} label="กรณีมีนัดหมายต่อเนื่อง">
                                                        <DatePicker style={{ width: '100%' }} />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row gutter={16} style={{ marginTop: -10 }}>
                                                <Col span={10}>
                                                    <Form.Item {...restField} name={[name, 'dentist_name']} label="ลงชื่อทันตแพทย์">
                                                        <Input />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row gutter={16} style={{ marginTop: -10 }}>
                                                <Col span={10}>
                                                    <Form.Item {...restField} name={[name, 'date']} label="วันที่ลงชื่อ">
                                                        <DatePicker style={{ width: '100%' }} />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Form.Item label="อัปโหลดรูปภาพ">
                                                <Upload
                                                    listType="picture-card"
                                                    fileList={dynamicFileLists[`treatments_${index}`] || []}
                                                    onPreview={handlePreview}
                                                    onChange={handleDynamicChange(index)}
                                                    beforeUpload={() => false}
                                                    multiple
                                                    maxCount={5}
                                                    accept="image/*"
                                                    style={{ width: 80, height: 80 }}
                                                >
                                                    {(dynamicFileLists[`treatments_${index}`]?.length || 0) >= 5 ? null : (
                                                        <div style={{ color: '#8c8c8c', fontSize: 12 }}>
                                                            <PlusOutlined style={{ fontSize: 18 }} />
                                                            <div style={{ marginTop: 4 }}>อัปโหลด</div>
                                                        </div>
                                                    )}
                                                </Upload>
                                            </Form.Item>


                                        </div>
                                    ))}

                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>เพิ่มการรักษา</Button>
                                    </Form.Item>
                                </>
                            )}


                        </Form.List>
                    </div>


                </Form>
            </Modal>
            <Modal open={previewVisible} title={previewTitle} footer={null} onCancel={() => setPreviewVisible(false)}>
                <img alt="preview" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </div>
    ); 0
};

export default TreatmentInfoPage;