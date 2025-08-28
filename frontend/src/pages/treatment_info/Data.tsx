import dayjs from 'dayjs';
import type { UploadFile } from 'antd/lib/upload/interface';

// index.tsx

// 1. Patient Interface - โครงสร้างข้อมูลคนไข้
interface Patient {
    patientId: number;
    title: string;
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    NationalID: string;
    phone: string;
    email: string;
    nickname?: string;
    preExistingConditions: string;
    allergyHistory: string;
    registeredAddress: {
        houseNo: string;
        moo?: string;
        subDistrict: string;
        district: string;
        province: string;
        postalCode: string;
    };
}

// 2. DynamicTreatment Interface - โครงสร้างข้อมูลการรักษาแต่ละรายการย่อย
interface DynamicTreatment {
    treatment_name: string;
    photo_upload?: UploadFile[];
    price: number;
    selected_teeth?: string[];
}

// 3. Treatment Interface - โครงสร้างข้อมูลการรักษาหลัก
interface Treatment {
    id: number;
    patientId: number;
    patientName: string; // เพิ่ม property สำหรับชื่อผู้ป่วยเต็ม
    treatments?: DynamicTreatment[];
    dentist_name: string;
    date: dayjs.Dayjs | null;
    notes: string;
    appointment_date: dayjs.Dayjs | null;
    photo_upload?: UploadFile[];
}

// ข้อมูลคนไข้เริ่มต้น
export const initialPatientData: Patient[] = [
    {
        patientId: 1,
        title: "นาย",
        firstName: "สมชาย",
        lastName: "ใจดี",
        age: 35,
        gender: "ชาย",
        NationalID: "1234567890123",
        phone: "081-234-5678",
        email: "somchai@email.com",
        nickname: "ชาย",
        preExistingConditions: "ไม่มี",
        allergyHistory: "แพ้ยาเพนิซิลลิน",
        registeredAddress: {
            houseNo: "123",
            moo: "5",
            subDistrict: "บางรัก",
            district: "บางรัก",
            province: "กรุงเทพมหานคร",
            postalCode: "10500",
        },
    },
    {
        patientId: 2,
        title: "นางสาว",
        firstName: "สุดา",
        lastName: "เก่งกาจ",
        age: 28,
        gender: "หญิง",
        NationalID: "9876543210987",
        phone: "089-111-2222",
        email: "suda@email.com",
        nickname: "หน่อย",
        preExistingConditions: "เบาหวาน",
        allergyHistory: "ไม่มี",
        registeredAddress: {
            houseNo: "45/2",
            subDistrict: "ลาดพร้าว",
            district: "ลาดพร้าว",
            province: "กรุงเทพมหานคร",
            postalCode: "10310",
        },
    },
    {
        patientId: 3,
        title: "นาย",
        firstName: "ปกรณ์",
        lastName: "สุขใจ",
        age: 42,
        gender: "ชาย",
        NationalID: "1112223334445",
        phone: "086-555-7890",
        email: "pakorn@email.com",
        nickname: "ป๊อป",
        preExistingConditions: "ความดันโลหิตสูง",
        allergyHistory: "แพ้แอลกอฮอล์",
        registeredAddress: {
            houseNo: "789",
            moo: "2",
            subDistrict: "ดอนเมือง",
            district: "ดอนเมือง",
            province: "กรุงเทพมหานคร",
            postalCode: "10210",
        },
    },
    {
        patientId: 4,
        title: "นาง",
        firstName: "อารีย์",
        lastName: "ใจงาม",
        age: 60,
        gender: "หญิง",
        NationalID: "5566778899001",
        phone: "084-999-3344",
        email: "aree@email.com",
        nickname: "รี่",
        preExistingConditions: "ไขมันในเลือดสูง",
        allergyHistory: "แพ้อาหารทะเล",
        registeredAddress: {
            houseNo: "101/7",
            moo: "3",
            subDistrict: "ปากเกร็ด",
            district: "ปากเกร็ด",
            province: "นนทบุรี",
            postalCode: "11120",
        },
    },
    {
        patientId: 5,
        title: "นาย",
        firstName: "วีระ",
        lastName: "ทองดี",
        age: 50,
        gender: "ชาย",
        NationalID: "4455667788990",
        phone: "082-456-7890",
        email: "wera@email.com",
        nickname: "วี",
        preExistingConditions: "โรคหัวใจ",
        allergyHistory: "แพ้ยาซัลฟา",
        registeredAddress: {
            houseNo: "55/8",
            moo: "4",
            subDistrict: "บางเขน",
            district: "บางเขน",
            province: "กรุงเทพมหานคร",
            postalCode: "10220",
        },
    },
    {
        patientId: 6,
        title: "นางสาว",
        firstName: "จิราภรณ์",
        lastName: "มีสุข",
        age: 31,
        gender: "หญิง",
        NationalID: "2233445566778",
        phone: "091-222-3344",
        email: "jiraporn@email.com",
        nickname: "จิ๊บ",
        preExistingConditions: "ไม่มี",
        allergyHistory: "แพ้ฝุ่น",
        registeredAddress: {
            houseNo: "88",
            moo: "6",
            subDistrict: "รามอินทรา",
            district: "คันนายาว",
            province: "กรุงเทพมหานคร",
            postalCode: "10230",
        },
    },
    {
        patientId: 7,
        title: "นาย",
        firstName: "เกรียงไกร",
        lastName: "บุญยืน",
        age: 45,
        gender: "ชาย",
        NationalID: "3344556677889",
        phone: "081-777-8888",
        email: "kriangkrai@email.com",
        nickname: "เก่ง",
        preExistingConditions: "โรคเกาต์",
        allergyHistory: "ไม่มี",
        registeredAddress: {
            houseNo: "22",
            moo: "7",
            subDistrict: "สำโรง",
            district: "พระประแดง",
            province: "สมุทรปราการ",
            postalCode: "10130",
        },
    },
    {
        patientId: 8,
        title: "นางสาว",
        firstName: "พัชรี",
        lastName: "แซ่ลี้",
        age: 38,
        gender: "หญิง",
        NationalID: "6677889900112",
        phone: "085-111-9999",
        email: "patcharee@email.com",
        nickname: "พัช",
        preExistingConditions: "ไมเกรน",
        allergyHistory: "แพ้นมวัว",
        registeredAddress: {
            houseNo: "15/3",
            subDistrict: "บางแค",
            district: "บางแค",
            province: "กรุงเทพมหานคร",
            postalCode: "10160",
        },
    },
    {
        patientId: 9,
        title: "นาย",
        firstName: "เดชากร",
        lastName: "รัตนาวดี",
        age: 26,
        gender: "ชาย",
        NationalID: "7788990011223",
        phone: "086-333-2222",
        email: "dechakorn@email.com",
        nickname: "เดช",
        preExistingConditions: "ไม่มี",
        allergyHistory: "แพ้ยาพาราเซตามอล",
        registeredAddress: {
            houseNo: "300",
            moo: "9",
            subDistrict: "บางนา",
            district: "บางนา",
            province: "กรุงเทพมหานคร",
            postalCode: "10260",
        },
    },
    {
        patientId: 10,
        title: "นาง",
        firstName: "วาสนา",
        lastName: "บุญสม",
        age: 54,
        gender: "หญิง",
        NationalID: "8899001122334",
        phone: "087-555-6666",
        email: "wasana@email.com",
        nickname: "นา",
        preExistingConditions: "ไทรอยด์",
        allergyHistory: "แพ้ถั่วลิสง",
        registeredAddress: {
            houseNo: "12/1",
            moo: "10",
            subDistrict: "ปทุมวัน",
            district: "ปทุมวัน",
            province: "กรุงเทพมหานคร",
            postalCode: "10330",
        },
    },
    {
        patientId: 11,
        title: "นาย",
        firstName: "สมชาย",
        lastName: "ใจดี",
        age: 35,
        gender: "ชาย",
        NationalID: "0928374650912",
        phone: "081-555-7788",
        email: "somchai@email.com",
        nickname: "ชาย",
        preExistingConditions: "ความดันโลหิตสูง",
        allergyHistory: "แพ้เพนิซิลลิน",
        registeredAddress: {
            houseNo: "12/7",
            subDistrict: "ศรีราชา",
            district: "ศรีราชา",
            province: "ชลบุรี",
            postalCode: "20110",
        },
    }
];

// ข้อมูลการรักษาเริ่มต้น
export const initialTreatmentData = [
    {
        id: 1,
        patientId: 1,
        treatments: [
            {
                treatment_name: 'อุดฟัน',
                photo_upload: [],
                price: 800,
                selected_teeth: ['LU-6', 'LU-7', 'RU-1']
            }
        ],
        dentist_name: 'หมอณเดชน์',
        date: dayjs(),
        notes: 'trenbolone',
        appointment_date: dayjs().add(7, 'day'),
    },
    {
        id: 2,
        patientId: 2,
        treatments: [
            {
                treatment_name: 'ขูดหินน้ำลาย',
                photo_upload: [],
                price: 1000,
                selected_teeth: ['LL-8', 'LL-7']
            }
        ],
        dentist_name: 'หมอยาย่า',
        date: dayjs(),
        notes: 'testosterone',
        appointment_date: null,
    },
    {
        id: 3,
        patientId: 3,
        treatments: [
            {
                treatment_name: 'ถอนฟัน',
                photo_upload: [],
                price: 700,
                selected_teeth: ['LR-2']
            }
        ],
        dentist_name: 'หมอณเดชน์',
        date: dayjs(),
        notes: 'steroid',
        appointment_date: null,
    },
    {
        id: 4,
        patientId: 4,
        treatments: [
            {
                treatment_name: 'ฟอกสีฟัน',
                photo_upload: [],
                price: 5000,
                selected_teeth: []
            }
        ],
        dentist_name: 'หมอยาย่า',
        date: dayjs(),
        notes: 'penicillin',
        appointment_date: dayjs().add(14, 'day'),
    },
    {
        id: 5,
        patientId: 5,
        treatments: [
            {
                treatment_name: 'รักษารากฟัน',
                photo_upload: [],
                price: 3000,
                selected_teeth: ['RU-3', 'RU-4']
            }
        ],
        dentist_name: 'หมอดารา',
        date: dayjs(),
        notes: 'deep canal',
        appointment_date: dayjs().add(5, 'day'),
    },
    {
        id: 6,
        patientId: 6,
        treatments: [
            {
                treatment_name: 'ใส่ฟันเทียมทดแทน',
                photo_upload: [],
                price: 10000,
                selected_teeth: []
            }
        ],
        dentist_name: 'หมอบอล',
        date: dayjs(),
        notes: 'ไม่มีฟันกราม',
        appointment_date: dayjs().add(10, 'day'),
    },
    {
        id: 7,
        patientId: 7,
        treatments: [
            {
                treatment_name: 'ขูดหินน้ำลาย',
                photo_upload: [],
                price: 600,
                selected_teeth: ['LL-1', 'LL-2']
            }
        ],
        dentist_name: 'หมอณเดชน์',
        date: dayjs(),
        notes: 'หินน้ำลายแข็งมาก',
        appointment_date: null,
    },
    {
        id: 8,
        patientId: 8,
        treatments: [
            {
                treatment_name: 'อื่นๆ',
                photo_upload: [],
                price: 400,
                selected_teeth: []
            }
        ],
        dentist_name: 'หมอยาย่า',
        date: dayjs(),
        notes: 'รอเด็กนิ่งก่อนทำ',
        appointment_date: null,
    },
    {
        id: 9,
        patientId: 9,
        treatments: [
            {
                treatment_name: 'อุดฟัน',
                photo_upload: [],
                price: 1200,
                selected_teeth: ['RU-8']
            }
        ],
        dentist_name: 'หมอบอล',
        date: dayjs(),
        notes: 'ฟันหน้าซ้าย',
        appointment_date: dayjs().add(3, 'day'),
    },
    {
        id: 10,
        patientId: 10,
        treatments: [
            {
                treatment_name: 'อื่นๆ',
                photo_upload: [],
                price: 300,
                selected_teeth: []
            }
        ],
        dentist_name: 'หมอณเดชน์',
        date: dayjs(),
        notes: 'ไม่มีฟันผุ',
        appointment_date: null,
    },
];

// สร้างอาร์เรย์ใหม่ที่เชื่อมโยงชื่อคนไข้เข้ามาในข้อมูลการรักษา
export const initialTreatmentDataWithPatientName: Treatment[] = initialTreatmentData.map(treatment => {
    // 1. ค้นหาข้อมูลคนไข้ที่ตรงกับ patientId
    const patient = initialPatientData.find(p => p.patientId === treatment.patientId);

    // 2. ถ้าหาข้อมูลเจอ ให้รวมชื่อ-นามสกุลเข้าด้วยกัน
    const patientName = patient ? `${patient.firstName} ${patient.lastName}` : 'ไม่พบข้อมูลผู้ป่วย';

    return {
        ...treatment,
        patientName: patientName,
    };
});
//นี่คือข้อมูลที่ต้องใช้พิจารณา ใช้สำหรับเก็บ mock data