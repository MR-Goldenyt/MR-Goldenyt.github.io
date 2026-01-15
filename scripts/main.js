import { isLoggedIn } from "./helpers.js";
import { renderLoginForm } from "./login.js";
import { renderProfileSection } from "./profile.js";

function createAppContainer() {
    const app = document.createElement("div");
    app.id = "app";
    document.body.appendChild(app);
    return app;
}

const app = document.getElementById("app") || createAppContainer();

async function initializeApp(container) {
    try {
        if (await isLoggedIn()) {
            renderProfileSection(container);
        } else {
            renderLoginForm(container);
        }
    } catch (error) {
        console.error("Error initializing app:", error);
        container.innerHTML = `<p class="error">Failed to initialize application: ${error.message}</p>`;
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initializeApp(app));
} else {
    initializeApp(app);
}