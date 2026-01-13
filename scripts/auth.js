import { setJWT, clearJWT } from "./helpers.js";

const SIGNIN_URL = "https://learn.reboot01.com/api/auth/signin";

export async function login(identifier, password) {
    try {
        if (!identifier || !password) {
            throw new Error("Username and password are required");
        }

        const token = await fetchJWT(identifier, password);
        if (!token) {
            throw new Error("No token received from server");
        }

        setJWT(token);
    } catch (error) {
        throw new Error(error.message || "Login failed");
    }
}

export function logout() {
    clearJWT();
}

export const fetchJWT = async (identifier, password) => {
    const encoded_creds = btoa(identifier+":"+password);
    const token = await fetch("https://learn.reboot01.com/api/auth/signin", {
        "method": "POST",
        "headers": {"Authorization": `Basic ${encoded_creds}`}
    })
    if (!token.ok) {
        throw new Error("Invalid credentials");
    }
    return token.json();
}