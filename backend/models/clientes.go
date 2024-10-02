package models

type Clientes struct {
	ID       uint      `json:"id" gorm:"primary_key"`
	Idsesion uint      `json:"idsesion"`
	Idmesa   uint      `json:"idmesa"`
	Sesion   *Sesiones `json:"sesion,omitempty" gorm:"ForeignKey:idsesion;AssociationForeignKey:id"`
	Mesa     *Mesas    `json:"mesa,omitempty" gorm:"ForeignKey:idmesa;AssociationForeignKey:id"`
}

func (Clientes) TableName() string {
	return "clientes"
}