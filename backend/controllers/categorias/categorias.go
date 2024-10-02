package categorias

import (
	"bar/database"
	"bar/models"
	"net/http"

	"github.com/labstack/echo/v4"
)

type ResponseMessage struct {
	Status	string	`json:"status"`
	Data		Data		`json:"data,omitempty"`
	Message	string	`json:"message,omitempty"`
}

type Data struct {
	Categorias 		[]models.Categorias	`json:"categorias,omitempty"`
	TotalDataSize int64								`json:"totalDataSize,omitempty"`
}

func GetAll(c echo.Context) error {
	db := database.GetDb()

	var totalDataSize int64 = 0
	var categorias []models.Categorias

	db.Find(&categorias).Count(&totalDataSize)

	data := Data{Categorias: categorias, TotalDataSize: totalDataSize}
	return c.JSON(http.StatusOK, ResponseMessage{
		Status:	"success",
		Data:		data,
	})
}