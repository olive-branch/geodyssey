import { getOrders } from '../api/order'
import { OrderAggregate } from '@/api/types';
import { IListItem } from './interfaces/IListItem';
const ListService = {
  mapToTable(items: Array<OrderAggregate>): Array<IListItem> {
    let getStatusTitle = code => {
      switch(code) {
        case 'ready': return 'Готов';
        case 'notReady': return 'Не готов';
        case 'done': return 'Отправлен';
        default: return 'Неизвестно'
      }
    }
    return items.map(item => ({
      id: item.id, title: item.instrument.model,
      service: item.service, client: item.client,
      comments: item.comments, serial: item.instrument.serial,
      status: {
        date: item.status === 'ready' ? item.departedAt : item.deadlineAt,
        code: item.status,
        title: getStatusTitle(item.status)
      }
    }))
  },
  getList(limit: number, currentPage: number, query?: string, year?: number){
    return getOrders({limit, offset: currentPage * limit, query, year})
      .then(({items, total, limit, offset}) => ({
        items: this.mapToTable(items), 
        currentPage: offset === 0 ? offset : offset/limit,
        total,
      }))
      .catch(x => {
        console.error(x)
        return {
          items: [] as Array<IListItem>,
          total: 0,
          currentPage: 0
        }
      })
    }
    
    
}

export default ListService;