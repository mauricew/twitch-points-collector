<template>
  <twitch />
</template>

<script>
import Twitch from '@/components/Twitch.vue'

export default {
  name: 'App',
  components: { Twitch }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons');

html {
  width: 400px;
  height: 400px;
}
</style>
