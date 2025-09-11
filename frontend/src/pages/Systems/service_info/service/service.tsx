import { useEffect, useState } from "react";
import './service.css';
import { Modal, Input, Button, Card, Select } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import { 
  fetchServices,
  createService as createDentalService,
  updateService as updateDentalService,
  deleteService as deleteDentalService,
  DentalService,
  CreateServicePayload
} from "../../../../services/Service/service";


interface Service {
    id?: number;
    name_service: string;
    detail_service: string;
    cost: number;
    category_id: number;
}


interface Category {
    id?: number;
    name_category: string;
}


const Servicecomponent = () => {
    const [service, setService] = useState<Service[]>([]);
    const [category, setCategory] = useState<Category[]>([]);
    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [newItem, setNewItem] = useState<Omit<Service, 'id'>>({
        name_service: "",
        cost: undefined!,
        detail_service: "",
        category_id: undefined!,
    });
    const [items, setItems] = useState<Service[]>([]);
    const [modal, setModal] = useState<{
        visible: boolean;
        type: 'add' | 'view' | null;
        detail: string;
        itemIndex: number | null;
    }>({ visible: false, type: null, detail: '', itemIndex: null });

    // สำหรับ confirm delete
    const [isCardVisible, setIsCardVisible] = useState(false);
    const [itemIdToDelete, setItemIdToDelete] = useState<null | number>(null);

    // ดึงข้อมูล Service และ Category
    useEffect(() => {
        const fetchData = async () => {
            try {
                const servicesResponse = await fetchServices();
                const servicesData = servicesResponse.data;

                // แปลงจาก DentalService เป็น Service format
                const formattedServices = servicesData.map((s: DentalService) => ({
                    id: s.id,
                    name_service: s.service_name,
                    detail_service: s.description,
                    cost: s.price,
                    category_id: 1, // Default category for now
                }));

                // Mock categories
                const mockCategories = [
                    { id: 1, name_category: 'การตรวจ' },
                    { id: 2, name_category: 'การรักษา' },
                    { id: 3, name_category: 'การทำความสะอาด' },
                    { id: 4, name_category: 'การผ่าตัด' },
                    { id: 5, name_category: 'ความงาม' }
                ];

                setService(formattedServices);
                setCategory(mockCategories);
                setItems(formattedServices); // สำหรับ edit/delete/add
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };
        fetchData();
    }, []);

    // ฟังก์ชันหาชื่อหมวดหมู่จาก ID
    const getCategoryName = (id: number) => {
        const foundCategory = category.find(cat => cat.id === id);
        return foundCategory ? foundCategory.name_category : "-";

    };

    // ฟังก์ชันเปลี่ยนค่า field ของ service
    const handleChange = (field: keyof Service, value: any, index?: number) => {
        if (index === undefined) {
            setNewItem(prev => ({ ...prev, [field]: value }));
        } else {
            const updated = [...items];
            updated[index] = { ...updated[index], [field]: value };
            setItems(updated);
        }
    };

    const handleAddItem = async () => {
        try {
            if (!newItem.name_service || !newItem.category_id || isNaN(newItem.cost)) {
                return;
            }
            
            // แปลงจาก Service format เป็น CreateServicePayload
            const payload: CreateServicePayload = {
                service_code: `SRV${Date.now()}`, // Generate unique code
                service_name: newItem.name_service,
                category: category.find(c => c.id === newItem.category_id)?.name_category || 'อื่นๆ',
                description: newItem.detail_service,
                duration_minutes: 30, // Default duration
                price: newItem.cost
            };

            const createdService = await createDentalService(payload);

            // แปลงกลับเป็น Service format
            const serviceItem: Service = {
                id: createdService.id,
                name_service: createdService.service_name,
                detail_service: createdService.description,
                cost: createdService.price,
                category_id: newItem.category_id
            };

            setItems([...items, serviceItem]);

            // reset ฟอร์ม
            setNewItem({
                name_service: '',
                cost: undefined!,
                detail_service: '',
                category_id: undefined!,
            });
        } catch (error) {
            console.error("❌ Failed to create service:", error);
        }
    };

    // แก้ไขข้อมูล
    const handleEdit = (index: number) => setEditIndex(index);

    const handleSave = async () => {
        if (editIndex !== null) {
            const item = items[editIndex];
            try {
                // แปลงเป็น CreateServicePayload format
                const payload: Partial<CreateServicePayload> = {
                    service_name: item.name_service,
                    category: category.find(c => c.id === item.category_id)?.name_category || 'อื่นๆ',
                    description: item.detail_service,
                    price: item.cost
                };

                const updatedService = await updateDentalService(item.id!, payload);
                
                // แปลงกลับเป็น Service format
                const serviceItem: Service = {
                    id: updatedService.id,
                    name_service: updatedService.service_name,
                    detail_service: updatedService.description,
                    cost: updatedService.price,
                    category_id: item.category_id
                };

                const updatedItems = [...items];
                updatedItems[editIndex] = serviceItem;
                setItems(updatedItems);
            } catch (error) {
                console.error('Failed to update service:', error);
            }
        }
        setEditIndex(null);
    };


    // ลบข้อมูล
    const confirmDelete = (id: number) => {
        setItemIdToDelete(id);
        setIsCardVisible(true);
    };

    const handleOk = async () => {
        if (itemIdToDelete !== null) {
            try {
                await deleteDentalService(itemIdToDelete); // เรียก API ลบ
                setItems(prev => prev.filter(item => item.id !== itemIdToDelete)); // อัปเดตรายการใน frontend
            } catch (error) {
                console.error('Failed to delete service:', error);
            }
        }
        setItemIdToDelete(null);
        setIsCardVisible(false);
    };


    const handleCancel = () => {
        setItemIdToDelete(null);
        setIsCardVisible(false);
    };

    // modal add/view
    const openModal = (type: 'add' | 'view', index: number | null) => {
        if (type === 'add') {
            setModal({ visible: true, type, detail: '', itemIndex: null });
        } else if (index !== null) {
            setModal({ visible: true, type, detail: items[index].detail_service, itemIndex: index });
        }
    };
    const handleModalSave = () => {
        if (modal.type === 'view' && modal.itemIndex !== null) {
            const updated = [...items];
            updated[modal.itemIndex].detail_service = modal.detail;
            setItems(updated);
        }
        setModal({ visible: false, type: null, detail: '', itemIndex: null });
    };

    // filter service ตาม search + category
    const filteredServices = items.filter(s => {
        const matchesSearch =
            (s.name_service?.toLowerCase() ?? "").includes(searchText.toLowerCase()) ||
            (s.detail_service?.toLowerCase() ?? "").includes(searchText.toLowerCase());

        const matchesCategory =
            selectedCategory === null || s.category_id === selectedCategory;

        return matchesSearch && matchesCategory;
    });


    // const editcategory = () => {

    // }

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
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        style={{ width: 300, marginLeft: 0 }}
                    />

                    {/* ตัวเลือกหมวดหมู่ */}
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>หมวดหมู่</div>
                        <select
                            className="select_category"
                            value={selectedCategory ?? ""}
                            onChange={e => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                        >
                            <option value="">-- แสดงทั้งหมด --</option>
                            {category.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name_category}</option>
                            ))}
                        </select>
                        {/* <Button
                            className="edit_category"
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(item.id)} // ใส่ฟังก์ชันที่ต้องการ
                        >
                        </Button> */}
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
                            <th style={{ width: '26%' }}>บริการ</th>
                            <th style={{ width: '20%' }}>ราคา</th>
                            <th style={{ width: '18%' }}>หมวดหมู่</th>
                            <th style={{ width: '18%' }}>รายละเอียด</th>
                            <th style={{ width: '18%' }}>การจัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredServices.map((service, index) => (
                            <tr key={service.id}>
                                <td>
                                    {editIndex === index ? (
                                        <Input
                                            value={service.name_service}
                                            onChange={(e) => handleChange('name_service', e.target.value, index)}
                                        />
                                    ) : service.name_service}
                                </td>
                                <td>
                                    {editIndex === index ? (
                                        <Input
                                            type="number"
                                            value={service.cost}
                                            onChange={(e) => handleChange('cost', Number(e.target.value), index)}
                                        />
                                    ) : service.cost}
                                </td>
                                <td>{getCategoryName(service.category_id)}</td>
                                <td>
                                    <Button onClick={() => openModal('view', index)}>ดูรายละเอียด</Button>
                                </td>

                                <td style={{ textAlign: "center", verticalAlign: "middle" }}>

                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <Button danger onClick={() => confirmDelete(service.id!)}><DeleteOutlined /> ลบ </Button>

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
                            value={newItem.name_service}
                            onChange={(e) => handleChange('name_service', e.target.value)}
                        />
                        <Input
                            type="number"
                            placeholder="ราคา"
                            value={newItem.cost}
                            onChange={(e) => handleChange('cost', Number(e.target.value))}
                        />
                        <Select
                            placeholder="เลือกหมวดหมู่"
                            value={newItem.category_id}
                            onChange={(value: number) => setNewItem({ ...newItem, category_id: value })}
                        >
                            <Select.Option value={0}>เลือกหมวดหมู่</Select.Option>
                            {category.map(cat => (
                                <Select.Option key={cat.id} value={cat.id}>{cat.name_category}</Select.Option>
                            ))}
                        </Select>
                        <Input.TextArea
                            rows={4}
                            placeholder="รายละเอียด"
                            value={newItem.detail_service}   // ใช้ newItem.detail
                            onChange={e => handleChange('detail_service', e.target.value)}
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

export default Servicecomponent;
