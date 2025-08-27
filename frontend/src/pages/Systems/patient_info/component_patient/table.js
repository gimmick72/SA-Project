import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Table } from 'antd';
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { Link } from 'react-router-dom'; // อย่าลืม import Link ด้วย!
const columns = [
    {
        title: 'รหัส',
        dataIndex: 'patient_id',
        key: 'patient_id',
        width: 100,
        render: (text) => _jsx("a", { children: text }),
    },
    {
        title: 'ชื่อ',
        dataIndex: 'first_name',
        key: 'first_name',
        width: 150,
    },
    {
        title: 'นามสกุล',
        dataIndex: 'last_name',
        key: 'last_name',
        width: 150,
    },
    {
        title: 'เบอร์โทรศัพท์',
        dataIndex: 'phone_number',
        key: 'phone_number',
        width: 180,
    },
    {
        title: 'Action',
        key: 'action',
        width: 280,
        render: (_, record) => (_jsxs("div", { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' }, children: [_jsx(Link, { to: "/patient/initial", children: _jsx("button", { type: "button", style: {
                            backgroundColor: '#BBE6F9',
                            color: 'black',
                            border: 'none',
                            borderRadius: '13px',
                            cursor: 'pointer',
                            padding: '4px 8px',
                        }, children: "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23" }) }), _jsx("button", { type: "button", style: {
                        backgroundColor: '#F9F9BB',
                        color: 'black',
                        border: 'none',
                        borderRadius: '13px',
                        cursor: 'pointer',
                        padding: '4px 8px',
                    }, children: "\u0E14\u0E39\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14" }), _jsx(FaRegEdit, { style: { color: 'black', cursor: 'pointer' } }), _jsx(MdDeleteOutline, { style: { color: 'red', cursor: 'pointer' } })] })),
    },
];
const data = [
    {
        key: '1',
        patient_id: 'P001',
        first_name: 'John',
        last_name: 'Brown',
        phone_number: '0812345678',
    },
    {
        key: '2',
        patient_id: 'P002',
        first_name: 'Jim',
        last_name: 'Green',
        phone_number: '0898765432',
    },
    {
        key: '3',
        patient_id: 'P003',
        first_name: 'Joe',
        last_name: 'Black',
        phone_number: '0888888888',
    },
    {
        key: '4',
        patient_id: 'P004',
        first_name: 'Jane',
        last_name: 'Doe',
        phone_number: '0876543210',
    },
];
const CustomTable = () => (_jsx("div", { style: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        overflowX: 'auto',
    }, children: _jsx(Table, { columns: columns, dataSource: data, scroll: { x: 'max-content' }, pagination: false, bordered: true }) }));
export default CustomTable;
