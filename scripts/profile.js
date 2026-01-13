import { graphql } from "./queries.js";
import { drawXpGraph } from "./xpGraph.js";
import { drawPassFailGraph } from "./passFailGraph.js";
import { 
    getName, 
    getLevel, 
    getRankData, 
    getAuditRatio, 
    getLastProject 
} from "./queries.js";

export async function loadProfile() {
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
            lastProject
        ] = await Promise.all([
            getName(),
            getLevel(),
            getRankData(),
            getAuditRatio(),
            getLastProject()
        ]);

        // 1. Identity Focus
        const [firstName, lastName] = nameData;
        const nameElement = document.getElementById("login-name");
        if (nameElement) {
            nameElement.textContent = `Welcome, ${firstName} ${lastName}`;
        }

        // 2. Level Section (Hero Size)
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
            receivedBar.style.width = "90%"; // Baseline comparison
        }

        const cleanProjectName = lastProject
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
            
        updateStat('display-last-project', cleanProjectName);

    } catch (error) {
        console.error("Error populating stats:", error);
    }
}

function updateStat(id, value) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = value;
        el.classList.remove('loading-text');
    }
}

