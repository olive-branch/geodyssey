package api

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (server *Server) AddRoutes() {
	server.GET("instrument/:id/certificates", func(ctx *gin.Context) {
		id, err := uuid.Parse(ctx.Param("id"))

		if err != nil {
			ctx.JSON(400, gin.H{"error": err.Error()})
			return
		}

		certs := server.DB.GetCertificates(id)

		ctx.JSON(200, certs)
	})

}
