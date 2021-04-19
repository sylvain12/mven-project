<template>
  <div class="container">
    <AddClient
      @newClient="addNewClient($event)"
      @cancelClientDialog="cancelDialog"
      :isClientDialogShowed="showClientDialog"
      :loadedProviders="providers"
      :client="client"
      @deleteProvider="deleteProvider($event)"
      @addProvider="addProvider($event)"
      :providerName="provider"
      :isEditing="isEditing"
      :selectProv="selectedProviders"
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

    <div class="search">
      <SearchClient />
    </div>

    <DataTable
      ref="dt"
      :value="filteredClients"
      class="p-datatable-striped p-datatable-responsive-demo"
      :paginator="true"
      :rows="numberPerPage"
    >
      <Column field="name" header="Name" sortable></Column>
      <Column field="email" header="Email" sortable></Column>
      <Column field="phone" header="Phone" sortable></Column>
      <Column field="providers" header="Providers">
        <template #body="slotProps">
          <div v-if="slotProps.data.providers" class="client-providers-list">
            <div
              v-for="provider in slotProps.data.providers"
              :key="provider.id"
            >
              <span
                >{{ provider.name
                }}<span
                  v-if="
                    slotProps.data.providers[
                      slotProps.data.providers.length - 1
                    ]._id !== provider._id
                  "
                  >,
                </span></span
              >
            </div>
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
import ConfirmDialog from "primevue/confirmdialog";
import { eventBus } from "./main";
import SearchClient from "./components/SearchClient.vue";

export default {
  name: "App",
  components: {
    AddClient,
    ConfirmDialog,
    SearchClient,
  },
  data() {
    return {
      columns: null,
      submitted: false,
      clients: null,
      showClientDialog: false,
      isEditing: false,
      selectedProviders: [],
      providers: null,
      provider: "",
      numberPerPage: 10,
      searchClientText: "",
      filteredClients: null,
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
    this.filteredClients = this.clients;

    eventBus.$on("loadSelectedProviders", (data) => {
      this.selectedProviders = data;
    });

    eventBus.$on("searchClient", (data) => {
      this.searchClientText = data;
      this.handleSearchClient(data);
    });
  },

  watch: {
    providers: function (newVal, oldVal) {
      // Update clients providers handle provider deleted
      const newValID = newVal.map((el) => el._id);
      if (oldVal && newVal.length !== oldVal.length) {
        const oldValID = oldVal.map((el) => el._id);
        const leftDiff = newValID.filter((el) => !oldValID.includes(el));
        const rightDiff = oldValID.filter((el) => !newValID.includes(el));
        const diff = [...leftDiff, ...rightDiff];

        this.filteredClients = this.filteredClients.map((item) => {
          item.providers = item.providers.filter(
            (el) => !diff.includes(el._id)
          );
          return item;
        });

        // this.filteredClients = [...this.clients];
      }
    },

    clients: function (newVal) {
      this.clients = newVal;
    },
  },

  methods: {
    // Generales actions

    // Open client + providers creation dialog
    openNew() {
      this.showClientDialog = true;
      this.isEditing = false;
      this.loadProviders()
        .then((data) => (this.providers = data.providers))
        .catch((err) => console.log(err));
    },

    // Close Create client Dialog
    cancelDialog() {
      this.showClientDialog = false;
      this.isEditing = false;
      this.selectedProviders = [];
      this.client = {};
    },

    // Show comfirm dialog for client delete
    confirmDeleteClient(client) {
      this.$confirm.require({
        message: "Are you sure you want to proceed?",
        header: "Confirmation",
        icon: "pi pi-exclamation-triangle",
        accept: () => {
          this.handleDeleteClient(client);
        },
        reject: () => {},
      });
    },
    //===============  END ==================================

    //===============  Client Actions =========================

    // Edit Client
    editClient(client) {
      this.showClientDialog = true;
      this.isEditing = true;
      this.client = client;
      this.loadProviders()
        .then((data) => (this.providers = data.providers))
        .catch((err) => console.log(err));

      this.selectedProviders = this.client.providers;
      eventBus.$on("editClient", (data) => {
        this.handleEditClient(data);
      });
    },

    // Create new client
    addNewClient(client) {
      const clientData = { ...client };
      clientData.providers = this.selectedProviders;

      const body = JSON.stringify(clientData);
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
            console.log(res.data.data.client);
            this.resetClient();
          }
        })
        .catch((err) => console.log(err));
    },

    // Delete Client
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

    // Edit client
    handleEditClient(client) {
      const body = JSON.stringify(client);
      axios
        .patch(`api/v1/clients/${client._id}`, body, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          const updatedClient = res.data.data.client;
          this.clients = this.clients.map((item) => {
            if (updatedClient._id === item._id) return updatedClient;
            return item;
          });

          this.filteredClients = [...this.clients];
          this.handleSearchClient(this.searchClientText);

          this.showClientDialog = false;
        })
        .catch((err) => console.log(err));
    },

    // Search In Client table
    handleSearchClient(search) {
      if (search === "") this.filteredClients = this.clients;
      this.filteredClients = this.filterAndSortBeans(this.clients, search);
    },

    evaluateMatchWithClient(value) {
      const space = " ";
      let clientInfo = " ";

      if (value.name) clientInfo = value.name;
      if (value.email) clientInfo = clientInfo + space + value.email;
      if (value.phone) clientInfo = clientInfo + space + value.phone;

      return clientInfo
        .toLowerCase()
        .includes(this.searchClientText.toLowerCase());
    },

    filterAndSortBeans(clientsList) {
      return clientsList.filter(this.evaluateMatchWithClient);
    },

    // Get client selected Providers on edit mode
    loadClientProviders() {},

    // ======================= END ====================

    //============= Providers CRUD ===========
    // Load provider list
    async loadProviders() {
      const response = await axios.get("api/v1/providers");
      const results = await response.data;
      return results.data;
    },

    // Delete provider
    deleteProvider(providerID) {
      axios
        .delete(`api/v1/providers/${providerID}`)
        .then((res) => {
          console.log(res.data);
          this.providers = this.providers.filter((el) => el._id !== providerID);
        })
        .catch((err) => console.log(err));
    },

    // Add provider
    addProvider(provider) {
      const body = JSON.stringify({ name: provider });
      axios
        .post(`api/v1/providers`, body, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          const item = res.data.data.provider;
          this.provider = "";
          console.log(res.data);
          if (res.data.status === "success") {
            this.providers.push(item);
          }
        })
        .catch((err) => console.log(err));
    },

    //=============== END ==============

    // More actions

    // Toast
    showToast(responseStatus, title, message) {
      this.$toast.add({
        severity: responseStatus,
        summary: title,
        detail: message,
        life: 3000,
      });
    },

    // Reset client forms after creations
    resetClient() {
      this.client.name = "";
      this.client.email = "";
      this.client.phone = "";
      this.client.providers = [];
    },
  },
};
</script>

<style scoped>
.client-providers-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.client-providers-list > *:not(:last-child) {
  margin-right: 4px;
}

.search {
  margin-bottom: 1rem;
}
</style>
