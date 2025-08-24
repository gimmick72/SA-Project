type Appointment struct {
    gorm.Model

    Date time.Time `gorm:"type:date;index:uniq_slot,unique,priority:1" json:"date"`
    RoomID string  `gorm:"index:uniq_slot,unique,priority:2" json:"roomId"`
    Time   string  `gorm:"size:5;index:uniq_slot,unique,priority:3" json:"time"`

    PatientID   string  `json:"patientId"`
    PatientName string  `json:"patientName"`
    Type        string  `json:"type"` // "appointment" | "walkin"
    CaseCode    *string `json:"caseCode,omitempty"`
    Note        *string `json:"note,omitempty"`
    DurationMin *int    `json:"durationMin,omitempty"`
}
