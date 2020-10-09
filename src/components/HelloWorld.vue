<template>
  <div>
    <p>{{ defaultText }}</p>
    <Twitch />
  </div>
</template>

<script>
import Twitch from './Twitch.vue';

export default {
  components: {
    Twitch
  },
  name: 'HelloWorld',
  mounted () {
    browser.runtime.sendMessage({})
  },
  computed: {
    defaultText () {
      return browser.i18n.getMessage('extName')
    }
  }
}
</script>

<style scoped>
p {
  font-size: 20px;
}
</style>
