package db

import (
	"time"

	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
)

// DB wraps gorm database connection struct
type DB struct {
	*gorm.DB
}

// Model - Base struct for database models
// Contains fields like ID, CreatedAt, UpdatedAt, DeletedAt
type Model struct {
	ID        uuid.UUID `gorm:"type:uuid;primary_key;"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt *time.Time
}

// BeforeCreate - gorm hook run before instance is inserted in database
func (base *Model) BeforeCreate(scope *gorm.Scope) error {
	f, foundID := scope.FieldByName(scope.PrimaryKey())
	if foundID && !f.IsBlank {
		return nil
	}

	uuid, err := uuid.NewRandom()
	if err != nil {
		return err
	}
	return scope.SetColumn("ID", uuid)
}
