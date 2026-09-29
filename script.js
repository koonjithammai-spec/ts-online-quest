let allQuests = [];

// โหลดข้อมูลเควส
fetch('quests.json')
    .then(res => res.json())
    .then(data => {
        allQuests = data;
        document.getElementById('totalStatsCounter').innerText = `${allQuests.length} เควส`;
        renderSidebarList(allQuests);
    })
    .catch(err => {
        console.error("โหลดข้อมูลไม่สำเร็จ:", err);
    });

// แสดงรายชื่อทางฝั่งซ้าย
function renderSidebarList(data) {
    let listContainer = document.getElementById('sidebarQuestList');
    listContainer.innerHTML = '';
    
    document.getElementById('resultCountText').innerText = `แสดงทั้งหมด ${data.length} ผลลัพธ์`;

    if (data.length === 0) {
        listContainer.innerHTML = `<div style="padding: 20px; text-align: center; color: #94a3b8; font-size: 0.85rem;">ไม่พบเควสที่ตรงกัน</div>`;
        return;
    }

    let html = '';
    data.forEach((q, index) => {
        let stepCount = q.steps ? q.steps.length : 0;
        html += `
            <div class="sidebar-item" id="q-card-${q.quest_id}" onclick="selectQuest(${q.quest_id})">
                <h4>${q.title}</h4>
                <span>Quest ${q.quest_id} · ${stepCount} ขั้นตอน</span>
            </div>
        `;
    });
    listContainer.innerHTML = html;
}

// เมื่อคลิกเลือกเควสทางซ้าย ให้แสดงรายละเอียดไทม์ไลน์ทางขวา
function selectQuest(id) {
    // เอาไฮไลท์เก่าออก แล้วใส่ไฮไลท์ใหม่
    document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('selected'));
    let selectedEl = document.getElementById(`q-card-${id}`);
    if (selectedEl) selectedEl.classList.add('selected');

    let q = allQuests.find(item => item.quest_id === id);
    if (!q) return;

    let stepsHtml = '';
    if (q.steps && q.steps.length > 0) {
        q.steps.forEach(s => {
            stepsHtml += `
                <div class="timeline-step-card">
                    <div class="step-number-circle">${s.step_no}</div>
                    <div class="step-body-content">
                        <h4>${s.type}</h4>
                        <p>${s.action}</p>
                        <span class="step-map-badge">📍 Map: ${s.map}</span>
                    </div>
                </div>
            `;
        });
    } else {
        stepsHtml = `<p style="color: #64748b; font-size: 0.9rem;">ไม่มีข้อมูลขั้นตอนย่อย</p>`;
    }

    let rightArea = document.getElementById('rightDetailArea');
    rightArea.innerHTML = `
        <div class="detail-header">
            <div class="detail-meta-id">QUEST ID: ${q.quest_id}</div>
            <h1>${q.title}</h1>
            <div class="detail-sub-info">คะแนนตรวจ 100/100 · ${q.steps ? q.steps.length : 0} ขั้นตอน</div>
        </div>

        <div class="prereq-box">
            <b>📌 เงื่อนไขและขอบเขตข้อมูล:</b> ${q.prerequisite}
        </div>

        <div class="timeline-title">ลำดับการเดินเควส</div>
        <div class="timeline-container">
            ${stepsHtml}
        </div>
    `;
}

// ระบบค้นหาและกรองข้อมูลขั้นสูง
function filterAndSearchQuests() {
    let keyword = document.getElementById('searchInput').value.trim().toLowerCase();
    let minStep = parseInt(document.getElementById('minSteps').value) || 0;
    let maxStep = parseInt(document.getElementById('maxSteps').value) || 999;

    let filtered = allQuests.filter(q => {
        let matchText = q.title.toLowerCase().includes(keyword) || String(q.quest_id).includes(keyword);
        let stepCount = q.steps ? q.steps.length : 0;
        let matchStepsCount = stepCount >= minStep && stepCount <= maxStep;

        return matchText && matchStepsCount;
    });

    renderSidebarList(filtered);
}