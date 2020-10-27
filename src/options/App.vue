<template>
  <div>
    <settings />
  </div>
</template>

<script>
import Settings from '@/components/Settings.vue'

export default {
  name: 'App',
  components: { Settings }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons');
html {
  width: 400px;
  height: 400px;
}
</style>
