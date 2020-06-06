package request

import "github.com/olive-branch/geodyssey/internal/api/shared"

func AddRoutes(server *shared.Server) {
	group := server.Group("/api/request")
	{
		group.GET("/", FetchRequestsHandler(server))
	}
}
