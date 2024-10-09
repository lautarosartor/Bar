package mesas

import (
	"bar/database"
	"bar/models"
	"net/http"

	"github.com/labstack/echo/v4"
)

type ResponseMessage struct {
	Status  string `json:"status"`
	Data    Data   `json:"data,omitempty"`
	Message string `json:"message,omitempty"`
}

type Data struct {
	Mesas         []models.Mesas `json:"mesas,omitempty"`
	TotalDataSize int64          `json:"totalDataSize,omitempty"`
}

func GetAll(c echo.Context) error {
	db := database.GetDb()

	var totalDataSize int64 = 0
	var mesas []models.Mesas

	db.Find(&mesas).Count(&totalDataSize)

	data := Data{Mesas: mesas, TotalDataSize: totalDataSize}
	return c.JSON(http.StatusOK, ResponseMessage{
		Status:	"success",
		Data:		data,
	})
}