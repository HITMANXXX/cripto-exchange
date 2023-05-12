//para estos filtro utilizamos la libreria npm llamada numeral
import { Number } from 'core-js'
import numeral from 'numeral'

const dollarFilter = function (value) {
  if (!value) {
    return '$0'
  }

  return numeral(value).format('($ 0.00a)')
}

const percentFilter = function (value){
    if(!value){
        return '0%'
    }

    return `${Number(value).toFixed(2)}%`
}

export { dollarFilter, percentFilter }
