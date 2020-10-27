<template>
  <div>
    <div v-if="bonusData" style="margin-bottom: 1em;">
      <h5 style="margin-bottom:.5em">Bonuses collected</h5>
      {{ bonusData }}
    </div>
    <button v-on:click="checkLogin">Check login status</button>
    
    <div v-if="loaded && isAuthenticated">
      You're logged in as {{ this.userData.login }}
      <button v-if="!followedAccounts" v-on:click="getFollowedAccounts">Get those follows bro</button>
      <ul v-if="followedAccounts">
        <li v-for="a in followedAccounts" v-bind:key="a.to_id">
          {{a.to_name}}
          <span v-if="pointsData && pointsData[a.to_id]">
            <span v-if="pointsData[a.to_id].isPointsEnabled">
              {{pointsData[a.to_id].yourPoints}} points
            </span>
            <em v-if="!pointsData[a.to_id].isPointsEnabled">
              (points not enabled)
            </em>
            <strong v-if="bonusData && bonusData[a.to_name.toLowerCase()]">
              {{bonusData[a.to_name.toLowerCase()]}} bonuses
            </strong>
          </span>
        </li>
      </ul>
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

const CHANNEL_POINTS_CONTEXT_REQUEST = {
    "operationName": "ChannelPointsContext",
    "variables": {
//      "channelLogin": "mang0"
    },
    "extensions": {
      "persistedQuery": {
        "version": 1,
        "sha256Hash": "9988086babc615a918a1e9a722ff41d98847acac822645209ac7379eecb27152"
      }
    }
}

export default {
  name: 'Twitch',
  data () {
    return {
      userToken: null,
      userData: null,
      loaded: false,
      followedAccounts: null,
      pointsData: null,
      bonusData: null
    }
  },
  mounted () {
    chrome.storage.local.get('bonus_counter', storage => this.bonusData = storage.bonus_counter);
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
            Authorization: `Bearer ${this.userToken}`,
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
    },
    getFollowedAccounts () {
      const headers = {
        Authorization: `Bearer ${this.userToken}`,
        "Client-ID": CLIENT_ID
      };

      fetch(`https://api.twitch.tv/helix/users/follows?from_id=${this.userData.user_id}`, { credentials: "include", headers })
        .then(res => res.json())
        .then(res => {
          this.followedAccounts = res.data;

          const gqlBody = res.data.map(c => ({
            ...CHANNEL_POINTS_CONTEXT_REQUEST,
            variables: {
              channelLogin: c.to_name
            }
          }));

          const headers = {
            Authorization: `OAuth ${this.userToken}`,
            "Client-ID": CLIENT_ID,
            "Content-Type": "application/json"};

          return fetch(`https://gql.twitch.tv/gql`, { method: "POST", body: JSON.stringify(gqlBody), headers })
            .then(res => res.json())
            .then(res => {
              this.pointsData = res.map(c => {
                const isPointsEnabled = c.data.community.channel.communityPointsSettings.isEnabled;

                let yourPoints;
                if (isPointsEnabled) {
                  yourPoints = c.data.community.channel.self.communityPoints.balance;
                }
                
                return {
                  user_id: c.data.community.channel.id,
                  isPointsEnabled,
                  yourPoints
                }
              })
              .reduce((a, b) => ({ ...a, [b.user_id]: b}), {});              
            });
        });
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