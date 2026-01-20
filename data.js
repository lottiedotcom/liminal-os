// data.js

// This object holds your entire world.
let worldData = {
    "room_start": {
        id: "room_start",
        name: "Lobby",
        desc: "Safe zone. The hum is quiet here.",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c",
        theme: "theme-vhs",
        x: 100, y: 150, // Position on the map
        // Sensory details
        smell: "Old carpet",
        sound: "Fluorescent hum",
        temp: "Cool",
        hotspots: []
    },
    "room_pool": {
        id: "room_pool",
        name: "Pools",
        desc: "Wet tiles. Do not slip.",
        image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7",
        theme: "theme-poolrooms",
        x: 250, y: 300, 
        smell: "Chlorine",
        sound: "Distant splashing",
        temp: "Humid",
        hotspots: []
    }
};

let currentRoomId = null;
