export interface BookingQueue {
  id: number;
  name: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface TimeSlot {
    id: number;
    timeslot: string;
    slotAvaliable: number; //บอกจำนวนที่ยังมี

}