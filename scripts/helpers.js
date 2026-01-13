import { getid } from "./queries.js";

const JWT_KEY = "jwt";

export const validToken = async () => {
    try {
        const id = await getid();
        return true;
    } catch (e) {
        return false;
    }
}

export const isLoggedIn = async () => {
    const isValid = await validToken(getJWT());
    return isValid;
}

export const setJWT = (token) => {
    window.localStorage.setItem(JWT_KEY, token);
}

export const getJWT = () => {
    return localStorage.getItem(JWT_KEY);
}

export const clearJWT = () => {
    localStorage.removeItem(JWT_KEY);
}