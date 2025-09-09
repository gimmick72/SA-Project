//frontend/src/services/https/CaseAPI.tsx
import axios from "axios";
const API_BASE = "http://localhost:8080";
import type { CaseData, Treatment,Patient } from "../../interface/Patient";
// import type { CaseData, Treatment, Quadrant, Patient } from "../../interface/Patient";
// helper: map backend → frontend interface

const normalizeDateString = (s?: any): string | undefined => {
  if (!s) return undefined;
  const str = String(s);
  if (!str || str.startsWith("0001-01-01")) return undefined;
  return str;
};

// const mapQuadrant = (q: any): Quadrant => ({
//   ID: q.ID,
//   Quadrant: q.Quadrant,
// });

const mapTreatment = (t: any): Treatment => ({
  ID: t?.ID,
  CaseDataID: t?.CaseDataID ?? t?.caseDataID ?? t?.case_id,
  TreatmentName: t?.TreatmentName ?? t?.treatment_name ?? "",
  Price: Number(t?.Price ?? t?.price ?? 0),
  appointment_date: normalizeDateString(t?.Appointment_date ?? t?.appointment_date ?? t?.date ?? null) ?? null,
  Photo: t?.Photo ?? t?.photo ?? null,
  // Quadrants: Array.isArray(t?.Quadrants) ? t.Quadrants.map(mapQuadrant) : [],
  // selected_teeth: t?.selected_teeth ?? [],
  photo_upload: t?.Photo ?? [],
});

const mapCase = (c: any): CaseData => ({
  ID: c?.ID,
  SignDate: c?.SignDate ? String(c.SignDate) : c?.signDate ? String(c.signDate) : "",
  Note: c?.Note ?? c?.note ?? "",
  PatientID: c?.PatientID ?? c?.patientId ?? 0,
  DepartmentID: c?.DepartmentID ?? c?.departmentId,
  appointment_date: normalizeDateString(c?.Appointment_date ?? c?.appointment_date) ?? undefined,
  TotalPrice: Number(c?.TotalPrice ?? c?.total_price ?? 0),
  Patient: c?.Patient ?? c?.patient ?? null,
  Treatment: Array.isArray(c?.Treatment) ? c.Treatment.map(mapTreatment) : [],

  Department: c?.Department
    ? {
      ...c.Department,
      PersonalData: c.Department.PersonalData
        ? {
          FirstName: c.Department.PersonalData.FirstName,
          LastName: c.Department.PersonalData.LastName,
        }
        : null,
    }
    : null,

});

export const CaseAPI = {
  getPatientByCitizenId: async (citizenId: string): Promise<Patient | null> => {
    try {
      const { data } = await axios.get<Patient | null>(`${API_BASE}/patients`, {
        params: { citizenId },
      });
      return data;

    } catch (err) {
      console.error("❌ Error fetching patient:", err);
      return null;
    }
  },
  getAllCases: async (): Promise<CaseData[]> => {
    const response = await axios.get<CaseData[]>(`${API_BASE}/cases`);
    return response.data.map(mapCase);
  },

  getCaseByID: async (id: number): Promise<CaseData> => {
    const response = await axios.get<CaseData>(`${API_BASE}/cases/${id}`);
    return mapCase(response.data);
  },

  addCaseFormData: async (newCase: CaseData & { _files?: { [k: string]: File[] } }): Promise<CaseData> => {
    // normalize treatment: remove frontend-only props
    const treatmentsForServer = (newCase.Treatment || []).map((t) => {
      const copy: any = { ...t };
      delete copy.photo_upload;
      delete copy.selected_teeth;
      return copy;
    });

    // ถ้าไม่มีไฟล์ ให้ส่ง JSON (backend ใช้ ShouldBindJSON)
    if (!newCase._files || Object.keys(newCase._files).length === 0) {
      const payload: any = {
        PatientID: newCase.PatientID,
        DepartmentID: newCase.DepartmentID,
        Note: newCase.Note,
        // backend ดูเหมือนใช้ชื่อ Appointment_date ใน seed → ส่งชื่อนี้เพื่อความแน่นอน
        Appointment_date: newCase.appointment_date ?? null,
        TotalPrice: newCase.TotalPrice ?? 0,
        Treatment: treatmentsForServer,
        SignDate: newCase.SignDate ?? null,
      };

      const { data } = await axios.post(`${API_BASE}/cases`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      return mapCase(data);
    }

    // ถ้ามีไฟล์: ส่ง multipart/form-data (เดิม)
    const fd = new FormData();
    fd.append("PatientID", String(newCase.PatientID));
    if (newCase.Note) fd.append("Note", newCase.Note);
    if (newCase.DepartmentID) fd.append("DepartmentID", String(newCase.DepartmentID));
    if (newCase.appointment_date) fd.append("Appointment_date", newCase.appointment_date);
    fd.append("Treatment", JSON.stringify(treatmentsForServer));

    Object.keys(newCase._files).forEach((k) => {
      newCase._files![k].forEach((file) => {
        fd.append(k, file, file.name);
      });
    });

    const { data } = await axios.post(`${API_BASE}/cases`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return mapCase(data);
  },

  updateCase: async (id: number, updatedCase: CaseData): Promise<CaseData> => {
    const { data } = await axios.put<CaseData>(`${API_BASE}/cases/${id}`, updatedCase);
    return mapCase(data);
  },

  deleteCase: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE}/cases/${id}`);
  },
};
