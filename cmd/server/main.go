package main

import (
	"fmt"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"

	"github.com/olive-branch/geodyssey/internal/api"
	"github.com/olive-branch/geodyssey/internal/db"
)

func main() {
	gormdb, err := gorm.Open("postgres", "host=192.168.0.12 port=5432 user=postgres dbname=geodyssey password=postgres sslmode=disable")
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	defer gormdb.Close()

	conn := db.DB{DB: gormdb}
	conn.Init()
	conn.CreateSampleData()

	engine := gin.Default()
	server := api.Server{Engine: engine, DB: &conn}
	server.AddRoutes()

	server.Run()
}
