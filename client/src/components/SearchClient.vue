<template>
  <span class="p-input-icon-left">
    <i class="pi pi-search" />
    <InputText
      @input="handleInput"
      type="text"
      v-model="searchText"
      placeholder="Search"
    />
  </span>
</template>

<script>
import InputText from "primevue/inputtext";
import { eventBus } from "../main";
export default {
  name: "SearchClient",
  components: {
    InputText,
  },
  props: {},
  data() {
    return {
      searchText: "",
    };
  },

  methods: {
    handleInput() {
      eventBus.$emit("searchClient", this.searchText);
    },
  },
};
</script>

<style scoped>
</style>