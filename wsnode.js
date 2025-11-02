const API_URL = "https://xampp.localhost.com/4tstphp/email_sync_batch.php";
const WS_URL = "ws://localhost:5173";

// Global WebSocket instance
let ws;
// Map to store pending WebSocket request promises
const pendingRequests = new Map();

// Custom console.log to also display in UI
function logToConsole(message, type = 'log') {
    console[type](message);
    const outputDiv = document.getElementById('console-output');
    const messageElement = document.createElement('p');
    messageElement.className = `mb-1 ${type === 'error' ? 'text-red-400' : type === 'warn' ? 'text-yellow-400' : 'text-green-400'}`;
    messageElement.textContent = `[${new Date().toLocaleTimeString()}] ${typeof message === 'object' ? JSON.stringify(message) : message}`;
    outputDiv.appendChild(messageElement);
    outputDiv.scrollTop = outputDiv.scrollHeight;
}

// Update progress bar (for batch_getmsg)
function updateProgressBar(completed, total) {
    if (total === 0) {
        logToConsole("Error: Total batches is zero", 'error');
        return;
    }
    const percentage = Math.min(Math.round((completed / total) * 100), 100);
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    progressBar.style.width = `${percentage}%`;
    progressText.textContent = `${percentage}%`;
    logToConsole(`Progress updated: ${completed}/${total} (${percentage}%)`);
}

// Format timestamp to local time string
function formatTimestamp(ms) {
    return new Date(ms).toLocaleString('en-US', { hour12: true });
}

// Format time difference in seconds and milliseconds
function formatTimeDifference(start, end) {
const diffMs = end - start;
const totalSeconds = Math.floor(diffMs / 1000);
const hours = Math.floor(totalSeconds / 3600);
const minutes = Math.floor((totalSeconds % 3600) / 60);
const seconds = totalSeconds % 60;
return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Open WebSocket and set up persistent message handler
function openWebSocketConnection() {
    return new Promise((resolve, reject) => {
        ws = new WebSocket(WS_URL);

        ws.onopen = () => {
            logToConsole("WebSocket connected");
            resolve(ws);
        };

        ws.onerror = (err) => {
            logToConsole("WebSocket error: " + err, 'error');
            reject(err);
        };

        ws.onclose = () => {
            logToConsole("WebSocket closed", 'warn');
            // Reject all pending requests
            pendingRequests.forEach(({ reject }) => reject(new Error("WebSocket closed")));
            pendingRequests.clear();
        };

        ws.onmessage = (event) => {
            try {
                const res = JSON.parse(event.data);
                const requestId = res.originalData?.requestId;
                if (requestId && pendingRequests.has(requestId)) {
                    const { resolve } = pendingRequests.get(requestId);
                    logToConsole(`Received WebSocket response for requestId: ${requestId}`);
                    resolve(res);
                    pendingRequests.delete(requestId);
                } else {
                    logToConsole(`Ignoring unrelated WebSocket message for requestId: ${requestId || 'undefined'}`, 'warn');
                }
            } catch (err) {
                logToConsole(`Invalid WebSocket response: ${err.message}`, 'error');
            }
        };
    });
}

// Chunk array
function chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        // chunks.push(array.slice(i, i + chunkSize));
        const chunk = array.slice(i, i + chunkSize).map((item, j) => {
            return { ...item, idx: i + j + 1 }; // +1 because you want 1..100
        });
        chunks.push(chunk);
    }
    return chunks;
}

// Send HTTP POST request
async function sendFetchRequest(jsonData) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jsonData)
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (err) {
        throw new Error(`Fetch request failed: ${err.message}`);
    }
}

// Send data through WebSocket
function sendWebSocketMessage(jsonData) {
    return new Promise((resolve, reject) => {
        if (!ws || ws.readyState !== WebSocket.OPEN) {
            reject(new Error("WebSocket is not open"));
            return;
        }

        const requestId = jsonData.requestId;
        logToConsole(`Sending WebSocket message for requestId: ${requestId}`);
        pendingRequests.set(requestId, { resolve, reject });
        ws.send(JSON.stringify(jsonData));
    });
}

// Main sequential execution
async function executeSequentialActions(usr_login, requestIdPrefix = "sync") {
    const startTime = Date.now();
    logToConsole(`Process started at: ${formatTimestamp(startTime)}`);

    try {
        // logToConsole("Step 1: getemlids");
        // const emlIdsRequest = await sendWebSocketMessage({
        //     action: "getemlids",
        //     usr_login,
        //     requestId: `${requestIdPrefix}_emlids`
        // });
        // const emlIdsResponse = emlIdsRequest.phpOutput.getemlids;
        // if (emlIdsResponse.status !== "success") throw new Error(`getemlids failed`);

        // const emailAddressId = emlIdsResponse.details?.[0]?.[0]?.EmailAddressId;
        // if (!emailAddressId) throw new Error("EmailAddressId missing");
        const emailAddressId = 8;
        logToConsole("Step 2: getmsgids");
        const msgIdsRequest = await sendWebSocketMessage({
            action: "getmsgids",
            usr_login,
            usr_emlid: emailAddressId,
            requestId: `${requestIdPrefix}_msgids`
        });
        const msgIdsResponse = msgIdsRequest.phpOutput.getmsgids;
        if (msgIdsResponse.status !== "success") throw new Error(`getmsgids failed`);

        const messageIds = msgIdsResponse.details?.map(item => ({ id: item.id })) || [];
        if (messageIds.length === 0) throw new Error("No message IDs found");

        logToConsole(`Step 3: batch_getmsg via WebSocket for ${messageIds.length} messages`);

        const batched = chunkArray(messageIds, 10);
        logToConsole(`Created ${batched.length} batches`);

        const batchRequests = batched.map((chunk, idx) => ({
            action: "batch_getmsg",
            usr_login,
            usr_emlid: emailAddressId,
            requestId: `${requestIdPrefix}_batch_${idx + 1}`,
            items: chunk
        }));

        // Initialize progress bar for batch_getmsg
        updateProgressBar(0, batched.length);
        let completedBatches = 0;

        const batchResults = await Promise.allSettled(
            batchRequests.map(async (payload, idx) => {
                try {
                    const result = await sendWebSocketMessage(payload);
                    completedBatches++;
                    updateProgressBar(completedBatches, batched.length);
                    logToConsole(`Batch ${idx + 1}/${batched.length} completed`);
                    return result;
                } catch (err) {
                    logToConsole(`Batch ${idx + 1} failed: ${err.message}`, 'error');
                    throw err;
                }
            })
        );

        // Log batch results after all are complete
        batchResults.forEach((res, idx) => {
            if (res.status === "fulfilled") {
                logToConsole(`Batch ${idx + 1} success: ${JSON.stringify(res.value)}`);
            } else {
                logToConsole(`Batch ${idx + 1} failed: ${res.reason}`, 'error');
            }
        });

        // Check if any batches failed
        const failedBatches = batchResults.filter(res => res.status === "rejected");
        if (failedBatches.length > 0) {
            throw new Error(`Some batches failed: ${failedBatches.length}/${batched.length}`);
        }

        // Log end time and duration after all batches are processed
        const endTime = Date.now();
        logToConsole(`Process ended at: ${formatTimestamp(endTime)}`);
        logToConsole(`Total time taken: ${formatTimeDifference(startTime, endTime)}`);

        return {
            status: "success",
            message: "All actions completed",
            // emlIdsResponse,
            msgIdsResponse,
            batchResults,
            timing: {
                startTime: formatTimestamp(startTime),
                endTime: formatTimestamp(endTime),
                duration: formatTimeDifference(startTime, endTime)
            }
        };
    } catch (err) {
        // Log end time and duration even if an error occurs
        const endTime = Date.now();
        logToConsole(`Process ended at: ${formatTimestamp(endTime)}`);
        logToConsole(`Total time taken: ${formatTimeDifference(startTime, endTime)}`);
        logToConsole(`Execution failed: ${err.message}`, 'error');
        throw err;
    }
}

// Start everything
openWebSocketConnection()
    .then(() => executeSequentialActions("admin"))
    .then(res => logToConsole("Completed successfully: " + JSON.stringify(res)))
    .catch(err => logToConsole("Final error: " + err.message, 'error'));