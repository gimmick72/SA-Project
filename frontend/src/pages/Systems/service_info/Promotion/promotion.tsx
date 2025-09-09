import { useEffect, useState } from "react";
import './promotion.css';
import { Modal, Input, Button, Card, Select } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { createPromotion, deletePromotion, getAllPromotion, getAllService, updatePromotion } from "../../../../services/Service/Service";

interface Promotion {
    id?: number;
    name_promotion: string;
    service_id?: number;
    promotion_detail: string;
    cost: number;
    date_start: string;
    date_end: string;
}

interface Service {
    id?: number;
    name_service: string;
    detail_service: string;
    cost: number;
    category_id: number;
}

const Promotion = () => {

    const [promotion, setPromotion] = useState<Promotion[]>([]);
    const [service, setService] = useState<Service[]>([]);
    const [items, setItems] = useState<Promotion[]>([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const promotionData = await getAllPromotion();
                const serviceData = await getAllService();


                const formattedPromotion = promotionData.map(p => ({
                    id: p.id,
                    name_promotion: p.name_promotion,
                    service_id: p.service_id,
                    promotion_detail: p.promotion_detail,
                    cost: p.cost || 0,
                    date_start: p.date_start,
                    date_end: p.date_end,
                }));

                const formattedService = serviceData.map(s => ({
                    id: s.id,
                    name_service: s.name_service,
                    detail_service: s.detail_service,
                    cost: s.cost || 0,
                    category_id: s.category_id,
                }));

                setPromotion(formattedPromotion);
                setService(formattedService);
                setItems(formattedPromotion); // สำหรับ edit/delete/add
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };
        fetchData();
    }, []);



    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [search, setSearch] = useState<string>("");
    const filteredItems = items.filter(item => {
        const keyword = search.trim().toLowerCase();
        if (!keyword) return true;
        return (
            item.name_promotion.toLowerCase().includes(keyword) ||
            (item.service_id && service.find(s => s.id === item.service_id)?.name_service.toLowerCase().includes(keyword)) ||
            item.promotion_detail.toLowerCase().includes(keyword)
        );
    });

    const [newItem, setNewItem] = useState<Omit<Promotion, 'id' | 'created_at' | 'updated_at'>>({
        name_promotion: '',
        service_id: undefined,
        promotion_detail: '',
        cost: 0 || undefined!,
        date_start: '',
        date_end: ''
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

    const handleChange = (field: keyof Promotion, value: any, index?: number) => {
        if (index === undefined) {
            setNewItem(prev => ({ ...prev, [field]: value }));
        } else {
            const updated = [...items];
            updated[index] = { ...updated[index], [field]: value };
            setItems(updated);
        }
    };

    const handleModalSave = async () => {
        if (modal.type === 'add') {
            // ตรวจสอบ field ที่จำเป็น
            if (!newItem.name_promotion.trim()) {
                alert("กรุณากรอกชื่อโปรโมชัน");
                return;
            }
            if (!newItem.service_id) {
                alert("กรุณาเลือกบริการ");
                return;
            }
            if (!newItem.date_start || !newItem.date_end) {
                alert("กรุณาเลือกวันที่เริ่มและสิ้นสุด");
                return;
            }

            try {
                // เรียก API เพิ่มโปรโมชั่น
                const savedPromotion = await createPromotion({
                    ...newItem,
                    service_id: newItem.service_id!, // ensure เป็น number
                    date_start: newItem.date_start,
                    date_end: newItem.date_end,
                });

                // อัพเดต state
                setPromotion(prev => [...prev, savedPromotion]);
                setItems(prev => [...prev, savedPromotion]);

                // ปิด Modal และรีเซ็ต newItem
                setModal({ visible: false, type: null, detail: '', itemIndex: null });
                setNewItem({
                    name_promotion: '',
                    service_id: 0,
                    promotion_detail: '',
                    cost: 0,
                    date_start: '',
                    date_end: ''
                });
            } catch (error) {
                console.error('Failed to create promotion:', error);
                alert("สร้างโปรโมชั่นไม่สำเร็จ");
            }
        } else if (modal.type === 'view' && modal.itemIndex !== null) {
            const updatedItem = { ...items[modal.itemIndex], promotion_detail: modal.detail };
            try {
                const updatedPromotion = await updatePromotion(updatedItem.id!, updatedItem);
                const updatedItems = [...items];
                updatedItems[modal.itemIndex] = updatedPromotion;
                setItems(updatedItems);
                setPromotion(updatedItems);
                setModal({ visible: false, type: null, detail: '', itemIndex: null });
            } catch (error) {
                console.error('Failed to update promotion:', error);
            }
        }
    };

    // เปลี่ยนค่า ฟิล
    const handleNewPromotionChange = (field: keyof Promotion, value: string | number) => {
        setNewItem(prev => ({ ...prev, [field]: value }));
    };



    //  ลบข้อมูล
    const [isCardVisible, setIsCardVisible] = useState(false);
    const [itemIdToDelete, setItemIdToDelete] = useState<null | Number>(null);


    // ยืนยันการลบ
    const confirmDelete = (id: number) => {
        setItemIdToDelete(id);
        setIsCardVisible(true);
    };

    const handleOk = async () => {
        if (itemIdToDelete === null) return;

        try {
            await deletePromotion(Number(itemIdToDelete));
            setItems(prev => prev.filter(item => item.id !== itemIdToDelete));
            console.log("ลบสำเร็จ")

        } catch (error) {
            console.error("ลบไม่สำเร็จ", error);

        } finally {
            // Clean up state
            setIsCardVisible(false);
            setItemIdToDelete(null);
        }

    };

    const handleCancel = () => {
        setIsCardVisible(false);
        setItemIdToDelete(null);
    };


    const handleEdit = (index: number) => setEditIndex(index);

    const handleSave = async (index: number) => {
        const itemToUpdate = items[index];
        try {
            const updated = await updatePromotion(itemToUpdate.id!, itemToUpdate);
            const newItems = [...items];
            newItems[index] = updated;
            setItems(newItems);
            setPromotion(newItems);
            setEditIndex(null);
            console.log("อัปเดตสำเร็จ");
        } catch (error) {
            console.error("อัปเดตไม่สำเร็จ", error)
        }
    };


    const openModal = (type: 'add' | 'view', index: number | null) => {
        if (type === 'add') {
            setModal({ visible: true, type, detail: newItem.promotion_detail, itemIndex: null });
        } else if (index !== null) {
            setModal({
                visible: true,
                type,
                detail: items[index].promotion_detail,
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
                    style={{ width: 300, marginRight: 16 }}
                />
                <Button className="add_Button"
                    type="primary" onClick={() => openModal('add', null)}>+ เพิ่มโปรโมชัน</Button>
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
                                            value={item.name_promotion}
                                            onChange={(e) => handleChange('name_promotion', e.target.value, index)}
                                        />
                                    ) : item.name_promotion}
                                </td>
                                <td>
                                    {editIndex === index ? (
                                        <Input
                                            type="number"
                                            value={item.service_id}
                                            onChange={(e) => handleChange('service_id', Number(e.target.value), index)}
                                        />
                                    ) : (
                                        service.find(s => s.id === item.service_id)?.name_service || "–"
                                    )}
                                </td>
                                <td>
                                    <Button onClick={() => openModal('view', index)}>ดูรายละเอียด</Button>
                                </td>
                                <td>
                                    {editIndex === index ? (
                                        <Input
                                            type="number"
                                            value={item.cost}
                                            onChange={(e) => handleChange('cost', Number(e.target.value), index)}
                                        />
                                    ) : item.cost}
                                </td>
                                <td>
                                    {editIndex === index ? (
                                        <Input
                                            type="date"
                                            value={item.date_start ? item.date_start.split("T")[0] : ""}
                                            onChange={(e) => handleChange('date_start', e.target.value, index)}
                                        />
                                    ) : item.date_start?.split("T")[0]}
                                </td>
                                <td>
                                    {editIndex === index ? (
                                        <Input
                                            type="date"
                                            value={item.date_end ? item.date_end.split("T")[0] : ""}
                                            onChange={(e) => handleChange('date_end', e.target.value, index)}
                                        />
                                    ) : item.date_end?.split("T")[0]}
                                </td>
                                <td style={{ textAlign: "center", verticalAlign: "middle" }}>

                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <Button danger onClick={() => item.id !== undefined && confirmDelete(item.id)}><DeleteOutlined /> ลบ </Button>

                                        {editIndex === index ? (
                                            <Button style={{ marginLeft: "10px" }}
                                                onClick={() => handleSave(index)}>บันทึก</Button>
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
                {modal.type === 'add' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <Input
                            placeholder="ชื่อโปรโมชัน"
                            value={newItem.name_promotion}
                            onChange={(e) => handleNewPromotionChange('name_promotion', e.target.value)}
                        />
                        <Select
                            placeholder="เลือกบริการ"
                            value={newItem.service_id}
                            onChange={(value) => handleNewPromotionChange('service_id', value)}
                        >
                            {service.map(s => (
                                <Select.Option key={s.id} value={s.id}>{s.name_service}</Select.Option>
                            ))}
                        </Select>
                        <Input.TextArea
                            rows={3}
                            placeholder="รายละเอียด"
                            value={newItem.promotion_detail}
                            onChange={(e) => handleNewPromotionChange('promotion_detail', e.target.value)}
                        />
                        <Input
                            type="number"
                            placeholder="ราคา"
                            value={newItem.cost}
                            onChange={(e) => handleNewPromotionChange('cost', Number(e.target.value))}
                        />
                        <Input
                            type="date"
                            value={newItem.date_start}
                            onChange={(e) => handleNewPromotionChange('date_start', e.target.value)}
                        />
                        <Input
                            type="date"
                            value={newItem.date_end}
                            onChange={(e) => handleNewPromotionChange('date_end', e.target.value)}
                        />
                    </div>
                )}

                {modal.type === 'view' && modal.itemIndex !== null && (
                    <Input.TextArea
                        rows={4}
                        value={modal.detail}
                        onChange={(e) => setModal({ ...modal, detail: e.target.value })}
                    />
                )}
            </Modal>
        </div>
    );
};

export default Promotion;
