let allQuests = [];
let currentFilter = 'all';

fetch('quests.json')
    .then(res => res.json())
    .then(data => {
        allQuests = data;
        updateStats(allQuests.length);
        renderTable(allQuests);
    })
    .catch(err => {
        document.getElementById('statsInfo').innerHTML = '⚠️ ยังไม่พบไฟล์ quests.json กรุณารัน python compiler.py ก่อนครับ';
    });

function renderTable(data) {
    let tbody = document.getElementById('questTableBody');
    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 40px; color: #64748b;">ไม่พบข้อมูลเควสที่คุณต้องการ</td></tr>`;
        return;
    }

    let html = '';
    data.slice(0, 100).forEach(q => {
        // หาตัวอย่างสเต็ปแรกมาแสดงย่อ
        let firstStep = q.steps && q.steps.length > 0 ? q.steps[0].action : 'ไม่มีรายละเอียด';
        let hasFight = q.steps.some(s => s.type && s.type.includes('ต่อสู้'));
        let statusBadge = hasFight ? `<span class="badge-fight">⚔️ มีต่อสู้ (Boss)</span>` : `<span class="badge-status">✔ เควสทั่วไป</span>`;

        html += `
            <tr onclick='openQuestModal(${JSON.stringify(q).replace(/'/g, "&#39;")})'>
                <td><span class="badge-id">#${q.quest_id}</span></td>
                <td><b>${q.title}</b></td>
                <td><span style="color: #94a3b8;">📍 แผนที่: ${q.steps[0]?.map || 'ทั่วไป'}</span><br>${firstStep.substring(0, 60)}...</td>
                <td>${statusBadge}</td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

function filterCategory(type, event) {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    if(event) event.target.classList.add('active');
    currentFilter = type;

    if (type === 'fight') {
        let filtered = allQuests.filter(q => q.steps.some(s => s.type && s.type.includes('ต่อสู้')));
        updateStats(filtered.length);
        renderTable(filtered);
    } else {
        updateStats(allQuests.length);
        renderTable(allQuests);
    }
}

function searchQuests() {
    let keyword = document.getElementById('searchInput').value.trim().toLowerCase();
    let baseData = currentFilter === 'fight' ? allQuests.filter(q => q.steps.some(s => s.type && s.type.includes('ต่อสู้'))) : allQuests;

    let filtered = baseData.filter(q => {
        let matchTitle = q.title.toLowerCase().includes(keyword);
        let matchId = String(q.quest_id).includes(keyword);
        let matchStep = q.steps.some(s => s.action.toLowerCase().includes(keyword) || s.map.toLowerCase().includes(keyword));
        return matchTitle || matchId || matchStep;
    });

    updateStats(filtered.length);
    renderTable(filtered);
}

function updateStats(count) {
    document.getElementById('statsInfo').innerHTML = `📊 แสดงผลข้อมูลเควสทั้งหมด <b>${count}</b> รายการ (ระบบค้นหาเรียลไทม์)`;
}

function openQuestModal(q) {
    document.getElementById('modalQuestTitle').innerText = `${q.title} (ID: ${q.quest_id})`;
    
    let stepsHtml = `<div style="margin-bottom: 15px; color: #38bdf8; font-size: 0.9rem;"><b>📌 เงื่อนไขเริ่มต้น:</b> ${q.prerequisite}</div>`;
    
    if (q.steps && q.steps.length > 0) {
        q.steps.forEach(s => {
            stepsHtml += `
                <div class="step-box">
                    <h4>ขั้นตอนที่ ${s.step_no} [ ${s.type} ]</h4>
                    <p style="margin-bottom: 6px;">💬 <b>เนื้อหา/บทพูด:</b> ${s.action}</p>
                    <p style="font-size: 0.85rem; color: #38bdf8;">🗺️ <b>พิกัดแผนที่:</b> ${s.map}</p>
                </div>
            `;
        });
    } else {
        stepsHtml += `<p>ไม่มีขั้นตอนย่อยระบุไว้</p>`;
    }

    document.getElementById('modalQuestBody').innerHTML = stepsHtml;
    document.getElementById('questModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('questModal').style.display = 'none';
}

window.onclick = function(event) {
    let modal = document.getElementById('questModal');
    if (event.target == modal) modal.style.display = 'none';
}