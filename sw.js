function saveRoom() {
    if(!currentId) return;
    let r = world[currentId];
    
    // Capture current form values
    r.name = document.getElementById('inp-name').value;
    r.time = document.getElementById('inp-time').value;
    r.reality = document.getElementById('inp-reality').value;
    r.atmosphere = document.getElementById('inp-atmosphere').value;
    r.sensation = document.getElementById('inp-sensation').value;
    r.image = document.getElementById('inp-img-url').value;
    
    // --- DECAY RESET LOGIC ---
    // Only reset the decay timer if the static is clear (tuned correctly)
    if(currentStaticOpacity < 0.1) {
        r.lastVisited = Date.now(); // Resets the 6-hour timer to zero
        addMrOtherLog("REALITY STABILIZED.");
    } else {
        // If they save while it's still static-heavy, decay persists
        addMrOtherLog("STABILIZATION FAILED: SIGNAL WEAK.");
    }

    // Refresh UI
    document.getElementById('room-img-display').src = r.image || "";
    updateVisualStats(r);
    updateMood(r.sensation);
    saveMemory(); // Commit to localStorage
}

function updateStatic(val) {
    if(!currentId) return;
    let r = world[currentId];
    let sweetSpot = r.tunerSweetSpot || 50;
    
    let distance = Math.abs(val - sweetSpot);
    
    // Calculate opacity based on distance from the sweet spot
    let opacity = 0;
    if(distance < 5) opacity = 0;
    else opacity = Math.min(1, (distance - 5) / 40);

    currentStaticOpacity = opacity; 

    const overlay = document.getElementById('static-overlay');
    overlay.style.opacity = opacity;

    const img = document.getElementById('room-img-display');
    if(opacity > 0.2) {
         if(["STERILE", "HUMMING", "ARTIFICIAL"].includes(r.atmosphere)) img.className = 'decay-bright';
         else img.className = 'decay-dark';
    } else {
         img.className = ""; 
    }
    
    // Update the button text to show if it's ready to stabilize
    const btn = document.getElementById('btn-save');
    if(opacity === 0) {
        btn.style.background = "var(--accent)";
        btn.innerText = "STABILIZE REALITY";
    } else {
        btn.style.background = "#cbd5e0"; // Grey out if signal is bad
        btn.innerText = "SIGNAL UNSTABLE";
    }
}
