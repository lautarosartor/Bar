package models

import "time"

type Pedidos struct {
	ID        	uint 				`json:"id" gorm:"primary_key"`
	Idsesion  	uint 				`json:"idsesion"`
	Idestado  	uint 				`json:"idestado"`
	CreatedAt 	time.Time		`json:"created_at"`
	DeliveredAt	*time.Time	`json:"delivered_at"`
	Sesion			*Sesiones		`json:"sesion,omitempty" gorm:"ForeignKey:idsesion;AssociationForeignKey:id"`
	Estado			*Estados		`json:"estado,omitempty" gorm:"ForeignKey:idestado;AssociationForeignKey:id"`
	Items				[]Pedido_Items	`json:"items,omitempty" gorm:"ForeignKey:idpedido;AssociationForeignKey:id"`
}

func (Pedidos) TableName() string {
	return "pedidos"
}

type Pedido_Items struct {
	ID        	uint 				`json:"id" gorm:"primary_key"`
	Idpedido  	uint 				`json:"idpedido"`
	Idproducto  uint 				`json:"idproducto"`
	Cantidad 		int					`json:"cantidad"`
	Total 			float64			`json:"total"`
	Pedido			*Pedidos		`json:"pedido,omitempty" gorm:"ForeignKey:idpedido;AssociationForeignKey:id"`
	Producto		*Productos	`json:"producto,omitempty" gorm:"ForeignKey:idproducto;AssociationForeignKey:id"`
}

func (Pedido_Items) TableName() string {
	return "pedido_items"
}