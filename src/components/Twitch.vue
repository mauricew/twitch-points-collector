<template>
  <div>
    <q-layout>
      <q-header elevated>
        <q-toolbar>
          <q-toolbar-title>Twitch Points Collector</q-toolbar-title>
          <q-btn flat round dense>
            <q-icon name="settings" v-on:click="openSettings()"></q-icon>
          </q-btn>
        </q-toolbar>
      </q-header>
      <q-page-container class="q-pa-md">
        <q-page>
          <div v-if="bonusData" style="margin-bottom: 1em;">
            <h5 style="margin: 1em 0;">Bonuses collected</h5>
            {{ bonusData }}
          </div>
          <q-btn v-on:click="checkLogin">Check login status</q-btn>
          
          <div v-if="loaded && isAuthenticated">
            You're logged in as {{ this.userData.login }}
            <q-btn v-if="!followedAccounts" v-on:click="getFollowedAccounts">Get those follows bro</q-btn>
            <q-spinner v-if="pointsDataLoading"
              color="primary"
              size="3em"></q-spinner>

            <q-table v-if="pointsData"
              :data="pointsData"
              :columns="pointsColumns"
              row-key="userId">
            </q-table>
           
          </div>
          <div v-if="loaded && !isAuthenticated">
            Please log in at
            <a rel="nofollow noreferrer noopener" href="https://www.twitch.tv/login" v-on:click="openLink">twitch.tv</a>
            to continue.
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
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
      bonusData: null,
      pointsDataLoading: false,
      pointsColumns: [
        { name: 'channelName', field: 'channelName', align: 'center', label: 'Channel' },
        { name: 'yourPoints', field: 'yourPoints', label: 'Points' },
        { name: 'yourBonuses', field: 'yourBonuses', label: 'Bonuses' },
      ]
    }
  },
  mounted () {
    chrome.storage.local.get('bonus_counter', storage => this.bonusData = storage.bonus_counter);
  },
  methods: {
    openLink (e) {
      chrome.tabs.create({ url: e.target.href });
    },
    openSettings() {
      chrome.runtime.openOptionsPage();
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

      this.pointsDataLoading = true;

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
                const channelName = c.data.community.displayName.toLowerCase()

                let yourPoints;
                let yourBonuses;
                if (isPointsEnabled) {
                  yourPoints = c.data.community.channel.self.communityPoints.balance;

                  if (this.bonusData && this.bonusData[channelName]) {
                    yourBonuses = this.bonusData[channelName];
                  }
                }
                
                return {
                  userId: c.data.community.channel.id,
                  channelName,
                  isPointsEnabled,
                  yourPoints,
                  yourBonuses
                }
              });
              this.pointsDataLoading = false;
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