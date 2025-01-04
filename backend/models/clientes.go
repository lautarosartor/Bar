package models

type Clientes struct {
	ID       uint   `json:"id" gorm:"primary_key"`
	Nombre   string `json:"nombre"`
	Apellido string `json:"apellido"`
	Dni      string `json:"dni"`
}

func (Clientes) TableName() string {
	return "clientes"
}
