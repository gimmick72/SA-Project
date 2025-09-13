//frontend/src/services/https/CaseAPI.tsx
import axios from "axios";
const API_BASE = "http://localhost:8080/api";
import type { CaseData, Treatment, Patients, CaseRow } from "../../interface/Case";
import type { Patient } from "../../interface/patient";
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
      const { data } = await axios.get<Patient | null>(`${API_BASE}/cases/patients`, {
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
      patientsList.find((x) => x.id === row.patientId) ||
      null;

    const init =
      data.Patient?.initialsymptomps
 &&
        data.Patient.initialsymptomps
.length
        ? data.Patient.initialsymptomps
[0]
        : null;

    // เตรียมค่าไว้ใส่ใน Form
    const formValues: any = {
      departmentID: data.DepartmentID ?? undefined,
      dentist_Name: data.Department?.PersonalData
        ? `${data.Department.PersonalData.FirstName} ${data.Department.PersonalData.LastName}`
        : "",
      NationalID: patient?.citizenID || patient?.nationalID || undefined,
      fullName: patient
        ? `${patient.prefix || ""} ${patient.firstname || ""} ${patient.lastname || ""
        }`
        : "",
      age: patient?.age,
      preExistingConditions: patient?.congenital_disease ?? "",
      phonenumber: patient?.phone_number
        ?? "",
      allergyHistory: patient?.drug_allergy
        ?? "",
      note: row.note,
      appointment_date: row.appointment_date ? dayjs(row.appointment_date) : null,
      treatments: (row.treatments || []).map((t) => ({
        treatment_name: t.TreatmentName,
        price: t.Price || 0,
      })),
      SignDate: data.SignDate ? dayjs(data.SignDate) : null,
      symptomps: init?.symptomps ?? "",
       bloodpressure: init?.systolic && init?.diastolic
    ? `${init.systolic}/${init.diastolic}`
    : "",
      heartRate: init?.heartrate ?? "",
      weight: init?.weight ?? "",
      height: init?.height ?? "",
      bloodType: patient?.blood_type ?? "",
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
    selectedPatient: Patients | null,
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
    selectedPatient: Patients | null,
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
): Promise<{ patient: Patients | Patient | null; formValues: any | null }> => {
  if (!nid || nid.length !== 13) {
    return { patient: null, formValues: null };
  }

  const found = (await CaseAPI.getPatientByCitizenId(nid)) as Patients | Patient | null;
  if (!found) {
    return { patient: null, formValues: null };
  }

  try {
    const allCases = await CaseAPI.getAllCases();

    const matched = allCases.find((c) => {
      if (typeof c.PatientID !== "undefined" && typeof (found as any).ID !== "undefined") {
        return c.PatientID === (found as any).ID;
      }
      return !!(
        c.Patient &&
        (
          (c.Patient.CitizenID && String(c.Patient.CitizenID) === nid) ||
          (c.Patient.citizenID && String(c.Patient.citizenID) === nid) ||
          (c.Patient.citizenId && String(c.Patient.citizenId) === nid) ||
          (c.Patient.nationalID && String(c.Patient.nationalID) === nid) ||
          (c.Patient.nationalId && String(c.Patient.nationalId) === nid)
        )
      );
    });

    if (matched) {
      const row: CaseRow = {
        id: (matched.ID ?? 0) as number,
        patientId: (matched.PatientID ?? ((found as any).ID ?? 0)) as number,
        appointment_date: matched.appointment_date ?? null,
        treatments: matched.Treatment ?? [],
        note: matched.Note ?? "",
        patient: (matched as any).Patient ?? null,
        SignDate: matched.SignDate ?? "",
        totalPrice: matched.TotalPrice ?? 0,
      };

      // รีใช้ mapping ของ getCaseFormValuesByID
      const { formValues, patient } = await CaseAPI.getCaseFormValuesByID(
        matched.ID as number,
        row,
        [found as unknown as Patient]
      );

      // สร้างสำเนาแล้วกรอง/ลบฟิลด์ที่ไม่ต้องการคืน
      const cleaned: any = { ...(formValues ?? {}) };

      // ลบ/ไม่ส่งข้อมูลรหัสบุคลากร / staff
      delete cleaned.departmentID;
      delete cleaned.staffID;
      delete cleaned.staffCode;

      // ลบ/ไม่ส่งชื่อ/ลายเซ็นทันตแพทย์
      delete cleaned.dentist_Name;
      delete cleaned.dentistSignature;
      delete cleaned.dentistName;

      // ลบวันที่ลงชื่อ / วันที่เซ็น
      delete cleaned.SignDate;

      // ลบหมายเหตุ
      delete cleaned.note;
      delete cleaned.notes;

      // ลบ/ไม่ส่งข้อมูลการรักษาทั้งหมด
      delete cleaned.treatments;
      // เพื่อความแน่นอน ให้เคลียร์ appointment_date จากเคสก่อนหน้า (ไม่ต้องการดึงนัดหมายต่อเนื่อง)
      cleaned.appointment_date = null;

      return { patient: patient as Patients | Patient | null, formValues: cleaned };
    }
  } catch (err) {
    console.warn("❗ couldn't look up cases while building patient form values:", err);
    // ถ้า error ให้ fallback สร้าง formValues จาก patient
  }

  // Fallback: สร้าง formValues จาก found โดยตรง (รองรับหลายรูปแบบ key)
  const init =
    (found as any).InitialSymptomps ||
    (found as any).initialsymptomps ||
    null;

  const firstInit = Array.isArray(init) && init.length ? init[0] : null;
  const systolic = firstInit?.systolic ?? firstInit?.Systolic ?? null;
  const diastolic = firstInit?.diastolic ?? firstInit?.Diastolic ?? null;

  const formValues: any = {
    fullName: `${(found as any).Prefix ?? (found as any).prefix ?? ""} ${(found as any).FirstName ?? (found as any).firstname ?? ""} ${(found as any).LastName ?? (found as any).lastname ?? ""}`.trim(),
    age: (found as any).Age ?? (found as any).age ?? "",
    preExistingConditions: (found as any).congenital_disease ?? (found as any).congenitalDisease ?? "",
    phonenumber: (found as any).phone_number ?? (found as any).phonenumber ?? (found as any).PhoneNumber ?? "",
    allergyHistory: (found as any).drug_allergy ?? (found as any).drugallergy ?? "",
    symptomps: firstInit?.Symptomps ?? firstInit?.symptomps ?? "",
    bloodpressure: systolic && diastolic ? `${systolic}/${diastolic}` : "",
    heartRate: firstInit?.HeartRate ?? firstInit?.heartrate ?? "",
    bloodType: (found as any).BloodType ?? (found as any).blood_type ?? "",
    // ไม่เติม department/staff, SignDate, note, treatments — ตามที่ขอ
    appointment_date: null,
  };

  return { patient: found as Patients | Patient, formValues };
},



  deleteCase: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE}/cases/${id}`);
  },
};


