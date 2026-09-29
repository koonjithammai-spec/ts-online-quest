let questsData = [];

// โหลดไฟล์ quests.json ที่คอมไพล์มาแล้ว
fetch('quests.json')
    .then(res => res.json())
    .then(data => {
        questsData = data;
        document.getElementById('statsInfoinnerText') || (document.getElementById('statsInfo').innerHTML = `โหลดข้อมูลเควสสำเร็จทั้งหมด ${questsData.length} รายการ`);
        renderQuests(questsData);
    })
    .catch(err => {
        console.error("โหลดไฟล์ quests.json ไม่สำเร็จ:", err);
        document.getElementById('statsInfo').innerHTML = 'ไม่พบไฟล์ quests.json กรุณารัน compiler.py ก่อน';
    });

function renderQuests(data) {
    let container = document.getElementById('questList');
    container.innerHTML = '';

    if (data.length === 0) {
        container.innerHTML = '<div class="no-result">ไม่พบเควสที่คุณค้นหา</div>';
        return;
    }

    let html = '';
    // แสดงผลทีละ 50 รายการแรกก่อนเพื่อความลื่นไหล
    data.slice(0, 50).forEach(q => {
        let stepsHtml = '';
        if (q.steps && q.steps.length > 0) {
            q.steps.forEach(s => {
                stepsHtml += `<li class="quest-step-item"><b>ขั้นที่ ${s.step_no}:</b> ${s.action}</li>`;
            });
        }

        html += `
            <div class="quest-card" onclick='showQuestDetail(${JSON.stringify(q).replace(/'/g, "&#39;")})'>
                <div class="quest-card-header">
                    <span class="badge-quest-id">ID: ${q.quest_id}</span>
                    <h3>${q.title}</h3>
                </div>
                <div class="quest-card-body">
                    <p><b>เงื่อนไข:</b> ${q.prerequisite}</p>
                    <ul class="quest-steps-preview">
                        ${stepsHtml}
                    </ul>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function searchQuests() {
    let keyword = document.getElementById('searchInput').value.trim().toLowerCase();
    if (keyword === '') {
        renderQuests(questsData);
        return;
    }

    let filtered = questsData.filter(q => {
        let titleMatch = q.title.toLowerCase().includes(keyword);
        let idMatch = String(q.quest_id).includes(keyword);
        let stepMatch = q.steps.some(s => s.action.toLowerCase().includes(keyword));
        return titleMatch || idMatch || stepMatch;
    });

    document.getElementById('statsInfo').innerHTML = `ค้นพบเควสที่เกี่ยวข้อง ${filtered.length} รายการ`;
    renderQuests(filtered);
}

function showQuestDetail(q) {
    document.getElementById('modalTitle').innerText = `${q.title} (ID: ${q.quest_id})`;
    
    let detailedSteps = '';
    if (q.steps && q.steps.length > 0) {
        q.steps.forEach(s => {
            detailedSteps += `📍 ขั้นตอนที่ ${s.step_no}\n- การกระทำ/บทพูด: ${s.action}\n- สถานที่: ${s.map}\n-----------------------------------\n`;
        });
    } else {
        detailedSteps = 'ไม่มีข้อมูลขั้นตอนย่อย';
    }

    document.getElementById('modalContent').innerText = `เงื่อนไขก่อนหน้า: ${q.prerequisite}\n\nลำดับขั้นตอนการทำเควส:\n${detailedSteps}`;
    document.getElementById('detailModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('detailModal').style.display = 'none';
}

window.onclick = function(event) {
    let modal = document.getElementById('detailModal');
    if (event.target == modal) modal.style.display = 'none';
}