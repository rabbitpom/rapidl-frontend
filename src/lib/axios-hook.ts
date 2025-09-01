import axios, { AxiosResponse } from 'axios';
import { hasExpired } from "@/lib/utils";
import { UserSlice } from "@/store/slices/user";
import { TokenSlice } from "@/store/slices/token";
import { store } from "@/store/configure-store";

type ResponseHook = (response: AxiosResponse<any>) => void;

const ResponseHooks: ResponseHook[] = [
    (response: AxiosResponse<any>) => {
        const x_set_credits = response.headers["x-set-credits"] ?? response.headers["X-Set-Credits"];
        if (x_set_credits != null) {
            store.dispatch(UserSlice.actions.setUserCredits(x_set_credits));
        }
    },
    (response: AxiosResponse<any>) => {
        const x_set_next_fetch = response.headers["x-next-fetch"] ?? response.headers["X-Next-Fetch"];
        if (x_set_next_fetch != null) {
            store.dispatch(UserSlice.actions.setUserNextFetch(x_set_next_fetch));
        }
    },
];

export default (DISABLE_TOKEN_LOG: boolean) => {
    const NOP = (..._: any []) => {};
    const dbg = DISABLE_TOKEN_LOG ? { log: NOP, debug: NOP, error: NOP, group: NOP, groupEnd: NOP, groupCollapsed: NOP } : { log: console.log, debug: console.debug, error: console.error, group: console.group, groupEnd: console.groupEnd, groupCollapsed: console.groupCollapsed }
    
    let _authorizing = null;
    const refresh = async () => {
        dbg.group("Refresh Procedure");
        try {
            dbg.log("Refreshing tokens");
            const response = await axios.post("/refresh-tokens");
            dbg.log("Token refresh got reponse ", response);
            // 1. ANY
            const x_atk_ex = response.headers["x-atk-ex"] ?? response.headers["X-Atk-Ex"];
            if (x_atk_ex) {
                store.dispatch(TokenSlice.actions.setExpiry(x_atk_ex));
                dbg.log("Updated X-ATK-EX to ", x_atk_ex);
            } else {
                dbg.log("No X-ATK-EX headers in response");
            }

            ResponseHooks.forEach(hook => hook(response));

            return response.data;
        } catch (error) {
                dbg.error("Error refreshing token:", error);
                dbg.groupEnd();
            throw error;
        }
    };
    axios.interceptors.request.use(async (config) => {
        // dont try checking if access token expired / refresh tokens for these endpoints
        if (
            config.url === "/refresh-tokens" ||
            config.url === "/sign-up" ||
            config.url === "/login" ||
            config.url === "/sign-out"
        ) {
            return config;
        }

        const expire = store.getState().tokenReducer.expiry;
        // 1.
        if (expire) {
            // 1. 3
            if (hasExpired(expire)) {
            // 1. 2
            try {
                const response = await axios.post("/refresh-tokens");
                // if it has not errored at this point, 1. 2. 2
                const x_atk_ex = response.headers["x-atk-ex"] ?? response.headers["X-Atk-Ex"];
                if (x_atk_ex) {
                    store.dispatch(TokenSlice.actions.setExpiry(expire));
                }
                ResponseHooks.forEach(hook => hook(response));
                return config;
            } catch (error) {
                return config;
            }
            } else {
            // 1. 2 (fallback to 1. 1)
            }
        }
        // 1. 1
        return config;
    });
    axios.interceptors.response.use(
        async (config) => {
            dbg.group("Axios Interceptor Success Response");
            dbg.log("Config: ", config);
            if (config.config.url == "/sign-out") {
                dbg.log("Got /sign-out, removing X-ATK-EX");
                store.dispatch(TokenSlice.actions.setExpiry(0));
            } else {
                const x_atk_ex = config.headers["x-atk-ex"] ?? config.headers["X-Atk-Ex"];
                if (x_atk_ex) {
                    dbg.log("Got new X-ATK-EX headers, updating to ", x_atk_ex);
                    store.dispatch(TokenSlice.actions.setExpiry(x_atk_ex));
                } else {
                    dbg.log("No new X-ATK-EX headers to update");
                }
            }
            ResponseHooks.forEach(hook => hook(config));
            dbg.groupEnd();
            return config;
        },
        async (error) => {
            dbg.group("Axios Interceptor Failure Response");
            const originalRequestConfig = error.config;

            if (error.response?.status !== 401) {
                dbg.log("Error status is not 401, ignoring response ", error);
                dbg.groupEnd();
                return Promise.reject(error);
            }
            // dont retry refresh again
            if (
                originalRequestConfig._retry ||
                originalRequestConfig.url === "/refresh-tokens"
            ) {
                dbg.log(
                    "Will not refresh tokens again as it has already been attempted"
                );
                dbg.groupEnd();
                return Promise.reject(error);
            }
            // dont refresh for these endpoints
            if (
                originalRequestConfig.url === "/sign-up" ||
                originalRequestConfig.url === "/login" ||
                originalRequestConfig.url === "/sign-out"
            ) {
                dbg.log("Will not refresh for /sign-up, /login, or /sign-out");
                dbg.groupEnd();
                return Promise.reject(error);
            }

            dbg.log("Attempting to refresh");
            originalRequestConfig._retry = true;

            try {
            _authorizing = refresh()
                .catch((error) => {
                    return Promise.reject(error);
                })
                .finally(() => {
                    _authorizing = null;
                    dbg.groupEnd();
                });

            await _authorizing;
                return axios.request(originalRequestConfig);
            } catch (error) {
                _authorizing = null;
                dbg.log("Refreshing encountered an error, ", error);
                dbg.groupEnd();
            return Promise.reject(error);
            }
        }
    );
    dbg.log("Axios interceptors active");
}