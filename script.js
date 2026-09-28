let talksData = {};
let npcData = {};
let itemData = {};
let currentCategory = 'all';

// โหลดข้อมูลทั้งหมด
Promise.all([
    fetch('talks.json').then(res => res.json()).catch(() => ({})),
    fetch('npc.json').then(res => res.json()).catch(() => ({})),
    fetch('item.json').then(res => res.json()).catch(() => ({}))
]).then(([talks, npcs, items]) => {
    talksData = talks;
    npcData = npcs;
    itemData = items;
    console.log("ระบบฐานข้อมูลพร้อมทำงานเต็มรูปแบบ!");
});

function setCategory(category, event) {
    currentCategory = category;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    searchGameData();
}

function searchGameData() {
    let keyword = document.getElementById('searchInput').value.trim().toLowerCase();
    let resultsDiv = document.getElementById('results');
    let countDiv = document.getElementById('resultCount');
    
    if (keyword === '' && currentCategory === 'all') {
        countDiv.innerHTML = '';
        resultsDiv.innerHTML = '<div class="welcome-msg">พิมพ์คำค้นหาด้านบน หรือเลือกหมวดหมู่เพื่อเริ่มใช้งาน</div>';
        return;
    }

    let matches = [];

    // ฟังก์ชันค้นหาแยกตามหมวด
    const searchInObj = (obj, categoryName) => {
        for (let key in obj) {
            let item = obj[key];
            let textStr = JSON.stringify(item).toLowerCase();
            if (keyword === '' || textStr.includes(keyword)) {
                let name = item.name || item.Name || item.title || `ID: ${key}`;
                let desc = item.text || item.desc || item.Description || item.detail || "ไม่มีรายละเอียดสังเขป";
                if (typeof desc === 'object') desc = JSON.stringify(desc);
                
                matches.push({ category: categoryName, id: key, name: name, desc: desc, raw: item });
                if (matches.length >= 150) break;
            }
        }
    };

    if (currentCategory === 'all' || currentCategory === 'item') searchInObj(itemData, 'ไอเทม');
    if (currentCategory === 'all' || currentCategory === 'npc') searchInObj(npcData, 'NPC');
    if (currentCategory === 'all' || currentCategory === 'quest') searchInObj(talksData, 'เควส/บทสนทนา');

    countDiv.innerHTML = `ค้นพบข้อมูลที่เกี่ยวข้องทั้งหมด ${matches.length} รายการ`;

    if (matches.length === 0) {
        resultsDiv.innerHTML = '<div class="no-result">ไม่พบข้อมูลที่คุณค้นหา ลองเปลี่ยนคำค้นหาดูครับ</div>';
        return;
    }

    let tableHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th width="18%">หมวดหมู่</th>
                    <th width="25%">รหัส / ชื่อ</th>
                    <th width="57%">รายละเอียดเบื้องต้น</th>
                </tr>
            </thead>
            <tbody>
    `;

    matches.forEach(m => {
        let shortDesc = m.desc.length > 85 ? m.desc.substring(0, 85) + '...' : m.desc;
        let badgeClass = m.category === 'ไอเทม' ? 'badge-item' : m.category === 'NPC' ? 'badge-npc' : 'badge-quest';
        
        let safeJson = JSON.stringify(m.raw).replace(/"/g, '&quot;').replace(/'/g, '&#39;');

        tableHTML += `
            <tr onclick='showDetail(${safeJson})'>
                <td><span class="badge ${badgeClass}">${m.category}</span></td>
                <td><b>${m.name}</b> <span style="color:#64748b; font-size:0.8rem;">(#${m.id})</span></td>
                <td>${shortDesc}</td>
            </tr>
        `;
    });

    tableHTML += `</tbody></table>`;
    resultsDiv.innerHTML = tableHTML;
}

function showDetail(dataObj) {
    document.getElementById('modalBody').innerText = JSON.stringify(dataObj, null, 2);
    document.getElementById('detailModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('detailModal').style.display = 'none';
}

window.onclick = function(event) {
    let modal = document.getElementById('detailModal');
    if (event.target == modal) modal.style.display = 'none';
}