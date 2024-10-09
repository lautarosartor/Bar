package models

type Mesas struct {
	ID          uint   `json:"id" gorm:"primary_key"`
	NombreMesa  string `json:"nombre_mesa"`
	Capacidad   int    `json:"capacidad"`
	CodigoQR    string `json:"codigo_qr"`
	Descripcion string `json:"descripcion"`
}

func (Mesas) TableName() string {
	return "mesas"
}