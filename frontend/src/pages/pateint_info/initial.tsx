
export const InitiallPage = () => {
    return (
      <>
        <div>
          <h2>ข้อมูลประจำตัว</h2>
          <h3>ข้อมูลการติดต่อ</h3>
          <h3>ประวัติการรักษา</h3>
        </div>
  
        <input type="text" className="patientID" />
        <label>รหัสคนไข้</label>
  
        <input type="text" className="citizenID" />
        <label>เลขบัตรประชาชน</label>
  
        <label>เพศ</label>
        <input type="radio" className="male" />
        <label>ชาย</label>
        <input type="radio" className="female" />
        <label>หญิง</label>
  
        <input type="text" className="prefix" />
        <label>คำนำหน้า</label>
  
        <input type="text" className="fristname" />
        <label>ชื่อ</label>
  
        <input type="text" className="lastname" />
        <label>นามสกุล</label>
  
        <input type="text" className="nickname" />
        <label>ชื่อเล่น</label>
  
        <input type="text" className="eti" />
        <label>เชื้อชาติ</label>
  
        <input type="text" className="nationality" />
        <label>สัญชาติ</label>
  
        <input type="datetime" className="birthdate" />
        <label>วันเกิด</label>
  
        <input type="text" className="age" />
        <label>อายุ(ปี)</label>
  
        <input type="text" className="p" />
        <label>โรคประจำตัว</label>
  
        <input type="text" className="ิbloodtype" />
        <label>หมู่เลือด</label>
  
        <input type="text" className="phone_number" />
        <label>เบอร์โทรศัพท์</label>
  
        <label>แพ้ยา</label>
        <input type="text" className="drug" />
        <label>แพ้ยา</label>
        <input type="radio" className="not_drug" />
        <label>ปฏิเสธการแพ้ยา</label>
  
        <label>ผู้ที่ติดต่อได้</label>
        <label>ความสัมพันธ์</label>
        <input type="text" className="relationship" />
        <label>เบอร์โทรศัพท์</label>
        <input type="radio" className="emergency_phone" />
  
        <button type="button" className="save-button">
          บันทึก
        </button>
        <button type="button" className="cancel-button">
          ยกเลิก
        </button>
      </>
    );
  };
  
  export default InitiallPage;
  