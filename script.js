document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi variabel
    let currentQueueNumber = 1;
    let selectedOperator = null;
    let callHistory = [];
    let isMuted = false;
    let operators = [
        { id: 1, name: "Operator 1", calls: 0, icon: "fas fa-user" },
        { id: 2, name: "Operator 2", calls: 0, icon: "fas fa-user" },
        { id: 3, name: "Operator 3", calls: 0, icon: "fas fa-user" },
        { id: 4, name: "Operator 4", calls: 0, icon: "fas fa-user" },
        { id: 5, name: "Operator 5", calls: 0, icon: "fas fa-user" },
        { id: 6, name: "Operator 6", calls: 0, icon: "fas fa-user" },
        { id: 7, name: "Operator 7", calls: 0, icon: "fas fa-user" },
        { id: 8, name: "Operator 8", calls: 0, icon: "fas fa-user" }
    ];
    
    // Elemen DOM
    const queueNumberInput = document.getElementById('queue-number');
    const increaseBtn = document.getElementById('increase-btn');
    const decreaseBtn = document.getElementById('decrease-btn');
    const resetBtn = document.getElementById('reset-btn');
    const operatorGrid = document.getElementById('operator-grid');
    const callBtn = document.getElementById('call-btn');
    const nextBtn = document.getElementById('next-btn');
    const currentQueueDisplay = document.getElementById('current-queue');
    const currentOperatorDisplay = document.getElementById('current-operator');
    const displayQueueNumber = document.getElementById('display-queue-number');
    const displayOperator = document.getElementById('display-operator');
    const nextQueueNumber = document.getElementById('next-queue-number');
    const statusGrid = document.getElementById('status-grid');
    const historyTableBody = document.getElementById('history-table-body');
    const clearHistoryBtn = document.getElementById('clear-history');
    const testVoiceBtn = document.getElementById('test-voice-btn');
    const muteBtn = document.getElementById('mute-btn');
    const audioStatus = document.getElementById('audio-status');
    const currentTimeDisplay = document.getElementById('current-time');
    const displayTime = document.getElementById('display-time');
    const currentYear = document.getElementById('current-year');
    
    // Inisialisasi tahun saat ini
    currentYear.textContent = new Date().getFullYear();
    
    // Inisialisasi operator
    function initializeOperators() {
        // Kosongkan grid operator
        operatorGrid.innerHTML = '';
        statusGrid.innerHTML = '';
        
        // Buat tombol untuk setiap operator
        operators.forEach(operator => {
            // Tombol untuk memilih operator
            const operatorBtn = document.createElement('button');
            operatorBtn.className = 'operator-btn';
            operatorBtn.id = `operator-${operator.id}`;
            operatorBtn.innerHTML = `
                <i class="${operator.icon}"></i>
                <span>${operator.name}</span>
            `;
            
            operatorBtn.addEventListener('click', () => {
                selectOperator(operator.id);
            });
            
            operatorGrid.appendChild(operatorBtn);
            
            // Item status operator
            const statusItem = document.createElement('div');
            statusItem.className = 'status-item';
            statusItem.id = `status-${operator.id}`;
            statusItem.innerHTML = `
                <div class="status-number">${operator.id}</div>
                <div class="status-name">${operator.name}</div>
                <div class="status-count">${operator.calls} panggilan</div>
            `;
            
            statusGrid.appendChild(statusItem);
        });
        
        // Pilih operator pertama secara default
        if (operators.length > 0) {
            selectOperator(1);
        }
    }
    
    // Pilih operator
    function selectOperator(operatorId) {
        // Hapus kelas aktif dari semua operator
        document.querySelectorAll('.operator-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Tambahkan kelas aktif ke operator yang dipilih
        const selectedOperatorBtn = document.getElementById(`operator-${operatorId}`);
        if (selectedOperatorBtn) {
            selectedOperatorBtn.classList.add('active');
        }
        
        // Update operator yang dipilih
        selectedOperator = operators.find(op => op.id === operatorId);
        
        // Update tampilan
        updateCurrentDisplay();
    }
    
    // Update tampilan saat ini
    function updateCurrentDisplay() {
        currentQueueDisplay.textContent = `A${String(currentQueueNumber).padStart(3, '0')}`;
        
        if (selectedOperator) {
            currentOperatorDisplay.textContent = selectedOperator.name;
        } else {
            currentOperatorDisplay.textContent = "-";
        }
        
        // Update tampilan antrian berikutnya
        nextQueueNumber.textContent = `A${String(currentQueueNumber + 1).padStart(3, '0')}`;
    }
    
    // Fungsi untuk memanggil antrian
    function callQueue() {
        if (!selectedOperator) {
            alert("Silakan pilih operator terlebih dahulu!");
            return;
        }
        
        // Format nomor antrian
        const formattedQueueNumber = `A${String(currentQueueNumber).padStart(3, '0')}`;
        
        // Update tampilan panggilan
        displayQueueNumber.textContent = formattedQueueNumber;
        displayOperator.textContent = `Operator: ${selectedOperator.name}`;
        
        // Tambahkan efek animasi
        displayQueueNumber.classList.add('pulse');
        displayOperator.classList.add('pulse');
        
        // Hapus animasi setelah selesai
        setTimeout(() => {
            displayQueueNumber.classList.remove('pulse');
            displayOperator.classList.remove('pulse');
        }, 1500);
        
        // Tambahkan ke riwayat
        const now = new Date();
        const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const dateString = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        
        const historyEntry = {
            time: `${dateString} ${timeString}`,
            queueNumber: formattedQueueNumber,
            operator: selectedOperator.name,
            status: 'Dipanggil'
        };
        
        callHistory.unshift(historyEntry); // Tambahkan di awal array
        updateHistoryTable();
        
        // Update jumlah panggilan operator
        selectedOperator.calls++;
        updateOperatorStatus(selectedOperator.id);
        
        // Panggil suara
        callVoice(formattedQueueNumber, selectedOperator.name);
        
        // Update tampilan antrian berikutnya
        nextQueueNumber.textContent = `A${String(currentQueueNumber + 1).padStart(3, '0')}`;
    }
    
    // Fungsi untuk memanggil antrian berikutnya
    function callNextQueue() {
        // Tingkatkan nomor antrian
        currentQueueNumber++;
        queueNumberInput.value = currentQueueNumber;
        
        // Panggil antrian
        callQueue();
    }
    
    // Fungsi untuk update status operator
    function updateOperatorStatus(operatorId) {
        const operator = operators.find(op => op.id === operatorId);
        const statusItem = document.getElementById(`status-${operatorId}`);
        
        if (statusItem && operator) {
            statusItem.innerHTML = `
                <div class="status-number">${operator.id}</div>
                <div class="status-name">${operator.name}</div>
                <div class="status-count">${operator.calls} panggilan</div>
            `;
            
            // Tambahkan kelas aktif jika operator ini sedang dipilih
            if (selectedOperator && selectedOperator.id === operatorId) {
                statusItem.classList.add('active');
            } else {
                statusItem.classList.remove('active');
            }
        }
    }
    
    // Fungsi untuk update tabel riwayat
    function updateHistoryTable() {
        // Kosongkan tabel
        historyTableBody.innerHTML = '';
        
        // Tambahkan maksimal 10 entri terbaru
        const recentHistory = callHistory.slice(0, 10);
        
        recentHistory.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.time}</td>
                <td><strong>${entry.queueNumber}</strong></td>
                <td>${entry.operator}</td>
                <td><span class="status-badge">${entry.status}</span></td>
            `;
            historyTableBody.appendChild(row);
        });
    }
    
    // Fungsi untuk memanggil suara
    function callVoice(queueNumber, operatorName) {
        if (isMuted) return;
        
        // Gunakan Web Speech API
        if ('speechSynthesis' in window) {
            // Hentikan ucapan yang sedang berlangsung
            speechSynthesis.cancel();
            
            // Buat teks untuk diucapkan
            const text = `Nomor antrian ${queueNumber}, silakan menuju ${operatorName}`;
            
            // Buat objek SpeechSynthesisUtterance
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Atur properti suara
            utterance.lang = 'id-ID';
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            
            // Coba gunakan suara wanita
            const voices = speechSynthesis.getVoices();
            const femaleVoice = voices.find(voice => 
                voice.lang.includes('id') && voice.name.toLowerCase().includes('female')
            ) || voices.find(voice => voice.lang.includes('id'));
            
            if (femaleVoice) {
                utterance.voice = femaleVoice;
            }
            
            // Ucapkan teks
            speechSynthesis.speak(utterance);
        } else {
            console.log("Web Speech API tidak didukung di browser ini.");
        }
    }
    
    // Fungsi untuk menguji suara
    function testVoice() {
        const testText = "Sistem suara antrian tikèt konser Cortis berfungsi dengan baik.";
        
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(testText);
            utterance.lang = 'id-ID';
            utterance.rate = 1.0;
            utterance.volume = 1.0;
            
            // Cari suara wanita Indonesia
            const voices = speechSynthesis.getVoices();
            const femaleVoice = voices.find(voice => 
                voice.lang.includes('id') && voice.name.toLowerCase().includes('female')
            ) || voices.find(voice => voice.lang.includes('id'));
            
            if (femaleVoice) {
                utterance.voice = femaleVoice;
            }
            
            speechSynthesis.speak(utterance);
        }
    }
    
    // Fungsi untuk update waktu
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const dateString = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        
        currentTimeDisplay.textContent = `${dateString} | ${timeString}`;
        displayTime.textContent = timeString;
    }
    
    // Event Listeners
    increaseBtn.addEventListener('click', () => {
        currentQueueNumber++;
        queueNumberInput.value = currentQueueNumber;
        updateCurrentDisplay();
    });
    
    decreaseBtn.addEventListener('click', () => {
        if (currentQueueNumber > 1) {
            currentQueueNumber--;
            queueNumberInput.value = currentQueueNumber;
            updateCurrentDisplay();
        }
    });
    
    resetBtn.addEventListener('click', () => {
        currentQueueNumber = 1;
        queueNumberInput.value = currentQueueNumber;
        updateCurrentDisplay();
    });
    
    queueNumberInput.addEventListener('change', () => {
        let value = parseInt(queueNumberInput.value);
        if (isNaN(value) || value < 1) {
            value = 1;
        }
        currentQueueNumber = value;
        queueNumberInput.value = value;
        updateCurrentDisplay();
    });
    
    callBtn.addEventListener('click', callQueue);
    
    nextBtn.addEventListener('click', callNextQueue);
    
    clearHistoryBtn.addEventListener('click', () => {
        callHistory = [];
        updateHistoryTable();
        
        // Reset jumlah panggilan operator
        operators.forEach(op => {
            op.calls = 0;
            updateOperatorStatus(op.id);
        });
    });
    
    testVoiceBtn.addEventListener('click', testVoice);
    
    muteBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        
        if (isMuted) {
            muteBtn.innerHTML = '<i class="fas fa-volume-up"></i> Hidupkan Suara';
            audioStatus.className = 'audio-status-muted';
            audioStatus.innerHTML = '<i class="fas fa-times-circle"></i> Suara Dimatikan';
        } else {
            muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i> Matikan Suara';
            audioStatus.className = 'audio-status-active';
            audioStatus.innerHTML = '<i class="fas fa-check-circle"></i> Suara Aktif';
        }
    });
    
    // Inisialisasi
    initializeOperators();
    updateCurrentDisplay();
    updateTime();
    
    // Update waktu setiap detik
    setInterval(updateTime, 1000);
    
    // Inisialisasi suara
    // Beberapa browser memerlukan interaksi pengguna sebelum Web Speech API dapat digunakan
    document.body.addEventListener('click', function initSpeech() {
        if ('speechSynthesis' in window) {
            // Memuat daftar suara
            speechSynthesis.getVoices();
        }
        document.body.removeEventListener('click', initSpeech);
    });
    
    // Tambahkan beberapa data riwayat contoh
    setTimeout(() => {
        // Contoh data riwayat
        const exampleHistory = [
            { time: "Senin, 1 Januari 2024 10:15:30", queueNumber: "A042", operator: "Operator 5", status: "Dipanggil" },
            { time: "Senin, 1 Januari 2024 10:10:22", queueNumber: "A041", operator: "Operator 3", status: "Dipanggil" },
            { time: "Senin, 1 Januari 2024 10:05:15", queueNumber: "A040", operator: "Operator 7", status: "Dipanggil" }
        ];
        
        callHistory = [...exampleHistory, ...callHistory];
        updateHistoryTable();
    }, 1000);
});