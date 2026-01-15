import { login } from "./auth.js";
import { updateTitle } from "./helpers.js";
import { getLoginTemplate } from "./templates.js";
import { renderProfileSection } from "./profile.js";


export const renderLoginForm = (container) => {
    try {
        if (!container) {
            throw new Error("App container not found");
        };

        container.innerHTML = getLoginTemplate();

        const loginForm = document.getElementById("login-form");
        const submitBtn = loginForm.querySelector(".login-btn");
        const passwordToggle = document.getElementById("passwordToggle");
        const passwordInput = document.getElementById("password");

        if (!loginForm) {
            throw new Error("Login form not found in template");
        }

        if (passwordToggle && passwordInput) {
            passwordToggle.onclick = (e) => {
                e.preventDefault();
                const type = passwordInput.type === "password" ? "text" : "password";
                passwordInput.type = type;
                passwordToggle.classList.toggle("visible");
            };
        }

        loginForm.onsubmit = async (e) => {
            e.preventDefault();

            const identifier = document.getElementById("identifier");
            const password = document.getElementById("password");
            const errorDisplay = document.getElementById("login-error");

            if (!identifier || !password) {
                showLoginError("Form fields not found", errorDisplay);
                return;
            }

            try {
                errorDisplay.textContent = "";
                errorDisplay.classList.remove("show");

                submitBtn.classList.add("loading");
                submitBtn.disabled = true;

                await login(identifier.value, password.value);
                renderProfileSection(container);
            } catch (err) {
                showLoginError(err.message, errorDisplay);
                submitBtn.classList.remove("loading");
                submitBtn.disabled = false;
            }
        };

        updateTitle("login");
    } catch (error) {
        console.error("Error rendering login form:", error);
        container.innerHTML = `<p class="error">Failed to load login form: ${error.message}</p>`;
    }
}

function showLoginError(message, errorDisplay) {
    if (errorDisplay) {
        errorDisplay.textContent = message;
        errorDisplay.classList.add("show");
    }
    console.error("Login error:", message);
}