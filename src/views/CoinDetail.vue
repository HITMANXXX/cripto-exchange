<template>
  <div class="flex-col">
    <div class="flex justify-center">
      <bounce-loader :loading="isLoading" :color="'#68d391'" :size="100" />
    </div>
    <template v-if="!isLoading">
      <div class="flex flex-col sm:flex-row justify-around items-center">
        <div class="flex flex-col items-center">
          <img
            :src="`https://static.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`"
            :alt="asset.name"
            class="w-20 h-20 mr-5"
          />
          <h1 class="text-5xl">
            {{ asset.name }}
            <small class="sm:mr-2 text-gray-500">{{ asset.symbol }}</small>
          </h1>
        </div>

        <div class="my-10 flex flex-col">
          <ul>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Ranking</b>
              <span
                ><b>#{{ asset.rank }}</b></span
              >
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio actual</b>
              <span
                ><b>{{ asset.priceUsd | dollar }}</b></span
              >
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio más bajo</b>
              <span
                ><b>{{ min | dollar }}</b></span
              >
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio más alto</b>
              <span
                ><b>{{ max | dollar }}</b></span
              >
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio Promedio</b>
              <span
                ><b>{{ avg | dollar }}</b></span
              >
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Variación 24hs</b>
              <span
                ><b>{{ asset.changePercent24Hr | percent }}</b></span
              >
            </li>
          </ul>
        </div>

        <div class="my-10 sm:mt-0 flex flex-col justify-center text-center">
          <button
            @click="toogleConverter"
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            {{ fromUsd ? `USD a ${asset.symbol}` : `${asset.symbol} a USD` }}
          </button>

          <div class="flex flex-row my-5">
            <label class="w-full" for="convertValue">
              <input
                v-model="convertValue"
                id="convertValue"
                type="number"
                class="text-center bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
                :placeholder="`Valor en ${fromUsd ? 'USD' : asset.symbol}`"
              />
            </label>
          </div>

          <span class="text-xl"
            >{{ convertResult | dollar }}
            {{ fromUsd ? asset.symbol : 'USD' }}</span
          >
        </div>
      </div>
      <!-- en esta parte se van a desplegar los graficos -->
      <line-chart
        class="my-10"
        :colors="['orange']"
        :min="min"
        :max="max"
        :data="history.map((h) => [h.date, parseFloat(h.priceUsd).toFixed(2)])"
      />

      <!-- en sta parte desplegaremos los markets -->
      <h3 class="text-xl my-10">Mejores Ofertas de Cambio</h3>
      <table>
        <tr
          v-for="m in markets"
          :key="`${m.exchangeId}-${m.priceUsd}`"
          class="border-b"
        >
          <td>
            <b>{{ m.exchangeId }}</b>
          </td>
          <td>
            <b>{{ m.priceUsd | dollar }}</b>
          </td>
          <td>
            <b>{{ m.baseSymbol }} / {{ m.quoteSymbol }}</b>
          </td>
          <td>
            <PxButton
              :is-loading="m.isLoading || false"
              v-if="!m.url"
              @click="getWebSite(m)"
            >
              <slot>Obtener Link</slot>
            </PxButton>
            <a v-else class="hover:underline text-green-600" target="_blanck">
              {{ m.url }}
            </a>
          </td>
        </tr>
      </table>
    </template>
  </div>
</template>

<script>
import PxButton from '@/components/PxButton.vue'
import api from '@/api'

export default {
  name: 'CoinDetail',

  data() {
    return {
      isLoading: false,
      asset: {},
      history: [],
      markets: [],
      fromUsd: true,
      convertValue: null,
    }
  },

  components: {
    PxButton,
  },

  computed: {
    convertResult() {
      if (!this.convertValue) {
        return 0
      }
      //se verifica si cambiamos de bitcoin a dolares y viceversa
      const result = this.fromUsd
        ? this.convertValue / this.asset.priceUsd
        : this.convertValue * this.asset.priceUsd

      return result.toFixed(4)
    },

    min() {
      return Math.min(
        ...this.history.map((h) => parseFloat(h.priceUsd).toFixed(2))
      )
    },

    max() {
      return Math.max(
        ...this.history.map((h) => parseFloat(h.priceUsd).toFixed(2))
      )
    },

    avg() {
      return (
        this.history.reduce((a, b) => a + parseFloat(b.priceUsd), 0) /
        this.history.length
      )
    },
  },

  //Esta funcion nos permite que cuando nos cambie $route(ruta), nos llame la funcion getCoin
  watch: {
    $route() {
      this.getCoin()
    },
  },

  created() {
    this.getCoin()
  },

  methods: {
    toogleConverter() {
      this.fromUsd = !this.fromUsd
    },

    // Este nos va a permitir obtener la URL con la informacion del exchange de la cripto
    getWebSite(exchange) {
      this.$set(exchange, 'isLoading', true)
      return api
        .getExchange(exchange.exchangeId)
        .then((res) => {
          this.$set(exchange, 'url', res.exchangeUrl)
        })
        .finally(() => {
          this.$set(exchange, 'isLoading', false)
        })
    },

    //para obtener el id, este hace parte de la url - a su vez es parte del router y al ser parte del router
    // hay una funcionalidad especifica llamada $route dentro de la instancia de Router que permite acceder a los valores
    getCoin() {
      const id = this.$route.params.id
      this.isLoading = true
      //accedemos a la api
      // Promise.all nos permite ejecutar diferentes promesas a traves de un array
      Promise.all([
        api.getAsset(id),
        api.getAssetHistory(id),
        api.getMarkets(id),
      ])
        .then(([asset, history, markets]) => {
          this.asset = asset
          this.history = history
          this.markets = markets
        })
        .finally(() => (this.isLoading = false))
    },
  },
}
</script>

<style scoped>
td {
  padding: 10px;
  text-align: center;
}
</style>
