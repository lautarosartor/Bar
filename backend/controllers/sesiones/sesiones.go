package sesiones

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
	Sesion        *models.Sesiones  `json:"sesion,omitempty"`
	Sesiones      []models.Sesiones `json:"sesiones,omitempty"`
	TotalDataSize int64             `json:"totalDataSize,omitempty"`
}

func GetAll(c echo.Context) error {
	db := database.GetDb()

	var totalDataSize int64 = 0
	var sesiones []models.Sesiones

	if c.QueryParam("activas") == "true" {
		db = db.Where("activo = ?", 1)
	}

	db.Preload("Mesa").Find(&sesiones).Count(&totalDataSize)

	if len(sesiones) == 0 {
		return c.JSON(http.StatusOK, ResponseMessage{
			Status:		"success",
			Message:	"Aún no hay sesiones activas hoy.",
		})
	}

	data := Data{Sesiones: sesiones, TotalDataSize: totalDataSize}
	return c.JSON(http.StatusOK, ResponseMessage{
		Status:	"success",
		Data:		data,
	})
}

func Get(c echo.Context) error {
	db := database.GetDb()
	sesionID := c.Param("id")
	sesion := new(models.Sesiones)

	db.Preload("Mesa").First(&sesion, sesionID)
	if sesion.ID == 0 {
		return c.JSON(http.StatusNotFound, ResponseMessage{
			Status: 	"error",
			Message:	"Sesión no encontrada.",
		})
	}

	data := Data{Sesion: sesion}
	return c.JSON(http.StatusOK, ResponseMessage{
		Status:	"success",
		Data:		data,
	})
}