let graphState = {
    transactions: [],
    density: 4
};

export const drawXpGraph = (transactions, density = 4) => {
    const container = document.getElementById('xp-graph-container');
    if (!container || !transactions.length) return;

    const containerWidth = container.offsetWidth;
    const isSmall = containerWidth < 600;
    
    let validatedDensity = Math.max(2, Math.min(density, isSmall ? 4 : 8));
    
    graphState.transactions = transactions;
    graphState.density = validatedDensity;

    const slider = document.getElementById('date-density-slider');
    const sliderVal = document.getElementById('slider-val');
    if (slider) {
        slider.max = isSmall ? 4 : 8;
        if (parseInt(slider.value) > slider.max) {
            slider.value = slider.max;
            validatedDensity = slider.max;
        }
        sliderVal.textContent = validatedDensity;
    }

    let totalXP = 0;
    const progressData = transactions.map(tx => {
        totalXP += tx.amount;
        return { 
            date: new Date(tx.createdAt), 
            amount: Math.round(totalXP / 1000) 
        };
    });

    const maxKB = progressData[progressData.length - 1].amount;
    const width = 1000;
    const height = isSmall ? 500 : 350; 
    const padding = { top: 30, right: 40, bottom: 60, left: isSmall ? 70 : 90 };
    
    const graphWidth = width - padding.left - padding.right;
    const graphHeight = height - padding.top - padding.bottom;

    const startTime = progressData[0].date.getTime();
    const endTime = progressData[progressData.length - 1].date.getTime();
    const timeRange = endTime - startTime;

    const getX = (date) => padding.left + ((date.getTime() - startTime) / timeRange) * graphWidth;
    const getY = (kb) => padding.top + graphHeight - (kb / maxKB) * graphHeight;

    let stepPath = `M ${getX(progressData[0].date)},${getY(0)}`;
    progressData.forEach(p => stepPath += ` H ${getX(p.date)} V ${getY(p.amount)}`);

    const syncPoints = Array.from({ length: validatedDensity }).map((_, i) => {
        const targetTime = startTime + (timeRange * (i / (validatedDensity - 1)));
        const targetDate = new Date(targetTime);
        
        const activeTx = progressData.filter(p => p.date.getTime() <= targetTime).pop() || progressData[0];
        
        return {
            displayDate: `${targetDate.getDate()}/${targetDate.getMonth() + 1}`,
            x: getX(targetDate),
            y: getY(activeTx.amount),
            kb: activeTx.amount
        };
    });

    container.innerHTML = `
        <div id="xp-tooltip" style="position: absolute; white-space: nowrap; display: none; background: #111A36; border: 1px solid #3CA2F4; color: white; padding: 0.5rem 1rem; border-radius: 0.25rem; font-size: 0.9rem; pointer-events: none; z-index: 2;"></div>
        <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" style="width: 100%; height: auto; overflow: visible;">
            ${[0, Math.round(maxKB/2), maxKB].map(v => `
                <text x="${padding.left - 15}" y="${getY(v)}" fill="rgba(255,255,255,0.5)" style="font-size: ${isSmall ? '1.8rem' : '1.1rem'};" text-anchor="end" dominant-baseline="middle">
                    ${v}${isSmall ? 'k' : ' kB'}
                </text>
                <line x1="${padding.left}" y1="${getY(v)}" x2="${width - padding.right}" y2="${getY(v)}" stroke="rgba(255,255,255,0.1)" />
            `).join('')}

            ${syncPoints.map(p => `
                <text x="${p.x}" y="${height - 10}" fill="rgba(255,255,255,0.5)" style="font-size: ${isSmall ? '1.8rem' : '1.1rem'};" text-anchor="middle">
                    ${p.displayDate}
                </text>
            `).join('')}

            <path d="${stepPath}" fill="none" stroke="#3CA2F4" stroke-width="${isSmall ? 4 : 2}" />
            
            ${syncPoints.map(p => `
                <circle cx="${p.x}" cy="${p.y}" r="${isSmall ? 8 : 4}" fill="#ffbc00" class="xp-point" onmouseover="showXPTooltip(event, ${p.kb})" onmouseout="hideXPTooltip()"/>
            `).join('')}
        </svg>
    `;

    setupSliderListener();
};

const setupSliderListener = () => {
    const slider = document.getElementById('date-density-slider');
    if (slider && !slider.dataset.listener) {
        slider.addEventListener('input', (e) => {
            const isSmall = document.getElementById('xp-graph-container').offsetWidth < 600;
            const maxAllowed = isSmall ? 4 : 8;
            
            let val = parseInt(e.target.value);
            if (val > maxAllowed) {
                val = maxAllowed;
                e.target.value = maxAllowed;
            }
            
            drawXpGraph(graphState.transactions, val);
        });
        
        window.addEventListener('resize', () => {
            drawXpGraph(graphState.transactions, graphState.density);
        });
        slider.dataset.listener = "true";
    }
};

window.showXPTooltip = (e, kb) => {
    const tooltip = document.getElementById('xp-tooltip');
    const container = document.getElementById('xp-graph-container');
    const rect = container.getBoundingClientRect();
    tooltip.style.display = 'block';
    tooltip.innerHTML = `<span style="font-size: 1rem;">${kb} kB</span>`;
    tooltip.style.left = `${e.clientX - rect.left}px`;
    tooltip.style.top = `${e.clientY - rect.top - 50}px`;
    tooltip.style.transform = 'translateX(-50%)';
};

window.hideXPTooltip = () => {
    const tooltip = document.getElementById('xp-tooltip');
    if (tooltip) tooltip.style.display = 'none';
};