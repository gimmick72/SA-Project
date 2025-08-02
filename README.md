Foertend: ตอนนี้โครงสร้างน่าจะใช้งานได้ระดับหนึ่งแล้ว แต่ยังไม่ได้เชื่อม Route ให้แต่ละคนแยก path ของตัวเอง 

แนวทางในการเชื่อม Route คือ
1.ให้แต่ละคนสร้าง folder ของตัวเองใน src/pages ก่อน
2.เวลาเพิ่มหน้าใหม่ ให้สร้างไฟล์ภายใน folder ตัวเอง
3.จากนั้นจึงไปเพิ่ม Route ในไฟล์ AppRoutes หลัก เช่น App.tsx 
  โดยกำหนด path ให้ชัดเจน /patient-info หรือ /dashboard เพื่อไม่ให้กัน
  
ถ้าเชื่อม Route แล้ว เวลา dev หรือเปิดหน้าก็เปิดที่ http://localhost:5173/patient-info เป็นต้น (patient-info คือชื่อ path ที่ตี่งไว้)

ตอน commit ดู branch ดีๆ อย่าพึ่งเอาขึ้น main

วิธีใช้ github
https://youtu.be/OyTeEjFcEXc?si=rwAW8A7H-XNDU_iDhttps://youtu.be/OyTeEjFcEXc?si=rwAW8A7H-XNDU_iD

วิธีใช้ github desktop
https://youtu.be/I7PXyKUdAug?si=1IMWPcurrEX6lXRO
