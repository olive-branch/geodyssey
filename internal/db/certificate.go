package db

import (
	"time"

	"github.com/google/uuid"
)

// Certificate (Свидетельство)
type Certificate struct {
	Model
	InstrumentID uuid.UUID
	Instrument   Instrument
	Number       string
	Sign         string
	Issuer       string
	Date         time.Time
}

// GetCertificates returns all instrument certificates
func (db *DB) GetCertificates(instrument uuid.UUID) []Certificate {
	certs := []Certificate{}

	db.Where("instrument_id = ?", instrument).Find(&certs)

	return certs
}
