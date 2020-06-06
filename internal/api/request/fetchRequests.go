package request

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/olive-branch/geodyssey/internal/api/shared"
	"github.com/olive-branch/geodyssey/internal/db"
)

type FetchRequestsOptions struct {
	Limit  int      `form:"limit"`
	Offset int      `form:"offset"`
	Sort   []string `form:"sort"`
}

type FetchRequestsResult struct {
	shared.PaginatedResponse
	Items []db.Request `json:"items"`
}

func FetchRequestsHandler(server *shared.Server) func(*gin.Context) {
	return func(ctx *gin.Context) {
		var request FetchRequestsOptions
		if err := ctx.ShouldBindQuery(&request); err != nil {
			ctx.JSON(http.StatusBadRequest, shared.ErrorResponse{"Invalid request"})
		}

		response := getRequests(server.DB, request)

		ctx.JSON(http.StatusOK, response)
	}
}

func getRequests(sql *db.DB, request FetchRequestsOptions) FetchRequestsResult {
	offset := request.Offset
	limit := request.Limit
	if limit == 0 {
		limit = 100
	}

	filter := func(db *db.DB) *db.DB {
		return db
	}

	data := []db.Request{}
	filter(sql).
		Preload("Instrument").
		Preload("Instrument.Certificates").
		Limit(limit).
		Offset(offset).
		Find(&data)

	count := 0
	filter(sql).Model(&data).Count(&count)

	return FetchRequestsResult{
		shared.PaginatedResponse{count, limit, offset},
		data,
	}
}
