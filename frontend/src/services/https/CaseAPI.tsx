// frontend/src/services/https/CaseAPI.tsx
import axios from "axios";
const API_BASE = "http://localhost:8080";
import type { CaseData, Treatment, Patient, CaseRow } from "../../interface/Case";
import dayjs from "dayjs";

// 🔹 Utils
const normalizeDateString = (s?: any): string | undefined => {
  const str = String(s || "");
  return !str || str.startsWith("0001-01-01") ? undefined : str;
};

const cleanISOString = (val?: any): string | null => {
  if (!val) return null;
  const iso = typeof val === "string" ? val : val.toISOString?.();
  return iso && !iso.startsWith("0001-01-01") ? iso : null;
};

const mapTreatment = (t: any): Treatment => ({
  ID: t?.ID,
  CaseDataID: t?.CaseDataID ?? t?.caseDataID ?? t?.case_id,
  TreatmentName: t?.TreatmentName ?? t?.treatment_name ?? "",
  Price: Number(t?.Price ?? t?.price ?? 0),
  appointment_date: normalizeDateString(
    t?.Appointment_date ?? t?.appointment_date ?? t?.date
  ) ?? null,
});

const mapCase = (c: any): CaseData => ({
  ID: c?.ID,
  SignDate: c?.SignDate || c?.signDate || "",
  Note: c?.Note ?? c?.note ?? "",
  PatientID: c?.PatientID ?? c?.patientId ?? 0,
  DepartmentID: c?.DepartmentID ?? c?.departmentId,
  appointment_date: normalizeDateString(c?.Appointment_date ?? c?.appointment_date),
  TotalPrice: Number(c?.TotalPrice ?? c?.total_price ?? 0),
  Patient: c?.Patient ?? c?.patient ?? null,
  Treatment: (c?.Treatment || []).map(mapTreatment),
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

// 🔹 Shared formValue mapper
const mapFormValuesFromPatient = (p: Patient | null) => {
  if (!p) return {};
  const init = p.InitialSymptomps?.[0] ?? null;
  return {
    fullName: `${p.Prefix ?? ""} ${p.FirstName ?? ""} ${p.LastName ?? ""}`.trim(),
    age: p.Age ?? "",
    preExistingConditions: p.CongenitaDisease ?? "",
    phone: p.PhoneNumber ?? "",
    allergyHistory: p.DrugAllergy ?? "",
    symptomps: init?.Symptomps ?? "",
    bloodPressure: init?.BloodPressure ?? "",
    heartRate: init?.HeartRate ?? "",
    weight: init?.Weight ?? "",
    height: init?.Height ?? "",
    bloodType: p.BloodType ?? "",
  };
};

const mapCaseRow = (c: CaseData): CaseRow => ({
  id: c.ID || 0,
  patientId: c.PatientID || 0,
  appointment_date: c.appointment_date || "",
  treatments: c.Treatment || [],
  note: c.Note || "",
  patient: c.Patient || null,
  SignDate: c.SignDate || "",
  totalPrice: c.TotalPrice || 0,
});

// 🔹 API
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
    const { data } = await axios.get<CaseData[]>(`${API_BASE}/cases`);
    return data.map(mapCase);
  },

  getCaseByID: async (id: number): Promise<CaseData> => {
    const { data } = await axios.get<CaseData>(`${API_BASE}/cases/${id}`);
    return mapCase(data);
  },

  // ✅ combine logic: patient + case → formValues
  getCaseFormValuesByID: async (
    id: number,
    row: CaseRow,
    patientsList: Patient[]
  ) => {
    const data = await CaseAPI.getCaseByID(id);
    const patient = row.patient || patientsList.find((x) => x.ID === row.patientId) || null;
    return {
      patient,
      formValues: {
        departmentID: data.DepartmentID ?? undefined,
        dentist_Name: data.Department?.PersonalData
          ? `${data.Department.PersonalData.FirstName} ${data.Department.PersonalData.LastName}`
          : "",
        NationalID: patient?.CitizenID || patient?.NationalID || undefined,
        note: row.note,
        appointment_date: row.appointment_date ? dayjs(row.appointment_date) : null,
        treatments: (row.treatments || []).map((t) => ({
          treatment_name: t.TreatmentName,
          price: t.Price || 0,
        })),
        SignDate: data.SignDate ? dayjs(data.SignDate) : null,
        ...mapFormValuesFromPatient(patient),
      },
    };
  },

  addCaseFormData: async (
    newCase: CaseData & { _files?: { [k: string]: File[] } }
  ): Promise<CaseData> => {
    const treatmentsForServer = (newCase.Treatment || []).map(({...rest }) => rest);

    if (!newCase._files || Object.keys(newCase._files).length === 0) {
      const payload = {
        PatientID: newCase.PatientID,
        DepartmentID: newCase.DepartmentID,
        Note: newCase.Note,
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

    // multipart/form-data
    const fd = new FormData();
    fd.append("PatientID", String(newCase.PatientID));
    if (newCase.Note) fd.append("Note", newCase.Note);
    if (newCase.DepartmentID) fd.append("DepartmentID", String(newCase.DepartmentID));
    if (newCase.appointment_date) fd.append("Appointment_date", newCase.appointment_date);
    fd.append("Treatment", JSON.stringify(treatmentsForServer));

    Object.entries(newCase._files).forEach(([k, files]) =>
      files.forEach((file) => fd.append(k, file, file.name))
    );

    const { data } = await axios.post(`${API_BASE}/cases`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return mapCase(data);
  },

  updateCase: async (id: number, updatedCase: CaseData): Promise<CaseData> => {
    const { data } = await axios.put<CaseData>(`${API_BASE}/cases/${id}`, updatedCase);
    return mapCase(data);
  },

  buildCasePayload: (values: any, selectedPatient: Patient | null): Partial<CaseData> | null => {
    const patientId = selectedPatient?.ID || values.patientId;
    if (!patientId) return null;

    const treatments = (values.treatments || []).map((t: any) => ({
      TreatmentName: t.treatment_name,
      Price: Number(t.price || 0),
    }));

    return {
      appointment_date: cleanISOString(values.appointment_date) || undefined,
      SignDate: cleanISOString(values.SignDate) || new Date().toISOString(),
      Note: values.note || values.notes || "",
      PatientID: patientId,
      DepartmentID: values.departmentID ? Number(values.departmentID) : 1,
      TotalPrice: treatments.reduce((sum: number, t: { Price: number }) => sum + t.Price, 0),
      Treatment: treatments,
    };
  },

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
      return prevCases.map((r) => (r.id === editingCase.id ? mapCaseRow(updated) : r));
    } else {
      await CaseAPI.addCaseFormData(payload as CaseData);
      const latestCases = await CaseAPI.getAllCases();
      return latestCases.map(mapCaseRow);
    }
  },

  getPatientFormValuesByCitizenId: async (nid: string) => {
    if (!nid || nid.length !== 13) return { patient: null, formValues: null };
    const found = await CaseAPI.getPatientByCitizenId(nid);
    if (!found) return { patient: null, formValues: null };
    return { patient: found, formValues: mapFormValuesFromPatient(found) };
  },

  deleteCase: async (id: number) => {
    await axios.delete(`${API_BASE}/cases/${id}`);
  },
};
