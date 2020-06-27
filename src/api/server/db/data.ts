import { OrderAggregate } from "../../types";
import jsonData from './data.json'

const ISO_DATE_REG = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/

let jsonStr = JSON.stringify(jsonData)
let data = JSON.parse(jsonStr, (k, v) => {
  if (typeof v === 'string') {
    return ISO_DATE_REG.test(v) ? new Date(v) : v
  } else {
    return v
  }
}) as OrderAggregate[]

export const DATA = data

export const CLIENTS = [
  'ФБУ Самарский ЦСМ',
  'ФБУ Архангельский ЦСМ',
  'ФБУ Московский ЦСМ',
  'ФБУ Петербуржский ЦСМ',
  'ФБУ Тульский ЦСМ',
  'ФБУ Ярославский ЦСМ',
]
