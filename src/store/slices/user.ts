import axios from "axios";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../configure-store";
import { getUTCSeconds } from "@/lib/utils";

interface UserState {
    username: string,
    userId: number,
    credits: number,
    email: string,
    emailVerified: boolean,
    hasSupportPrivilege: boolean,
    nextFetch: number,
}

const InitialState: UserState = {
    username: "",
    userId: -1,
    credits: 0,
    email: "",
    emailVerified: false,
    hasSupportPrivilege: false,
    nextFetch: 0,
}

const ResetState = (state: any) => {
    state.email = InitialState.email;
    state.username = InitialState.username;
    state.credits = InitialState.credits;
    state.emailVerified = InitialState.emailVerified;
    state.userId = InitialState.userId;
    state.nextFetch = InitialState.nextFetch;
    state.hasSupportPrivilege = InitialState.hasSupportPrivilege;
}

export const UserSlice = createSlice({
    name: "user",
    initialState: InitialState,
    reducers: {
        flushUserSlice: (state) => {
            ResetState(state);
        },
        setUserEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload;
        },
        setUserEmailVerified: (state, action: PayloadAction<boolean>) => {
            state.emailVerified = action.payload;
        },
        setUserUsername: (state, action: PayloadAction<string>) => {
            state.username = action.payload;
        },
        setUserCredits: (state, action: PayloadAction<number>) => {
            state.credits = action.payload;
        },
        setUserNextFetch: (state, action: PayloadAction<number>) => {
            state.nextFetch = action.payload;
        },
        setHasSupportPrivilege: (state, action: PayloadAction<boolean>) => {
            state.hasSupportPrivilege = action.payload;
        },
    },
    extraReducers(builder) {
        builder.addCase(updateUserSliceAsync.fulfilled, (state, action) => {
            if (action.payload.ignore) {
                return
            }
            if (action.payload.reset) {
                ResetState(state);
                return
            }
            state.email = action.payload.email;
            state.username = action.payload.username;
            state.credits = action.payload.credits;
            state.emailVerified = action.payload.email_verified;
            state.userId = action.payload.user_id;
            state.nextFetch = action.payload.next_call;
            state.hasSupportPrivilege = action.payload.has_support_privilege;
        })
        builder.addCase(forceUpdateUserSliceAsync.fulfilled, (state, action) => {
            if (action.payload.ignore) {
                return
            }
            if (action.payload.reset) {
                ResetState(state);
                return
            }
            state.email = action.payload.email;
            state.username = action.payload.username;
            state.credits = action.payload.credits;
            state.emailVerified = action.payload.email_verified;
            state.userId = action.payload.user_id;
            state.nextFetch = action.payload.next_call;
            state.hasSupportPrivilege = action.payload.has_support_privilege;
        })
    },
})

export const updateUserSliceAsync = createAsyncThunk(
    "user/updateUserSliceAsync",
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        if (state.userReducer.nextFetch > getUTCSeconds()) {
            return {ignore: true}
        }
        try {
            const response = await axios.get("/get-profile");
            return response.data;
        } catch(err) {
            console.log("Error when updating user slice:", err);
            return {
                reset: true
            }
        }
    }
);

type updateUserSliceAsync = ReturnType<typeof updateUserSliceAsync>;

export const forceUpdateUserSliceAsync = createAsyncThunk(
    "user/forceUpdateUserSliceAsync",
    async () => {
        try {
            const response = await axios.get("/get-profile");
            return response.data;
        } catch(err) {
            console.log("Error when updating user slice:", err);
            return {
                reset: true
            }
        }
    }
);

type forceUpdateUserSliceAsync = ReturnType<typeof forceUpdateUserSliceAsync>;

export default UserSlice.reducer;
export const { setUserEmail, setUserEmailVerified, setUserUsername, flushUserSlice } = UserSlice.actions;