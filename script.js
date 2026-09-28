let talksData = {};
let npcData = {};
let itemData = {};

// โหลดไฟล์ JSON ทั้งหมดเข้ามาเก็บไว้ล่วงหน้า
Promise.all([
    fetch('talks.json').then(res => res.json()).catch(() => ({})),
    fetch('npc.json').then(res => res.json()).catch(() => ({})),
    fetch('item.json').then(res => res.json()).catch(() => ({}))
]).then(([talks, npcs, items]) => {
    talksData = talks;
    npcData = npcs;
    itemData = items;
    console.log("โหลดข้อมูลเกมสำเร็จ พร้อมค้นหาแล้ว!");
});

// ฟังก์ชันค้นหาข้อมูล
function searchGameData() {
    let keyword = document.getElementById('searchInput').value.trim().toLowerCase();
    let resultsDiv = document.getElementById('results');
    let countDiv = document.getElementById('resultCount');
    
    resultsDiv.innerHTML = '';
    
    if (keyword === '') {
        countDiv.innerHTML = '';
        resultsDiv.innerHTML = '<p style="text-align: center; color: #64748b;">พิมพ์คำค้นหาเพื่อเริ่มใช้งาน...</p>';
        return;
    }

    let matches = [];

    // ค้นหาใน Talks (เควส/บทสนทหา)
    for (let key in talksData) {
        let textContent = JSON.stringify(talksData[key]).toLowerCase();
        if (textContent.includes(keyword)) {
            matches.push({ type: 'เควส/บทสนทนา', id: key, data: talksData[key] });
        }
        if (matches.length >= 40) break; // จำกัดจำนวนไม่ให้โหลดหน้าเว็บเยอะเกินไป
    }

    // ค้นหาใน NPC
    for (let key in npcData) {
        let textContent = JSON.stringify(npcData[key]).toLowerCase();
        if (textContent.includes(keyword)) {
            matches.push({ type: 'NPC', id: key, data: npcData[key] });
        }
        if (matches.length >= 60) break;
    }

    // ค้นหาใน Item
    for (let key in itemData) {
        let textContent = JSON.stringify(itemData[key]).toLowerCase();
        if (textContent.includes(keyword)) {
            matches.push({ type: 'ไอเทม', id: key, data: itemData[key] });
        }
        if (matches.length >= 80) break;
    }

    countDiv.innerHTML = `ค้นพบข้อมูลที่เกี่ยวข้อง ${matches.length} รายการ`;

    if (matches.length === 0) {
        resultsDiv.innerHTML = '<p style="text-align: center; color: #f43f5e;">ไม่พบข้อมูลที่คุณค้นหา</p>';
        return;
    }

    // แสดงผลลัพธ์ลงหน้าเว็บ
    matches.forEach(item => {
        let card = document.createElement('div');
        card.className = 'result-card';
        card.innerHTML = `
            <h3>[${item.type}] ID: ${item.id}</h3>
            <pre>${JSON.stringify(item.data, null, 2)}</pre>
        `;
        resultsDiv.appendChild(card);
    });
}