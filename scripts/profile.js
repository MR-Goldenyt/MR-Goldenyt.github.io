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
        await loadXpData();
        await loadResultsData();
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

async function loadXpData() {
  try {
    // Fetch XP transactions (replace graphql() with your actual fetch method)
    const xpData = await graphql(`
      {
        transaction(where: { type: { _eq: "xp" } }) {
          amount
          createdAt
        }
      }
    `);

    const transactions = xpData.transaction || [];
    if (transactions.length === 0) {
      throw new Error("No XP transactions found");
    }

    // Calculate total XP
    const totalXp = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);

    // Display total XP
    const totalXpElement = document.getElementById("total-xp");
    totalXpElement.textContent = totalXp.toLocaleString();
    totalXpElement.classList.remove("loading");

    // Calculate level (matches your platform)
    let level = 1;
    let xpForNext = 1000; // starting XP needed for level 2
    while (totalXp >= xpForNext) {
      level++;
      xpForNext = Math.floor((level ** 2) * 1000);
    }

    // Display level
    const levelElement = document.getElementById("level");
    levelElement.textContent = level;
    levelElement.classList.remove("loading");
    drawXpGraph(transactions);
  } catch (error) {
    console.error("Error loading XP data:", error);
  }

}


async function loadResultsData() {
    try {
        const resultData = await graphql(`{ result { grade } }`);

        const results = resultData.result || [];
        let passCount = 0;
        let failCount = 0;

        results.forEach(result => {
            if (result.grade >= 1) {
                passCount++;
            } else {
                failCount++;
            }
        });

        const passElement = document.getElementById("pass-count");
        const failElement = document.getElementById("fail-count");

        if (passElement) passElement.textContent = passCount;
        if (failElement) failElement.textContent = failCount;

        if (passCount + failCount > 0) {
            drawPassFailGraph(passCount, failCount);
        }
    } catch (error) {
        console.error("Error loading results data:", error);
        throw error;
    }
}