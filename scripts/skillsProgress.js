const SKILL_CATEGORIES = {
    technical: ['prog', 'algo', 'front-end', 'back-end', 'sys-admin', 'tcp', 'stats', 'ai', 'game'],
    technology: ['go', 'js', 'html', 'sql', 'css', 'unix', 'docker', 'rust', 'ruby', 'python']
};

export const drawSkills = (skillsData) => {
    const container = document.getElementById('radar-container');
    if (!container) return;
    const globalMax = Math.max(...Object.values(skillsData)) || 100;

    const technical = [];
    const technologies = [];

    Object.entries(skillsData).forEach(([type, amount]) => {
        const skillName = type.replace("skill_", "");
        const item = {
            name: skillName.toUpperCase(),
            amount: amount,
            maxRange: globalMax
        };

        if (SKILL_CATEGORIES.technical.includes(skillName)) {
            technical.push(item);
        } else {
            technologies.push(item);
        }
    });

    container.innerHTML = '';

    if (technical.length > 0) {
        container.appendChild(createRadar(technical, "Technical Skills", "#42a5f5"));
    }
    if (technologies.length > 0) {
        container.appendChild(createRadar(technologies, "Technologies", "#9B59B6"));
    }
}

function createRadar(data, title, color) {
    const viewBoxSize = 1000;
    const center = viewBoxSize / 2;

    const radius = 280; 
    const levels = 10;
    const angleStep = (Math.PI * 2) / data.length;
    const highestVal = Math.max(...data.map(s => s.amount));
    const chartMax = Math.sqrt(highestVal * 1.8);

    const getScaledDist = (value) => {
        if (value <= 0) return 0;
        return (Math.sqrt(value) / chartMax) * radius;
    };

    let svg = `<svg viewBox="0 0 ${viewBoxSize} ${viewBoxSize}" preserveAspectRatio="xMidYMid meet" class="radar-svg">`;

    // 1. Grid Rings
    for (let i = 1; i <= levels; i++) {
        const r = (radius / levels) * i;
        const points = data.map((_, idx) => {
            const angle = idx * angleStep - Math.PI / 2;
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
        }).join(' ');
        svg += `<polygon points="${points}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2" />`;
    }

    // 2. Skill Polygon (The Shape)
    const skillPoints = data.map((s, idx) => {
        const angle = idx * angleStep - Math.PI / 2;
        const dist = getScaledDist(s.amount);
        return `${center + dist * Math.cos(angle)},${center + dist * Math.sin(angle)}`;
    }).join(' ');

    svg += `<polygon points="${skillPoints}" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="4" stroke-linejoin="round" />`;

    // 3. Skill Points (The Dots)
    data.forEach((s, idx) => {
        const angle = idx * angleStep - Math.PI / 2;
        const dist = getScaledDist(s.amount);
        const cx = center + dist * Math.cos(angle);
        const cy = center + dist * Math.sin(angle);

        svg += `
        <circle 
            cx="${cx}" 
            cy="${cy}" 
            r="8" 
            fill="${color}" 
            stroke="#fff" 
            stroke-width="3" 
            style="filter: drop-shadow(0 0 6px ${color});"
        />`;
    });

    data.forEach((s, idx) => {
        const angle = idx * angleStep - Math.PI / 2;
        const labelDist = radius + 65; 
        const x = center + labelDist * Math.cos(angle);
        const y = center + labelDist * Math.sin(angle);        
        const anchor = Math.cos(angle) > 0.1 ? 'start' : Math.cos(angle) < -0.1 ? 'end' : 'middle';
        const baseline = Math.sin(angle) > 0.5 ? 'hanging' : Math.sin(angle) < -0.5 ? 'baseline' : 'middle';

        svg += `<text x="${x}" y="${y}" text-anchor="${anchor}" dominant-baseline="${baseline}" fill="#b0bec5" font-size="34" font-weight="700" style="font-family: sans-serif; text-transform: uppercase;">${s.name}</text>`;
    });

    svg += `</svg>`;
    
    const group = document.createElement('div');
    group.className = 'radar-chart-group';
    group.innerHTML = `<h3 class="radar-chart-title" style="color:${color}; font-family: sans-serif; text-align:center; margin-bottom: 15px;">${title}</h3>` + svg;
    return group;
}