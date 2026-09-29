let allQuests = [];
let currentFilter = 'all';

fetch('quests.json')
    .then(res => res.json())
    .then(data => {
        allQuests = data;
        document.getElementById('totalStatsCounter').innerText = `ระบบพร้อมใช้งาน (${allQuests.length} เควส)`;
        renderGrid(allQuests);
    })
    .catch(err => {
        document.getElementById('totalStatsCounter').innerText = '⚠️ ไม่พบไฟล์ quests.json';
    });

function renderGrid(data) {
    let container = document.getElementById('questGrid');
    container.innerHTML = '';

    if (!data || data.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 50px; color: #64748b;">ไม่พบข้อมูลภารกิจที่ค้นหา</div>`;
        return;
    }

    let html = '';
    // แสดงผล 100 รายการแรกเพื่อความลื่นไหลสูงสุด
    data.slice(0, 100).forEach(q => {
        let firstStep = q.steps && q.steps.length > 0 ? q.steps[0] : { action: 'ไม่มีรายละเอียด', map: 'ไม่ระบุ' };
        let hasFight = q.steps.some(s => s.type && s.type.includes('ต่อสู้'));
        let badgeHtml = hasFight ? `<span class="fight-tag">⚔️ มีจุดปะทะบอส</span>` : `<span class="map-tag">📍 ${firstStep.map}</span>`;

        html += `
            <div class="cyber-card" onclick='openCyberModal(${JSON.stringify(q).replace(/'/g, "&#39;")})'>
                <div class="card-top">
                    <span class="card-id">#${q.quest_id}</span>
                    <span class="card-steps-count">${q.steps ? q.steps.length : 0} ขั้นตอน</span>
                </div>
                <h3>${q.title}</h3>
                <p class="card-snippet">${firstStep.action}</p>
                <div class="card-footer">
                    ${badgeHtml}
                    <span style="color: #64748b; font-size: 0.75rem;">คลิกดูรายละเอียด →</span>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function setFilter(type, event) {
    document.querySelectorAll('.pill-btn').forEach(btn => btn.classList.remove('active'));
    if(event) event.target.classList.add('active');
    currentFilter = type;
    filterQuests();
}

function filterQuests() {
    let keyword = document.getElementById('searchInput').value.trim().toLowerCase();
    
    let baseData = allQuests;
    if (currentFilter === 'fight') {
        baseData = allQuests.filter(q => q.steps.some(s => s.type && s.type.includes('ต่อสู้')));
    }

    let filtered = baseData.filter(q => {
        let matchText = q.title.toLowerCase().includes(keyword) || String(q.quest_id).includes(keyword);
        let matchStep = q.steps.some(s => s.action.toLowerCase().includes(keyword) || s.map.toLowerCase().includes(keyword));
        return matchText || matchStep;
    });

    renderGrid(filtered);
}

function openCyberModal(q) {
    document.getElementById('modalQuestId').innerText = `QUEST ID: ${q.quest_id}`;
    document.getElementById('modalTitle').innerText = q.title;

    let stepsHtml = `<div style="color: #94a3b8; font-size: 0.9rem; margin-bottom: 5px;"><b>📌 เงื่อนไขเริ่มต้น:</b> ${q.prerequisite}</div>`;

    if (q.steps && q.steps.length > 0) {
        q.steps.forEach(s => {
            stepsHtml += `
                <div class="modal-step-card">
                    <div class="step-header-row">
                        <span class="step-num">STEP 0${s.step_no}</span>
                        <span class="step-type-badge">${s.type}</span>
                    </div>
                    <p class="step-action-text">${s.action}</p>
                    <div class="step-map-info">🗺️ สถานที่: ${s.map}</div>
                </div>
            `;
        });
    } else {
        stepsHtml += `<p style="color: #64748b;">ไม่มีข้อมูลขั้นตอนย่อย</p>`;
    }

    document.getElementById('modalBodyContent').innerHTML = stepsHtml;
    document.getElementById('cyberModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('cyberModal').style.display = 'none';
}

function closeModalOnOutside(event) {
    let modal = document.getElementById('cyberModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}