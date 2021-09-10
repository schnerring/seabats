<template>
  <div class="parent">
    <div class="child">
      <h1>Hello! You Need Data To Use This App</h1>

      <p>
        Sorry, we currently don't have a license to publicly redistribute any of
        our test data.
      </p>

      <p>
        Please contact one of the project maintainers to request a sample data
        set.
      </p>

      <label>
        <input
          type="file"
          ref="file"
          multiple="multiple"
          @change="loadData($event.target.files)"
          :disabled="isLoading"
        />

        <!--
          Tabler Icon "loader"
          Copyright (c) 2020 Paweł Kuna
          Source: https://tablericons.com/
          License: MIT
        -->
        <svg
          v-if="isLoading"
          xmlns="http://www.w3.org/2000/svg"
          class="icon icon-tabler icon-tabler-loader"
          width="44"
          height="44"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="#2c3e50"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <line x1="12" y1="6" x2="12" y2="3" />
          <line x1="16.25" y1="7.75" x2="18.4" y2="5.6" />
          <line x1="18" y1="12" x2="21" y2="12" />
          <line x1="16.25" y1="16.25" x2="18.4" y2="18.4" />
          <line x1="12" y1="18" x2="12" y2="21" />
          <line x1="7.75" y1="16.25" x2="5.6" y2="18.4" />
          <line x1="6" y1="12" x2="3" y2="12" />
          <line x1="7.75" y1="7.75" x2="5.6" y2="5.6" />
        </svg>

        <!--
          Tabler Icon "upload"
          Copyright (c) 2020 Paweł Kuna
          Source: https://tablericons.com/
          License: MIT
        -->
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="icon icon-tabler icon-tabler-upload"
          width="44"
          height="44"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="#2c3e50"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
          <polyline points="7 9 12 4 17 9" />
          <line x1="12" y1="4" x2="12" y2="16" />
        </svg>

        <p class="status-text">
          {{ status }}
        </p>
      </label>

      <p>
        If you want to provide your own data,
        <a href="https://github.com/schnerring/seabats/blob/main/README.md"
          >read more about the expected data format</a
        >.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { AdsbExchangeResponse } from "@/shared/adsb/AdsbExchangeResponse";
import { addFlight } from "@/shared/DataService";
import { Flight } from "@/shared/Flight";

const initialStatus =
  "Click here to select a data set from the local file system";

export default defineComponent({
  data() {
    return {
      status: initialStatus,
      isLoading: false,
    };
  },
  methods: {
    async loadData(files: FileList) {
      this.isLoading = true;
      try {
        for (let i = 0; i < files.length; i++) {
          this.status = `Importing (${Math.floor(++i / files.length)}%) ...`;
          const adsbTraces: AdsbExchangeResponse[] = JSON.parse(
            await files[i].text()
          );
          for (const trace of adsbTraces) {
            try {
              const flight = new Flight(trace);
              await addFlight(flight);
            } catch {
              console.warn(trace);
            }
          }
        }
      } catch (error) {
        // TODO show error to user
        console.error(error);
      } finally {
        this.status = initialStatus;
        this.isLoading = false;
      }
    },
  },
});
</script>

<style scoped>
.parent {
  height: 100%;
  text-align: center;
}
.parent,
.child {
  display: grid;
  place-items: center;
}
.status-text {
  font-size: 9pt;
  margin-top: 0.2rem;
}
input[type="file"] {
  display: none;
}
label {
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 40px 0;
}
label:hover {
  color: var(--blue600);
  cursor: pointer;
}
label:hover svg {
  stroke: var(--blue600);
  transform: translateY(-5px);
}
svg {
  transition: transform 0.4s ease-in-out;
}
svg.icon-tabler-loader {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
