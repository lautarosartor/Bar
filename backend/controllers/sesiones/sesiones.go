package sesiones

import (
	"bar/database"
	"bar/models"
	"fmt"
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

func Create(c echo.Context) error {
	db := database.GetDb()
	QR := c.Param("qr")

/* 	if err := c.Bind(&QR); err != nil {
		return c.JSON(http.StatusBadRequest, ResponseMessage{
			Status:		"error",
			Message:	"Invalid request body: " + err.Error(),
		})
	} */

	// Validación manual de los campos requeridos
	if QR == "" {
		return c.JSON(http.StatusBadRequest, ResponseMessage{
			Status:  "error",
			Message: "Debes escanear el código QR que está en tu mesa.",
		})
	}

	mesa := new(models.Mesas)
	db.Where("codigo_qr = ?", QR).First(&mesa)
	if mesa.ID == 0 {
		return c.JSON(http.StatusNotFound, ResponseMessage{
			Status: 	"error",
			Message:	"Mesa no encontrada.",
		})
	}

	newSesion := &models.Sesiones{
		Idmesa: mesa.ID,
	}

	if err := db.Create(&newSesion).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, ResponseMessage{
			Status:		"error",
			Message:	"Error inesperado al crear la sesión.",
		})
	}

	return c.JSON(http.StatusOK, ResponseMessage{
		Status:		"success",
		Message:	fmt.Sprintf("¡Iniciaste una nueva sesión en la mesa '%s'!", mesa.NombreMesa),
	})
}