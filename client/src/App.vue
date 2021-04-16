<template>
  <div class="container">
    <AddClient
      @newClient="addNewClient($event)"
      @cancelClientDialog="cancelDialog"
      :isClientDialogShowed="showClientDialog"
      :loadedProviders="providers"
      :client="client"
    />
    <ConfirmDialog></ConfirmDialog>
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
// import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";

export default {
  name: "App",
  components: {
    AddClient,
    ConfirmDialog,
  },
  data() {
    return {
      columns: null,
      clients: null,
      showClientDialog: false,
      providers: null,
      submitted: false,
      client: {
        name: "",
        email: "",
        phone: "",
        providers: [],
      },
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
      this.$confirm.require({
        message: "Are you sure you want to proceed?",
        header: "Confirmation",
        icon: "pi pi-exclamation-triangle",
        accept: () => {
          this.handleDeleteClient(client);
        },
        reject: () => {
          console.log("delete reject");
        },
      });
    },

    addNewClient(client) {
      const body = JSON.stringify(client);
      const headers = {
        "Content-type": "application/json",
      };
      axios
        .post("api/v1/clients", body, {
          headers: headers,
        })
        .then((res) => {
          if (res.data.status === "success") {
            this.showClientDialog = false;
            this.clients.push(res.data.data.client);
            this.resetClient();
            this.showToast(
              "success",
              "New Client",
              "Client successfuly created"
            );
          }
        })
        .catch((err) => console.log(err));
    },

    handleDeleteClient(client) {
      axios
        .delete(`api/v1/clients/${client._id}`)
        .then(() => {
          this.clients = this.clients.filter((el) => el._id !== client._id);
          this.showToast(
            "success",
            "Delete successfull",
            "The client has been deleted!"
          );
        })
        .catch((err) => {
          console.log(err);
          this.showToast(
            "error",
            "Delete client error",
            "An error ocure while deleting the client, try again!"
          );
        });
    },

    async loadProviders() {
      const response = await axios.get("api/v1/providers");
      const results = await response.data;
      return results.data;
    },

    showToast(responseStatus, title, message) {
      this.$toast.add({
        severity: responseStatus,
        summary: title,
        detail: message,
        life: 3000,
      });
    },

    resetClient() {
      this.client.name = "";
      this.client.email = "";
      this.client.phone = "";
      this.client.providers = [];
    },
  },
};
</script>

<style>
</style>
