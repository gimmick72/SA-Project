//frontend/src/services/https/CaseAPI.tsx
import axios from "axios";
const API_BASE = "http://localhost:8080";
import type { CaseData, Treatment, Patient, CaseRow } from "../../interface/Case";
import dayjs from "dayjs";   // ✅ ต้องใส่ตรงนี้

const normalizeDateString = (s?: any): string | undefined => {
  if (!s) return undefined;
  const str = String(s);
  if (!str || str.startsWith("0001-01-01")) return undefined;
  return str;
};

const mapTreatment = (t: any): Treatment => ({
  ID: t?.ID,
  CaseDataID: t?.CaseDataID ?? t?.caseDataID ?? t?.case_id,
  TreatmentName: t?.TreatmentName ?? t?.treatment_name ?? "",
  Price: Number(t?.Price ?? t?.price ?? 0),
  appointment_date: normalizeDateString(t?.Appointment_date ?? t?.appointment_date ?? t?.date ?? null) ?? null,
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
  // fetch + แปลงเป็น formValues พร้อมใช้งานใน UI
  getCaseFormValuesByID: async (
    id: number,
    row: CaseRow,
    patientsList: Patient[]
  ): Promise<{
    formValues: any;
    patient: Patient | null;
  }> => {
    const data = await CaseAPI.getCaseByID(id);

    // หา patient
    const patient =
      row.patient ||
      patientsList.find((x) => x.ID === row.patientId) ||
      null;

    const init =
      data.Patient?.InitialSymptomps &&
        data.Patient.InitialSymptomps.length
        ? data.Patient.InitialSymptomps[0]
        : null;

    // เตรียมค่าไว้ใส่ใน Form
    const formValues: any = {
      departmentID: data.DepartmentID ?? undefined,
      dentist_Name: data.Department?.PersonalData
        ? `${data.Department.PersonalData.FirstName} ${data.Department.PersonalData.LastName}`
        : "",
      NationalID: patient?.CitizenID || patient?.NationalID || undefined,
      fullName: patient
        ? `${patient.Prefix || ""} ${patient.FirstName || ""} ${patient.LastName || ""
        }`
        : "",
      age: patient?.Age,
      preExistingConditions: patient?.CongenitaDisease ?? "",
      phone: patient?.PhoneNumber,
      allergyHistory: patient?.DrugAllergy ?? "",
      note: row.note,
      appointment_date: row.appointment_date ? dayjs(row.appointment_date) : null,
      treatments: (row.treatments || []).map((t) => ({
        treatment_name: t.TreatmentName,
        price: t.Price || 0,
      })),
      SignDate: data.SignDate ? dayjs(data.SignDate) : null,
      symptomps: init?.Symptomps ?? "",
      bloodPressure: init?.BloodPressure ?? "",
      heartRate: init?.HeartRate ?? "",
      weight: init?.Weight ?? "",
      height: init?.Height ?? "",
      bloodType: patient?.BloodType ?? "",
    };
    return { formValues, patient };
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

  buildCasePayload: (
    values: any,
    selectedPatient: Patient | null,
    // dynamicSelectedTeeth: Record<number, string[]>
  ): Partial<CaseData> | null => {
    const patientIdToUse =
      selectedPatient?.ID || selectedPatient?.ID || values.patientId || null;

    if (!patientIdToUse) {
      return null;
    }

    const cleanISOString = (val?: any) => {
      if (!val) return null;
      const iso = typeof val === "string" ? val : val.toISOString?.();
      if (!iso || iso.startsWith("0001-01-01")) return null;
      return iso;
    };

    const treatments = (values.treatments || []).map((t: any) => ({
      TreatmentName: t.treatment_name,
      Price: Number(t.price || 0),
      // selected_teeth: dynamicSelectedTeeth[idx] || [], 
    }));

    const totalPrice = treatments.reduce(
      (sum: number, t: { Price: number }) => sum + t.Price,
      0
    );

    return {
      appointment_date: cleanISOString(values.appointment_date) || undefined,
      SignDate: cleanISOString(values.SignDate) || new Date().toISOString(),
      Note: values.note || values.notes || "",
      PatientID: patientIdToUse,
      DepartmentID: values.departmentID ? Number(values.departmentID) : 1,
      TotalPrice: totalPrice,
      Treatment: treatments,
    };
  },

  // ✅ save (update or create)
  saveCase: async (
    values: any,
    selectedPatient: Patient | null,
    editingCase: CaseRow | null,
    prevCases: CaseRow[]
  ): Promise<CaseRow[]> => {
    const payload = CaseAPI.buildCasePayload(values, selectedPatient);
    if (!payload) throw new Error("กรุณาเลือกผู้ป่วยที่ถูกต้อง (National ID)");

    if (editingCase) {
      const updated = await CaseAPI.updateCase(editingCase.id, payload as CaseData);

      const updatedRow: CaseRow = {
        id: updated.ID as number,
        patientId: updated.PatientID as number,
        appointment_date: updated.appointment_date || "",
        treatments: updated.Treatment || [],
        note: updated.Note || "",
        patient: (updated as any).Patient || selectedPatient,
        SignDate: updated.SignDate || "",
        totalPrice: updated.TotalPrice || 0,
      };

      // 🔄 return cases ที่แก้ไขแล้ว
      return prevCases.map((r) => (r.id === editingCase.id ? updatedRow : r));
    } else {
      await CaseAPI.addCaseFormData(payload as CaseData);
      const latestCasesData = await CaseAPI.getAllCases();

      // 🔄 return cases ล่าสุดจาก backend
      return latestCasesData.map((c) => ({
        id: c.ID as number,
        patientId: c.PatientID as number,
        appointment_date: c.appointment_date || "",
        treatments: c.Treatment || [],
        note: c.Note || "",
        patient: c.Patient || null,
        SignDate: c.SignDate || "",
        totalPrice: c.TotalPrice || 0,
      }));
    }
  },

  // ✅ new: ดึง patient + map formValues
  getPatientFormValuesByCitizenId: async (
    nid: string
  ): Promise<{ patient: Patient | null; formValues: any | null }> => {
    if (!nid || nid.length !== 13) {
      return { patient: null, formValues: null };
    }

    const found = await CaseAPI.getPatientByCitizenId(nid);

    if (!found) {
      return { patient: null, formValues: null };
    }

    const init =
      found.InitialSymptomps && found.InitialSymptomps.length
        ? found.InitialSymptomps[0]
        : null;

    const formValues: any = {
      fullName: `${found.Prefix ?? ""} ${found.FirstName ?? ""} ${found.LastName ?? ""}`.trim(),
      age: found.Age ?? "",
      preExistingConditions: found.CongenitaDisease ?? "",
      phone: found.PhoneNumber ?? "",
      allergyHistory: found.DrugAllergy ?? "",
      symptomps: init?.Symptomps ?? "",
      bloodPressure: init?.BloodPressure ?? "",
      heartRate: init?.HeartRate ?? "",
      weight: init?.Weight ?? "",
      height: init?.Height ?? "",
      bloodType: found.BloodType ?? "",
    };

    return { patient: found, formValues };
  },

  deleteCase: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE}/cases/${id}`);
  },
};


