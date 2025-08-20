// TreatmentInfoPage.tsx
import React, { useEffect, useState } from 'react';
import {
    Card,
    Table,
    Button,
    Typography,
    Modal,
    Form,
    Input,
    message,
    Popconfirm,
    Row,
    Col,
    DatePicker,
    Upload,
    InputNumber,
    Checkbox,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/lib/upload/interface';
import dayjs from 'dayjs';

import { initialPatientData, initialTreatmentData } from './Data';

const { Title } = Typography;
const { Search, TextArea } = Input;

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
    treatment_name: string;
    photo_upload?: UploadFile[];
    price: number;
    notes?: string;
    dentist_name?: string;
    date?: dayjs.Dayjs | null;
    scaling_stone?: boolean;
    scaling_root?: boolean;
    root_canal_detail?: string;
    fake_teeth_detail?: string;
    others_detail?: string;
}

interface Treatment {
    id: number;
    patientId: number;
    // other optional fields from your Data.tsx records:
    treatmentName?: string;
    description?: string;
    treatments?: DynamicTreatment[];
    dentist_name?: string;
    date?: dayjs.Dayjs | null;
    notes?: string;
    appointment_date?: dayjs.Dayjs | null; // <-- top-level appointment
    scaling_stone?: boolean;
    scaling_root?: boolean;
    root_canal_detail?: string;
    fake_teeth_detail?: string;
    others_detail?: string;
    photo_upload?: UploadFile[];
    // optional "derived" name for table convenience
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

const normFile = (e: any) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
};

const TreatmentInfoPage: React.FC = () => {
    const [treatments, setTreatments] = useState<Treatment[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [form] = Form.useForm();
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);

    // store fileLists per dynamic treatment index while editing
    const [dynamicFileLists, setDynamicFileLists] = useState<{ [key: string]: UploadFile[] }>({});

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
            // convert top-level appointment_date/date to dayjs for DatePicker form items if present
            appointment_date: record.appointment_date ? dayjs(record.appointment_date) : null,
            date: record.date ? dayjs(record.date) : null,
            // ensure treatments list in the form is in shape with per-item fields (but NO per-item appointment_date)
            treatments: (record.treatments || []).map((t: DynamicTreatment, idx: number) => ({
                treatment_name: t.treatment_name,
                price: t.price,
                scaling_stone: t.scaling_stone || false,
                scaling_root: t.scaling_root || false,
                root_canal_detail: t.root_canal_detail || '',
                fake_teeth_detail: t.fake_teeth_detail || '',
                others_detail: t.others_detail || '',
                notes: t.notes || undefined,
                dentist_name: t.dentist_name || undefined,
                date: t.date ? dayjs(t.date) : null,
                // photo_upload is restored via dynamicFileLists below
            })),
        };

        form.setFieldsValue(formValues);

        // restore dynamic file lists (if any exist on the record.treatments)
        const newDynamicFileLists: { [key: string]: UploadFile[] } = {};
        (record.treatments || []).forEach((t, idx) => {
            if (t.photo_upload && t.photo_upload.length) {
                // if stored as UploadFile-like objects already, keep; if strings, convert
                const arr = t.photo_upload.map((f: any, i: number) => {
                    if (typeof f === 'string') {
                        return {
                            uid: `remote-${idx}-${i}`,
                            name: f.split('/').pop(),
                            status: 'done',
                            url: f,
                        } as UploadFile;
                    } else {
                        return {
                            uid: f.uid ?? `remote-${idx}-${i}`,
                            name: f.name ?? (f.url ? f.url.split('/').pop() : `file-${i}`),
                            status: (f.status as any) || 'done',
                            url: f.url || f.thumbUrl || undefined,
                        } as UploadFile;
                    }
                });
                newDynamicFileLists[`treatments_${idx}`] = arr;
            }
        });
        setDynamicFileLists(newDynamicFileLists);

        setIsModalVisible(true);
    };

    const handleDelete = (id: number) => {
        setTreatments(prev => prev.filter(t => t.id !== id));
        message.success('ลบข้อมูลเรียบร้อย');
    };

    const handleFormSubmit = async (values: any) => {
        try {
            // either selectedPatient (from NationalID) or try to find from form NationalID
            let patient = selectedPatient;
            if (!patient && values.NationalID) {
                patient = initialPatientData.find(p => p.NationalID === values.NationalID) || null;
            }

            if (!patient) {
                message.error('ไม่พบข้อมูลผู้ป่วย กรุณาตรวจสอบเลขบัตรประชาชน');
                return;
            }

            // map dynamic treatments and attach file lists (photo_upload from dynamicFileLists)
            const mappedDyn: DynamicTreatment[] = (values.treatments || []).map((t: any, idx: number) => ({
                treatment_name: t.treatment_name,
                price: Number(t.price) || 0,
                photo_upload: dynamicFileLists[`treatments_${idx}`] || [],
                notes: t.notes,
                dentist_name: t.dentist_name,
                date: t.date ? dayjs(t.date) : null,
                scaling_stone: !!t.scaling_stone,
                scaling_root: !!t.scaling_root,
                root_canal_detail: t.root_canal_detail || '',
                fake_teeth_detail: t.fake_teeth_detail || '',
                others_detail: t.others_detail || '',
            }));

            // read the top-level appointment_date (moved out from per-item)
            const topAppointment = values.appointment_date ?? null;

            const newRecord: Treatment = {
                id: editingTreatment ? editingTreatment.id : Math.max(0, ...treatments.map(x => x.id)) + 1,
                patientId: patient.patientId,
                patientName: `${patient.firstName} ${patient.lastName}`,
                treatments: mappedDyn,
                dentist_name: values.dentist_name || '',
                date: values.date ?? null,
                notes: values.notes || '',
                appointment_date: topAppointment,
                scaling_stone: values.scaling_stone || false,
                scaling_root: values.scaling_root || false,
                root_canal_detail: values.root_canal_detail || '',
                fake_teeth_detail: values.fake_teeth_detail || '',
                others_detail: values.others_detail || '',
            };

            if (editingTreatment) {
                setTreatments(prev => prev.map(t => (t.id === editingTreatment.id ? newRecord : t)));
            } else {
                setTreatments(prev => [...prev, newRecord]);
            }

            setIsModalVisible(false);
            form.resetFields();
            setDynamicFileLists({});
            setSelectedPatient(null);
            setEditingTreatment(null);
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

    const columns = [
        {
            title: 'รหัสการรักษา',
            dataIndex: 'id',
            key: 'id',
            sorter: (a: Treatment, b: Treatment) => a.id - b.id,
        },
        {
            title: 'รหัสบัตรประชาชน',
            key: 'NationalID',
            render: (_: any, record: Treatment) => {
                const p = initialPatientData.find(pp => pp.patientId === record.patientId);
                return p?.NationalID ?? '';
            },
            sorter: (a: Treatment, b: Treatment) => {
                const pa = initialPatientData.find(pp => pp.patientId === a.patientId);
                const pb = initialPatientData.find(pp => pp.patientId === b.patientId);
                return (pa?.NationalID || '').localeCompare(pb?.NationalID || '');
            },
        },
        {
            title: 'ชื่อ-นามสกุล',
            key: 'patientName',
            render: (_: any, record: Treatment) => {
                const p = initialPatientData.find(pp => pp.patientId === record.patientId);
                return p ? `${p.firstName} ${p.lastName}` : record.patientName || '-';
            },
            sorter: (a: Treatment, b: Treatment) => {
                const pa = initialPatientData.find(pp => pp.patientId === a.patientId);
                const pb = initialPatientData.find(pp => pp.patientId === b.patientId);
                return (pa?.firstName || '').localeCompare(pb?.firstName || '');
            },
        },
        {
            title: 'นัดหมายครั้งถัดไป',
            dataIndex: 'appointment_date',
            key: 'appointment_date',
            render: (date: any) => (date ? dayjs(date).format('DD/MM/YYYY') : 'ไม่มี'),
        },
        {
            title: 'ราคา',
            key: 'totalPrice',
            render: (_: any, record: Treatment) => {
                const totalPrice = record.treatments?.reduce((sum, cur) => sum + (cur.price || 0), 0) || 0;
                return `${totalPrice.toLocaleString()} บาท`;
            },
            sorter: (a: Treatment, b: Treatment) => {
                const pa = a.treatments?.reduce((sum, cur) => sum + (cur.price || 0), 0) || 0;
                const pb = b.treatments?.reduce((sum, cur) => sum + (cur.price || 0), 0) || 0;
                return pa - pb;
            },
        },
    ];

    return (
        <div style={{ padding: 16 }}>
            <Title level={2}>ข้อมูลการรักษา</Title>

            <Card style={{ borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Search placeholder="ค้นหาชื่อการรักษา" allowClear style={{ width: 300 }} />
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

                <Table
                    columns={columns}
                    dataSource={treatments}
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    onRow={(record) => ({
                        onClick: () => handleEditClick(record),
                    })}
                    scroll={{ y: 500, x: 'max-content' }}
                />
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
                width={900}
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
                                    rules={[{ required: true, message: 'กรุณากรอกเลขบัตรประชาชน' }]}
                                >
                                    <Input onChange={handleNationalIdChange} />
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

                    {/* Treatment Plan (top-level appointment_date moved here) */}
                    <div style={{ border: '1px solid #d9d9d9', borderRadius: 8, padding: 16, marginBottom: 24 }}>
                        <Title level={4}>แผนการรักษา</Title>

                        {/* top-level appointment date now */}
                        <Row gutter={16} style={{ marginBottom: 12 }}>
                            <Col span={7}>
                                <Form.Item name="appointment_date" label="กรณีมีนัดหมายต่อเนื่อง">
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.List name="treatments">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }, index) => (
                                        <div key={key} style={{ border: '1px dashed #d9d9d9', padding: 16, marginBottom: 16 }}>
                                            <Row gutter={16}>
                                                <Col span={10}>
                                                    <Form.Item {...restField} name={[name, 'treatment_name']} label="ชื่อการรักษา" rules={[{ required: true, message: 'กรุณาใส่ชื่อการรักษา' }]}>
                                                        <Input placeholder="ชื่อการรักษา" />
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
                                                            // formatter: show commas for thousands (must return string)
                                                            formatter={(value?: number | string) =>
                                                                value === undefined || value === null || value === ''
                                                                    ? ''
                                                                    : String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                            }
                                                            // parser: remove commas and return a number (must return number)
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
                                            <Row gutter={16}>
                                                <Col span={12}>
                                                    <Form.Item {...restField} name={[name, 'scaling_stone']} valuePropName="checked">
                                                        <Checkbox>ขูดหินน้ำลาย</Checkbox>
                                                    </Form.Item>
                                                    <Form.Item {...restField} name={[name, 'scaling_root']} valuePropName="checked">
                                                        <Checkbox>เกรารากฟัน</Checkbox>
                                                    </Form.Item>
                                                    <Form.Item {...restField} name={[name, 'root_canal_detail']} label="รักษารากฟัน(ระบุ)">
                                                        <Input />
                                                    </Form.Item>
                                                    <Form.Item {...restField} name={[name, 'fake_teeth_detail']} label="ใส่ฟันเทียมทดแทน">
                                                        <Input />
                                                    </Form.Item>
                                                    <Form.Item {...restField} name={[name, 'others_detail']} label="อื่นๆ">
                                                        <Input />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={12}>
                                                    <div style={{ border: '1px solid #d9d9d9', borderRadius: 5, padding: 10, marginTop: 80 }}>
                                                        {/* Visual tooth grids (kept as static in your layout) */}
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <span style={{ fontWeight: 'bold', marginRight: 16 }}>ถอนฟัน</span>
                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                <div style={{ display: 'flex' }}>
                                                                    <span style={{ borderBottom: '1px solid #d9d9d9', borderRight: '1px solid #d9d9d9', padding: '0 8px 4px 0' }}>8 7 6 5 4 3 2 1</span>
                                                                    <span style={{ borderBottom: '1px solid #d9d9d9', padding: '0 0 4px 8px' }}>1 2 3 4 5 6 7 8</span>
                                                                </div>
                                                                <div style={{ display: 'flex' }}>
                                                                    <span style={{ borderRight: '1px solid #d9d9d9', padding: '4px 8px 0 0' }}>8 7 6 5 4 3 2 1</span>
                                                                    <span style={{ padding: '4px 0 0 8px' }}>1 2 3 4 5 6 7 8</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', marginTop: 40 }}>
                                                            <span style={{ fontWeight: 'bold', marginRight: 28 }}>อุดฟัน</span>
                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                <div style={{ display: 'flex' }}>
                                                                    <span style={{ borderBottom: '1px solid #d9d9d9', borderRight: '1px solid #d9d9d9', padding: '0 8px 4px 0' }}>8 7 6 5 4 3 2 1</span>
                                                                    <span style={{ borderBottom: '1px solid #d9d9d9', padding: '0 0 4px 8px' }}>1 2 3 4 5 6 7 8</span>
                                                                </div>
                                                                <div style={{ display: 'flex' }}>
                                                                    <span style={{ borderRight: '1px solid #d9d9d9', padding: '4px 8px 0 0' }}>8 7 6 5 4 3 2 1</span>
                                                                    <span style={{ padding: '4px 0 0 8px' }}>1 2 3 4 5 6 7 8</span>
                                                                </div>
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

                                            <Form.Item {...restField} name={[name, 'photo_upload']} label="อัปโหลดรูปภาพ" valuePropName="fileList" getValueFromEvent={normFile}>
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
    );
};

export default TreatmentInfoPage;
