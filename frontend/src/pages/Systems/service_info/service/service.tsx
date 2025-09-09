import React, { useState } from "react";
import './service.css';
import { Modal, Input, Button, Popconfirm, Card } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';

interface Item {
    id: number;
    name: string;
    price: number;
    detail: string;
    category: string;
}

// option select catagory service
const categoryOptions = [
    { value: "รักษาฮากแข่ว", label: "รักษาฮากแข่ว" },
    { value: "จัดแข่ว", label: "จัดแข่ว" },
    { value: "แข่วปลอม", label: "แข่วปลอม" },
];

const Service = () => {

    // moc up datda test
    const [items, setItems] = useState<Item[]>([
        { id: 1, name: "ขูดหินปูน", price: 800, detail: "ขูดหินปูนและขัดฟัน", category: "รักษาฮากแข่ว" },
        { id: 2, name: "อุดฟัน", price: 1200, detail: "อุดฟันด้วยวัสดุเรซินคอมโพสิต", category: "รักษาฮากแข่ว" },
        { id: 3, name: "ถอนฟัน", price: 500, detail: "ถอนฟันสำหรับเด็กและผู้ใหญ่", category: "รักษาฮากแข่ว" },
        { id: 4, name: "ฟอกฟันขาว", price: 2500, detail: "ฟอกฟันขาวด้วย Zoom Whitening", category: "รักษาฮากแข่ว" },
        { id: 5, name: "จัดฟันโลหะ", price: 15000, detail: "จัดฟันโลหะมาตรฐาน", category: "จัดแข่ว" },
        { id: 6, name: "จัดฟันใส Invisalign", price: 45000, detail: "จัดฟันใส Invisalign", category: "จัดแข่ว" },
        { id: 7, name: "รีเทนเนอร์", price: 2500, detail: "รีเทนเนอร์หลังจัดฟัน", category: "จัดแข่ว" },
        { id: 8, name: "ฟันปลอมถอดได้", price: 4000, detail: "ฟันปลอมถอดได้บางส่วน", category: "แข่วปลอม" },
        { id: 9, name: "ฟันปลอมทั้งปาก", price: 12000, detail: "ฟันปลอมทั้งปากบนหรือล่าง", category: "แข่วปลอม" },
        { id: 10, name: "รากฟันเทียม", price: 35000, detail: "รากฟันเทียมมาตรฐาน", category: "แข่วปลอม" },
    ]);

    const [currentCategory, setCurrentCategory] = useState<string>("");
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [search, setSearch] = useState<string>("");
    const [newItem, setNewItem] = useState<Omit<Item, 'id'>>({
        name: "",
        price: 0,
        detail: "",
        category: "",
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

    const filteredItems = items.filter(item => {
        const matchCategory = currentCategory ? item.category === currentCategory : true;
        const matchSearch = search.trim() === "" ? true : (
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.detail.toLowerCase().includes(search.toLowerCase())
        );
        return matchCategory && matchSearch;
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

    // เพิ่มข้อมูล
    const handleAddItem = () => {
        if (!newItem.name || isNaN(newItem.price) || !newItem.category) return;
        setItems([...items, {
            ...newItem,
            id: Date.now(),
        }]);
        setNewItem({ name: '', price: 0, detail: '', category: '' });
    };

    //  ลบข้อมูล
    const [isCardVisible, setIsCardVisible] = useState(false);
    const [itemIdToDelete, setItemIdToDelete] = useState<null | Number>(null);

    const handleDelete = (id: number) => {
        setItems(prev => prev.filter(item => item.id !== id));
        setIsCardVisible(false);
    };

    // ยืนยันการลบ
    const confirmDelete = (id: number) => {
        setItemIdToDelete(id);
        setIsCardVisible(true);
    };
    const handleOk = () => {
        // Filter out the item with the stored ID
        setItems(prev => prev.filter(item => item.id !== itemIdToDelete));

        // Clean up state
        setIsCardVisible(false);
        setItemIdToDelete(null);
    };
    const handleCancel = () => {
        setIsCardVisible(false);
        setItemIdToDelete(null);
    };

    // แก้ไขข้อมูล
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

    //บันทึกบริการ
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

        // กล่องใหญ่ครอบทั้งหมด
        <div style={{
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto 0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            boxSizing: 'border-box',
            position: 'relative',
            background: '#fff',
            border: 'none 2px #accc',
        }}>

            {/* แถบเครื่องมือ -> ค้นหา, หมวดหมู่, เพิ่มรายการ */}
            <div style={{
                display: 'flex',
                gap: '20px',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                border: 'none 2px #000',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    {/* ช่องค้นหาข้อมูล */}
                    <Input.Search
                        placeholder="ค้นหาบริการหรือรายละเอียด..."
                        allowClear
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ width: 300, marginLeft: 0 }}
                    />

                    {/* ตัวเลือกหมวดหมู่ */}
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>หมวดหมู่</div>
                        <select
                            className="select_category"
                            value={currentCategory}
                            onChange={(e) => setCurrentCategory(e.target.value)}
                        >
                            <option value="">-- แสดงทั้งหมด --</option>
                            {categoryOptions.map(cat => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* ปุ่มเพิ่มรายการ */}
                <div >
                    <Button className="add_Button"
                        type="primary" onClick={() => openModal('add', null)}>+ เพิ่มบริการ</Button>
                </div>
            </div>

            {/* ตารางแสดงข้อมูล */}
            <div className="table-container" >
                <table className="item-table">
                    <thead style={{ display: "flix" }}>
                        <tr >
                            <th style={{ width: '28%' }}>บริการ</th>
                            <th style={{ width: '25%' }}>ราคา</th>
                            <th style={{ width: '19%' }}>หมวดหมู่</th>
                            <th style={{ width: '19%' }}>รายละเอียด</th>
                            <th style={{ width: '19%' }}>การจัดการ</th>
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
                                <td>{item.category}</td>
                                <td>
                                    <Button onClick={() => openModal('view', index)}>ดูรายละเอียด</Button>
                                </td>

                                <td style={{ textAlign: "center", verticalAlign: "middle" }}>

                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <Button danger onClick={() => confirmDelete(item.id)}><DeleteOutlined /> ลบ </Button>

                                        {editIndex === index ? (
                                            <Button style={{ marginLeft: "10px" }}
                                                onClick={handleSave}>บันทึก</Button>
                                        ) : (
                                            <Button style={{ marginLeft: "10px" }}
                                                onClick={() => handleEdit(index)}>แก้ไข</Button>
                                        )}
                                    </div>

                                    {isCardVisible && (
                                        <div
                                            style={{
                                                position: "fixed",
                                                top: 0,
                                                left: 0,
                                                width: "100%",
                                                height: "100%",
                                                backgroundColor: "rgba(0,0,0,0)", // overlay
                                                zIndex: 999,
                                                pointerEvents: "auto", // ปิดการคลิก background ไม่ได้
                                            }}
                                        >
                                            <Card
                                                title="ยืนยันการลบ"
                                                style={{
                                                    width: 450,
                                                    position: "absolute",
                                                    top: "40%",
                                                    left: "55%",
                                                    transform: "translate(-50%, -50%)",
                                                    zIndex: 1000,
                                                    border: "2px solid #CBC6FF",
                                                    pointerEvents: "auto", // ทำให้ card สามารถคลิกได้
                                                }}
                                                actions={[
                                                    <Button key="cancel" onClick={handleCancel} style={{ width: 120 }}>
                                                        ยกเลิก
                                                    </Button>,
                                                    <Button key="ok" type="primary" danger onClick={handleOk} style={{ width: 120 }}>
                                                        ยืนยัน
                                                    </Button>,
                                                ]}
                                            >
                                                <p>คุณต้องการลบรายการนี้ใช่หรือไม่?</p>
                                            </Card>
                                        </div>
                                    )}

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                open={modal.visible}
                title={modal.type === 'add' ? 'เพิ่มบริการใหม่' : 'ดูรายละเอียด'}
                onOk={() => {
                    if (modal.type === 'add') {
                        handleAddItem();   // ดึงค่าจาก newItem โดยตรง
                    } else {
                        handleModalSave();
                    }
                    setModal({ visible: false, type: null, detail: '', itemIndex: null });
                }}
                onCancel={() => setModal({ visible: false, type: null, detail: '', itemIndex: null })}
                okText="บันทึก"
                cancelText="ยกเลิก"
                centered
            >
                {modal.type === 'add' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <Input
                            placeholder="ชื่อบริการ"
                            value={newItem.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                        <Input
                            type="number"
                            placeholder="ราคา"
                            value={newItem.price}
                            onChange={(e) => handleChange('price', Number(e.target.value))}
                        />
                        <select
                            value={newItem.category}
                            onChange={e => handleChange('category', e.target.value)}
                            style={{ padding: 8, borderRadius: 4 }}
                        >
                            <option value="">เลือกหมวดหมู่</option>
                            {categoryOptions.map(cat => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                        <Input.TextArea
                            rows={4}
                            placeholder="รายละเอียด"
                            value={newItem.detail}   // ใช้ newItem.detail
                            onChange={e => handleChange('detail', e.target.value)}
                        />
                    </div>
                ) : (
                    <Input.TextArea
                        rows={4}
                        placeholder="พิมพ์รายละเอียดที่นี่..."
                        value={modal.detail}
                        onChange={e => setModal({ ...modal, detail: e.target.value })}
                    />
                )}
            </Modal>
        </div>
    );
};

export default Service;
