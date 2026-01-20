// app.js

// --- 1. BOOT SEQUENCE ---
window.onload = function() {
    // Wait for user to click "Enter" on boot screen
    document.getElementById('btn-enter-system').onclick = function() {
        document.getElementById('boot-screen').classList.add('hidden');
        document.getElementById('map-view').classList.remove('hidden');
        document.getElementById('editor-panel').classList.remove('hidden');
        renderMap(); // Show the icons
    };

    setupEventListeners();
};

// --- 2. MAP SYSTEM ---
function renderMap() {
    currentRoomId = null; // We are not in a room
    const mapEl = document.getElementById('map-view');
    mapEl.innerHTML = ""; // Clear map

    // Loop through all rooms and make icons
    for (let key in worldData) {
        let room = worldData[key];
        
        // Create Icon
        let icon = document.createElement('div');
        icon.className = 'map-icon';
        icon.style.left = (room.x || 50) + 'px';
        icon.style.top = (room.y || 50) + 'px';
        
        // Allow dragging (simple version)
        icon.onmousedown = function(e) { dragElement(e, icon, room.id); };

        // Icon Image + Label
        icon.innerHTML = `
            <img class="icon-img" src="${room.image || ''}">
            <div class="icon-label">${room.name}</div>
        `;

        // Double Click to Enter Room
        icon.ondblclick = function() {
            enterRoom(room.id);
        };

        mapEl.appendChild(icon);
    }
}

function dragElement(e, elmnt, id) {
    e.preventDefault();
    // Stop click from firing immediately
    let pos1 = 0, pos2 = 0, pos3 = e.clientX, pos4 = e.clientY;
    
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        // Save new position
        worldData[id].x = elmnt.offsetLeft;
        worldData[id].y = elmnt.offsetTop;
    }
}

// --- 3. ROOM SYSTEM ---
function enterRoom(id) {
    currentRoomId = id;
    
    // Switch Views
    document.getElementById('map-view').classList.add('hidden');
    document.getElementById('game-viewport').classList.remove('hidden');
    
    // Render Room (Same as before)
    const room = worldData[id];
    const imgEl = document.getElementById('room-image');
    const viewportEl = document.getElementById('game-viewport');
    
    imgEl.src = room.image || "";
    viewportEl.className = ""; 
    if (room.theme) viewportEl.classList.add(room.theme);

    document.getElementById('ui-title').innerText = room.name;
    
    // Render Hotspots
    const layer = document.getElementById('hotspot-layer');
    layer.innerHTML = "";
    if (room.hotspots) {
        room.hotspots.forEach(spot => {
            const el = document.createElement('div');
            el.className = 'hotspot';
            el.style.top = spot.top; el.style.left = spot.left;
            el.style.width = spot.width; el.style.height = spot.height;
            el.innerText = "LINK";
            el.onclick = () => enterRoom(spot.target);
            layer.appendChild(el);
        });
    }

    populateEditor(room);
}

// --- 4. EDITOR & UPLOAD ---
function populateEditor(room) {
    document.getElementById('edit-name').value = room.name;
    document.getElementById('edit-desc').value = room.desc;
    document.getElementById('edit-image').value = room.image;
    document.getElementById('edit-theme').value = room.theme || "";
}

function setupEventListeners() {
    // Back to Map Button
    document.getElementById('btn-back-map').onclick = function() {
        document.getElementById('game-viewport').classList.add('hidden');
        document.getElementById('map-view').classList.remove('hidden');
        renderMap(); // Re-render to show updated positions
    };

    // File Upload Logic (Converts image to Base64 string)
    document.getElementById('file-upload').addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // Set the input value to the Base64 string
                document.getElementById('edit-image').value = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Save Changes
    document.getElementById('btn-save').onclick = function() {
        if (!currentRoomId) return alert("Select a room first!");
        
        let r = worldData[currentRoomId];
        r.name = document.getElementById('edit-name').value;
        r.desc = document.getElementById('edit-desc').value;
        r.image = document.getElementById('edit-image').value;
        r.theme = document.getElementById('edit-theme').value;
        
        alert("Saved!");
        if(!document.getElementById('game-viewport').classList.contains('hidden')){
            enterRoom(currentRoomId); // Refresh room
        } else {
            renderMap(); // Refresh map
        }
    };

    // Create New Room
    document.getElementById('btn-create-room').onclick = function() {
        let newId = "room_" + Date.now();
        worldData[newId] = {
            id: newId, name: "New Node", desc: "", image: "", 
            x: 50, y: 50, hotspots: []
        };
        renderMap();
    };
    
    // Add Link (Hotspot)
    document.getElementById('btn-add-link').onclick = function() {
        if(!currentRoomId) return;
        let target = document.getElementById('new-link-id').value;
        if(!target) return;
        
        worldData[currentRoomId].hotspots.push({
            target: target, top: "40%", left: "40%", width: "20%", height: "20%"
        });
        enterRoom(currentRoomId); // Refresh
    };
}
