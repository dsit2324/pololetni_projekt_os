const API_URL = '/api';

// Vytvoření uživatele
async function createUser() {
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const messageDiv = document.getElementById('userMessage');

    if (!username || !email) {
        showMessage(messageDiv, 'Vyplň jméno a e-mail', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email })
        });

        if (response.ok) {
            const user = await response.json();
            showMessage(messageDiv, `✓ Uživatel ${user.username} vytvořen! (ID: ${user.id})`, 'success');
            document.getElementById('username').value = '';
            document.getElementById('email').value = '';
            document.getElementById('selectedUserId').value = user.id;
        } else {
            const error = await response.json();
            showMessage(messageDiv, `✗ Chyba: ${error.detail || 'Nepodařilo se vytvořit uživatele'}`, 'error');
        }
    } catch (error) {
        showMessage(messageDiv, `✗ Chyba: ${error.message}`, 'error');
    }
}

// Načtení úkolů uživatele
async function loadTasks() {
    const userId = document.getElementById('selectedUserId').value.trim();
    const tasksList = document.getElementById('tasksList');

    if (!userId) {
        tasksList.innerHTML = '<p class="placeholder">Vyplň ID uživatele</p>';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/users/${userId}/tasks`);
        
        if (response.ok) {
            const tasks = await response.json();
            displayTasks(tasks);
        } else {
            tasksList.innerHTML = '<p class="placeholder">Uživatel nenalezen nebo nemá žádné úkoly</p>';
        }
    } catch (error) {
        tasksList.innerHTML = `<p class="placeholder">✗ Chyba: ${error.message}</p>`;
    }
}

// Zobrazení úkolů
function displayTasks(tasks) {
    const tasksList = document.getElementById('tasksList');

    if (tasks.length === 0) {
        tasksList.innerHTML = '<p class="placeholder">Tento uživatel zatím nemá žádné úkoly</p>';
        return;
    }

    tasksList.innerHTML = tasks.map(task => `
        <div class="task-item">
            <div class="task-title">📌 ${task.title}</div>
            <span class="task-status status-${task.status.toLowerCase()}">${
                task.status === 'pending' ? '⏳ Čeká' : '✓ Hotovo'
            }</span>
        </div>
    `).join('');
}

// Vytvoření úkolu
async function createTask() {
    const title = document.getElementById('taskTitle').value.trim();
    const userId = document.getElementById('taskUserId').value.trim();
    const messageDiv = document.getElementById('taskMessage');

    if (!title || !userId) {
        showMessage(messageDiv, 'Vyplň název úkolu a ID uživatele', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                title, 
                user_id: parseInt(userId)
            })
        });

        if (response.ok) {
            const task = await response.json();
            showMessage(messageDiv, `✓ Úkol "${task.title}" vytvořen!`, 'success');
            document.getElementById('taskTitle').value = '';
            
            // Obnov úkoly, pokud je zvolen stejný uživatel
            if (document.getElementById('selectedUserId').value === userId) {
                loadTasks();
            }
        } else {
            const error = await response.json();
            showMessage(messageDiv, `✗ Chyba: ${error.detail || 'Nepodařilo se vytvořit úkol'}`, 'error');
        }
    } catch (error) {
        showMessage(messageDiv, `✗ Chyba: ${error.message}`, 'error');
    }
}

// Zobrazení zprávy
function showMessage(element, text, type) {
    element.textContent = text;
    element.className = `message ${type}`;
    
    if (type === 'success') {
        setTimeout(() => {
            element.textContent = '';
            element.className = 'message';
        }, 4000);
    }
}

// Načti úkoly, když se změní ID uživatele
document.addEventListener('DOMContentLoaded', () => {
    const selectedUserInput = document.getElementById('selectedUserId');
    if (selectedUserInput) {
        selectedUserInput.addEventListener('change', loadTasks);
    }
});
