<template>
  <div class="container">
    <AddClient
      @newClient="addNewClient($event)"
      @cancelClientDialog="cancelDialog"
      :isClientDialogShowed="showClientDialog"
      :loadedProviders="providers"
    />
    <div class="header">
      <h1>Clients Manager</h1>

      <Button
        label="New client"
        icon="pi pi-plus"
        class="p-ml-auto p-button"
        @click="openNew"
      />
    </div>

    <DataTable
      ref="dt"
      :value="clients"
      class="p-datatable-striped p-datatable-responsive-demo"
    >
      <Column field="name" header="Name" sortable></Column>
      <Column field="email" header="Email" sortable></Column>
      <Column field="phone" header="Phone" sortable></Column>
      <Column field="providers" header="Providers">
        <template #body="slotProps">
          <div v-for="provider in slotProps.data.providers" :key="provider.id">
            {{ provider.name }},
          </div>
        </template>
      </Column>
      <Column>
        <template #body="slotProps">
          <div style="text-align: right">
            <Button
              icon="pi pi-pencil"
              class="p-button-success"
              @click="editClient(slotProps.data)"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-danger"
              @click="confirmDeleteClient(slotProps.data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script>
import AddClient from "./components/AddClient.vue";
import axios from "axios";

export default {
  name: "App",
  components: {
    AddClient,
  },
  data() {
    return {
      columns: null,
      clients: null,
      showClientDialog: false,
      providers: null,
      submitted: false,
    };
  },
  created() {},

  async mounted() {
    const response = await axios.get("api/v1/clients");
    const results = response.data.data.clients;
    this.clients = results;
  },

  methods: {
    openNew() {
      this.showClientDialog = true;
      this.loadProviders()
        .then((data) => (this.providers = data.providers))
        .catch((err) => console.log(err));
    },

    cancelDialog() {
      this.showClientDialog = false;
    },

    editClient(client) {
      console.log(`${client.name} edited`);
    },

    confirmDeleteClient(client) {
      console.log(`Do you want to delete ${client.name}`);
    },

    addNewClient(client) {
      this.handleNewClient(client)
        .then((data) => console.log(data))
        .catch((err) => console.log(err));
    },

    async handleNewClient(client) {
      console.log(client);
      const response = await axios.post(
        "api/v1/clients",
        JSON.stringify(client),
        {
          headers: { "Content-Type": "application.json" },
        }
      );
      return await response.data;
    },

    async loadProviders() {
      const response = await axios.get("api/v1/providers");
      const results = await response.data;
      return results.data;
    },
  },
};
</script>

<style>
</style>
