//frontend/src/services/https/CaseAPI.tsx
import axios from "axios";
const API_BASE = "http://localhost:8080";
import type { CaseData, Treatment, Quadrant, Patient } from "../../interface/patient";
// helper: map backend → frontend interface
const mapQuadrant = (q: any): Quadrant => ({
    ID: q.ID,
    Quadrant: q.Quadrant,
});

const mapTreatment = (t: any): Treatment => ({
    
    ID: t?.ID,
    CaseDataID: t?.CaseDataID ?? t?.caseDataID ?? t?.case_id,
    TreatmentName: t?.TreatmentName ?? t?.treatment_name ?? "",
    Price: Number(t?.Price ?? t?.price ?? 0),
    appointment_date: t?.Appointment_date ? String(t.appointment_date) : t?.date ? String(t.date) : null,
    Photo: t?.Photo ?? t?.photo ?? null,
    Quadrants: Array.isArray(t?.Quadrants) ? t.Quadrants.map(mapQuadrant) : [],
    // selected_teeth: t?.selected_teeth ?? [],
    photo_upload: t?.Photo ?? [],
});

const mapCase = (c: any): CaseData => ({
    ID: c?.ID,
    SignDate: c?.SignDate ? String(c.SignDate) : c?.signDate ? String(c.signDate) : "",
    Note: c?.Note ?? c?.note ?? "",
    PatientID: c?.PatientID ?? c?.patientId ?? 0,
    DepartmentID: c?.DepartmentID ?? c?.departmentId,
    appointment_date: c?.Appointment_date ? String(c.Appointment_date) : c?.appointment_date ? String(c.appointment_date) : undefined,   // <-- ใช้ undefined แทน null
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
//      getAllPatients: async () => {
//     const { data } = await axios.get(`${API_BASE}/patients`);
//     return data;
//   },
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
        const fd = new FormData();
        // Map simple fields
        fd.append("PatientID", String(newCase.PatientID));
        if (newCase.Note) fd.append("Note", newCase.Note);
        if (newCase.DepartmentID) fd.append("DepartmentID", String(newCase.DepartmentID));
        if (newCase.appointment_date) fd.append("Appointment_date", newCase.appointment_date);
        // Treatment: append as JSON string except files
        const treatmentsForServer = (newCase.Treatment || []).map((t) => {
            const copy: any = { ...t };
            // remove frontend-only file arrays before JSON stringify
            delete copy.photo_upload;
            delete copy.selected_teeth;
            return copy;
        });
        fd.append("Treatment", JSON.stringify(treatmentsForServer));

        // Append files, if provided in _files with keys like "treatment_0"
        if (newCase._files) {
            Object.keys(newCase._files).forEach((k) => {
                newCase._files![k].forEach((file) => {
                    fd.append(k, file, file.name);
                });
            });
        }

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
