/**
 * worker.js - Background processor for PrimeHR
 * Offloads heavy tasks such as complex data parsing or formatting
 * from the main thread to ensure smooth UI performance.
 */

self.onmessage = function(e) {
    const { action, payload } = e.data;

    if (action === "PARSE_HEAVY_DATA") {
        // Simulate heavy logic being offloaded
        let result = processHeavyData(payload);
        
        // Return result
        self.postMessage({
            action: "PARSE_HEAVY_DATA_DONE",
            result
        });
    }
}

function processHeavyData(data) {
    // Artificial delay / heavy loop simulation
    const start = Date.now();
    let computed = 0;
    while(Date.now() - start < 50) { 
        computed += Math.random() * data.length;
    }
    return computed;
}
