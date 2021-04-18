import Vue from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';

import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import './styles.css';

Vue.config.productionTip = false;

export const eventBus = new Vue();


Vue.use(PrimeVue, { ripple: true });
Vue.use(ToastService);
Vue.use(ConfirmationService);
Vue.component('DataTable', DataTable);
Vue.component('Column', Column);
Vue.component('Button', Button);

new Vue({
  render: h => h(App),
}).$mount('#app');


