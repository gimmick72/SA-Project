import { jsx as _jsx } from "react/jsx-runtime";
import { Card, Table } from 'antd';
const columns = [
    {
        title: 'วันที่เข้ารับบริการ',
        dataIndex: 'visitDate',
        render: (text) => _jsx("a", { children: text }),
    },
    {
        title: 'บริการ',
        dataIndex: 'service',
    },
];
const data = [
    {
        key: '1',
        visitDate: '2023-07-01',
        service: 'ตรวจสุขภาพ',
    },
    {
        key: '2',
        visitDate: '2023-07-05',
        service: 'ฉีดวัคซีน',
    },
    {
        key: '3',
        visitDate: '2023-07-10',
        service: 'พบแพทย์',
    },
];
const App = () => {
    return (_jsx("div", { children: _jsx(Card, { style: { width: 500, margin: "0" }, children: _jsx(Table, { columns: columns, dataSource: data, pagination: false }) }) }));
};
export default App;
