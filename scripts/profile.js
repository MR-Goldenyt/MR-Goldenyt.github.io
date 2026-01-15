import { logout } from "./auth.js";
import { updateTitle } from "./helpers.js";
import { drawXpGraph } from "./xpGraph.js";
import { renderLoginForm } from "./login.js";
import { drawSkills } from "./skillsProgress.js";
import { getProfileTemplate } from "./templates.js";
import {
    getName,
    getLevel,
    getRankData,
    getAuditRatio,
    getLastProject,
    getSkillsXp,
    getXpOverTime
} from "./queries.js";

export const loadProfile = async () => {
    try {
        await loadUserInfo();
    } catch (error) {
        console.error("Error loading profile:", error);
        throw new Error(`Failed to load profile: ${error.message}`);
    }
}

async function loadUserInfo() {
    try {
        const [
            nameData,
            level,
            rankInfo,
            ratio,
            lastProject,
            skillsData,
            xpTimeline
        ] = await Promise.all([
            getName(),
            getLevel(),
            getRankData(),
            getAuditRatio(),
            getLastProject(),
            getSkillsXp(),
            getXpOverTime()
        ]);

        const [firstName, lastName, userName] = nameData;

        const navTitle = document.getElementById("header-title");

        if (navTitle) {
            const isDesktop = window.innerWidth > 600;
            
            navTitle.textContent = isDesktop 
                ? `${userName}'s Intra Dashboard` 
                : `${userName}'s Dashboard`;
        }
        
        const nameElement = document.getElementById("login-name");
        if (nameElement) {
            nameElement.textContent = `Welcome, ${firstName} ${lastName}`;
        }

        updateStat('display-level', level);

        updateStat('display-rank', rankInfo.currentRank);

        const progressText = rankInfo.nextRank
            ? `${rankInfo.levelsLeft} levels left until ${rankInfo.nextRank}`
            : "Maximum Rank Achieved";
        updateStat('rank-progress', progressText);

        updateStat('display-ratio', ratio);

        const ratioMsg = document.getElementById('ratio-message');
        if (ratioMsg) {
            ratioMsg.textContent = ratio >= 1.2 ? "Excellent work!" : "You can do better!";
            ratioMsg.style.color = ratio >= 1.2 ? "#3CA2F4" : "#ffbc00";
        }

        const doneBar = document.getElementById('done-bar');
        const receivedBar = document.getElementById('received-bar');
        if (doneBar && receivedBar) {
            doneBar.style.width = ratio >= 1 ? "100%" : `${ratio * 100}%`;
            receivedBar.style.width = "90%";
        }

        const cleanProjectName = lastProject
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        updateStat('display-last-project', cleanProjectName);

        drawSkills(skillsData);

        drawXpGraph(xpTimeline);

    } catch (error) {
        console.error("Error populating stats:", error);
    }
}

export const renderProfileSection = (container) => {
    try {
        if (!container) {
            throw new Error("App container not found");
        };

        container.innerHTML = getProfileTemplate();
        setupNavigationBtns();
        const logoutBtn = document.getElementById("logout");

        if (!logoutBtn) {
            throw new Error("Logout button not found in template");
        }

        logoutBtn.onclick = () => {
            logout();
            location.reload();
        };

        loadProfile()
            .catch(error => {
                console.error("Profile loading error:", error);

                const errorMsg = error.message.toLowerCase();
                if (errorMsg.includes("unauthorized") || errorMsg.includes("authenticated") || errorMsg.includes("401") || errorMsg.includes("invalid or expired token")) {
                    logout();
                    renderLoginForm(container);
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
        container.innerHTML = `<p class="error">Failed to load profile: ${error.message}</p>`;
    }
}

function setupNavigationBtns() {
    const navConfigs = [
        { btnClass: '.btn-stats', targetId: 'stats-summary' },
        { btnClass: '.btn-progress', targetId: 'skills-section' },
        { btnClass: '.btn-graphs', targetId: 'xp-timeline-section' }
    ];

    navConfigs.forEach(config => {
        const btn = document.querySelector(config.btnClass);
        const target = document.getElementById(config.targetId);
        
        if (btn && target) {
            btn.onclick = () => {
                target.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            };
        }
    });
}

function updateStat(id, value) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = value;
        el.classList.remove('loading-text');
    }
}

