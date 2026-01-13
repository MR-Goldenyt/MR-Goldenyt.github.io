import { getJWT } from "./helpers.js";

const GRAPHQL_API = "https://learn.reboot01.com/api/graphql-engine/v1/graphql";
const ErrorMsg = "Error 401 Unauthorized - Invalid or expired token";

export const graphql = async(query) => {
    try {
        const token = getJWT();
        if (!token) {
            throw new Error("Not authenticated");
        }

        if (!query || typeof query !== "string") {
            throw new Error("Invalid query");
        }

        const res = await fetch(GRAPHQL_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ query })
        });

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();

        if (data.errors && data.errors.length > 0) {
            throw new Error(ErrorMsg);
        }

        return data.data;
    } catch (error) {
        throw new Error(error.message || ErrorMsg);
    }
}

export const getid = async () => {
    const query = `
    query {
        user {
            id
        }
    }
    `;
    const data = await graphql(query);
    if (!data) {
        console.log(data)
        throw new Error(ErrorMsg);
    }
    return data.user[0].id;
}

export const getName = async () => {
    const query = `
    query {
        user {
            firstName
            lastName
            login
        }
    }
    `;
    const data = await graphql(query);
    if (!data) {
        throw new Error(ErrorMsg);
    }
    return [data.user[0].firstName, data.user[0].lastName, data.user[0].login];
}

export const getLevel = async () => {
    const query = `
        query {
            transaction(
                where: {
                userId: { _eq: ${await getid()} }
                type: { _eq: "level" }
                }
                order_by: [{ createdAt: desc }, { amount: desc }]
                limit: 1
            ) {
                amount
            }
        }
    `;
    const data = await graphql(query);
    if (!data) {
        throw new Error(ErrorMsg);
    }
    return data.transaction[0].amount;
}

export const getRankData = async () => {
    const query = `
    query {
        object(
            where: { id: { _eq: 100236 } }
            limit: 1
        ) {
            ranksDefinitions: attrs(path: "$.ranksDefinitions")
        }
    }
    `
    const data = await graphql(query);
    if (!data) {
        throw new Error(ErrorMsg);
    }
    const level = await getLevel();
    const ranks = data.object[0].ranksDefinitions;

    let currentIndex = 0;

    for (let idx = 0; idx < ranks.length; idx++) {
        if (ranks[idx].level > level) {
            currentIndex = idx === 0 ? 0 : idx - 1;
            break;
        }
        if (idx === ranks.length - 1) currentIndex = idx;
    }

    const currentRank = ranks[currentIndex].name;
    const nextRank = ranks[currentIndex + 1].name;

    let levelsLeft = 0;

    if (currentIndex < ranks.length - 1) {
        levelsLeft = ranks[currentIndex + 1].level - level;
    } else {
        levelsLeft = 0;
        nextRank = null;
    }

    return {
        currentRank,
        nextRank,
        levelsLeft
    };
}

export const getAuditRatio = async () => {
    const userId = await getid();
    const query = `
    query {
        upTransactions: transaction(
            where: { userId: { _eq: ${userId} }, type: { _eq: "up" } }
            order_by: { createdAt: desc }
        ) {
            amount
        }

        downTransactions: transaction(
            where: { userId: { _eq: ${userId} }, type: { _eq: "down" } }
            order_by: { createdAt: desc }
        ) {
            amount
        }
    }
    `;
    const data = await graphql(query);
    if (!data) {
        throw new Error(ErrorMsg);
    }
    
    const totalXpUp = data.upTransactions.reduce((sum, audit) => sum + audit.amount, 0);
    const totalXpDown = data.downTransactions.reduce((sum, audit) => sum + audit.amount, 0);

    return Math.round((totalXpUp/totalXpDown)*10/10).toFixed(1);
}

export const getLastProject = async () => {
    const query = `
        query {
            transaction(
                where: {
                userId: { _eq: ${await getid()} }
                type: { _eq: "level" }
                }
                order_by: [{ createdAt: desc }, { amount: desc }]
                limit: 1
            ) {
                object {
                    name 
                }
            }
        }
    `;
    const data = await graphql(query);
    if (!data) {
        throw new Error(ErrorMsg);
    }
    return data.transaction[0].object.name;
}

export const getSkillTypes = async () => {
    const query = `
    query {
        transaction(
            where: { type: { _like: "skill_%" } }
            distinct_on: type
            order_by: { type: asc }
        ) {
            type
        }
    }
    `
    const data = await graphql(query);
    if (!data) {
        throw new Error(ErrorMsg);
    }
    const types = [];
    for (const entry of data.transaction) {
        types.push(entry.type.replace("skill_", ""));
    }
    return types;
}

export const getSkillsXp = async () => {
    const types = await getSkillTypes();
    let query = "query SkillSums {";
    for (const type of types) {
        query += `
        ${type.replace("-","_")}: transaction_aggregate(where: { type: { _eq: "skill_${type}" } }) {
            aggregate { sum { amount } }
        }

        `
    }
    query += "}";
    const data = await graphql(query);
    if (!data) {
        throw new Error(ErrorMsg);
    }
    
    let results = {};
    for (const type of types) {
        // @ts-ignore
        results[type] = data[type.replace("-","_")].aggregate.sum.amount;
    }
        return results;
}

export const getXpOverTime = async () => {
    const query = `
    query {
        transaction(
            where: {
              type: { _eq: "xp" }
            	path: { _like: "%/bh-module/%" }
              _or: [
                { path: { _nlike: "%/piscine%" } }
                { path: { _eq: "/bahrain/bh-module/piscine-js" } }
                { path: { _eq: "/bahrain/bh-module/piscine-rust" } }
          		]
            }
            order_by: {createdAt:asc}
        ) {
            amount
            createdAt
        }
    }
    `;
    const data = await graphql(query);
    if (!data) {
        throw new Error(ErrorMsg);
    }
    return data.transaction;
}