window.onload = function() {
    // Wait for click on boot screen
    const boot = document.getElementById('boot-screen');
    if(boot) {
        boot.onclick = function() {
            boot.classList.add('hidden');
            // Show Map, Hide Room, Hide Editor
            document.getElementById('map-view').classList.remove('hidden');
            document.getElementById('game-viewport').classList.add('hidden');
            document.getElementById('editor-panel').classList.add('hidden');
            renderMap();
        };
    }
    setupEventListeners();
};

function renderMap() {
    // 1. Clear State
    currentRoomId = null;
    const mapEl = document.getElementById('map-view');
    mapEl.innerHTML = ""; // Wipe map clean

    // 2. Hide other views to prevent overlap
    document.getElementById('game-viewport').classList.add('hidden');
    document.getElementById('editor-panel').classList.add('hidden');
    document.getElementById('map-view').classList.remove('hidden');

    // 3. Draw Icons
    for (let key in worldData) {
        let room = worldData[key];
        let icon = document.createElement('div');
        icon.className = 'map-icon';
        icon.style.left = (room.x || 50) + 'px';
        icon.style.top = (room.y || 50) + 'px';
        
        // Show "?" if no image
        let imgContent = room.image ? `<img src="${room.image}">` : `<span style="color:#333; font-size:20px;">?</span>`;

        icon.innerHTML = `<div class="icon-box">${imgContent}</div><div class="icon-label">${room.name}</div>`;
        
        // Drag Logic
        icon.onmousedown = function(e) { dragElement(e, icon, room.id); };
        icon.ontouchstart = function(e) { dragElement(e, icon, room.id); }; // Mobile Drag
        
        // Enter Room Logic (Double Click / Tap)
        let lastTap = 0;
        icon.addEventListener('touchend', function (e) {
            let currentTime = new Date().getTime();
            let tapLength = currentTime - lastTap;
            if (tapLength < 500 && tapLength > 0) {
                enterRoom(room.id);
            }
            lastTap = currentTime;
        });
        icon.ondblclick = function() { enterRoom(room.id); };

        mapEl.appendChild(icon);
    }
}

function enterRoom(id) {
    currentRoomId = id;
    const room = worldData[id];

    // Switch Views
    document.getElementById('map-view').classList.add('hidden');
    document.getElementById('game-viewport').classList.remove('hidden');
    document.getElementById('editor-panel').classList.remove('hidden'); // Show Editor NOW

    // Fill Data
    document.getElementById('ui-title').innerText = room.name;
    document.getElementById('edit-name').value = room.name;
    document.getElementById('edit-desc').value = room.desc || "";
    document.getElementById('edit-image').value = room.image || "";
    document.getElementById('room-image').src = room.image || "";
    
    // Render Hotspots
    const layer = document.getElementById('hotspot-layer');
    layer.innerHTML = "";
    if (room.hotspots) {
        room.hotspots.forEach(spot => {
            let el = document.createElement('div');
            el.className = 'hotspot';
            el.style.top = spot.top; el.style.left = spot.left;
            el.style.width = spot.width; el.style.height = spot.height;
            el.innerText = "LINK";
            el.onclick = () => enterRoom(spot.target);
            layer.appendChild(el);
        });
    }
}

function setupEventListeners() {
    // Save Button
    document.getElementById('btn-save').onclick = function() {
        if (!currentRoomId) return;
        let r = worldData[currentRoomId];
        r.name = document.getElementById('edit-name').value;
        r.desc = document.getElementById('edit-desc').value;
        r.image = document.getElementById('edit-image').value;
        alert("SAVED.");
        enterRoom(currentRoomId); // Refresh
    };

    // File Upload
    document.getElementById('file-upload').addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('edit-image').value = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Create New Room Button
    document.getElementById('btn-create-room').onclick = function() {
        let newId = "room_" + Date.now();
        worldData[newId] = {
            id: newId, name: "New Void", desc: "", image: "", x: 100, y: 100, hotspots: []
        };
        renderMap(); // Go back to map to see it
    };
    
    // Back Button
    document.getElementById('btn-back-map').onclick = renderMap;
}

// Dragging Logic
function dragElement(e, elmnt, id) {
    let pos1=0, pos2=0, pos3=0, pos4=0;
    if(e.type === 'touchstart') {
        pos3 = e.touches[0].clientX; pos4 = e.touches[0].clientY;
    } else {
        pos3 = e.clientX; pos4 = e.clientY;
    }
    
    document.onmouseup = closeDrag;
    document.onmousemove = elementDrag;
    document.ontouchend = closeDrag;
    document.ontouchmove = elementDrag;

    function elementDrag(e) {
        let clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        let clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
        pos1 = pos3 - clientX; pos2 = pos4 - clientY;
        pos3 = clientX; pos4 = clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
    function closeDrag() {
        document.onmouseup = null; document.onmousemove = null;
        document.ontouchend = null; document.ontouchmove = null;
        worldData[id].x = elmnt.offsetLeft;
        worldData[id].y = elmnt.offsetTop;
    }
}
