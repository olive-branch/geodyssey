package api

import (
	"github.com/gin-gonic/gin"
	"github.com/olive-branch/geodyssey/internal/db"
)

type Server struct {
	*gin.Engine
	DB *db.DB
}
