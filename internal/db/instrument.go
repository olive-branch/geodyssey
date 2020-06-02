package db

// Instrument (СИ - Средство измерения)
type Instrument struct {
	Model
	Name           string
	Mod            string
	SerialNumber   string
	RegistryNumber string
}
