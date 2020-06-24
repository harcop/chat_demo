import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import "@/components/module";
import VueSession from "vue-session";
import VueSocketIO from "vue-socket.io";

Vue.config.productionTip = false;
const url_loc = "http://localhost:4890";
const url =
  "https://futurex-notification.herokuapp.com/api";

Vue.use(VueSession);
Vue.use(
  new VueSocketIO({
    debug: true,
    connection: `${url}/roomer`,
    options: { useConnectionNamespace: true }
  })
);
Vue.prototype.$endpoint = url;
Vue.prototype.$token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcGVyYXRpb25zIjp7InBvbGljaWVzIjpbeyJvcGVyYXRpb24iOiJjYW5fY3JlYXRlX3Rlcm1zIn0seyJvcGVyYXRpb24iOiJjYW5fY3JlYXRlX2ZpbmFsX2dyYWRpbmdfc3lzdGVtIn0seyJvcGVyYXRpb24iOiJjYW5fY3JlYXRlX3JlZ3VsYXJfZ3JhZGluZ19zeXN0ZW0ifSx7Im9wZXJhdGlvbiI6ImNhbl9hc3NpZ25fcHJlc2VudF90ZXJtIn0seyJvcGVyYXRpb24iOiJjYW5fY3JlYXRlX2NvdXJzZSJ9LHsib3BlcmF0aW9uIjoiY2FuX3JlZ2lzdGVyX3NjaG9vbCJ9LHsib3BlcmF0aW9uIjoiY2FuX2NyZWF0ZV9zdWJqZWN0In0seyJvcGVyYXRpb24iOiJjYW5fc2V0X3Rlcm0ifV0sImlkIjoiNWRkNThkMWJmZjNlNmYzZmQ5MmI2ODExIn0sImZ4SWQiOnsiaWQiOiI1ZWYzMjYyNjUzMDUwNTIyNTZmMDEzZTUiLCJ0eXBlIjoiRlhTRCIsInVzZXJJZCI6NywidXNlcm5hbWUiOiJ0b2x1d2FwIn0sImlhdCI6MTU5MzAwMTQ3OCwiZXhwIjoxNTkzMTc0Mjc4fQ.zGXcPIgUSx_JI1978bT_xVNDFi0eHZ2ieYkYKcP7RCk";

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
