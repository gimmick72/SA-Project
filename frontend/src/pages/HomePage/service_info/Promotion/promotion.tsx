import React, { useState } from "react";
import './promotion.css';
import { Modal, Input, Button } from 'antd';

interface Item {
    id: number;
    name: string;
    price: number;
    detail: string;
}

const Promotion = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [newItem, setNewItem] = useState<Omit<Item, 'id'>>({
        name: "",
        price: 0,
        detail: "",
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
        if (!newItem.name || isNaN(newItem.price)) return;
        setItems([...items, {
            ...newItem,
            id: Date.now(),
        }]);
        setNewItem({ name: '', price: 0, detail: '' });
    };

    const handleDelete = (id: number) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const handleEdit = (index: number) => setEditIndex(index);
    const handleSave = () => setEditIndex(null);

    const openModal = (type: 'add' | 'view', index: number | null) => {
        if (type === 'add') {
            setModal({ visible: true, type, detail: '', itemIndex: null });
        } else if (index !== null) {
            setModal({
                visible: true,
                type,
                detail: items[index].detail,
                itemIndex: index
            });
        }
    };

    const handleModalSave = () => {
        if (modal.type === 'add') {
            setNewItem(prev => ({ ...prev, detail: modal.detail }));
        } else if (modal.type === 'view' && modal.itemIndex !== null) {
            const updated = [...items];
            updated[modal.itemIndex].detail = modal.detail;
            setItems(updated);
        }
        setModal({ visible: false, type: null, detail: '', itemIndex: null });
    };

    return (
        <div style={{
            width: '1220px',
            border: 'none 2px #facc',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '25px',
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '1200px',
                marginTop: '20px',
                border: 'none 2px #ffffff',
            }} />

            <div style={{
                width: '1200px',
                margin: '0',
                border: 'solid 1px #b8b8b8ff',
                marginBottom: '30px',
            }}>
                <div style={{
                    width: '100%',
                    border: 'solid 2px #fff',
                    overflow: 'auto',
                    marginBottom: '30px',
                }}>
                    <table className="item-table">
                        <thead>
                            <tr>
                                <th style={{ width: '20%' }}>ชื่อโปรโมชัน</th>
                                <th style={{ width: '16%' }}>ราคา</th>
                                <th style={{ width: '16%' }}>หมวดหมู่</th>
                                <th style={{ width: '16%' }}>รายละเอียด</th>
                                <th style={{ width: '16%' }}>การจัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
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
                                                type="number"
                                                value={item.price}
                                                onChange={(e) => handleChange('price', Number(e.target.value), index)}
                                            />
                                        ) : item.price}
                                    </td>
                                    <td>
                                        <Button onClick={() => openModal('view', index)}>ดูรายละเอียด</Button>
                                    </td>
                                    <td className="edit">
                                        {editIndex === index ? (
                                            <Button onClick={handleSave}>บันทึก</Button>
                                        ) : (
                                            <Button onClick={() => handleEdit(index)}>แก้ไข</Button>
                                        )}
                                        <Button danger onClick={() => handleDelete(item.id)}>ลบ</Button>
                                    </td>
                                </tr>
                            ))}
                            {currentCategory && (
                                <tr>
                                    <td>
                                        <Input
                                            placeholder="ชื่อรายการ"
                                            value={newItem.name}
                                            onChange={(e) => handleChange('name', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <Input
                                            type="number"
                                            placeholder="ราคา"
                                            value={newItem.price}
                                            onChange={(e) => handleChange('price', Number(e.target.value))}
                                        />
                                    </td>
                                    <td>{currentCategory}</td>
                                    <td>
                                        <Button onClick={() => openModal('add', null)}>เพิ่มรายละเอียด</Button>
                                    </td>
                                    <td>
                                        <Button type="primary" onClick={handleAddItem}>เพิ่มรายการ</Button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Modal
                    open={modal.visible}
                    title={modal.type === 'add' ? 'เพิ่มรายละเอียด' : 'ดูรายละเอียด'}
                    onOk={handleModalSave}
                    onCancel={() => setModal({ visible: false, type: null, detail: '', itemIndex: null })}
                    okText="บันทึก"
                    cancelText="ยกเลิก"
                >
                    <Input.TextArea
                        rows={4}
                        placeholder="พิมพ์รายละเอียดที่นี่..."
                        value={modal.detail}
                        onChange={(e) => setModal({ ...modal, detail: e.target.value })}
                    />
                </Modal>
            </div>
        </div>
    );
};

export default Promotion;
