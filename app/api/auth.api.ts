// app/api/auth.api.ts

import { setUser } from "~/features/user/userSlice";
import { getToken } from "~/utils/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export interface RegisterPayload {
    name: string,
    email: string,
    password: string,
    branchName: string,
    subdomain: string,
    customDomain?: string,
}

export interface LoginPayload {
    email: string,
    password: string,
}

export async function registerUser(payload: RegisterPayload) {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Registration failed.");
    }
    return data;
}


export async function loginUser(payload: LoginPayload) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    return data;
}

export async function logoutUser() {
    const token = getToken();
    if (!token) throw new Error("User not authenticated");

    const res = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Logout failed");
    return data;
}

// User Profile Endpoints
export interface UserProfileData {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    provider: string;
    createdAt: string;
}

export interface BranchData {
    id: string;
    name: string;
    slug: string;
    subdomain: string;
    customDomain: string | null;
}

export interface UserProfileResponse {
    message: string;
    user: UserProfileData;
    branch: BranchData | null;
}

export interface UpdateProfilePayload {
    name?: string;
    branchName?: string;
    subdomain?: string;
    customDomain?: string;
}

export async function getUserProfile(): Promise<UserProfileResponse> {
    const token = getToken();
    if (!token) throw new Error("User not authenticated");

    const res = await fetch(`${API_URL}/users/profile/view`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Invalid response format:", text);
        throw new Error("Server returned invalid response format");
    }

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to fetch user profile");
    
    // Store user in Redux
    setUser(data.user);

    return data;
}

export async function updateUserProfile(payload: UpdateProfilePayload): Promise<UserProfileResponse> {
    const token = getToken();
    if (!token) throw new Error("User not authenticated");

    console.log("Updating profile with payload:", payload);
    console.log("API URL:", `${API_URL}/users/profile/update`);

    const res = await fetch(`${API_URL}/users/profile/update`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    console.log("Response status:", res.status);

    const contentType = res.headers.get("content-type");
    const text = await res.text();
    
    console.error("Response text:", text);
    console.error("Content-Type:", contentType);

    if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Server returned invalid response format (Status: ${res.status}). Response: ${text.substring(0, 200)}`);
    }

    let data;
    try {
        data = JSON.parse(text);
    } catch (e) {
        throw new Error(`Failed to parse JSON. Response: ${text.substring(0, 200)}`);
    }

    if (!res.ok) throw new Error(data.message || "Failed to update user profile");
    
    // Update Redux with new user data
    setUser(data.user);

    return data;
}