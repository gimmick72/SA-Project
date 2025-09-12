// src/components/auth/RequireManager.tsx
import React, { useEffect, useState } from "react";
import { Modal, Input, message, Spin, Button } from "antd";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { StaffAPI } from '../../../../services/Staff/StaffAPI'

interface Props {
    children?: ReactNode;
    requiredPosition?: string;
}

const STORAGE_KEY = "isManagerAuthenticated";

const getSessionAuth = (): boolean => {
    try { return sessionStorage.getItem(STORAGE_KEY) === "1"; }
    catch { return false; }
};
const setSessionAuth = (v: boolean) => {
    try { sessionStorage.setItem(STORAGE_KEY, v ? "1" : "0"); }
    catch { }
};

export const RequireManager: React.FC<Props> = ({ children, requiredPosition = "ผู้จัดการ" }) => {

    const [isAuthed, setIsAuthed] = useState<boolean>(getSessionAuth());
    const [open, setOpen] = useState<boolean>(() => !getSessionAuth());
    const [employeeId, setEmployeeId] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();
    useEffect(() => {
        setOpen(true);
        setIsAuthed(false);
        setEmployeeId("");
        setPassword("");
    }, []);

    const handleSubmit = async () => {
        const idNum = Number(employeeId);
        if (!idNum || isNaN(idNum)) {
            message.error("กรุณาใส่รหัสพนักงานที่ถูกต้อง (ตัวเลข)");
            return;
        }
        if (!password) {
            message.error("กรุณาใส่รหัสผ่าน");
            return;
        }

        try {
            setLoading(true);
            const staff = await StaffAPI.getStaffByID(idNum);
            if (!staff) {
                message.error("ไม่พบพนักงานนี้");
                return;
            }

            const dept = (staff as any).Department || (staff as any).department || null;
            const storedPassword = dept?.Password ?? dept?.Passowrd ?? (staff as any).password ?? null;
            const position = (staff as any).position ?? dept?.Position ?? "";

            if (!storedPassword) {
                message.error("บัญชีนี้ยังไม่มีรหัสผ่าน (backend ต้องมีฟิลด์รหัสผ่านหรือ endpoint login)");
                return;
            }

            if (String(password) !== String(storedPassword)) {
                message.error("รหัสผ่านไม่ถูกต้อง");
                return;
            }

            if (!position || String(position).trim() !== requiredPosition) {
                message.error(`บัญชีนี้ไม่มีสิทธิ์เข้าถึง (ต้องเป็นตำแหน่ง: ${requiredPosition})`);
                return;
            }

            setSessionAuth(true);
            setIsAuthed(true);
            setOpen(false);
            message.success("ยืนยันตัวตนสำเร็จ");
        } catch (err) {
            console.error(err);
            message.error("เกิดข้อผิดพลาดระหว่างตรวจสอบข้อมูล");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        // พฤติกรรมปัจจุบัน: กลับไปหน้า /admin และไม่ authenticated
        setSessionAuth(false);
        setIsAuthed(false);
        setOpen(false);
        message.info("ยกเลิกการยืนยัน (ยังไม่สามารถเข้าได้)");
        navigate("/admin/staff"); // หรือ navigate('/') หรือ navigate(-1)
    };

    if (isAuthed) return <>{children}</>;

    return (
        <>
            <Modal
                title="ยืนยันตัวตน (ผู้จัดการ)"
                visible={open}
                closable={false}
                footer={null}
                centered
            >
                <div style={{ marginBottom: 12 }}>
                    <label style={{ display: "block", marginBottom: 6 }}>รหัสพนักงาน</label>
                    <Input
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value.replace(/\D/g, ""))}
                        placeholder="กรอกรหัสพนักงาน (ตัวเลข)"
                        maxLength={10}
                    />
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label style={{ display: "block", marginBottom: 6 }}>รหัสผ่าน</label>
                    <Input.Password
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="รหัสผ่าน"
                        onPressEnter={handleSubmit}
                    />
                </div>

                <div style={{ textAlign: "right", marginTop: 12 }}>
                    <Button onClick={handleCancel} style={{ marginRight: 8 ,borderRadius: "25px", height: 40, width: 120,}}>
                        ยกเลิก
                    </Button>
                    <Button
                        type="primary"
                        onClick={handleSubmit}
                        loading={loading}
                        style={{
                            backgroundColor: "#52c41a",  // สีเขียว
                            borderColor: "#52c41a",      // สีขอบเดียวกับพื้นหลัง
                            color: "white",              // สีตัวอักษร
                            borderRadius: "25px",        // ทำให้ขอบมน
                            height: 40,
                            width: 120,
                        }}
                    >
                        {loading ? <Spin size="small" /> : "ยืนยัน"}
                    </Button>
                </div>

            </Modal>
        </>
    );
};

export default RequireManager;
