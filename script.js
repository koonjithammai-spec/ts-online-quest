let talksData = {};
let sceneData = {};

// โหลดไฟล์ talks.json และ scene.json พร้อมกัน
Promise.all([
    fetch('talks.json').then(res => res.json()).catch(() => ({})),
    fetch('scene.json').then(res => res.json()).catch(() => ({}))
]).then(([talks, scenes]) => {
    talksData = talks;
    sceneData = scenes;
    console.log("โหลดฐานข้อมูลบทสนทนาและฉากสำเร็จ!");
});

function searchGameData() {
    let keyword = document.getElementById('searchInput').value.trim().toLowerCase();
    let resultsDiv = document.getElementById('results');
    let countDiv = document.getElementById('resultCount');
    
    resultsDiv.innerHTML = '';
    
    if (keyword === '') {
        countDiv.innerHTML = '';
        resultsDiv.innerHTML = '<div class="welcome-msg">พิมพ์ชื่อตัวละคร, เนื้อหาเควส หรือชื่อสถานที่ (เช่น จัวจวิ้น, เล่าปี่) เพื่อค้นหา...</div>';
        return;
    }

    let matches = [];

    // 1. ค้นหาในบทสนทนา (talks.json)
    let entries = Array.isArray(talksData) ? talksData.entries() : Object.entries(talksData);
    for (let [index, item] of entries) {
        if (!item) continue;
        let id = item.id !== undefined ? item.id : index;
        let text = item.text || '';
        
        if (text.toLowerCase().includes(keyword)) {
            matches.push({ type: 'บทสนทนา/เควส', id: `ID: ${id}`, content: text });
            if (matches.length >= 80) break;
        }
    }

    // 2. ค้นหาในฉากและแผนที่ (scene.json)
    for (let key in sceneData) {
        if (key.toLowerCase().includes(keyword)) {
            matches.push({ type: 'แผนที่/สถานที่', id: 'Scene', content: `พิกัด/ข้อมูลฉาก: ${key}` });
            if (matches.length >= 100) break;
        }
    }

    countDiv.innerHTML = `ค้นพบข้อมูลที่เกี่ยวข้องทั้งหมด ${matches.length} รายการ`;

    if (matches.length === 0) {
        resultsDiv.innerHTML = '<div class="no-result">ไม่พบข้อมูลที่คุณค้นหา ลองเปลี่ยนคำค้นหาดูครับ</div>';
        return;
    }

    let tableHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th width="20%">หมวดหมู่</th>
                    <th width="20%">รหัส / ข้อมูล</th>
                    <th width="60%">รายละเอียด</th>
                </tr>
            </thead>
            <tbody>
    `;

    matches.forEach(m => {
        let safeContent = m.content.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        let badgeClass = m.type === 'บทสนทนา/เควส' ? 'badge-quest' : 'badge-item';

        tableHTML += `
            <tr onclick='showDetail("${m.type}", "${m.id}", "${safeContent}")'>
                <td><span class="badge ${badgeClass}">${m.type}</span></td>
                <td><b>${m.id}</b></td>
                <td>${m.content}</td>
            </tr>
        `;
    });

    tableHTML += `</tbody></table>`;
    resultsDiv.innerHTML = tableHTML;
}

function showDetail(type, id, content) {
    document.getElementById('modalBody').innerText = `ประเภท: ${type}\nรหัส: ${id}\n\nรายละเอียด:\n${content}`;
    document.getElementById('detailModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('detailModal').style.display = 'none';
}

window.onclick = function(event) {
    let modal = document.getElementById('detailModal');
    if (event.target == modal) modal.style.display = 'none';
}