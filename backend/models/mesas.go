package models

type Mesas struct {
	ID         uint `json:"id" gorm:"primary_key"`
	NumeroMesa int  `json:"numero_mesa"`
	Capacidad  int  `json:"capacidad"`
}

func (Mesas) TableName() string {
	return "mesas"
}