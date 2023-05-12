<template>
  <div class="flex justify-center">
    <bounce-loader :loading="isLoading" :color="'#68d391'" :size="100" />
    <PxAssetsTable v-if="!isLoading" :assets="assets"></PxAssetsTable>
  </div>
</template>

<script>
import api from '@/api'
import PxAssetsTable from '@/components/PxAssetsTable.vue'

export default {
  name: 'Home',

  data() {
    return {
      isLoading: false,
      assets: [],
    }
  },

  // en el hook created hacemos la interaccion con la api
  created() {
    //iniciamos el spinners
    this.isLoading = true;
    api.getAssets()
    .then((assets) => (this.assets = assets))
    .finally(() => this.isLoading = false )
  },

  components: {
    PxAssetsTable,
  },
}
</script>
