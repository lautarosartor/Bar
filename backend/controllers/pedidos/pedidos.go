package pedidos

import "bar/models"

type ResponseMessage struct {
	Status  string `json:"status"`
	Data    Data   `json:"data,omitempty"`
	Message string `json:"message,omitempty"`
}

type Data struct {
	Pedido        *models.Pedidos  			`json:"pedido,omitempty"`
	Pedidos       []models.Pedidos 			`json:"pedidos,omitempty"`
	PedidoItems   []models.Pedido_Items `json:"items,omitempty"`
	TotalDataSize int64            			`json:"totalDataSize,omitempty"`
}