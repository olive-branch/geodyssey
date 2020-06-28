import { getOrderById, addOrder, deleteOrder, updateOrder } from '../api/order'
const OrderService = {
  getOrder(id: string) {
    return getOrderById({id}).catch(x => {
        console.error(x);
        return null;
      })
  },
  save(order) {
    return addOrder(order).catch(x => {
      console.error(x);
      return null;
    })
  },
  delete(id) {
    return deleteOrder({id}).catch(x => {
      console.error(x);
      return null;
    })
  },
  update(order){
    return updateOrder(order).catch(x => {
      console.error(x);
      return null;
    })
  }
}

export default OrderService;