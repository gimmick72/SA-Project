const calcAge = (dateStr: string) => {
    if (!dateStr) return 0;
    const today = new Date();
    const dob = new Date(dateStr); // yyyy-MM-dd จาก <input type="date" />
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return Math.max(0, age);
  };
  
  const todayStr = new Date().toISOString().slice(0, 10); // ใช้ set เป็น max ของ input date