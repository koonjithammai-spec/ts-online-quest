let talksData = {};
let npcData = {};
let itemData = {};

// โหลดไฟล์ JSON ทั้งหมด
Promise.all([
    fetch('talks.json').then(res => res.json()).catch(() => ({})),
    fetch('npc.json').then(res => res.json()).catch(() => ({})),
    fetch('item.json').then(res => res.json()).catch(() => ({}))
]).then(([talks, npcs, items]) => {
    talksData = talks;
    npcData = npcs;
    itemData = items;
    console.log("ระบบฐานข้อมูลพร้อมใช้งาน!");
});

function searchGameData() {
    let keyword = document.getElementById('searchInput').value.trim().toLowerCase();
    let resultsDiv = document.getElementById('results');
    let countDiv = document.getElementById('resultCount');
    
    resultsDiv.innerHTML = '';
    
    if (keyword === '') {
        countDiv.innerHTML = '';
        resultsDiv.innerHTML = '<p style="text-align: center; color: #64748b;">พิมพ์ชื่อเควส, ไอเทม หรือ NPC เพื่อค้นหาข้อมูล...</p>';
        return;
    }

    let matches = [];

    // ค้นหาใน Item
    for (let key in itemData) {
        let item = itemData[key];
        let textStr = JSON.stringify(item).toLowerCase();
        if (textStr.includes(keyword)) {
            matches.push({ category: 'ไอเทม', id: key, name: item.name || item.Name || `Item #${key}`, detail: item });
        }
        if (matches.length >= 50) break;
    }

    // ค้นหาใน NPC
    for (let key in npcData) {
        let npc = npcData[key];
        let textStr = JSON.stringify(npc).toLowerCase();
        if (textStr.includes(keyword)) {
            matches.push({ category: 'NPC', id: key, name: npc.name || npc.Name || `NPC #${key}`, detail: npc });
        }
        if (matches.length >= 50) break;
    }

    // ค้นหาใน Talks / เควส
    for (let key in talksData) {
        let talk = talksData[key];
        let textStr = JSON.stringify(talk).toLowerCase();
        if (textStr.includes(keyword)) {
            matches.push({ category: 'เควส/บทสนทนา', id: key, name: `Quest/Talk ID: ${key}`, detail: talk });
        }
        if (matches.length >= 50) break;
    }

    countDiv.innerHTML = `ค้นพบข้อมูลที่เกี่ยวข้องทั้งหมด ${matches.length} รายการ`;

    if (matches.length === 0) {
        resultsDiv.innerHTML = '<p style="text-align: center; color: #f43f5e;">ไม่พบข้อมูลที่คุณค้นหา</p>';
        return;
    }

    // สร้างตารางแสดงผลให้ดูสะอาดตา
    let tableHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>หมวดหมู่</th>
                    <th>ID / ชื่อรายการ</th>
                    <th>รายละเอียดเบื้องต้น</th>
                </tr>
            </thead>
            <tbody>
    `;

    matches.forEach(m => {
        let previewText = m.detail.text || m.detail.desc || m.detail.Description || JSON.stringify(m.detail);
        if (previewText.length > 100) previewText = previewText.substring(0, 100) + '...';

        tableHTML += `
            <tr>
                <td><span class="badge ${m.category === 'ไอเทม' ? 'badge-item' : m.category === 'NPC' ? 'badge-npc' : 'badge-quest'}">${m.category}</span></td>
                <td><b>${m.id}</b></td>
                <td>${previewText}</td>
            </tr>
        `;
    });

    tableHTML += `</tbody></table>`;
    resultsDiv.innerHTML = tableHTML;
}