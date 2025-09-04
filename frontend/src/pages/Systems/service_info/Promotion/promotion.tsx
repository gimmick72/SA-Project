import React, { useState } from "react";
import './promotion.css';
import { Modal, Input, Button } from 'antd';

interface Item {
    id: number;
    name: string;
    service: string;
    detail: string;
    price: number;
    startDate: string;
    endDate: string;
}

const Promotion = () => {
    const [items, setItems] = useState<Item[]>([
        {
            id: 1,
            name: "โปรโมชันฟอกฟันขาว",
            service: "ฟอกฟันขาว",
            detail: "ฟอกฟันขาวด้วย Zoom Whitening ราคาพิเศษ",
            price: 2500,
            startDate: "2025-09-01",
            endDate: "2025-09-30"
        },
        {
            id: 2,
            name: "โปรโมชันขูดหินปูน",
            service: "ขูดหินปูน",
            detail: "ขูดหินปูนพร้อมตรวจสุขภาพช่องปาก",
            price: 800,
            startDate: "2025-09-01",
            endDate: "2025-09-15"
        },
        {
            id: 3,
            name: "โปรโมชันจัดฟัน",
            service: "จัดฟัน",
            detail: "จัดฟันราคาพิเศษสำหรับนักศึกษา",
            price: 15000,
            startDate: "2025-09-10",
            endDate: "2025-12-31"
        },
        {
            id: 4,
            name: "โปรโมชันถอนฟัน",
            service: "ถอนฟัน",
            detail: "ถอนฟันราคาพิเศษสำหรับเด็ก",
            price: 500,
            startDate: "2025-09-05",
            endDate: "2025-09-20"
        },
        {
            id: 5,
            name: "โปรโมชันอุดฟัน",
            service: "อุดฟัน",
            detail: "อุดฟันด้วยวัสดุเรซินคอมโพสิต",
            price: 1200,
            startDate: "2025-09-01",
            endDate: "2025-09-30"
        },
        {
            id: 6,
            name: "โปรโมชันเคลือบฟลูออไรด์",
            service: "เคลือบฟลูออไรด์",
            detail: "เคลือบฟลูออไรด์สำหรับเด็กและผู้ใหญ่",
            price: 600,
            startDate: "2025-09-01",
            endDate: "2025-09-30"
        },
        {
            id: 7,
            name: "โปรโมชันรากฟันเทียม",
            service: "รากฟันเทียม",
            detail: "รากฟันเทียมราคาพิเศษ",
            price: 35000,
            startDate: "2025-09-15",
            endDate: "2025-10-31"
        },
        {
            id: 8,
            name: "โปรโมชันฟอกฟันขาวคู่",
            service: "ฟอกฟันขาว",
            detail: "ฟอกฟันขาวสำหรับ 2 ท่าน ราคาพิเศษ",
            price: 4000,
            startDate: "2025-09-01",
            endDate: "2025-09-30"
        },
        {
            id: 9,
            name: "โปรโมชันขูดหินปูน+ขัดฟัน",
            service: "ขูดหินปูน",
            detail: "ขูดหินปูนและขัดฟันในราคาพิเศษ",
            price: 1000,
            startDate: "2025-09-01",
            endDate: "2025-09-30"
        },
        {
            id: 10,
            name: "โปรโมชันตรวจสุขภาพฟัน",
            service: "ตรวจสุขภาพฟัน",
            detail: "ตรวจสุขภาพฟันฟรีสำหรับเด็กอายุต่ำกว่า 12 ปี",
            price: 0,
            startDate: "2025-09-01",
            endDate: "2025-09-30"
        }
    ]);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [search, setSearch] = useState<string>("");
    const filteredItems = items.filter(item => {
        const keyword = search.trim().toLowerCase();
        if (!keyword) return true;
        return (
            item.name.toLowerCase().includes(keyword) ||
            item.service.toLowerCase().includes(keyword) ||
            item.detail.toLowerCase().includes(keyword)
        );
    });
    const [newItem, setNewItem] = useState<Omit<Item, 'id'>>({
        name: "",
        service: "",
        detail: "",
        price: 0,
        startDate: "",
        endDate: ""
    });

    const [modal, setModal] = useState<{
        visible: boolean;
        type: 'add' | 'view' | null;
        detail: string;
        itemIndex: number | null;
    }>({
        visible: false,
        type: null,
        detail: '',
        itemIndex: null,
    });

    const handleChange = (field: keyof Item, value: any, index?: number) => {
        if (index === undefined) {
            setNewItem(prev => ({ ...prev, [field]: value }));
        } else {
            const updated = [...items];
            updated[index] = { ...updated[index], [field]: value };
            setItems(updated);
        }
    };

    const handleAddItem = () => {
        setModal({ visible: true, type: 'add', detail: '', itemIndex: null });
    };

    const handleModalSave = () => {
        if (modal.type === 'add') {
            // ดึงค่าจากฟอร์มใน modal
            if (!newItem.name || !newItem.service) return;
            setItems([...items, { ...newItem, id: Date.now(), detail: modal.detail }]);
            setNewItem({ name: "", service: "", detail: "", price: 0, startDate: "", endDate: "" });
        } else if (modal.type === 'view' && modal.itemIndex !== null) {
            const updated = [...items];
            updated[modal.itemIndex].detail = modal.detail;
            setItems(updated);
        }
        setModal({ visible: false, type: null, detail: '', itemIndex: null });
    };

    const handleDelete = (id: number) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const handleEdit = (index: number) => setEditIndex(index);
    const handleSave = () => setEditIndex(null);

    const openModal = (type: 'add' | 'view', index: number | null) => {
        if (type === 'add') {
            setModal({ visible: true, type, detail: newItem.detail, itemIndex: null });
        } else if (index !== null) {
            setModal({
                visible: true,
                type,
                detail: items[index].detail,
                itemIndex: index
            });
        }
    };


    return (
        <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto 0 auto', display: 'flex', flexDirection: 'column', gap: '20px', boxSizing: 'border-box', position: 'relative', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 0 }}>
                <Input.Search
                    placeholder="ค้นหาโปรโมชัน บริการ หรือรายละเอียด..."
                    allowClear
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ width: 350, marginRight: 16 }}
                />
                <Button type="primary" onClick={handleAddItem}>+ เพิ่มโปรโมชัน</Button>
            </div>
            <div className="table-container">
                <table className="item-table">
                    <thead>
                        <tr>
                            <th style={{ width: '22%' }}>โปรโมชัน</th>
                            <th style={{ width: '13%' }}>บริการ</th>
                            <th style={{ width: '13%' }}>รายละเอียด</th>
                            <th style={{ width: '13%' }}>ราคา</th>
                            <th style={{ width: '13%' }}>วันเริ่ม</th>
                            <th style={{ width: '13%' }}>วันหยุด</th>
                            <th style={{ width: '13%' }}>การจัดการ</th>
                        </tr>
                    </thead>
                    <tbody >
                        {filteredItems.map((item, index) => (
                            <tr key={item.id}>
                                <td>
                                    {editIndex === index ? (
                                        <Input
                                            value={item.name}
                                            onChange={(e) => handleChange('name', e.target.value, index)}
                                        />
                                    ) : item.name}
                                </td>
                                <td>
                                    {editIndex === index ? (
                                        <Input
                                            value={item.service}
                                            onChange={(e) => handleChange('service', e.target.value, index)}
                                        />
                                    ) : item.service}
                                </td>
                                <td>
                                    <Button onClick={() => openModal('view', index)}>ดูรายละเอียด</Button>
                                </td>
                                <td>
                                    {editIndex === index ? (
                                        <Input
                                            type="number"
                                            value={item.price}
                                            onChange={(e) => handleChange('price', Number(e.target.value), index)}
                                        />
                                    ) : item.price}
                                </td>
                                <td>
                                    {editIndex === index ? (
                                        <Input
                                            type="date"
                                            value={item.startDate}
                                            onChange={(e) => handleChange('startDate', e.target.value, index)}
                                        />
                                    ) : item.startDate}
                                </td>
                                <td>
                                    {editIndex === index ? (
                                        <Input
                                            type="date"
                                            value={item.endDate}
                                            onChange={(e) => handleChange('endDate', e.target.value, index)}
                                        />
                                    ) : item.endDate}
                                </td>
                                <td >
                                    <Button danger onClick={() => handleDelete(item.id)}>ลบ</Button>
                                    {editIndex === index ? (
                                        <Button style={{ marginLeft: "8px" }}
                                            onClick={handleSave}>บันทึก</Button>
                                    ) : (
                                        <Button style={{ marginLeft: "8px" }}
                                            onClick={() => handleEdit(index)}>แก้ไข</Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal สำหรับเพิ่ม/ดูรายละเอียดและกรอกข้อมูล */}
            <Modal
                open={modal.visible}
                title={modal.type === 'add' ? 'เพิ่มรายการโปรโมชัน' : 'ดูรายละเอียด'}
                onOk={handleModalSave}
                onCancel={() => setModal({ visible: false, type: null, detail: '', itemIndex: null })}
                okText="บันทึก"
                cancelText="ยกเลิก"
                centered
            >
                {/* ฟอร์มกรอกข้อมูลเมื่อเพิ่ม */}
                {modal.type === 'add' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <Input
                            placeholder="ชื่อรายการ"
                            value={newItem.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                        <Input
                            placeholder="บริการ"
                            value={newItem.service}
                            onChange={(e) => handleChange('service', e.target.value)}
                        />
                        <Input.TextArea
                            rows={3}
                            placeholder="รายละเอียด"
                            value={modal.detail}
                            onChange={(e) => setModal({ ...modal, detail: e.target.value })}
                        />
                        <Input
                            type="number"
                            placeholder="ราคา"
                            value={newItem.price}
                            onChange={(e) => handleChange('price', Number(e.target.value))}
                        />
                        <Input
                            type="date"
                            value={newItem.startDate}
                            onChange={(e) => handleChange('startDate', e.target.value)}
                        />
                        <Input
                            type="date"
                            value={newItem.endDate}
                            onChange={(e) => handleChange('endDate', e.target.value)}
                        />
                    </div>
                )}
                {/* ดูรายละเอียด */}
                {modal.type === 'view' && (
                    <Input.TextArea
                        rows={4}
                        placeholder="พิมพ์รายละเอียดที่นี่..."
                        value={modal.detail}
                        onChange={(e) => setModal({ ...modal, detail: e.target.value })}
                    />
                )}
            </Modal>
        </div>
    );
};

export default Promotion;
