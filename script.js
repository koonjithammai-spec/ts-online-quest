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
                    <p style="font-size: 0.85rem; color: #38bdf8;">🗺️ <b>สถานที่:</b> ${s.map}</p>
                </div>
            `;
        });
    } else {
        stepsHtml += `<p>ไม่มีขั้นตอนย่อยระบุไว้</p>`;
    }

    document.getElementById('modalQuestBody').innerHTML = stepsHtml;
    document.getElementById('questModal').style.display = 'flex';
}