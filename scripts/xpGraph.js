export function drawXpGraph(data) {
    try {
        const svg = document.getElementById("xp-graph");

        if (!svg) {
            throw new Error("XP graph SVG element not found");
        }

        if (!Array.isArray(data) || data.length === 0) {
            throw new Error("Invalid or empty transaction data");
        }

        svg.innerHTML = "";

        let x = 0;
        let y = 200;
        let cumulative = 0;

        data.forEach(transaction => {
            cumulative += transaction.amount || 0;

            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", x);
            line.setAttribute("y1", y);

            x += 30;
            y = 200 - (cumulative / 100);

            line.setAttribute("x2", x);
            line.setAttribute("y2", y);
            line.setAttribute("stroke", "lime");
            line.setAttribute("stroke-width", "2");

            svg.appendChild(line);
        });
    } catch (error) {
        console.error("Error drawing XP graph:", error);
        throw error;
    }
}