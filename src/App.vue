<template>
  <main>
    <Pxheader :links="links"></Pxheader>
    <router-view
      class="container px-5 sm:px-20 py-20 flex justify-center"
    ></router-view>
  </main>
</template>

<script>
import Pxheader from '@/components/Pxheader.vue'

export default {
  name: 'App',

  data() {
    return {
      links: [
        {
          title: 'BTC',
          to: { name: 'CoinDetail', params: { id: 'bitcoin' } },
        },
        {
          title: 'ETH',
          to: { name: 'CoinDetail', params: { id: 'ethereum' } },
        },
        {
          title: 'XRP',
          to: { name: 'CoinDetail', params: { id: 'xrp' } },
        },
      ],
    }
  },

  components: {
    Pxheader,
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
