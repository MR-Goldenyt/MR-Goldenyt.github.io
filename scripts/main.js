import { login, logout } from "./auth.js";
import { loadProfile } from "./profile.js";
import { isLoggedIn } from "./helpers.js";
import { getLoginTemplate, getProfileTemplate } from "./templates.js";
import { getName } from "./queries.js";

function createAppContainer() {
    const app = document.createElement("div");
    app.id = "app";
    document.body.appendChild(app);
    return app;
}

const app = document.getElementById("app") || createAppContainer();

function renderLoginForm() {
    try {
        app.innerHTML = getLoginTemplate();

        const loginForm = document.getElementById("login-form");
        const submitBtn = loginForm.querySelector(".login-btn");
        const passwordToggle = document.getElementById("passwordToggle");
        const passwordInput = document.getElementById("password");

        if (!loginForm) {
            throw new Error("Login form not found in template");
        }

        // Setup password toggle
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
                showProfile();
            } catch (err) {
                showLoginError(err.message, errorDisplay);
                submitBtn.classList.remove("loading");
                submitBtn.disabled = false;
            }
        };

        updateTitle("login");
    } catch (error) {
        console.error("Error rendering login form:", error);
        app.innerHTML = `<p class="error">Failed to load login form: ${error.message}</p>`;
    }
}

function showLoginError(message, errorDisplay) {
    if (errorDisplay) {
        errorDisplay.textContent = message;
        errorDisplay.classList.add("show");
    }
    console.error("Login error:", message);
}

function renderProfileSection() {
    try {
        app.innerHTML = getProfileTemplate();

        const logoutBtn = document.getElementById("logout");

        if (!logoutBtn) {
            throw new Error("Logout button not found in template");
        }

        logoutBtn.onclick = () => {
            logout();
            location.reload();
        };

        initSmoothScroll();

        loadProfile()
            .catch(error => {
                console.error("Profile loading error:", error);

                const errorMsg = error.message.toLowerCase();
                if (errorMsg.includes("unauthorized") || errorMsg.includes("authenticated") || errorMsg.includes("401") || errorMsg.includes("invalid or expired token")) {
                    logout();
                    renderLoginForm();
                    return;
                }

                const profileSection = document.getElementById("profile-section");
                if (profileSection) {
                    profileSection.innerHTML += `<p class="error">Failed to load profile: ${error.message}</p>`;
                }
            });

        updateTitle("profile");
    } catch (error) {
        console.error("Error rendering profile section:", error);
        app.innerHTML = `<p class="error">Failed to load profile: ${error.message}</p>`;
    }
}

function updateTitle(state) {
    document.title = `GraphQL - ${state}`;
}

function initSmoothScroll() {
    const scrollMap = {
        '.btn-stats': 'pass-count',    // Maps class to target ID
        '.btn-progress': 'level',      // Maps class to target ID
        '.btn-graphs': 'xp-graph'      // Maps class to target ID
    };

    Object.keys(scrollMap).forEach(selector => {
        const btn = document.querySelector(selector);
        if (btn) {
            btn.onclick = (e) => {
                e.preventDefault();
                const target = document.getElementById(scrollMap[selector]);
                if (target) {
                    const headerOffset = 100; // Adjust based on your header height
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            };
        }
    });
}

function showProfile() {
    renderProfileSection();
}


function initializeApp() {
    try {
        if (isLoggedIn()) {
            showProfile();
        } else {
            renderLoginForm();
        }
    } catch (error) {
        console.error("Error initializing app:", error);
        app.innerHTML = `<p class="error">Failed to initialize application: ${error.message}</p>`;
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeApp);
} else {
    initializeApp();
}