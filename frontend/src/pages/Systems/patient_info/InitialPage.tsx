import "./design/initial.css";
import React from "react";


const InitialPage: React.FC= () => {
  
  return (
    (
      <div className="form-wrapper">
        <div className="form-container">
          <div className="form-card">
            {/* Header */}
            <div className="form-header">
              <div className="header-content">
                <div className="header-icon" />
                <h2 className="header-title">อาการเบื้องต้น</h2>
              </div>
            </div>
  
            {/* Content */}
            <form className="form-content" 
            // onSubmit={handleSubmit}
            >
              {/* ข้อมูลคนไข้ */}
              <section className="form-section">
                <div className="grid-4">
                  <div className="input-group">
                    <label className="input-label required" htmlFor="patientID">
                      รหัสคนไข้
                    </label>
                    <input
                      id="patientID"
                      name="patientID"
                      type="number"
                      min={1}
                      className="input-field"
                      placeholder="เช่น 123"
                      required
                    />
                  </div>
  
                  <div className="input-group">
                    <label className="input-label" htmlFor="serviceID">
                      รหัสบริการ (ServiceID)
                    </label>
                    <input
                      id="serviceID"
                      name="serviceID"
                      type="number"
                      min={0}
                      className="input-field"
                      placeholder="เช่น 10"
                    />
                  </div>
  
                  <div className="input-group">
                    <label className="input-label" htmlFor="heartrate">
                      อัตราการเต้นหัวใจ (bpm)
                    </label>
                    <input
                      id="heartrate"
                      name="heartrate"
                      type="text"
                      className="input-field"
                      placeholder="เช่น 78"
                    />
                  </div>
  
                  <div className="input-group">
                    <label className="input-label" htmlFor="bloodpressure">
                      ความดัน (mmHg)
                    </label>
                    <input
                      id="bloodpressure"
                      name="bloodpressure"
                      type="text"
                      className="input-field"
                      placeholder="เช่น 120/80"
                    />
                  </div>
                </div>
  
                <div className="grid-4">
                  <div className="input-group">
                    <label className="input-label" htmlFor="visit">
                      วันที่เข้ารับบริการ
                    </label>
                    <input
                      id="visit"
                      name="visit"
                      type="datetime-local"
                      className="input-field"
                      // defaultValue={todayLocal}
                    />
                  </div>
  
                  <div className="input-group">
                    <label className="input-label" htmlFor="weight">
                      น้ำหนัก (kg)
                    </label>
                    <input
                      id="weight"
                      name="weight"
                      type="number"
                      step="0.1"
                      min={0}
                      className="input-field"
                      placeholder="เช่น 60.5"
                    />
                  </div>
  
                  <div className="input-group">
                    <label className="input-label" htmlFor="height">
                      ส่วนสูง (cm)
                    </label>
                    <input
                      id="height"
                      name="height"
                      type="number"
                      step="0.1"
                      min={0}
                      className="input-field"
                      placeholder="เช่น 170"
                    />
                  </div>
                </div>
  
                <div className="input-group">
                  <label className="input-label required" htmlFor="symptomps">
                    อาการ
                  </label>
                  <textarea
                    id="symptomps"
                    name="symptomps"
                    className="textarea-field"
                    placeholder="บันทึกอาการเบื้องต้นของผู้ป่วย"
                    required
                  />
                </div>
              </section>
  
              {/* Actions */}
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-cancel"
                  onClick={() => window.history.back()}
                >
                  ยกเลิก
                </button>
                <button type="submit" className="btn btn-save">
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );
};
export default InitialPage;