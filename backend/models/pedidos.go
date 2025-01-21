package models

import "time"

type Pedidos struct {
	ID          uint           `json:"id" gorm:"primary_key"`
	Idsesion    uint           `json:"idsesion"`
	Idcliente   uint           `json:"idcliente"`
	Idestado    uint           `json:"idestado"`
	Total       float64        `json:"total"`
	CreatedAt   time.Time      `json:"created_at"`
	DeliveredAt *time.Time     `json:"delivered_at"`
	Sesion      *Sesiones      `json:"sesion,omitempty" gorm:"ForeignKey:idsesion;AssociationForeignKey:id"`
	Cliente     *Clientes      `json:"cliente,omitempty" gorm:"ForeignKey:idcliente;AssociationForeignKey:id"`
	Estado      *Estados       `json:"estado,omitempty" gorm:"ForeignKey:idestado;AssociationForeignKey:id"`
	Items       []PedidosItems `json:"items,omitempty" gorm:"ForeignKey:idpedido;AssociationForeignKey:id"`
}

func (Pedidos) TableName() string {
	return "pedidos"
}

type PedidosItems struct {
	ID         uint       `json:"id" gorm:"primary_key"`
	Idpedido   uint       `json:"idpedido"`
	Idproducto uint       `json:"idproducto"`
	Cantidad   int        `json:"cantidad"`
	Subtotal   float64    `json:"subtotal"`
	Pedido     *Pedidos   `json:"pedido,omitempty" gorm:"ForeignKey:idpedido;AssociationForeignKey:id"`
	Producto   *Productos `json:"producto,omitempty" gorm:"ForeignKey:idproducto;AssociationForeignKey:id"`
}

func (PedidosItems) TableName() string {
	return "pedidos_items"
}
