// app.js

// --- 1. INITIALIZATION ---
// This runs when the page loads
window.onload = function() {
    renderRoom(currentRoomId);
    setupEventListeners();
};

// --- 2. RENDER ENGINE (Shows the room) ---
function renderRoom(id) {
    // Check if room exists
    if (!worldData[id]) {
        alert("Error: Room [" + id + "] not found. Creating a blank one.");
        // Create a blank room on the fly if it's missing
        worldData[id] = {
            id: id,
            name: "New Room",
            desc: "Empty...",
            image: "",
            theme: "",
            hotspots: []
        };
    }

    const room = worldData[id];
    currentRoomId = id; // Update global state

    // A. Visuals
    const imgEl = document.getElementById('room-image');
    const viewportEl = document.getElementById('game-viewport');
    
    imgEl.src = room.image || ""; // If no image, show nothing
    
    // Apply Theme Class (removes old ones first)
    viewportEl.className = ""; 
    if (room.theme) viewportEl.classList.add(room.theme);

    // B. Text
    document.getElementById('ui-title').innerText = room.name;
    document.getElementById('ui-desc').innerText = room.desc;

    // C. Hotspots (The Doors)
    const layer = document.getElementById('hotspot-layer');
    layer.innerHTML = ""; // Clear old spots
    
    if (room.hotspots) {
        room.hotspots.forEach(spot => {
            const el = document.createElement('div');
            el.className = 'hotspot';
            // Position percentage-based so it scales
            el.style.top = spot.top;
            el.style.left = spot.left;
            el.style.width = spot.width;
            el.style.height = spot.height;
            el.innerText = spot.label || "LINK";
            
            // Interaction
            el.onclick = () => {
                console.log("Traveling to:", spot.target);
                renderRoom(spot.target);
            };
            
            layer.appendChild(el);
        });
    }

    // D. Update the Editor Panel
    populateEditor(room);
}

// --- 3. EDITOR LOGIC (Fills the inputs) ---
function populateEditor(room) {
    document.getElementById('edit-id').value = room.id;
    document.getElementById('edit-name').value = room.name;
    document.getElementById('edit-desc').value = room.desc;
    document.getElementById('edit-image').value = room.image;
    document.getElementById('edit-theme').value = room.theme || "";
    
    updateDebugView();
}

// --- 4. SAVING LOGIC ---
function saveCurrentState() {
    const id = currentRoomId;
    
    // Pull data from inputs
    worldData[id].name = document.getElementById('edit-name').value;
    worldData[id].desc = document.getElementById('edit-desc').value;
    worldData[id].image = document.getElementById('edit-image').value;
    worldData[id].theme = document.getElementById('edit-theme').value;

    // Refresh the view to show changes
    renderRoom(id);
    
    // Flash a message (simple alert for now)
    alert("System Update: Room [" + id + "] saved.");
}

function addNewLink() {
    const targetId = document.getElementById('new-link-id').value;
    if (!targetId) return;

    // Default placement for new link is center of screen
    const newSpot = {
        target: targetId,
        top: "40%", left: "40%", width: "20%", height: "20%",
        label: "TO: " + targetId
    };

    if (!worldData[currentRoomId].hotspots) {
        worldData[currentRoomId].hotspots = [];
    }
    
    worldData[currentRoomId].hotspots.push(newSpot);
    saveCurrentState(); // Auto-save when adding link
}

// --- 5. EVENT LISTENERS ---
function setupEventListeners() {
    // Save Button
    document.getElementById('btn-save').onclick = saveCurrentState;
    
    // Add Link Button
    document.getElementById('btn-add-link').onclick = addNewLink;

    // Live Theme Preview (Optional: Update theme as soon as dropdown changes)
    document.getElementById('edit-theme').onchange = function() {
        const theme = this.value;
        document.getElementById('game-viewport').className = theme;
    };
}

function updateDebugView() {
    const json = JSON.stringify(worldData[currentRoomId], null, 2);
    document.getElementById('json-preview').innerText = json;
}
