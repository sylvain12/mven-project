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
      @setProviderOnEdit="setEditModeProvider($event)"
      :providerName="provider"
      :isEditing="isEditing"
      :selectProv="selectedProviders"
      :errors="errors"
      :providersErrors="providersErrors"
      :isProviderEditing="isProviderEditing"
      :editingProvider="editingProvider"
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
      numberPerPage: 8,
      searchClientText: "",
      filteredClients: null,
      isProviderEditing: false,
      editingProvider: null,
      errors: {},
      providersErrors: {},
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

    eventBus.$on("editProvider", (data) => {
      this.handleEditProvider(data);
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
      }
    },

    clients: function (newVal) {
      this.updateFilteredClients(newVal);
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
      this.errors = {};
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
      this.errors = {};
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
            this.clients.push(res.data.data.client);
            this.resetClient();
          }
        })
        .catch((err) => {
          const errResponse = err.response;
          const responseData = errResponse.data.error;

          if (responseData.code === 11000 && responseData.keyValue.email) {
            const errObj = {};
            errObj.email = {
              path: "email",
              message: `Duplicate field value: "${responseData.keyValue.email}" Please use another value`,
            };
            this.errors = errObj;
          } else {
            this.errors = responseData.errors;
          }
        });
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

          // this.filteredClients = [...this.clients];
          // this.handleSearchClient(this.searchClientText);

          this.showClientDialog = false;
        })
        .catch((err) => {
          const errResponse = err.response;
          const responseData = errResponse.data.error;

          if (responseData.code === 11000 && responseData.keyValue.email) {
            const errObj = {};
            errObj.email = {
              path: "email",
              message: `Duplicate field value: "${responseData.keyValue.email}" Please use another value`,
            };
            this.errors = errObj;
          } else {
            this.errors = responseData.errors;
          }
        });
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

    // Load filtered clients while clients data updates
    updateFilteredClients(newClientList) {
      this.clients = newClientList;
      this.filteredClients = newClientList;
      this.handleSearchClient(this.searchClientText);
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
        .then(() => {
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
          if (res.data.status === "success") {
            this.providers.push(item);
            this.resetProvider();
            console.log(this.provider);
          }
        })
        .catch((err) => {
          const errResponse = err.response;
          const responseData = errResponse.data.error;

          if (responseData.code === 11000 && responseData.keyValue.name) {
            const errObj = {};
            errObj.name = {
              path: "name",
              message: `Duplicate field value: "${responseData.keyValue.name}" Please use another value`,
            };
            this.providersErrors = errObj;
          } else {
            this.providersErrors = responseData.errors;
          }
        });
    },

    // Set provider on edit mode
    setEditModeProvider(provider) {
      this.provider = provider.name;
      this.isProviderEditing = true;
      this.editingProvider = provider;
    },

    // Handle edit provider
    handleEditProvider(provider) {
      console.log(this.provider);
      const body = JSON.stringify({ name: this.provider });
      axios
        .patch(`api/v1/providers/${provider._id}`, body, {
          headers: { "Content-Type": "application/josn" },
        })
        .then((res) => {
          const data = res.data.data.provider;
          this.providers = this.providers((el) => {
            if (el._id === data._id) return data;
            return el;
          });

          this.resetProvider();
        })
        .catch((err) => {
          const errResponse = err.response;
          const responseData = errResponse.data.error;

          if (responseData.code === 11000 && responseData.keyValue.name) {
            const errObj = {};
            errObj.name = {
              path: "name",
              message: `Duplicate field value: "${responseData.keyValue.name}" Please use another value`,
            };
            this.providersErrors = errObj;
          } else {
            this.providersErrors = responseData.errors;
          }
        });
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
      this.errors = {};
    },

    // Reset client forms after creations
    resetProvider() {
      this.provider = "";
      this.providersErrors = {};
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
