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
      <h2 v-if="isEditing">Edit the client</h2>
      <h2 v-if="!isEditing">Add new client</h2>
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

      <div class="p-col">
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
      </div>
    </div>
    <!-- </form> -->

    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        class="p-button-text"
        @click="cancel"
      />
      <Button type="submit" @click="save" label="Save" icon="pi pi-check" />
    </template>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import MultiSelect from "primevue/multiselect";
// import axios from "axios";

export default {
  name: "AddClient",
  components: {
    Dialog,
    InputText,
    MultiSelect,
  },
  props: {
    isClientDialogShowed: {
      type: Boolean,
      default: false,
    },
    loadedProviders: Array,
    client: Object,
  },
  data() {
    return {
      clientDialog: this.isClientDialogShowed,
      isEditing: false,
      // selectedProviders: null,
      providers: [],
    };
  },

  destroyed() {
    this.clientDialog = false;
  },

  watch: {
    loadedProviders: function (newVal, oldVal) {
      console.log("Prop changed: ", newVal, " | was: ", oldVal);
      this.providers = newVal;
    },
  },

  methods: {
    cancel() {
      this.$emit("cancelClientDialog");
    },

    save() {
      // this.client.providers = this.selectedProviders;
      this.$emit("newClient", this.client);
    },

    checkForm() {
      // this.save();
    },
  },
};
</script>

<style>
</style>