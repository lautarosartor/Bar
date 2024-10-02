package models

type Clientes struct {
	ID       uint      `json:"id" gorm:"primary_key"`
	Idsesion uint      `json:"idsesion"`
	Idrol    uint      `json:"idrol"`
	Sesion   *Sesiones `json:"sesion,omitempty" gorm:"ForeignKey:idsesion;AssociationForeignKey:id"`
	Rol      *Roles    `json:"rol,omitempty" gorm:"ForeignKey:idrol;AssociationForeignKey:id"`
}

func (Clientes) TableName() string {
	return "clientes"
}