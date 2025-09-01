import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store/configure-store.ts";
import axiosHook from "./lib/axios-hook.ts";
import axios from "axios";
import App from "./App.tsx";
import "./index.css";

global.DevelopmentMode =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development";
global.CopyrightYear = 2023;
global.SocialTwitter = "https://www.x.com";
global.SocialLinkedIn = "https://www.linkedin.com";
global.SocialInstagram = "https://www.instagram.com";
global.Method = global.DevelopmentMode ? "http" : "https";
global.HostDomain = global.DevelopmentMode
  ? "127.0.0.1:5173"
  : "www.rapidl.co.uk";
global.APIHostDomain = global.DevelopmentMode
  ? "127.0.0.1:3000"
  : "api.rapidl.co.uk";
global.HostURL = global.Method + "://" + global.HostDomain;
global.APIHostURL = global.Method + "://" + global.APIHostDomain;
global.TickReCaptchaSiteKey = "???";
global.InvisibleReCaptchaSiteKey = "???";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = global.APIHostURL;

if (global.DevelopmentMode) {
  global.DISABLE_TOKEN_LOG = true;
  console.log("Development mode");
} else {
  global.DISABLE_TOKEN_LOG = true;
  console.log("Production mode");
  console.log =
    console.debug =
    console.error =
    console.group =
    console.groupEnd =
    console.groupCollapsed =
      () => {};
}

axiosHook(global.DISABLE_TOKEN_LOG);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
    <Toaster />
  </BrowserRouter>
);
