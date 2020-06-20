import { OrderAggregate } from "../types";
import jsonData from './data.json'

let jsonStr = JSON.stringify(jsonData)
let data = JSON.parse(jsonStr, (k, v) => {
  if (typeof v === 'string') {
    let date = Date.parse(v)
    return isNaN(date) ? v : new Date(date)
  } else {
    return v
  }
}) as OrderAggregate[]

export const DATA = data
