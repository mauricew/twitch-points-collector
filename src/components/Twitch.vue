<template>
  <div>
    <button v-on:click="checkLogin">Check login status</button>
    
    <div v-if="loaded && isAuthenticated">
      You're logged in as {{ this.userData.login }}
    </div>
    <div v-if="loaded && !isAuthenticated">
      Please log in at
      <a rel="nofollow noreferrer noopener" href="https://www.twitch.tv/login" v-on:click="openLink">twitch.tv</a>
      to continue.
    </div>
  </div>
</template>

<script>
const CLIENT_ID = 'kimne78kx3ncx6brgo4mv6wki5h1ko';

export default {
  name: 'Twitch',
  data () {
    return {
      userToken: null,
      userData: null,
      loaded: false
    }
  },
  mounted () {
  },
  methods: {
    openLink (e) {
      chrome.tabs.create({ url: e.target.href });
    },
    checkLogin () {
      chrome.storage.local.get('user_token', storage => {
        this.userToken = storage.user_token;

        if (this.userToken) {
          const headers = {
            Authorization: `OAuth ${this.userToken}`,
            "Client-ID": CLIENT_ID
          };
          fetch(`https://id.twitch.tv/oauth2/validate`, { credentials: "include", headers })
            .then(res => res.json())
            .then(res => {
              this.userData = {
                user_id: res.user_id,
                login: res.login
              };
              this.loaded = true;
            });
        }
        else {
          this.loaded = true;
        }
      });
      const headers = {};
      
    }
  },
  computed: {
    isAuthenticated () {
      return !!this.userToken && !!this.userData;
    }
  }
}
</script>

<style>

</style>