const clockElement = document.getElementById('clock');
const settingsPanel = document.getElementById('settings-panel');
const fontSizeInput = document.getElementById('font-size');
const fontColorInput = document.getElementById('text-color');
const bgColorInput = document.getElementById('bg-color');
const fontFamilyInput = document.getElementById('font-family');
const hourFormatInput = document.getElementById('hour-format');
const bgImageUrlInput = document.getElementById('bg-image-url');
const bgImageOpacityInput = document.getElementById('bg-image-opacity');
const customTextInput = document.getElementById('custom-text-input');
const bgImageLayer = document.getElementById('bg-image');
const customTextElement = document.getElementById('custom-text');
const showSecondsInput = document.getElementById('show-seconds');
const ampmElement = document.getElementById('ampm');
const scheduleModeInput = document.getElementById('schedule-mode');
const scheduleList = document.getElementById('schedule-list');
const countdownBanner = document.getElementById('countdown-banner');

// Modal Elements
const scheduleModal = document.getElementById('schedule-modal');
const openScheduleBtn = document.getElementById('open-schedule-modal');
const closeScheduleBtn = document.getElementById('close-schedule-modal');
const addRowBtn = document.getElementById('add-schedule-row');
const saveScheduleBtn = document.getElementById('save-schedule');
const copyDaySelect = document.getElementById('copy-day-select');
const scheduleEditorRows = document.getElementById('schedule-editor-rows');
const dayTabs = document.querySelectorAll('.day-tab');

const timeDisplay = document.createTextNode('');
clockElement.insertBefore(timeDisplay, ampmElement);
clockElement.removeChild(clockElement.childNodes[0]); 

let weeklySchedule = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
let editingDay = new Date().getDay();
let currentSchedule = [];

// Update Clock
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const is24Hour = hourFormatInput.checked;
    const showSec = showSecondsInput.checked;
    
    if (!is24Hour) {
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        ampmElement.textContent = ampm;
    } else {
        ampmElement.textContent = '';
    }
    
    const hoursStr = String(hours).padStart(2, '0');
    const timeStr = showSec ? `${hoursStr}:${minutes}:${seconds}` : `${hoursStr}:${minutes}`;
    timeDisplay.textContent = timeStr;
    
    updateSchedule();
}

function updateSchedule() {
    const now = new Date();
    const currentDay = now.getDay();
    currentSchedule = weeklySchedule[currentDay] || [];

    const mode = scheduleModeInput.value;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    scheduleList.classList.toggle('hidden', mode !== 'list');
    countdownBanner.classList.toggle('hidden', mode !== 'countdown');
    
    if (mode === 'hidden') return;
    
    let activeIndex = -1;
    let nextIndex = -1;
    
    for (let i = 0; i < currentSchedule.length; i++) {
        const itemMinutes = currentSchedule[i].hours * 60 + currentSchedule[i].minutes;
        if (itemMinutes <= currentMinutes) {
            activeIndex = i;
        } else {
            nextIndex = i;
            break;
        }
    }
    
    if (mode === 'list') {
        const listHtml = currentSchedule.map((item, i) => `
            <div class="schedule-item ${i === activeIndex ? 'active' : (i < activeIndex ? 'past' : '')}">
                ${item.timeStr} - ${item.label}
            </div>
        `).join('');
        if (scheduleList.innerHTML !== listHtml) scheduleList.innerHTML = listHtml;
    } else if (mode === 'countdown') {
        if (nextIndex !== -1) {
            const nextItem = currentSchedule[nextIndex];
            const nextTotalSeconds = (nextItem.hours * 3600) + (nextItem.minutes * 60);
            const currentTotalSeconds = (now.getHours() * 3600) + (now.getMinutes() * 60) + now.getSeconds();
            const diffSeconds = nextTotalSeconds - currentTotalSeconds;
            
            const h = Math.floor(diffSeconds / 3600);
            const m = Math.ceil((diffSeconds % 3600) / 60);
            
            let countdownStr = '';
            if (h > 0) countdownStr += `${h}h `;
            if (m > 0) {
                countdownStr += `${m}m`;
            } else if (h === 0) {
                countdownStr = 'Less than a minute';
            }
            
            countdownBanner.textContent = `Next: ${nextItem.label} in ${countdownStr}`;
        } else {
            countdownBanner.textContent = 'No more events today';
        }
    }
}

// Initial Settings from URL Fragment
function loadSettingsFromHash() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);

    if (params.has('size')) fontSizeInput.value = params.get('size');
    if (params.has('color')) fontColorInput.value = params.get('color');
    if (params.has('bg')) bgColorInput.value = params.get('bg');
    if (params.has('font')) fontFamilyInput.value = params.get('font');
    if (params.has('h24')) hourFormatInput.checked = params.get('h24') === 'true';
    if (params.has('s')) showSecondsInput.checked = params.get('s') === 'true';
    if (params.has('sm')) scheduleModeInput.value = params.get('sm');
    
    // Load weekly schedule (d0 - d6)
    for (let i = 0; i < 7; i++) {
        if (params.has('d' + i)) {
            weeklySchedule[i] = deserializeDay(params.get('d' + i));
        }
    }

    if (params.has('img')) bgImageUrlInput.value = params.get('img');
    if (params.has('imgOp')) bgImageOpacityInput.value = params.get('imgOp');
    if (params.has('txt')) customTextInput.value = params.get('txt');

    applySettings();
}

// Sync Settings to UI and URL
function applySettings() {
    const size = fontSizeInput.value + 'px';
    const color = fontColorInput.value;
    const bg = bgColorInput.value;
    const font = fontFamilyInput.value;

    document.documentElement.style.setProperty('--font-size', size);
    document.documentElement.style.setProperty('--text-color', color);
    document.documentElement.style.setProperty('--bg-color', bg);
    document.documentElement.style.setProperty('--font-family', font);

    // Update URL fragment
    const params = new URLSearchParams();
    params.set('size', fontSizeInput.value);
    params.set('color', fontColorInput.value);
    params.set('bg', bgColorInput.value);
    params.set('font', fontFamilyInput.value);
    params.set('h24', hourFormatInput.checked);
    params.set('s', showSecondsInput.checked);
    params.set('sm', scheduleModeInput.value);
    
    // Save weekly schedule
    for (let i = 0; i < 7; i++) {
        if (weeklySchedule[i].length > 0) {
            params.set('d' + i, serializeDay(weeklySchedule[i]));
        }
    }

    params.set('img', bgImageUrlInput.value);
    params.set('imgOp', bgImageOpacityInput.value);
    params.set('txt', customTextInput.value);
    
    // Apply to UI
    bgImageLayer.style.backgroundImage = bgImageUrlInput.value ? `url('${bgImageUrlInput.value}')` : 'none';
    document.documentElement.style.setProperty('--bg-image-opacity', bgImageOpacityInput.value);
    customTextElement.textContent = customTextInput.value;
    
    window.history.replaceState(null, null, '#' + params.toString());
}

// Toggle Settings Panel
function toggleSettings(e) {
    if (e.altKey && e.key.toLowerCase() === 's') {
        settingsPanel.classList.toggle('hidden');
    }
}

// Event Listeners
fontSizeInput.addEventListener('input', applySettings);
fontColorInput.addEventListener('input', applySettings);
bgColorInput.addEventListener('input', applySettings);
fontFamilyInput.addEventListener('input', applySettings);
hourFormatInput.addEventListener('change', () => {
    applySettings();
    updateClock();
});
showSecondsInput.addEventListener('change', () => {
    applySettings();
    updateClock();
});
bgImageUrlInput.addEventListener('input', applySettings);
bgImageOpacityInput.addEventListener('input', applySettings);
customTextInput.addEventListener('input', applySettings);
scheduleModeInput.addEventListener('change', applySettings);

// Schedule Modal Listeners
openScheduleBtn.addEventListener('click', () => {
    editingDay = new Date().getDay();
    updateTabUI();
    renderEditorRows();
    scheduleModal.classList.remove('hidden');
});

closeScheduleBtn.addEventListener('click', () => scheduleModal.classList.add('hidden'));

addRowBtn.addEventListener('click', () => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    weeklySchedule[editingDay].push({ hours: now.getHours(), minutes: now.getMinutes(), label: 'New Activity', timeStr });
    renderEditorRows();
});

saveScheduleBtn.addEventListener('click', () => {
    applySettings();
    scheduleModal.classList.add('hidden');
});

dayTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        editingDay = parseInt(tab.dataset.day);
        updateTabUI();
        renderEditorRows();
    });
});

copyDaySelect.addEventListener('change', (e) => {
    const fromDay = e.target.value;
    if (fromDay !== "" && fromDay != editingDay) {
        if (weeklySchedule[fromDay].length === 0) {
            alert("No events to copy from that day!");
            e.target.value = "";
            return;
        }
        
        if (confirm(`Overwrite ${getDayName(editingDay)} schedule with ${getDayName(fromDay)}'s?`)) {
            weeklySchedule[editingDay] = JSON.parse(JSON.stringify(weeklySchedule[fromDay]));
            renderEditorRows();
        }
    }
    e.target.value = ""; 
});

function getDayName(day) {
    const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return names[day];
}

function updateTabUI() {
    dayTabs.forEach(t => t.classList.toggle('active', parseInt(t.dataset.day) === editingDay));
}

function renderEditorRows() {
    scheduleEditorRows.innerHTML = '';
    const dayData = weeklySchedule[editingDay];
    
    dayData.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'schedule-editor-row';
        row.innerHTML = `
            <input type="time" value="${item.timeStr}" class="row-time">
            <input type="text" value="${item.label}" class="row-label w-full" placeholder="Activity Name">
            <button class="delete-row-btn">&times;</button>
        `;
        
        const timeInput = row.querySelector('.row-time');
        const labelInput = row.querySelector('.row-label');
        const deleteBtn = row.querySelector('.delete-row-btn');
        
        timeInput.addEventListener('change', (e) => {
            const [h, m] = e.target.value.split(':').map(Number);
            dayData[index].hours = h;
            dayData[index].minutes = m;
            dayData[index].timeStr = e.target.value;
            dayData.sort((a,b) => (a.hours*60+a.minutes) - (b.hours*60+b.minutes));
            renderEditorRows();
        });
        
        labelInput.addEventListener('input', (e) => {
            dayData[index].label = e.target.value;
        });
        
        deleteBtn.addEventListener('click', () => {
            dayData.splice(index, 1);
            renderEditorRows();
        });
        
        scheduleEditorRows.appendChild(row);
    });
}

function serializeDay(dayArr) {
    return dayArr.map(item => `${item.hours * 60 + item.minutes}-${item.label}`).join('|');
}

function deserializeDay(str) {
    if (!str) return [];
    return str.split('|').map(part => {
        const dashIndex = part.indexOf('-');
        const time = part.substring(0, dashIndex);
        const label = part.substring(dashIndex + 1);
        const totalMinutes = parseInt(time);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        return { hours, minutes, label, timeStr };
    }).sort((a, b) => (a.hours * 60 + a.minutes) - (b.hours * 60 + b.minutes));
}

window.addEventListener('keydown', toggleSettings);

// Boot
setInterval(updateClock, 1000);
updateClock();
loadSettingsFromHash();
