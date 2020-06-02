package db

import (
	"time"

	"github.com/google/uuid"
)

// Applience (Заявка)
type Applience struct {
	Model
	InstrumentID uuid.UUID
	Instrument   Instrument

	Client string
	Order  string
	Number string

	Service  string
	Comments string

	ArrivedToApproverAt *time.Time
	ArrivedAt           *time.Time
	DeadlineAt          *time.Time
	DepartedAt          *time.Time
}
