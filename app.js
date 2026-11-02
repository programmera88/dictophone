let mediaRecorder;
let audioChunks = [];

const recordBtn = document.getElementById('recordBtn');
const stopBtn = document.getElementById('stopBtn');
const statusText = document.getElementById('statusText');
const recordingsList = document.getElementById('recordingsList');

// Запит доступу до мікрофона та старт запису
recordBtn.addEventListener('click', async () => {
    audioChunks = []; // Очищуємо попередні дані
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        
        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            // Збираємо аудіо в один файл
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            const audioUrl = URL.createObjectURL(audioBlob);
            
            // Створюємо елементи інтерфейсу для нового запису
            const li = document.createElement('li');
            const audio = document.createElement('audio');
            audio.src = audioUrl;
            audio.controls = true;
            
            li.appendChild(audio);
            recordingsList.appendChild(li);
            
            statusText.textContent = "Запис збережено!";
            // Вимикаємо використання мікрофона після зупинки
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        statusText.textContent = "🎙️ Запис іде...";
        recordBtn.disabled = true;
        stopBtn.disabled = false;
        
    } catch (err) {
        console.error("Помилка доступу до мікрофона:", err);
        statusText.textContent = "Не вдалося отримати доступ до мікрофона.";
    }
});

// Зупинка запису
stopBtn.addEventListener('click', () => {
    mediaRecorder.stop();
    recordBtn.disabled = false;
    stopBtn.disabled = true;
});
