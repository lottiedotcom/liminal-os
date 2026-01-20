// app.js

window.onload = function() {
    // 1. Boot Screen Logic
    document.getElementById('boot-screen').onclick = function() {
        this.classList.add('hidden');
        document.getElementById('map-view').classList.remove('hidden');
        document.getElementById('editor-panel').classList.remove('hidden');
        renderMap();
    };

    setupEventListeners();
};

// --- MAP SYSTEM ---
function renderMap() {
    currentRoomId = null; 
    document.getElementById('game-viewport').classList.add('hidden');
    
    const mapEl = document.getElementById('map-view');
    mapEl.innerHTML = ""; 

    for (let key in worldData) {
        let room = worldData[key];
        
        let icon = document.createElement('div');
        icon.className = 'map-icon';
        icon.style.left = (room.x || 50) + 'px';
        icon.style.top = (room.y || 50) + 'px';
        
        // Icon visual
        let imgDisplay = room.image ? `<img src="${room.image}">` : `<div style="color:#333; font-size:20px;">?</div>`;
        
        icon.innerHTML = `
            <div class="icon-box">${imgDisplay}</div>
            <div class="icon-label">${room.name}</div>
        `;

        // DRAG LOGIC
        icon.onmousedown = function(e) { dragElement(e, icon, room.id); };
        
        // CLICK TO ENTER
        icon.ondblclick = function() { enterRoom(room.id); };

        mapEl.appendChild(icon);
    }
}

// --- ROOM SYSTEM ---
function enterRoom(id) {
    currentRoomId = id;
    
    // UI Switches
    document.getElementById('map-view').classList.add('hidden');
    document.getElementById('game-viewport').classList.remove('hidden');

    const room = worldData[id];

    // 1. Render Visuals
    const imgEl = document.getElementById('room-image');
    imgEl.src = room.image || ""; 
    
    // 2. Render Text
    document.getElementById('ui-title').innerText = room.name.toUpperCase();
    
    // 3. Render Sensory Text (New!)
    let sensoryText = "";
    if(room.smell) sensoryText += `[NOSE]: ${room.smell} <br>`;
    if(room.sound) sensoryText += `[EAR]: ${room.sound} <br>`;
    if(room.temp) sensoryText += `[SKIN]: ${room.temp}`;
    document.getElementById('ui-sensory').innerHTML = sensoryText;

    // 4. Fill Editor Inputs
    document.getElementById('edit-name').value = room.name || "";
    document.getElementById('edit-desc').value = room.desc || "";
    document.getElementById('edit-image').value = room.image || "";
    
    // Fill new sensory inputs
    document.getElementById('edit-smell').value = room.smell || "";
    document.getElementById('edit-sound').value = room.sound || "";
    document.getElementById('edit-temp').value = room.temp || "";
}

// --- EDITOR LOGIC ---
function setupEventListeners() {
    
    // SAVE BUTTON (The Fix)
    document.getElementById('btn-save').onclick = function() {
        if (!currentRoomId) return alert("Select a room from the map first.");

        let r = worldData[currentRoomId];
        
        // Capture all data
        r.name = document.getElementById('edit-name').value;
        r.desc = document.getElementById('edit-desc').value;
        r.image = document.getElementById('edit-image').value;
        
        // Capture sensory data
        r.smell = document.getElementById('edit-smell').value;
        r.sound = document.getElementById('edit-sound').value;
        r.temp = document.getElementById('edit-temp').value;

        // Visual Feedback
        alert(">> REALITY UPDATED <<");
        
        // RE-RENDER (Important: This makes the changes appear instantly)
        enterRoom(currentRoomId);
    };

    // FILE UPLOAD
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

    // CREATE NEW ROOM
    document.getElementById('btn-create-room').onclick = function() {
        let newId = "room_" + Date.now();
        worldData[newId] = {
            id: newId, name: "New Sector", 
            x: 100, y: 100 // Default spawn location
        };
        
        // If we are in map view, refresh map. If in room, alert user.
        if(!document.getElementById('map-view').classList.contains('hidden')) {
            renderMap();
        } else {
            alert("New Room Created on Map.");
        }
    };

    // BACK TO MAP
    document.getElementById('btn-back-map').onclick = function() {
        renderMap();
    };
}

// Drag Helper
function dragElement(e, elmnt, id) {
    let pos1=0, pos2=0, pos3=e.clientX, pos4=e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY;
        pos3 = e.clientX; pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
    function closeDragElement() {
        document.onmouseup = null; document.onmousemove = null;
        if(worldData[id]) {
            worldData[id].x = elmnt.offsetLeft;
            worldData[id].y = elmnt.offsetTop;
        }
    }
}
