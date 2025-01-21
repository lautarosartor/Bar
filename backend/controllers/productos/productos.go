package productos

import (
	"bar/database"
	"bar/models"
	"fmt"
	"net/http"

	"github.com/go-sql-driver/mysql"
	"github.com/labstack/echo/v4"
)

type ResponseMessage struct {
	Status  string `json:"status"`
	Data    Data   `json:"data,omitempty"`
	Message string `json:"message,omitempty"`
}

type Data struct {
	Producto      *models.Productos  `json:"producto,omitempty"`
	Productos     []models.Productos `json:"productos,omitempty"`
	TotalDataSize int64              `json:"totalDataSize,omitempty"`
}

func GetAll(c echo.Context) error {
	db := database.GetDb()
	searchValue := c.QueryParam("searchValue")
	searchedColumn := c.QueryParam("searchedColumn")

	switch searchedColumn {
	case "subcategoria":
		db = db.Joins("INNER JOIN subcategorias ON productos.id = subcategorias.id").
			Where("subcaterogias.nombre = ?", searchValue)
	}

	if searchValue != "" {
		db = db.Where(`
			productos.nombre like ?
		`, "%"+c.QueryParam("searchValue")+"%")
	}

	var totalDataSize int64 = 0
	db.Table("productos").Count(&totalDataSize)

	var productos []models.Productos
	db.Select("productos.*").
		Preload("Subcategoria.Categoria").
		Find(&productos)

	data := Data{Productos: productos, TotalDataSize: totalDataSize}
	return c.JSON(http.StatusOK, ResponseMessage{
		Status: "success",
		Data:   data,
	})
}

/* func GetAll(c echo.Context) error {
	db := database.GetDb()

	var totalDataSize int64 = 0
	var productos []models.Productos

	db.Find(&productos).Count(&totalDataSize)

	data := Data{Productos: productos, TotalDataSize: totalDataSize}
	return c.JSON(http.StatusOK, ResponseMessage{
		Status: "success",
		Data:   data,
	})
} */

func Get(c echo.Context) error {
	db := database.GetDb()
	productoID := c.Param("id")
	producto := new(models.Productos)

	db.Preload("Subcategoria").First(&producto, productoID)
	if producto.ID == 0 {
		return c.JSON(http.StatusNotFound, ResponseMessage{
			Status:  "error",
			Message: "Producto no encontrado.",
		})
	}

	data := Data{Producto: producto}
	return c.JSON(http.StatusOK, ResponseMessage{
		Status: "success",
		Data:   data,
	})
}

func Create(c echo.Context) error {
	db := database.GetDb()
	payload := new(models.Productos)

	if err := c.Bind(&payload); err != nil {
		return c.JSON(http.StatusBadRequest, ResponseMessage{
			Status:  "error",
			Message: "Invalid request body: " + err.Error(),
		})
	}

	// Validación manual de los campos requeridos
	if payload.Nombre == "" || payload.Precio < 0 || payload.Stock < 0 {
		return c.JSON(http.StatusBadRequest, ResponseMessage{
			Status:  "error",
			Message: "El nombre del producto, el precio y el stock son requeridos.",
		})
	}

	newProducto := &models.Productos{
		Idsubcategoria: payload.Idsubcategoria,
		Nombre:         payload.Nombre,
		Descripcion:    payload.Descripcion,
		Precio:         payload.Precio,
		Stock:          payload.Stock,
		ImgUrl:         payload.ImgUrl,
	}

	// Creamos el producto
	if err := db.Create(&newProducto).Error; err != nil {
		if mysqlErr, ok := err.(*mysql.MySQLError); ok && mysqlErr.Number == 1062 {
			return c.JSON(http.StatusBadRequest, ResponseMessage{
				Status:  "error",
				Message: fmt.Sprintf("Ya posees el producto '%v'.", newProducto.Nombre),
			})
		} else {
			return c.JSON(http.StatusInternalServerError, ResponseMessage{
				Status:  "error",
				Message: "Error inesperado al crear el producto.",
			})
		}
	}

	return c.JSON(http.StatusOK, ResponseMessage{
		Status:  "success",
		Message: "¡Producto creado con éxito!.",
	})
}

func Update(c echo.Context) error {
	db := database.GetDb()
	productoID := c.Param("id")
	request := new(models.Productos)

	if err := c.Bind(&request); err != nil {
		return c.JSON(http.StatusBadRequest, ResponseMessage{
			Status:  "error",
			Message: "Invalid request body: " + err.Error(),
		})
	}

	// Buscamos si la mesa existe
	producto := new(models.Productos)
	db.First(&producto, productoID)
	if producto.ID == 0 {
		return c.JSON(http.StatusNotFound, ResponseMessage{
			Status:  "error",
			Message: "Producto no encontrado.",
		})
	}

	if err := db.Where("id = ?", producto.ID).Updates(&request).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, ResponseMessage{
			Status:  "error",
			Message: "Error inesperado al actualizar el producto.",
		})
	}

	return c.JSON(http.StatusOK, ResponseMessage{
		Status:  "success",
		Message: "¡Producto actualizado con éxito!.",
	})
}
