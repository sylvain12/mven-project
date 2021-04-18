<template>
  <div>
    <h3 class="provider-title">Provider List</h3>
    <div class="provider-add-form">
      <InputText
        type="text"
        v-model="providerName"
        placeholder="Add new provider"
      />
      <Button
        icon="pi pi-plus"
        class="p-button-outlined p-button-primary"
        @click="addProvider"
      />
    </div>

    <DataView
      :value="providersList"
      :layout="layout"
      :rows="5"
      :paginator="true"
    >
      <template #list="slotProps">
        <div class="provider-list">
          <div class="p-field-checkbox">
            <Checkbox
              :id="slotProps.data._id"
              v-model="selectedProviders"
              name="providers"
              :value="slotProps.data._id"
              class="provider-checkbox"
              @change="loadSelectedProviders"
            />
            <label :for="slotProps.data._id">{{ slotProps.data.name }}</label>
          </div>
          <div class="provider-list-action">
            <Button
              icon="pi pi-pencil"
              class="p-button-outlined p-button-success"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-outlined p-button-danger"
              @click="deleteProvider(slotProps.data._id)"
            />
          </div>
        </div>
      </template>
    </DataView>
  </div>
</template>

<script>
import DataView from "primevue/dataview";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import InputText from "primevue/inputtext";
import { eventBus } from "../main";

export default {
  name: "ProviderList",
  components: {
    DataView,
    Button,
    Checkbox,
    InputText,
  },
  props: {
    providers: Array,
    provider: String,
  },
  data() {
    return {
      layout: "list",
      providersList: [],
      selectedProviders: [],
      providerName: this.provider,
    };
  },
  watch: {
    providers: function (newVal) {
      this.providersList = newVal;
    },
    provider: function (newVal) {
      this.providerName = newVal;
    },
  },

  methods: {
    deleteProvider(providerID) {
      this.$emit("deleteProdiver", providerID);
    },

    addProvider() {
      this.$emit("addProvider", this.providerName);
    },

    loadSelectedProviders() {
      eventBus.$emit("loadSelectedProviders", this.selectedProviders);
    },
  },
};
</script>

<style scoped>
.provider-list {
  display: flex !important;
  justify-content: space-between;
  align-items: center;
}

.provider-checkbox {
  margin-right: 5px;
}

.provider-add-form {
  display: flex;
  align-items: stretch;
  justify-content: center;
  margin-bottom: 1rem;
}

.provider-title {
  margin-bottom: 1rem;
  margin-top: 2rem;
}
</style>