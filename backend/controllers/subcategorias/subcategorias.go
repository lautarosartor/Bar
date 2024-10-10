package subcategorias

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
	Subcategorias []models.Subcategorias `json:"subcategorias,omitempty"`
	Subcategoria  *models.Subcategorias  `json:"subcategoria,omitempty"`
	TotalDataSize int64                  `json:"totalDataSize,omitempty"`
}

func GetAll(c echo.Context) error {
	db := database.GetDb()

	var totalDataSize int64 = 0
	var subcategorias []models.Subcategorias

	if c.QueryParam("categoria") == "1" {
		db = db.Where("idcategoria = ?", 1)
	} else if c.QueryParam("categoria") == "2" {
		db = db.Where("idcategoria = ?", 2)
	} else if c.QueryParam("categoria") == "3" {
		db = db.Where("idcategoria = ?", 3)
	}
	
	db.Preload("Categoria").Find(&subcategorias).Count(&totalDataSize)

	data := Data{Subcategorias: subcategorias, TotalDataSize: totalDataSize}
	return c.JSON(http.StatusOK, ResponseMessage{
		Status: "success",
		Data:   data,
	})
}

func Get(c echo.Context) error {
	db := database.GetDb()
	subcategoriaID := c.Param("id")
	subcategoria := new(models.Subcategorias)

	db.Preload("Categoria").First(&subcategoria, subcategoriaID)
	if subcategoria.ID == 0 {
		return c.JSON(http.StatusNotFound, ResponseMessage{
			Status:  "error",
			Message: "Subcategoria no encontrada.",
		})
	}

	data := Data{Subcategoria: subcategoria}
	return c.JSON(http.StatusOK, ResponseMessage{
		Status: "success",
		Data:   data,
	})
}