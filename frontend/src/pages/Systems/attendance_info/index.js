var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Card, Table, Button, Modal, Form, Input, DatePicker, TimePicker, Select, Space, Tag, Typography, Row, Col, Statistic } from "antd";
import { PlusOutlined, ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const AttendanceInfoPage = () => {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    // Mock data
    const [attendanceData, setAttendanceData] = useState([
        {
            id: '1',
            staffId: 'ST001',
            staffName: 'นายสมชาย ใจดี',
            position: 'ทันตแพทย์',
            date: '2024-08-26',
            checkIn: '08:00',
            checkOut: '17:00',
            workHours: 9,
            status: 'present',
            notes: ''
        },
        {
            id: '2',
            staffId: 'ST002',
            staffName: 'นางสาวมาลี สวยงาม',
            position: 'พยาบาล',
            date: '2024-08-26',
            checkIn: '08:15',
            checkOut: '17:00',
            workHours: 8.75,
            status: 'late',
            notes: 'สาย 15 นาที'
        },
        {
            id: '3',
            staffId: 'ST003',
            staffName: 'นายวิชัย ขยันทำงาน',
            position: 'เจ้าหน้าที่',
            date: '2024-08-26',
            checkIn: '08:00',
            checkOut: '',
            workHours: 0,
            status: 'present',
            notes: 'ยังไม่ออกงาน'
        }
    ]);
    const columns = [
        {
            title: 'รหัสพนักงาน',
            dataIndex: 'staffId',
            key: 'staffId',
            width: 120,
        },
        {
            title: 'ชื่อ-นามสกุล',
            dataIndex: 'staffName',
            key: 'staffName',
            width: 180,
        },
        {
            title: 'ตำแหน่ง',
            dataIndex: 'position',
            key: 'position',
            width: 120,
        },
        {
            title: 'วันที่',
            dataIndex: 'date',
            key: 'date',
            width: 120,
            render: (date) => dayjs(date).format('DD/MM/YYYY'),
        },
        {
            title: 'เวลาเข้างาน',
            dataIndex: 'checkIn',
            key: 'checkIn',
            width: 100,
        },
        {
            title: 'เวลาออกงาน',
            dataIndex: 'checkOut',
            key: 'checkOut',
            width: 100,
            render: (checkOut) => checkOut || '-',
        },
        {
            title: 'ชั่วโมงทำงาน',
            dataIndex: 'workHours',
            key: 'workHours',
            width: 120,
            render: (hours) => hours ? `${hours} ชม.` : '-',
        },
        {
            title: 'สถานะ',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => {
                const statusConfig = {
                    present: { color: 'green', text: 'มาทำงาน' },
                    late: { color: 'orange', text: 'มาสาย' },
                    absent: { color: 'red', text: 'ขาดงาน' },
                    'half-day': { color: 'blue', text: 'ครึ่งวัน' }
                };
                const config = statusConfig[status];
                return _jsx(Tag, { color: config.color, children: config.text });
            },
        },
        {
            title: 'หมายเหตุ',
            dataIndex: 'notes',
            key: 'notes',
            render: (notes) => notes || '-',
        },
        {
            title: 'จัดการ',
            key: 'action',
            width: 100,
            render: (_, record) => (_jsx(Button, { type: "link", onClick: () => handleEdit(record), children: "\u0E41\u0E01\u0E49\u0E44\u0E02" })),
        },
    ];
    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalVisible(true);
    };
    const handleEdit = (record) => {
        setEditingRecord(record);
        form.setFieldsValue(Object.assign(Object.assign({}, record), { date: dayjs(record.date), checkIn: record.checkIn ? dayjs(record.checkIn, 'HH:mm') : null, checkOut: record.checkOut ? dayjs(record.checkOut, 'HH:mm') : null }));
        setIsModalVisible(true);
    };
    const handleSubmit = (values) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const newRecord = {
            id: (editingRecord === null || editingRecord === void 0 ? void 0 : editingRecord.id) || Date.now().toString(),
            staffId: values.staffId,
            staffName: values.staffName,
            position: values.position,
            date: values.date.format('YYYY-MM-DD'),
            checkIn: ((_a = values.checkIn) === null || _a === void 0 ? void 0 : _a.format('HH:mm')) || '',
            checkOut: ((_b = values.checkOut) === null || _b === void 0 ? void 0 : _b.format('HH:mm')) || '',
            workHours: values.checkIn && values.checkOut ?
                dayjs(values.checkOut.format('HH:mm'), 'HH:mm').diff(dayjs(values.checkIn.format('HH:mm'), 'HH:mm'), 'hour', true) : 0,
            status: values.status,
            notes: values.notes || ''
        };
        if (editingRecord) {
            setAttendanceData(prev => prev.map(item => item.id === editingRecord.id ? newRecord : item));
        }
        else {
            setAttendanceData(prev => [...prev, newRecord]);
        }
        setIsModalVisible(false);
        form.resetFields();
    });
    // Calculate statistics
    const totalStaff = attendanceData.length;
    const presentStaff = attendanceData.filter(record => record.status === 'present' || record.status === 'late').length;
    const lateStaff = attendanceData.filter(record => record.status === 'late').length;
    const absentStaff = attendanceData.filter(record => record.status === 'absent').length;
    return (_jsxs("div", { style: { padding: '24px' }, children: [_jsxs(Title, { level: 2, children: [_jsx(ClockCircleOutlined, {}), " \u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E01\u0E32\u0E23\u0E40\u0E02\u0E49\u0E32\u0E07\u0E32\u0E19"] }), _jsxs(Row, { gutter: 16, style: { marginBottom: '24px' }, children: [_jsx(Col, { span: 6, children: _jsx(Card, { children: _jsx(Statistic, { title: "\u0E1E\u0E19\u0E31\u0E01\u0E07\u0E32\u0E19\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14", value: totalStaff, prefix: _jsx(UserOutlined, {}), valueStyle: { color: '#1890ff' } }) }) }), _jsx(Col, { span: 6, children: _jsx(Card, { children: _jsx(Statistic, { title: "\u0E21\u0E32\u0E17\u0E33\u0E07\u0E32\u0E19", value: presentStaff, valueStyle: { color: '#52c41a' } }) }) }), _jsx(Col, { span: 6, children: _jsx(Card, { children: _jsx(Statistic, { title: "\u0E21\u0E32\u0E2A\u0E32\u0E22", value: lateStaff, valueStyle: { color: '#faad14' } }) }) }), _jsx(Col, { span: 6, children: _jsx(Card, { children: _jsx(Statistic, { title: "\u0E02\u0E32\u0E14\u0E07\u0E32\u0E19", value: absentStaff, valueStyle: { color: '#f5222d' } }) }) })] }), _jsxs(Card, { children: [_jsxs("div", { style: { marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsxs(Space, { children: [_jsx(RangePicker, { placeholder: ['วันที่เริ่มต้น', 'วันที่สิ้นสุด'] }), _jsxs(Select, { placeholder: "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E2A\u0E16\u0E32\u0E19\u0E30", style: { width: 120 }, allowClear: true, children: [_jsx(Option, { value: "present", children: "\u0E21\u0E32\u0E17\u0E33\u0E07\u0E32\u0E19" }), _jsx(Option, { value: "late", children: "\u0E21\u0E32\u0E2A\u0E32\u0E22" }), _jsx(Option, { value: "absent", children: "\u0E02\u0E32\u0E14\u0E07\u0E32\u0E19" }), _jsx(Option, { value: "half-day", children: "\u0E04\u0E23\u0E36\u0E48\u0E07\u0E27\u0E31\u0E19" })] })] }), _jsx(Button, { type: "primary", icon: _jsx(PlusOutlined, {}), onClick: handleAdd, children: "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E01\u0E32\u0E23\u0E40\u0E02\u0E49\u0E32\u0E07\u0E32\u0E19" })] }), _jsx(Table, { columns: columns, dataSource: attendanceData, rowKey: "id", pagination: {
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) => `${range[0]}-${range[1]} จาก ${total} รายการ`,
                        }, scroll: { x: 1200 } })] }), _jsx(Modal, { title: editingRecord ? 'แก้ไขการเข้างาน' : 'บันทึกการเข้างาน', open: isModalVisible, onCancel: () => setIsModalVisible(false), footer: null, width: 600, children: _jsxs(Form, { form: form, layout: "vertical", onFinish: handleSubmit, children: [_jsxs(Row, { gutter: 16, children: [_jsx(Col, { span: 12, children: _jsx(Form.Item, { name: "staffId", label: "\u0E23\u0E2B\u0E31\u0E2A\u0E1E\u0E19\u0E31\u0E01\u0E07\u0E32\u0E19", rules: [{ required: true, message: 'กรุณาระบุรหัสพนักงาน' }], children: _jsx(Input, { placeholder: "ST001" }) }) }), _jsx(Col, { span: 12, children: _jsx(Form.Item, { name: "staffName", label: "\u0E0A\u0E37\u0E48\u0E2D-\u0E19\u0E32\u0E21\u0E2A\u0E01\u0E38\u0E25", rules: [{ required: true, message: 'กรุณาระบุชื่อ-นามสกุล' }], children: _jsx(Input, { placeholder: "\u0E19\u0E32\u0E22\u0E2A\u0E21\u0E0A\u0E32\u0E22 \u0E43\u0E08\u0E14\u0E35" }) }) })] }), _jsxs(Row, { gutter: 16, children: [_jsx(Col, { span: 12, children: _jsx(Form.Item, { name: "position", label: "\u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07", rules: [{ required: true, message: 'กรุณาระบุตำแหน่ง' }], children: _jsxs(Select, { placeholder: "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07", children: [_jsx(Option, { value: "\u0E17\u0E31\u0E19\u0E15\u0E41\u0E1E\u0E17\u0E22\u0E4C", children: "\u0E17\u0E31\u0E19\u0E15\u0E41\u0E1E\u0E17\u0E22\u0E4C" }), _jsx(Option, { value: "\u0E1E\u0E22\u0E32\u0E1A\u0E32\u0E25", children: "\u0E1E\u0E22\u0E32\u0E1A\u0E32\u0E25" }), _jsx(Option, { value: "\u0E40\u0E08\u0E49\u0E32\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48", children: "\u0E40\u0E08\u0E49\u0E32\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48" }), _jsx(Option, { value: "\u0E41\u0E21\u0E48\u0E1A\u0E49\u0E32\u0E19", children: "\u0E41\u0E21\u0E48\u0E1A\u0E49\u0E32\u0E19" })] }) }) }), _jsx(Col, { span: 12, children: _jsx(Form.Item, { name: "date", label: "\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48", rules: [{ required: true, message: 'กรุณาเลือกวันที่' }], children: _jsx(DatePicker, { style: { width: '100%' } }) }) })] }), _jsxs(Row, { gutter: 16, children: [_jsx(Col, { span: 8, children: _jsx(Form.Item, { name: "checkIn", label: "\u0E40\u0E27\u0E25\u0E32\u0E40\u0E02\u0E49\u0E32\u0E07\u0E32\u0E19", rules: [{ required: true, message: 'กรุณาระบุเวลาเข้างาน' }], children: _jsx(TimePicker, { format: "HH:mm", style: { width: '100%' } }) }) }), _jsx(Col, { span: 8, children: _jsx(Form.Item, { name: "checkOut", label: "\u0E40\u0E27\u0E25\u0E32\u0E2D\u0E2D\u0E01\u0E07\u0E32\u0E19", children: _jsx(TimePicker, { format: "HH:mm", style: { width: '100%' } }) }) }), _jsx(Col, { span: 8, children: _jsx(Form.Item, { name: "status", label: "\u0E2A\u0E16\u0E32\u0E19\u0E30", rules: [{ required: true, message: 'กรุณาเลือกสถานะ' }], children: _jsxs(Select, { placeholder: "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E2A\u0E16\u0E32\u0E19\u0E30", children: [_jsx(Option, { value: "present", children: "\u0E21\u0E32\u0E17\u0E33\u0E07\u0E32\u0E19" }), _jsx(Option, { value: "late", children: "\u0E21\u0E32\u0E2A\u0E32\u0E22" }), _jsx(Option, { value: "absent", children: "\u0E02\u0E32\u0E14\u0E07\u0E32\u0E19" }), _jsx(Option, { value: "half-day", children: "\u0E04\u0E23\u0E36\u0E48\u0E07\u0E27\u0E31\u0E19" })] }) }) })] }), _jsx(Form.Item, { name: "notes", label: "\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E2B\u0E15\u0E38", children: _jsx(Input.TextArea, { rows: 3, placeholder: "\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E2B\u0E15\u0E38\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E40\u0E15\u0E34\u0E21..." }) }), _jsx(Form.Item, { style: { marginBottom: 0, textAlign: 'right' }, children: _jsxs(Space, { children: [_jsx(Button, { onClick: () => setIsModalVisible(false), children: "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01" }), _jsx(Button, { type: "primary", htmlType: "submit", children: editingRecord ? 'บันทึกการแก้ไข' : 'บันทึก' })] }) })] }) })] }));
};
export default AttendanceInfoPage;
