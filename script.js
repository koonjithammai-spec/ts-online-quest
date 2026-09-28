let dbData = {
    talk: {},
    item: {},
    npc: {},
    scene: {}
};
let currentTab = 'talk';

// โหลดฐานข้อมูลทั้งหมดพร้อมกัน
Promise.all([
    fetch('talks.json').then(res => res.json()).catch(() => ({})),
    fetch('item.json').then(res => res.json()).catch(() => ({})),
    fetch('npc.json').then(res => res.json()).catch(() => ({})),
    fetch('scene.json').then(res => res.json()).catch(() => ({}))
]).then(([talks, items, npcs, scenes]) => {
    dbData.talk = talks;
    dbData.item = items;
    dbData.npc = npcs;
    dbData.scene = scenes;
    
    updateStats();
    renderTable();
    console.log("โหลดฐานข้อมูลทั้งหมดเรียบร้อย!");
});

function switchTab(tabName, event) {
    currentTab = tabName;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if(event) event.target.classList.add('active');
    document.getElementById('searchInput').value = '';
    renderTable();
}

function updateStats() {
    let counts = {
        talk: Object.keys(dbData.talk).length,
        item: Object.keys(dbData.item).length,
        npc: Object.keys(dbData.npc).length,
        scene: Object.keys(dbData.scene).length
    };
    document.getElementById('statsInfo').innerHTML = `สถานะฐานข้อมูล: บทสนทนา ${counts.talk} รายการ | ไอเทม ${counts.item} รายการ | NPC ${counts.npc} รายการ | ฉาก ${counts.scene} รายการ`;
}

function renderTable() {
    let keyword = document.getElementById('searchInput').value.trim().toLowerCase();
    let headerEl = document.getElementById('tableHeader');
    let bodyEl = document.getElementById('tableBody');
    
    bodyEl.innerHTML = '';
    let dataset = dbData[currentTab];
    let rowsHTML = '';
    let count = 0;

    // กำหนดหัวตารางตามแท็บ
    if (currentTab === 'talk') {
        headerEl.innerHTML = `<tr><th width="20%">ID / รหัส</th><th width="80%">เนื้อหาบทสนทนา / เควส</th></tr>`;
    } else if (currentTab === 'item') {
        headerEl.innerHTML = `<tr><th width="20%">ID / รหัส</th><th width="30%">ชื่อไอเทม</th><th width="50%">รายละเอียด</th></tr>`;
    } else if (currentTab === 'npc') {
        headerEl.innerHTML = `<tr><th width="20%">ID / รหัส</th><th width="30%">ชื่อ NPC</th><th width="50%">ข้อมูลเพิ่มเติม</th></tr>`;
    } else if (currentTab === 'scene') {
        headerEl.innerHTML = `<tr><th width="30%">รหัสฉาก / พิกัด</th><th width="70%">ชื่อสถานที่</th></tr>`;
    }

    for (let key in dataset) {
        let item = dataset[key];
        let textSearchStr = JSON.stringify(item).toLowerCase() + " " + key.toLowerCase();

        if (keyword === '' || textSearchStr.includes(keyword)) {
            count++;
            if (currentTab === 'talk') {
                let text = item.text || item.Description || JSON.stringify(item);
                rowsHTML += `<tr onclick='showModal("บทสนทนา ID: ${key}", ${JSON.stringify(item)})'>
                    <td><b>#${key}</b></td>
                    <td>${text}</td>
                </tr>`;
            } else if (currentTab === 'item') {
                let name = item.name || item.Name || `Item #${key}`;
                let desc = item.desc || item.Description || 'ไม่มีข้อมูล';
                rowsHTML += `<tr onclick='showModal("${name}", ${JSON.stringify(item)})'>
                    <td><b>#${key}</b></td>
                    <td><b>${name}</b></td>
                    <td>${desc}</td>
                </tr>`;
            } else if (currentTab === 'npc') {
                let name = item.name || item.Name || `NPC #${key}`;
                let desc = item.desc || item.Description || 'ไม่มีข้อมูล';
                rowsHTML += `<tr onclick='showModal("${name}", ${JSON.stringify(item)})'>
                    <td><b>#${key}</b></td>
                    <td><b>${name}</b></td>
                    <td>${desc}</td>
                </tr>`;
            } else if (currentTab === 'scene') {
                rowsHTML += `<tr onclick='showModal("สถานที่: ${item}", {key: "${key}", value: "${item}"})'>
                    <td><b>${key}</b></td>
                    <td><b>${item}</b></td>
                </tr>`;
            }

            if (count >= 150) break; // จำกัดการแสดงผลเพื่อความลื่นไหล
        }
    }

    if (count === 0) {
        bodyEl.innerHTML = `<tr><td colspan="3" style="text-align:center; padding: 30px; color: #8b949e;">ไม่พบข้อมูลที่คุณค้นหา</td></tr>`;
    } else {
        bodyEl.innerHTML = rowsHTML;
    }
}

function filterData() {
    renderTable();
}

function showModal(title, dataObj) {
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalContent').innerText = typeof dataObj === 'object' ? JSON.stringify(dataObj, null, 2) : dataObj;
    document.getElementById('detailModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('detailModal').style.display = 'none';
}

window.onclick = function(event) {
    let modal = document.getElementById('detailModal');
    if (event.target == modal) modal.style.display = 'none';
}