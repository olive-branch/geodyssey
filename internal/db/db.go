package db

import (
	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
)

// DB wraps gorm database connection struct
type DB struct {
	*gorm.DB
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
