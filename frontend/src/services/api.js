import { config } from "./config";

const apiOrigin = config.URL_API;
const publicOrigin = config.URL_PUBLIC;

const publicOptions = (method, data) => {
  let opt = {
    method,
    headers: {
      'Content-Type': 'application/json',
    }
  };
  if (data) {
    opt.body = JSON.stringify(data);
  }
  return opt;
}

const privateOptions = (method, data) => {
  let opt = {
    method,
    headers: {
      'Content-Type':   'application/json',
      'AUTHORIZATION':  `Bearer ${sessionStorage.getItem('token')}`
    }
  };
  if (data) {
    opt.body = JSON.stringify(data);
  }
  return opt;
}

export const api = {
  auth: {
    async login(data) {
      const response = await fetch(publicOrigin + "/login", publicOptions('POST', data));
      const res = await response.json();
      return res;
    },
    async register(data) {
      const response = await fetch(publicOrigin + "/register", publicOptions('POST', data));
      const res = await response.json();
      return res;
    }
  },

  usuarios: {
    async getAllUsers() {
      const response = await fetch(apiOrigin + "/usuarios", privateOptions('GET'));
      const data = await response.json();
      return data;
    },
    async getUser(id) {
      const response = await fetch(apiOrigin + `/usuario/${id}`, privateOptions('GET'));
      const data = await response.json();
      return data;
    }
  },

  categorias: {
    async getAllCategories() {
      const response = await fetch(apiOrigin + "/categorias", privateOptions('GET'));
      const data = await response.json();
      return data;
    },
  },

  subcategorias: {
    async getAllSubcategories(idCategoria = "") {
      const response = await fetch(apiOrigin + `/subcategorias?categoria=${idCategoria}`, privateOptions('GET'));
      const data = await response.json();
      return data;
    },
    async getSubcategorie(id) {
      const response = await fetch(apiOrigin + `/subcategoria/${id}`, privateOptions('GET'));
      const data = await response.json();
      return data;
    },
  },

  promociones: {
    async getAllPromotions() {
      const response = await fetch(apiOrigin + "/promociones", privateOptions('GET'));
      const data = await response.json();
      return data;
    },
    async getPromotion(id) {
      const response = await fetch(apiOrigin + `/promocion/${id}`, privateOptions('GET'));
      const data = await response.json();
      return data;
    },
    async createPromotion(data) {
      const response = await fetch(apiOrigin + "/promocion", privateOptions('POST', data));
      const res = await response.json();
      return res;
    },
    async updatePromotion(id, data) {
      const response = await fetch(apiOrigin + `/promocion/${id}`, privateOptions('PUT', data));
      const res = await response.json();
      return res;
    }
  },

  mesas: {
    async getAllTables() {
      const response = await fetch(apiOrigin + "/mesas", privateOptions('GET'));
      const data = await response.json();
      return data;
    },
    async getTable(id) {
      const response = await fetch(apiOrigin + `/mesa/${id}`, privateOptions('GET'));
      const data = await response.json();
      return data;
    },
    async createTable(data) {
      const response = await fetch(apiOrigin + "/mesa", privateOptions('POST', data));
      const res = await response.json();
      return res;
    },
    async updateTable(id, data) {
      const response = await fetch(apiOrigin + `/mesa/${id}`, privateOptions('PUT', data));
      const res = await response.json();
      return res;
    }
  },

  productos: {
    async getAllProducts() {
      const response = await fetch(apiOrigin + "/productos", privateOptions('GET'));
      const data = await response.json();
      return data;
    },
    async getProduct(id) {
      const response = await fetch(apiOrigin + `/producto/${id}`, privateOptions('GET'));
      const data = await response.json();
      return data;
    },
    async createProduct(data) {
      const response = await fetch(apiOrigin + "/producto", privateOptions('POST', data));
      const res = await response.json();
      return res;
    },
    async updateProduct(id, data) {
      const response = await fetch(apiOrigin + `/producto/${id}`, privateOptions('PUT', data));
      const res = await response.json();
      return res;
    }
  },

  pedidos: {
    async getAllOrders() {
      const response = await fetch(apiOrigin + "/pedidos", privateOptions('GET'));
      const data = await response.json();
      return data;
    },
    async getOrder(id) {
      const response = await fetch(apiOrigin + `/pedido/${id}`, privateOptions('GET'));
      const data = await response.json();
      return data;
    },
    async createOrder(data) {
      const response = await fetch(publicOrigin + "/pedido", publicOptions('POST', data));
      const res = await response.json();
      return res;
    }
  },

  sesiones: {
    async getAllSesiones(activas = false) {
      const response = await fetch(apiOrigin + `/sesiones?activas=${activas}`, privateOptions('GET'));
      const data = await response.json();
      return data;
    },
    async getSesion(id) {
      const response = await fetch(apiOrigin + `/sesion/${id}`, privateOptions('GET'));
      const data = await response.json();
      return data;
    },
    async createSesion(qr) {
      const response = await fetch(publicOrigin + `/sesion/${qr}`, publicOptions('POST'));
      const res = await response.json();
      return res;
    }
  },

  clientes: {
    async getAllCustomers() {
      const response = await fetch(apiOrigin + "/clientes", privateOptions('GET'));
      const data = await response.json();
      return data;
    },
    async getCustomer(id) {
      const response = await fetch(apiOrigin + `/cliente/${id}`, privateOptions('GET'));
      const data = await response.json();
      return data;
    }
  }
}