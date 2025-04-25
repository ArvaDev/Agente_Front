let socket;
let isConnected = false;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const reconnectInterval = 1000;

const messagesDiv = document.getElementById('messages');
const connectionStatus = document.getElementById('connection-status');
const pdfSelector = document.getElementById('pdfSelector');
const pdfPathInput = document.getElementById('pdfPath');

function connectWebSocket() {
    updateConnectionStatus('connecting');

    socket = new WebSocket('ws://localhost:8000/ws');

    socket.onopen = () => {
        isConnected = true;
        reconnectAttempts = 0;
        updateConnectionStatus('connected');
        addMessage('Conexión establecida', 'system');
    };

    socket.onmessage = (event) => {
        try {
            const message = JSON.parse(event.data);
            addMessage(JSON.stringify(message.content.message, null, 2), 'system');
        } catch (error) {
            addMessage(`Error parsing message: ${event.data}`, 'system');
        }
    };

    socket.onclose = () => {
        isConnected = false;
        updateConnectionStatus('disconnected');
        addMessage('Conexión cerrada', 'system');

        if (reconnectAttempts < maxReconnectAttempts) {
            reconnectAttempts++;
            addMessage(`Intentando reconectar (${reconnectAttempts}/${maxReconnectAttempts})...`, 'system');
            setTimeout(connectWebSocket, reconnectInterval * reconnectAttempts);
        } else {
            addMessage('No se pudo reconectar. Por favor, recarga la página.', 'system');
        }
    };

    socket.onerror = (error) => {
        addMessage(`Error en WebSocket: ${error.message}`, 'system');
    };
}

function updateConnectionStatus(status) {
    connectionStatus.className = `connection-status ${status}`;
    connectionStatus.textContent = {
        connected: 'Conectado',
        disconnected: 'Desconectado',
        connecting: 'Conectando...'
    }[status];
}

function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerText = text;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function sendWebSocketMessage(message) {
    if (isConnected && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
        addMessage(JSON.stringify(message, null, 2), 'user');
    } else {
        addMessage('No se puede enviar el mensaje: WebSocket desconectado', 'system');
        if (!isConnected) connectWebSocket();
    }
}

pdfSelector.addEventListener('change', () => {
    if (pdfSelector.value) {
        pdfPathInput.value = pdfSelector.value;
    }
});

document.getElementById('processBtn').addEventListener('click', () => {
    const pdfPath = pdfPathInput.value;
    const chunkSize = parseInt(document.getElementById('chunkSize').value);
    const chunkOverlap = parseInt(document.getElementById('chunkOverlap').value);

    if (!pdfPath) {
        alert('Por favor selecciona o ingresa la ruta del PDF');
        return;
    }

    const message = {
        action: "process_pdf",
        pdf_path: pdfPath,
        chunk_size: chunkSize,
        chunk_overlap: chunkOverlap
    };

    sendWebSocketMessage(message);
});

document.getElementById('askBtn').addEventListener('click', () => {
    const question = document.getElementById('question').value;

    if (!question) {
        alert('Por favor escribe una pregunta');
        return;
    }

    const message = {
        action: "ask_question",
        question: question
    };

    sendWebSocketMessage(message);
});

connectWebSocket();
