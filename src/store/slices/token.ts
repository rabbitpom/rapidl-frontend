import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { hasExpired, hasExpiredWithinMargin } from "@/lib/utils";

interface TokenState {
    sessionEnded: boolean,        /* Use this to track if the tokens have completely expired */
    expired: boolean,             /* Has the access token expired                            */
    expiredWithinMargin: boolean, /* Has the access token expired early                      */
    expiry: number,               /* Expiry UTC timestamp for access token                   */
}

const InitialState: TokenState = {
    sessionEnded: true,
    expired: true,
    expiredWithinMargin: true,
    expiry: 0, 
}

export const TokenSlice = createSlice({
    name: "token",
    initialState: InitialState,
    reducers: {
        setExpiry: (state, action: PayloadAction<number | string>) => {
            let expire: number = 0;
            if (typeof action.payload == "string") {
                let _c_expire: string = action.payload;
                let _expire: number = parseInt(_c_expire, 10);
                if (_expire) {
                    if (!isNaN(_expire)) {
                        expire = _expire;
                    }
                }
            } else {
                expire = action.payload;
            }
            state.expiry = expire;
            state.expired = hasExpired(expire);
            state.expiredWithinMargin = hasExpiredWithinMargin(expire);
            state.sessionEnded = expire == 0;
        },
        selfUpdate: (state) => {
            state.expired = hasExpired(state.expiry);
            state.expiredWithinMargin = hasExpiredWithinMargin(state.expiry);
        }
    },
})

export default TokenSlice.reducer;
export const { setExpiry, selfUpdate } = TokenSlice.actions;