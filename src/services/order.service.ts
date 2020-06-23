import { getOrderById } from '../api/order'
const OrderService = {
  getOrder(id: string) {
    return getOrderById({id}).catch(x => {
        console.error(x);
        return null;
      })
  }
}

export default OrderService;