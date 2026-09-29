let allQuests = [];
let currentFilter = 'all';

// โหลดไฟล์ quests.json ที่คอมไพล์เสร็จแล้ว
fetch('quests.json')
    .then(res => res.json())
    .then(data => {
        allQuests = data;
        updateStats(allQuests.length);
        renderTable(allQuests);
    })
    .catch(err => {
        document.getElementById('statsInfo').innerHTML = '⚠️ ไม่พบไฟล์ quests.json กรุณารัน python compiler.py ก่อนครับ';
    });

// แสดงผลข้อมูลลงในตารางหลัก
function renderTable(data) {
    let tbody = document.getElementById('questTableBody');
    tbody.innerHTML = '';

    if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 40px; color: #64748b;">ไม่พบข้อมูลเควสที่คุณค้นหา</td></tr>`;
        return;
    }

    let html = '';
    // แสดงผลไม่เกิน 150 รายการแรกเพื่อความลื่นไหล
    data.slice(0, 150).forEach(q => {
        let firstStep = q.steps && q.steps.length > 0 ? q.steps[0] : { action: 'ไม่มีรายละเอียด', map: 'ไม่ระบุ' };
        let hasFight = q.steps.some(s => s.type && s.type.includes('ต่อสู้'));
        let statusBadge = hasFight ? `<span class="badge-fight">⚔️ มีต่อสู้ (Boss)</span>` : `<span class="badge-status">✔ เควสทั่วไป</span>`;

        html += `
            <tr onclick='openQuestModal(${JSON.stringify(q).replace(/'/g, "&#39;")})'>
                <td><span class="badge-id">#${q.quest_id}</span></td>
                <td><b>${q.title}</b></td>
                <td><span style="color: #38bdf8;">📍 แผนที่: ${firstStep.map}</span><br>${firstStep.action.substring(0, 50)}...</td>
                <td>${statusBadge}</td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

// ฟังก์ชันเลือกหมวดหมู่เมนูด้านซ้าย
function filterCategory(type, event) {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    if(event) event.target.classList.add('active');
    currentFilter = type;

    applyFilterAndSearch();
}

// ฟังก์ชันค้นหาแบบเรียลไทม์
function searchQuests() {
    applyFilterAndSearch();
}

// ระบบกรองข้อมูลและค้นหาทำงานร่วมกัน
function applyFilterAndSearch() {
    let keyword = document.getElementById('searchInput').value.trim().toLowerCase();
    
    let baseData = allQuests;
    if (currentFilter === 'fight') {
        baseData = allQuests.filter(q => q.steps.some(s => s.type && s.type.includes('ต่อสู้')));
    }

    let filtered = baseData.filter(q => {
        let matchTitle = q.title.toLowerCase().includes(keyword);
        let matchId = String(q.quest_id).includes(keyword);
        let matchStep = q.steps.some(s => s.action.toLowerCase().includes(keyword) || s.map.toLowerCase().includes(keyword));
        return matchTitle || matchId || matchStep;
    });

    updateStats(filtered.length);
    renderTable(filtered);
}

// อัปเดตข้อความสถิติ
function updateStats(count) {
    document.getElementById('statsInfo').innerHTML = `📊 แสดงผลข้อมูลเควสทั้งหมด <b>${count}</b> รายการ`;
}

// เปิดหน้าต่าง Modal ดูรายละเอียดสเต็ปเควสเชิงลึก
function openQuestModal(q) {
    document.getElementById('modalQuestTitle').innerText = `${q.title} (ID: ${q.quest_id})`;
    
    let stepsHtml = `<div style="margin-bottom: 15px; color: #38bdf8; font-size: 0.9rem;"><b>📌 เงื่อนไขเริ่มต้น:</b> ${q.prerequisite}</div>`;
    
    if (q.steps && q.steps.length > 0) {
        q.steps.forEach(s => {
            stepsHtml += `
                <div class="step-box">
                    <h4>ขั้นตอนที่ ${s.step_no} [ ${s.type} ]</h4>
                    <p style="margin-bottom: 4px;">👤 <b>เป้าหมาย/ตัวละคร:</b> ${s.target}</p>
                    <p style="margin-bottom: 6px;">💬 <b>บทพูด/เนื้อหา:</b> ${s.action}</p>
                    <p style="font-size: 0.85rem; color: #38bdf8;">🗺️ <b>แผนที่:</b> ${s.map}</p>
                </div>
            `;
        });
    } else {
        stepsHtml += `<p>ไม่มีขั้นตอนย่อยระบุไว้</p>`;
    }

    document.getElementById('modalQuestBody').innerHTML = stepsHtml;
    document.getElementById('questModal').style.display = 'flex';
}

// ปิดหน้าต่าง Modal
function closeModal() {
    document.getElementById('questModal').style.display = 'none';
}

// ปิด Modal เมื่อคลิกพื้นที่ว่างด้านนอก
window.onclick = function(event) {
    let modal = document.getElementById('questModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}