package db

import (
	"time"

	"github.com/google/uuid"
)

// Model - Base struct for database models
// Contains fields like ID, CreatedAt, UpdatedAt, DeletedAt
type Model struct {
	ID        uuid.UUID  `gorm:"type:uuid;primary_key;" json:"id"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `json:"-"`
}

// Certificate (Свидетельство)
type Certificate struct {
	Model
	InstrumentID uuid.UUID   `json:"instrumentId"`
	Instrument   *Instrument `json:"instument,omitempty"`
	Number       string      `json:"number"`
	Sign         string      `json:"sign"`
	Issuer       string      `json:"issuer"`
	Date         time.Time   `json:"date"`
}

// Instrument (СИ - Средство измерения)
type Instrument struct {
	Model
	Name           string        `json:"name"`
	Mod            string        `json:"mod"`
	SerialNumber   string        `json:"serial"`
	RegistryNumber string        `json:"registry"`
	Certificates   []Certificate `json:"certs"`
}

// Request (Заявка)
type Request struct {
	Model
	InstrumentID uuid.UUID  `json:"instrumentId"`
	Instrument   Instrument `json:"instrument"`

	Client string `json:"client"`
	Order  string `json:"order"`
	Number string `json:"number"`

	Service  string `json:"service"`
	Comments string `json:"comments"`

	ArrivedToApproverAt *time.Time `json:"arrivedToApproverAt"`
	ArrivedAt           *time.Time `json:"arrivedAt"`
	DeadlineAt          *time.Time `json:"deadlineAt"`
	DepartedAt          *time.Time `json:"departedAt"`
}
