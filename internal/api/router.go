package api

import (
	"github.com/olive-branch/geodyssey/internal/api/request"
	"github.com/olive-branch/geodyssey/internal/api/shared"
)

func AddRoutes(server *shared.Server) {
	request.AddRoutes(server)
}
