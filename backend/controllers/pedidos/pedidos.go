package pedidos

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
	Pedido        *models.Pedidos      `json:"pedido,omitempty"`
	Pedidos       []models.Pedidos     `json:"pedidos,omitempty"`
	PedidoItems   []models.PedidoItems `json:"items,omitempty"`
	TotalDataSize int64                `json:"totalDataSize,omitempty"`
}

func GetAll(c echo.Context) error {
	db := database.GetDb()

	var totalDataSize int64 = 0
	var pedidos []models.Pedidos

	db.Preload("Sesion.Mesa").Preload("Estado").Preload("Items.Producto").Find(&pedidos).Count(&totalDataSize)

	if len(pedidos) == 0 {
		return c.JSON(http.StatusOK, ResponseMessage{
			Status:  "success",
			Message: "Aún no hay pedidos hoy.",
		})
	}

	data := Data{Pedidos: pedidos, TotalDataSize: totalDataSize}
	return c.JSON(http.StatusOK, ResponseMessage{
		Status: "success",
		Data:   data,
	})
}

func Get(c echo.Context) error {
	db := database.GetDb()
	pedidoID := c.Param("id")
	pedido := new(models.Pedidos)

	db.Preload("Sesion.Mesa").Preload("Estado").First(&pedido, pedidoID)
	if pedido.ID == 0 {
		return c.JSON(http.StatusNotFound, ResponseMessage{
			Status:  "error",
			Message: "Pedido no encontrado.",
		})
	}

	data := Data{Pedido: pedido}
	return c.JSON(http.StatusOK, ResponseMessage{
		Status: "success",
		Data:   data,
	})
}

func Create(c echo.Context) error {
	db := database.GetDb()
	payload := new(models.Pedidos)

	// Bindeamos el payload (solo recibimos el idsesion, y los items[])
	if err := c.Bind(&payload); err != nil {
		return c.JSON(http.StatusBadRequest, ResponseMessage{
			Status:  "error",
			Message: "Invalid request body: " + err.Error(),
		})
	}

	// Verificamos que la sesion aún esté activa
	sesion := new(models.Sesiones)
	db.Where("activo = ?", 1).First(&sesion, payload.Idsesion)
	if sesion.ID == 0 {
		return c.JSON(http.StatusNotFound, ResponseMessage{
			Status:  "error",
			Message: "Sesión no encontrada.",
		})
	}

	newPedido := &models.Pedidos{
		Idsesion: payload.Idsesion,
		Idestado: 1, // En preparación
	}

	// Creamos el pedido
	if err := db.Create(&newPedido).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, ResponseMessage{
			Status:  "error",
			Message: "Error inesperado al realizar el pedido.",
		})
	}

	// Procesamos los items
	for _, item := range payload.Items {
		producto := new(models.Productos) // Verificar si existe cada producto
		db.First(&producto, item.Idproducto)
		if producto.ID == 0 {
			return c.JSON(http.StatusNotFound, ResponseMessage{
				Status:  "error",
				Message: fmt.Sprintf("No se encontro un producto con ID %v.", item.Idproducto),
			})
		}

		// Creamos un nuevo item en el pedido
		newItem := &models.PedidoItems{
			Idpedido:   newPedido.ID,
			Idproducto: producto.ID,
			Cantidad:   item.Cantidad,
			Total:      producto.Precio * float64(item.Cantidad),
		}

		if err := db.Create(&newItem).Error; err != nil {
			return c.JSON(http.StatusInternalServerError, ResponseMessage{
				Status:  "error",
				Message: fmt.Sprintf("Error inesperado al agregar '%s' al pedido.", producto.Nombre),
			})
		}
	}

	return c.JSON(http.StatusOK, ResponseMessage{
		Status:  "success",
		Message: "¡Pedido realizado con éxito!.",
	})
}
