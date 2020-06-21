import { SqlOptions, fromSqlCommand, SqlCommand } from "../../server/db/opearators";
import { pipe, OperatorFunction } from "rxjs";
import { DeleteOrderRequest, DeleteOrderResponse } from "./types";
import { mergeMap, map, mapTo } from "rxjs/operators";

const toDeleteCommand = (req: DeleteOrderRequest): SqlCommand => ({
  name: 'delete order',
  values: [req.id],
  text: `DELETE FROM "order" WHERE id = $1`,
})

export const deleteOrderHandler = (config: SqlOptions): OperatorFunction<DeleteOrderRequest, DeleteOrderResponse> => pipe(
  map(toDeleteCommand),
  mergeMap(x => fromSqlCommand(config, x)),
  mapTo(undefined),
)
