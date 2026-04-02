// Constante para garantir que usamos a mesma "tabela" no localStorage
const DB_KEY = 'VOZ_CIDADA_DATA';

// Objeto temporário da denúncia atual
let report = {
    category: '',
    bairro: '',
    rua: '',
    relato: '',
    protocol: '',
    status: 'Recebida'
};

// --- NAVEGAÇÃO ---
function showView(viewId) {
    document.querySelectorAll('.view-section').forEach(v => v.classList.add('hidden'));
    document.getElementById(`view-${viewId}`).classList.remove('hidden');
    
    // Se entrar no admin, renderiza a tabela na hora
    if(viewId === 'admin') renderAdminTable();
}

function startReport() {
    report = { category: '', bairro: '', rua: '', relato: '', protocol: '', status: 'Recebida' };
    document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('selected'));
    document.getElementById('btn-next-1').disabled = true;
    document.getElementById('btn-next-1').classList.add('opacity-50', 'cursor-not-allowed');
    showView('report');
    goToStep(1);
}

function goToStep(num) {
    document.querySelectorAll('.step-content').forEach(s => s.classList.add('hidden'));
    document.getElementById(`step-${num}`).classList.remove('hidden');
    
    // Atualiza os pontos (dots)
    for(let i=1; i<=3; i++) {
        const dot = document.getElementById(`dot-${i}`);
        if(i <= num) dot.classList.add('active');
        else dot.classList.remove('active');
    }
}

// --- LÓGICA DO FORMULÁRIO ---
function selectCat(name, el) {
    report.category = name;
    document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    
    const btn = document.getElementById('btn-next-1');
    btn.disabled = false;
    btn.classList.remove('opacity-50', 'cursor-not-allowed');
}

function saveReport() {
    report.bairro = document.getElementById('in-bairro').value.trim();
    report.rua = document.getElementById('in-rua').value.trim();
    report.relato = document.getElementById('in-relato').value.trim();

    if(!report.bairro || !report.rua || !report.relato) {
        alert("Por favor, preencha todos os campos obrigatórios (*)");
        return;
    }

    // Gera protocolo
    const id = Math.random().toString(36).substring(2, 6).toUpperCase();
    report.protocol = `VOZ-2026-${id}`;

    // SALVAR NO LOCALSTORAGE
    const currentDB = JSON.parse(localStorage.getItem(DB_KEY) || '[]');
    currentDB.push({...report});
    localStorage.setItem(DB_KEY, JSON.stringify(currentDB));

    document.getElementById('display-proto').innerText = report.protocol;
    showView('success');
}

// --- CONSULTA (CIDADÃO) ---
function searchProtocol() {
    const input = document.getElementById('track-in').value.trim().toUpperCase();
    const db = JSON.parse(localStorage.getItem(DB_KEY) || '[]');
    const found = db.find(item => item.protocol === input);

    const resBox = document.getElementById('track-res');
    const errBox = document.getElementById('track-error');

    if(found) {
        errBox.classList.add('hidden');
        resBox.classList.remove('hidden');
        document.getElementById('track-status').innerText = found.status;
        document.getElementById('track-cat').innerText = found.category;
    } else {
        resBox.classList.add('hidden');
        errBox.classList.remove('hidden');
    }
}

// --- ÁREA ADMINISTRATIVA ---
function renderAdminTable() {
    const db = JSON.parse(localStorage.getItem(DB_KEY) || '[]');
    const tbody = document.getElementById('admin-table-body');
    const emptyMsg = document.getElementById('admin-empty');

    tbody.innerHTML = '';

    if(db.length === 0) {
        emptyMsg.classList.remove('hidden');
        return;
    }

    emptyMsg.classList.add('hidden');

    db.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.className = "border-b border-slate-50 hover:bg-slate-50 transition";
        tr.innerHTML = `
            <td class="py-4 px-2 font-mono text-xs font-bold text-blue-600">${item.protocol}</td>
            <td class="py-4 px-2 text-sm">${item.category}</td>
            <td class="py-4 px-2 text-sm">${item.bairro}</td>
            <td class="py-4 px-2">
                <span class="bg-blue-50 text-blue-600 px-2 py-1 rounded text-[10px] font-bold uppercase">${item.status}</span>
            </td>
            <td class="py-4 px-2 text-right">
                <select class="select-admin" onchange="updateStatus(${index}, this.value)">
                    <option value="Recebida" ${item.status === 'Recebida' ? 'selected' : ''}>Recebida</option>
                    <option value="Em Análise" ${item.status === 'Em Análise' ? 'selected' : ''}>Análise</option>
                    <option value="Encaminhada" ${item.status === 'Encaminhada' ? 'selected' : ''}>Encaminhada</option>
                    <option value="Concluída" ${item.status === 'Concluída' ? 'selected' : ''}>Concluída</option>
                </select>
                <button onclick="deleteReport(${index})" class="text-red-400 hover:text-red-600 ml-2">×</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function updateStatus(index, newStatus) {
    const db = JSON.parse(localStorage.getItem(DB_KEY) || '[]');
    db[index].status = newStatus;
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    alert("Status atualizado!");
    renderAdminTable();
}

function deleteReport(index) {
    if(confirm("Deseja apagar esta denúncia?")) {
        const db = JSON.parse(localStorage.getItem(DB_KEY) || '[]');
        db.splice(index, 1);
        localStorage.setItem(DB_KEY, JSON.stringify(db));
        renderAdminTable();
    }
}
