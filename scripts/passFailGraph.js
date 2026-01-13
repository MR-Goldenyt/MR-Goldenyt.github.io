export function drawPassFailGraph(pass, fail) {
    try {
        const svg = document.getElementById("passfail-graph");

        if (!svg) {
            throw new Error("Pass/Fail graph SVG element not found");
        }

        if (typeof pass !== "number" || typeof fail !== "number" || pass < 0 || fail < 0) {
            throw new Error("Pass and fail values must be non-negative numbers");
        }

        const total = pass + fail;

        if (total === 0) {
            throw new Error("No results to display");
        }

        svg.innerHTML = "";

        const passAngle = (pass / total) * 2 * Math.PI;
        const radius = 90;
        const cx = 100;
        const cy = 100;

        // Calculate pass slice coordinates
        const x1 = cx + radius * Math.cos(0);
        const y1 = cy + radius * Math.sin(0);
        const x2 = cx + radius * Math.cos(passAngle);
        const y2 = cy + radius * Math.sin(passAngle);

        // Large arc flag (for arcs > 180 degrees)
        const largeArc = passAngle > Math.PI ? 1 : 0;

        // Draw pass slice (green)
        const passPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        passPath.setAttribute("d", `M${cx},${cy} L${x1},${y1} A${radius},${radius} 0 ${largeArc} 1 ${x2},${y2} Z`);
        passPath.setAttribute("fill", "lime");
        svg.appendChild(passPath);

        // Draw fail slice (red)
        const failPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        failPath.setAttribute("d", `M${cx},${cy} L${x2},${y2} A${radius},${radius} 0 0 1 ${cx + radius},${cy} Z`);
        failPath.setAttribute("fill", "red");
        svg.appendChild(failPath);
    } catch (error) {
        console.error("Error drawing pass/fail graph:", error);
        throw error;
    }
}