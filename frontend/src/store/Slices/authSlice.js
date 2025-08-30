import axiosInstance from "../../helper/axiosInstance.js";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const initialState = {
    user: null,
    error: null,
    status: false,
    loading: false,
};

export const registerUser = createAsyncThunk("register", async (data) => {
    try {
        const response = await axiosInstance.post("/auth/register", data);
        return response.data.data;
    } catch (error) {
        toast.error(error.response.data.message || "Registration failed");
        throw error;
    }
})

export const loginUser = createAsyncThunk("login", async (data) => {
    try {
        const response = await axiosInstance.post("/auth/login", data);
        return response.data.data;
    } catch (error) {
        toast.error(error.response.data.message || "Invalid credentials");
        throw error;
    }
})

export const logoutUser = createAsyncThunk("logout", async () => {
    try {
        const response = await axiosInstance.post("/auth/logout");
        return response.data.data;
    } catch (error) {
        toast.error(error.response.data.message || "Logout failed");
        throw error;
    }
});

export const currentUser = createAsyncThunk("current-user", async () => {
    try {
        const response = await axiosInstance.get("/auth/me");
        return response.data.data;
    } catch (error) {
        toast.error(error.response.data.message);
        throw error;
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.status = true;
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.status = true;
            })
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.status = false;
            })
            .addCase(logoutUser.rejected, (state) => {
                state.loading = false;
                state.user = null;
                state.status = false;
            })
            .addCase(currentUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(currentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.status = true;
            })
            .addCase(currentUser.rejected, (state) => {
                state.loading = false;
                state.user = null;
                state.status = false;
            });
    },
});

export default authSlice.reducer;