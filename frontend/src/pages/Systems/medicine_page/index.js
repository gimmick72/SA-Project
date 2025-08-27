import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Tabs, Card, Typography } from 'antd';
import { MedicineBoxOutlined } from '@ant-design/icons';
import AllSuppliesPage from './AllSuppliesPage';
import AddSupplyPage from './AddSupplyPage';
import DispensePage from './DispensePage';
const { TabPane } = Tabs;
const { Title } = Typography;
const MedicinePage = () => {
    const [activeKey, setActiveKey] = useState('1');
    const onTabChange = (key) => {
        setActiveKey(key);
    };
    const renderTabTitle = (key, title) => {
        const isActive = activeKey === key;
        return (_jsxs("div", { style: { display: 'flex', alignItems: 'center' }, children: [isActive && (_jsx(MedicineBoxOutlined, { style: { marginRight: '8px', color: '#5243aa' } })), _jsx("span", { style: { color: isActive ? '#5243aa' : 'inherit' }, children: title })] }));
    };
    return (_jsxs("div", { style: { padding: '0px' }, children: [_jsx("div", { style: { marginBottom: '24px', display: 'flex', alignItems: 'center' }, children: _jsx(Title, { level: 2, style: { margin: 0 }, children: "\u0E40\u0E27\u0E0A\u0E20\u0E31\u0E13\u0E11\u0E4C" }) }), _jsx(Card, { style: { borderRadius: '12px', marginTop: '24px' }, bodyStyle: { padding: '0 24px 24px 24px' }, children: _jsxs(Tabs, { defaultActiveKey: "1", activeKey: activeKey, onChange: onTabChange, tabBarStyle: { marginBottom: '0' }, children: [_jsx(TabPane, { tab: renderTabTitle('1', 'รายการเวชภัณฑ์ทั้งหมด'), children: _jsx(AllSuppliesPage, {}) }, "1"), _jsx(TabPane, { tab: renderTabTitle('2', 'เพิ่มเวชภัณฑ์ใหม่'), children: _jsx(AddSupplyPage, {}) }, "2"), _jsx(TabPane, { tab: renderTabTitle('3', 'การเบิกจ่ายเวชภัณฑ์'), children: _jsx(DispensePage, {}) }, "3")] }) })] }));
};
export default MedicinePage;
