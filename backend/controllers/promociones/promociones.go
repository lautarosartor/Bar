package promociones

import (
	"bar/database"
	"bar/models"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
)

type ResponseMessage struct {
	Status  string `json:"status"`
	Data    Data   `json:"data,omitempty"`
	Message string `json:"message,omitempty"`
}

type Data struct {
	Promocion     *models.Promociones  `json:"promocion,omitempty"`
	Promociones   []models.Promociones `json:"promociones,omitempty"`
	TotalDataSize int64                `json:"totalDataSize,omitempty"`
}

func GetAll(c echo.Context) error {
	db := database.GetDb()

	var totalDataSize int64 = 0
	var promociones []models.Promociones

	db.Find(&promociones).Count(&totalDataSize)

	data := Data{Promociones: promociones, TotalDataSize: totalDataSize}
	return c.JSON(http.StatusOK, ResponseMessage{
		Status:	"success",
		Data:		data,
	})
}

func Get(c echo.Context) error {
	db := database.GetDb()
	promocionID := c.Param("id")
	promocion := new(models.Promociones)

	db.Where("fecha_finalizacion <= ?", time.Now()).First(&promocion, promocionID)
	if promocion.ID == 0 {
		return c.JSON(http.StatusNotFound, ResponseMessage{
			Status:		"error",
			Message:	"Promocion no encontrada.",
		})
	}

	data := Data{Promocion: promocion}
	return c.JSON(http.StatusOK, ResponseMessage{
		Status:	"success",
		Data:		data,
	})
}

func Create(c echo.Context) error {
	db := database.GetDb()
	payload := new(models.Promociones)

	if err := c.Bind(&payload); err != nil {
		return c.JSON(http.StatusBadRequest, ResponseMessage{
			Status:		"error",
			Message:	"Invalid request body: " + err.Error(),
		})
	}

	// Validación manual de los campos requeridos
	if payload.Titulo == "" || payload.FechaInicio.IsZero() || payload.FechaFin.IsZero() {
		return c.JSON(http.StatusBadRequest, ResponseMessage{
			Status:  "error",
			Message: "El titulo de la promoción, fecha inicio y fecha fin son campos requeridos.",
		})
	} else if payload.FechaInicio.After(payload.FechaFin) {
		return c.JSON(http.StatusBadRequest, ResponseMessage{
			Status:  "error",
			Message: "La fecha de inicio no puede ser posterior a la fecha de finalización.",
		})
	}
	
	newPromocion := &models.Promociones{
		Titulo:				payload.Titulo,
		Descripcion:	payload.Descripcion,
		FechaInicio:	payload.FechaInicio,
		FechaFin:			payload.FechaFin,
		Promocion:		payload.Promocion,
	}

	if err := db.Create(&newPromocion).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, ResponseMessage{
			Status:		"error",
			Message:	"Error inesperado al crear la promoción.",
		})
	}

	return c.JSON(http.StatusOK, ResponseMessage{
		Status:		"success",
		Message:	"¡Promoción creada con éxito!.",
	})
}

func Update(c echo.Context) error {
	db := database.GetDb()
	promocionID := c.Param("id")
	request := new(models.Promociones)

	if err := c.Bind(&request); err != nil {
		return c.JSON(http.StatusBadRequest, ResponseMessage{
			Status:		"error",
			Message:	"Invalid request body: " + err.Error(),
		})
	}

	// Buscamos si la promocion existe
	promocion := new(models.Promociones)
	db.First(&promocion, promocionID)
	if promocion.ID == 0 {
		return c.JSON(http.StatusNotFound, ResponseMessage{
			Status: 	"error",
			Message:	"Promoción no encontrada.",
		})
	}

	if err := db.Where("id = ?", promocion.ID).Updates(&request).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, ResponseMessage{
			Status:		"error",
			Message:	"Error inesperado al actualizar la promoción.",
		})
	}

	return c.JSON(http.StatusOK, ResponseMessage{
		Status:		"success",
		Message:	"¡Promoción actualizada con éxito!.",
	})
}