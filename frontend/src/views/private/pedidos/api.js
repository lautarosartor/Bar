import { config } from "../../../services/config";
import { privateOptions, publicOptions } from "../../../utils";

export const getAllOrders = async () => {
  const response = await fetch(config.URL_API + "/pedidos", privateOptions('GET'));
  const data = await response.json();
  return data;
}

export const getOrder = async (id) => {
  const response = await fetch(config.URL_API + `/pedido/${id}`, privateOptions('GET'));
  const data = await response.json();
  return data;
}

export const createOrder = async (data) => {
  const response = await fetch(config.publicOrigin + "/pedido", publicOptions('POST', data));
  const res = await response.json();
  return res;
}