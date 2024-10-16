<template>
  <section class="hero is-primary">
    <div class="hero-body">
      <div class="columns">
        <div class="column is-2 p-0">
          <LogoClean class="logo logo-animation" viewBox="-5 -5 160 160" />
        </div>
        <div class="column">
          <p class="title">
            QUICKSILVER
          </p>
          <p class="subtitle">
            A Mirror Site of https://config.bosshobby.com/
          </p>          
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { updater } from "@/store/util/updater";

import LogoClean from "@/assets/Logo_Clean.svg?component";

export default defineComponent({
  name: "Info",
  components: {
    LogoClean,
  },
  data() {
    return {
      updateAvailable: null,
      appVersion: import.meta.env.VITE_APP_VERSION,
    };
  },
  methods: {
    doUpdate() {
      return updater.update(this.updateAvailable);
    },
  },
  created() {
    /*if (!updater.updatePending()) {
      updater.checkForUpdate(
        this.appVersion,
        (updateAvailable) => (this.updateAvailable = updateAvailable)
      );
    }*/
  },
});
</script>

<style lang="scss">
.logo {
  display: block;
  height: 100%;
  width: 100%;
  transform: scale(0.99);
}
</style>
