<template>
  <Dialog
    :visible.sync="isClientDialogShowed"
    class="p-fluid"
    :modal="true"
    :style="{ width: '450px' }"
    header="Add new client"
    :contentStyle="{ overflow: 'visible' }"
    :closable="false"
  >
    <template #header>
      <h2 v-if="editMode">Edit the client</h2>
      <h2 v-if="!editMode">Add new client</h2>
    </template>

    <!-- <form @submit.prevent="checkForm" method="post"> -->
    <div class="p-grid p-dir-rev p-fluid">
      <div class="p-col">
        <div class="p-field">
          <label for="name">Name</label>
          <InputText
            id="name"
            v-model="client.name"
            class="p-inputtext-lg"
            aria-describedby="name-help"
          />
          <small id="name-help"></small>
        </div>
      </div>

      <div class="p-col">
        <div class="p-field">
          <label for="email">Email</label>
          <InputText
            id="email"
            v-model="client.email"
            class="p-inputtext-lg"
            aria-describedby="email-help"
          />
          <small id="amail-help"></small>
        </div>
      </div>

      <div class="p-col">
        <div class="p-field">
          <label for="phone">Phone</label>
          <InputText
            id="phone"
            v-model="client.phone"
            class="p-inputtext-lg"
            aria-describedby="phone-help"
          />
          <small id="phone-help"></small>
        </div>
      </div>

      <!-- <div class="p-col">
        <div class="p-field">
          <label for="providers">Providers</label>
          <MultiSelect
            v-model="client.providers"
            :options="providers"
            optionLabel="name"
            placeholder="Select providers"
          />

          <small id="providers-help"></small>
        </div>
      </div> -->
    </div>
    <!-- </form> -->

    <!-- Provider List -->
    <!-- <Card> -->
    <ProviderList
      @deleteProdiver="deleteProvider($event)"
      @addProvider="addProvider($event)"
      :providers="providers"
      :provider="provider"
      style="margin-top: 1rem"
      :clientProviders="clientProviders"
      :isEditing="editMode"
    />
    <!-- </Card> -->

    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        class="p-button-text"
        @click="cancel"
      />
      <Button
        v-if="!editMode"
        type="submit"
        @click="save"
        label="Save"
        icon="pi pi-check"
      />
      <Button
        v-if="editMode"
        type="submit"
        @click="edit"
        label="Save"
        icon="pi pi-check"
      />
    </template>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import MultiSelect from "primevue/multiselect";
import ProviderList from "./ProviderList.vue";
import Card from "primevue/card";
import { eventBus } from "../main";

export default {
  name: "AddClient",
  components: {
    Dialog,
    InputText,
    MultiSelect,
    ProviderList,
    Card,
  },
  props: {
    isClientDialogShowed: {
      type: Boolean,
      default: false,
    },
    loadedProviders: Array,
    client: Object,
    providerName: String,
    selectProv: Array,
    isEditing: Boolean,
  },
  data() {
    return {
      clientDialog: this.isClientDialogShowed,
      providers: [],
      clientProviders: [],
      provider: this.providerName,
      vals: [],
      editMode: false,
    };
  },
  mounted() {},

  destroyed() {
    this.clientDialog = false;
  },

  watch: {
    loadedProviders: function (newVal) {
      this.providers = newVal;
    },
    providerName: function (newVal) {
      this.provider = newVal;
    },

    isEditing: function (newVal) {
      this.editMode = newVal;
    },

    selectProv: function (newVal) {
      if (this.editMode) {
        this.clientProviders = newVal;
      }
    },
  },

  methods: {
    cancel() {
      this.$emit("cancelClientDialog");
    },

    save() {
      this.$emit("newClient", this.client);
    },

    edit() {
      this.client.providers = this.selectProv;
      eventBus.$emit("editClient", this.client);
    },

    //  Provider emit handler ==========
    deleteProvider(providerID) {
      this.$emit("deleteProvider", providerID);
    },

    addProvider(providerName) {
      this.$emit("addProvider", providerName);
    },
    // END =====================

    checkForm() {
      // this.save();
    },
  },
};
</script>

<style>
</style>