package sesiones

import "bar/models"

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