package db

import (
	"time"

	"github.com/google/uuid"
)

// Init creates app tables if their are missing
func (db *DB) Init() {
	db.AutoMigrate(&Instrument{}, &Applience{}, &Certificate{})
}

// CreateSampleData inserts test records if their are missing
func (db *DB) CreateSampleData() {
	arrivedAt := time.Date(2020, 01, 01, 0, 0, 0, 0, time.UTC)
	instrument1 := Instrument{
		Model:          model("4ea209ed-9273-4d05-98d2-e2257eff4b3f"),
		Name:           "Тахеометр электронный",
		Mod:            "Leica TS50",
		SerialNumber:   "358564",
		RegistryNumber: "52664-10",
	}
	db.createIfNotExists(&instrument1)

	db.createIfNotExists(&Instrument{
		Model:          model("5ba209ed-9273-4d05-98d2-e2257eff4b4e"),
		Name:           "Тахеометр электронный",
		Mod:            "Leica AB42",
		SerialNumber:   "358565",
		RegistryNumber: "52664-11",
	})

	db.createIfNotExists(&Applience{
		Model:               model("099f6ba5-56e0-4433-aacb-66cc55769eef"),
		InstrumentID:        instrument1.ID,
		Client:              `ФБУ "Самарский ЦСМ"`,
		Order:               "МК1515 от 25.15.20",
		Number:              "3545",
		Service:             "Поверка",
		Comments:            "1-разряд",
		ArrivedToApproverAt: &arrivedAt,
	})

	db.createIfNotExists(&Certificate{
		Model:        model("ad4f9030-b0e1-47bc-ab82-50c56eeb47a0"),
		InstrumentID: instrument1.ID,
		Number:       "8/832-115-20",
		Sign:         "ГМС 1900554423",
		Issuer:       "Иванов Иван Иванович",
		Date:         arrivedAt,
	})
	db.createIfNotExists(&Certificate{
		Model:        model("fd4f9030-b0e1-47bc-ab82-50c56eeb47a1"),
		InstrumentID: instrument1.ID,
		Number:       "8/832-115-19",
		Sign:         "ГМС 1900554422",
		Issuer:       "Иванов Иван Иванович",
		Date:         arrivedAt.AddDate(-1, 0, 0),
	})
}

func (db *DB) createIfNotExists(value interface{}) {
	if db.HasTable(value) {
		db.FirstOrCreate(value)
	}
}

func model(id string) Model {
	date := time.Now()

	return Model{
		ID:        uuid.MustParse(id),
		CreatedAt: date,
		UpdatedAt: date,
	}
}
