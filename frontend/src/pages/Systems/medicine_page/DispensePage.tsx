// src/pages/medicine_page/DispensePage.tsx
import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Card,
  Row,
  Col,
  Table,
  message,
  Space,
} from "antd";
import { MinusCircleOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

// ✅ ดึงบริการจริงจาก services
import { fetchSupplyOptions, createDispense } from "../../../services/Supply/supply";

const { Option } = Select;

type SupplyOption = { code: string; name: string; category: string };
type DispenseItem = {
  key: string;
  caseCode: string;
  supplyCode: string;
  supplyName: string;
  quantity: number;
};

const DispensePage: React.FC = () => {
  const [form] = Form.useForm();
  const [dispenseList, setDispenseList] = useState<DispenseItem[]>([]);
  const [options, setOptions] = useState<SupplyOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // โหลดรายการรหัสเวชภัณฑ์จาก backend
  useEffect(() => {
    const load = async () => {
      setLoadingOptions(true);
      try {
        const opts = await fetchSupplyOptions(); // ต้องมีใน services/supply.ts
        setOptions(opts);
      } catch (e: any) {
        message.error(e?.message || "โหลดรหัสเวชภัณฑ์ไม่สำเร็จ");
      } finally {
        setLoadingOptions(false);
      }
    };
    load();
  }, []);

  const handleSupplyChange = (value: string) => {
    const selectedSupply = options.find((item) => item.code === value);
    if (selectedSupply) {
      form.setFieldsValue({
        supplyName: selectedSupply.name,
        supplyCategory: selectedSupply.category,
      });
    } else {
      form.setFieldsValue({ supplyName: "", supplyCategory: "" });
    }
  };

  const handleAddToList = async () => {
    try {
      const values = await form.validateFields(["caseCode", "supplyCode", "quantity"]);
      const selectedSupply = options.find((item) => item.code === values.supplyCode);
      if (!selectedSupply) {
        message.warning("ไม่พบรหัสเวชภัณฑ์ที่เลือก");
        return;
      }
      const newItem: DispenseItem = {
        key: `${values.caseCode}-${values.supplyCode}-${dispenseList.length}`,
        caseCode: values.caseCode,
        supplyCode: selectedSupply.code,
        supplyName: selectedSupply.name,
        quantity: values.quantity,
      };
      setDispenseList((prev) => [...prev, newItem]);
      message.success("เพิ่มรายการเบิกสำเร็จ!");
      form.resetFields(["supplyCode", "supplyName", "supplyCategory", "quantity"]);
      window.dispatchEvent(new Event("suppliesUpdated"));
    } catch {
      // validation ไม่ผ่าน — ไม่ต้องทำอะไร
    }
  };

  const handleDeleteItem = (key: string) => {
    setDispenseList((prev) => prev.filter((i) => i.key !== key));
    message.success("ลบรายการสำเร็จ!");
  };

  const handleConfirmDispense = async () => {
    if (!dispenseList.length) {
      message.warning("ยังไม่มีรายการเบิก");
      return;
    }
    const dispenser = form.getFieldValue("dispenser") || "";
    if (!dispenser) {
      message.warning("กรุณากรอกผู้เบิก/หน่วยงาน");
      return;
    }
    // ใช้รหัสเคสจากแถวแรก (แบบฟอร์มกำหนดให้เคสเดียวกัน)
    const caseCode = dispenseList[0].caseCode;

    const payload = {
      case_code: caseCode,
      dispenser,
      items: dispenseList.map((it) => ({
        supply_code: it.supplyCode,
        quantity: it.quantity,
      })),
    };

    try {
      if (submitting) return;
      setSubmitting(true);
      await createDispense(payload); // ต้องมีใน services/supply.ts
      message.success("บันทึกการเบิกสำเร็จ");
      setDispenseList([]);
      form.resetFields();
    } catch (e: any) {
      message.error(e?.message || "บันทึกไม่สำเร็จ");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelDispense = () => {
    setDispenseList([]);
    form.resetFields();
    message.info("ยกเลิกการเบิกจ่าย");
  };

  const columns: ColumnsType<DispenseItem> = [
    { title: "ชื่อเวชภัณฑ์", dataIndex: "supplyName", key: "supplyName" },
    { title: "จำนวน", dataIndex: "quantity", key: "quantity", align: "right" },
    {
      title: "ลบ",
      key: "action",
      width: 70,
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<MinusCircleOutlined />}
          onClick={() => handleDeleteItem(record.key)}
        />
      ),
    },
  ];

  return (
    <Card
      title="การเบิก/จ่ายเวชภัณฑ์"
      bordered
      style={{
        borderRadius: 12,
        border: "2px solid #ffffffff",
        backgroundColor: "#ffffffff",
        width: "1325px",
        height: "475px",
      }}
      bodyStyle={{
        background: "#ffffffff",
        borderRadius: 8,
        border: "2px solid #ffffffff",
        width: "1300px",
        height: "425px",
      }}
    >
      <Row gutter={32}>
        {/* ฟอร์มซ้าย */}
        <Col span={12}>
          <Form form={form} layout="vertical" name="dispense_form">
            {/* รหัสเคส + รหัสเวชภัณฑ์ */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="caseCode"
                  label="รหัสเคส"
                  rules={[{ required: true, message: "กรุณากรอกรหัสเคส!" }]}
                >
                  <Input placeholder="รหัสเคส" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="supplyCode"
                  label="รหัสเวชภัณฑ์"
                  rules={[{ required: true, message: "กรุณาเลือกรหัสเวชภัณฑ์!" }]}
                >
                  <Select
                    placeholder="เลือกรหัสเวชภัณฑ์"
                    onChange={handleSupplyChange}
                    showSearch
                    loading={loadingOptions}
                    filterOption={(input, option) =>
                      (option?.value as string)?.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {options.map((s) => (
                      <Option key={s.code} value={s.code}>
                        {s.code}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* ชื่อเวชภัณฑ์ + ประเภท */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="supplyName" label="ชื่อเวชภัณฑ์">
                  <Input placeholder="ชื่อเวชภัณฑ์" disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="supplyCategory" label="ประเภท">
                  <Input placeholder="ประเภท" disabled />
                </Form.Item>
              </Col>
            </Row>

            {/* จำนวน + ผู้เบิก/หน่วยงาน */}
            <Form.Item label="จำนวน / ผู้เบิก">
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="quantity"
                    noStyle
                    rules={[{ required: true, message: "กรุณากรอกจำนวน!" }]}
                  >
                    <InputNumber min={1} style={{ width: "100%" }} placeholder="จำนวน" />
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item name="dispenser" noStyle>
                    <Input placeholder="ชื่อผู้เบิกหรือหน่วยงาน" />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>

            <Form.Item>
              <Space style={{ float: "right" }}>
                <Button onClick={() => form.resetFields()}>ล้างข้อมูล</Button>
                <Button type="primary" onClick={handleAddToList}>
                  เพิ่ม
                </Button>
                
              </Space>
            </Form.Item>
          </Form>
        </Col>

        {/* รายการเบิกขวา */}
        <Col span={12}>
          <Card bordered style={{ borderRadius: 8, minHeight: 375 }}>
            <Table
              dataSource={dispenseList}
              columns={columns}
              pagination={false}
              locale={{ emptyText: "No data" }}
              style={{ marginBottom: 16 }}
              rowKey="key"
            />
            <div style={{ textAlign: "right" }}>
              <Space>
                <Button onClick={handleCancelDispense}>ยกเลิก</Button>
                <Button
                  type="primary"
                  onClick={handleConfirmDispense}
                  loading={submitting}
                  disabled={!dispenseList.length}
                >
                  ตกลง
                </Button>

              </Space>
            </div>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default DispensePage;
