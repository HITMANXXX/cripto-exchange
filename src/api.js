const url = 'https://api.coincap.io/v2'

function getAssets() {
  return fetch(`${url}/assets?limit=20`)
    .then((res) => res.json())
    .then((res) => res.data)
}

// funcion que nos permite acceder a una cripto en particular de coincap

function getAsset(coin) {
  return fetch(`${url}/assets/${coin}`)
    .then((res) => res.json())
    .then((res) => res.data)
}


// esta funcion nos permite acceder al historial de la criptomoneda
function getAssetHistory(coin){
  const now = new Date();
  const end = now.getTime();
  now.setDate(now.getDate() - 1 );
  const start = now.getTime();
  return fetch(`${url}/assets/${coin}/history?interval=h1&start=${start}&end=${end}`)
  .then(res => res.json())
  .then(res => res.data)
}


//esta funcion nos permite acceder a los markets de la api
function getMarkets(coin) {
  return fetch(`${url}/assets/${coin}/markets?limit=5`)
    .then(res => res.json())
    .then(res => res.data)
}

//esta funcion nos permite acceder a los exchange de la api
function getExchange(id){
  return fetch (`${url}/exchanges/${id}`)
  .then(res => res.json())
  .then(res => res.data)
}

export default {
  getAssets,
  getAsset,
  getMarkets,
  getExchange,
  getAssetHistory
}
