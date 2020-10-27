<template>
  <q-layout>
    <q-header elevated>
        <q-toolbar>
          <q-toolbar-title>TPC Settings</q-toolbar-title>
        </q-toolbar>
      </q-header>
    <q-page-container class="q-pa-md">
      <q-page :style-fn="() => ({})">
        <div class="q-gutter-sm">
          <q-checkbox v-model="bonusCollectionEnabled" label="Enable automatic bonus collection" v-on:input="toggleCollection()" />
        </div>

        <div>
          <q-btn color="red" v-on:click="showDataClearDialog = true">Clear bonus data</q-btn>

          <q-dialog v-model="showDataClearDialog" persistent>
            <q-card>
              <q-card-section class="row items-center">
                <q-avatar icon="warning" color="white" text-color="red" />
                <span class="q-ml-sm">Confirm deletion</span>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <p>Are you sure you want to clear all bonus collection data?</p>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat label="Cancel" color="primary" v-close-popup />
                <q-btn flat label="Clear" color="red" v-on:click="clearBonusData()" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'Settings',
  data () {
    return {
      bonusCollectionEnabled: null,
      showDataClearDialog: false
    }
  },
  mounted () {
    browser.storage.local.get('bonus_collection_enabled').then(storage => {
      this.bonusCollectionEnabled = storage.bonus_collection_enabled;
    });
  },
  methods: {
    toggleCollection() {
      browser.storage.local.set({ bonus_collection_enabled: this.bonusCollectionEnabled });
    },
    clearBonusData() {
      browser.storage.local.set({ bonus_counter: {} });
    }
  }
}
</script>

<style>

</style>