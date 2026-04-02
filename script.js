/**
 * SafeVoice Core Logic
 * Banco de Dados: LocalStorage (VOZ_DATABASE)
 */

const DB_KEY = 'VOZ_DATABASE';

// Estado da denúncia atual em memória
let currentReport = {
    category: '',
    bairro: '',
    rua: '',
    ref: '',
    relato: '',
    protocol: '',
    status: 'DENÚNCIA RECEBIDA' // Status iniciais (Ex 5)
};

// --- NAVEGAÇÃO ENTRE TELAS ---
function showView(viewId) {
    document.querySelectorAll('.view-section').forEach(s => s.classList.add('hidden'));
    document.getElementById(`view-${viewId}`).classList.remove('hidden');

    // CRÍTICO: Sempre que abrir o Admin, atualiza a tabela
    if(viewId === 'admin') renderAdminTable();
}

// --- FLUXO DE FORMULÁRIO ---
function startFlow() {
    // Reset do objeto
    currentReport = { category: '', bairro: '', rua: '', ref: '', relato: '', protocol: '', status: 'DENÚNCIA RECEBIDA' };
    
    // Limpeza visual
    document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('.form-input').forEach(i => i.value = '');
    
    showView('report');
    nextStep(1);
}

function setCat(name, el) {
    currentReport.category = name;
    document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    
    // Pequeno delay para feedback visual antes de mudar de passo
    setTimeout(() => nextStep(2), 300);
}

function nextStep(n) {
    document.querySelectorAll('.step-content').forEach(s => s.classList.add('hidden'));
    document.getElementById(`step-${n}`).classList.remove('hidden');

    // Indicadores visuais de progresso
    document.getElementById('step-2-indicator').className = (n >= 2) ? 'h-1 flex-1 bg-cyan-400' : 'h-1 flex-1 bg-slate-800';
}

// --- FINALIZAÇÃO E PROTOCOLO (Ex 4) ---
function finalize() {
    currentReport.bairro = document.getElementById('field-bairro').value.trim();
    currentReport.rua = document.getElementById('field-rua').value.trim();
    currentReport.ref = document.getElementById('field-ref').value.trim();
    currentReport.relato = document.getElementById('field-relato').value.trim();

    if(!currentReport.bairro || !currentReport.relato) {
        return alert("Por favor, preencha o bairro e o relato da ocorrência.");
    }

    // Gerador de Protocolo Aleatório
    const code = "VOZ-" + Math.floor(1000 + Math.random() * 9000);
    currentReport.protocol = code;

    // Persistência no LocalStorage
    const db = JSON.parse(localStorage.getItem(DB_KEY) || '[]');
    db.push({...currentReport});
    localStorage.setItem(DB_KEY, JSON.stringify(db));

    // Exibição do sucesso
    document.getElementById('display-proto').innerText = code;
    document.getElementById('modal-success').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal-success').classList.add('hidden');
    showView('home');
}

// --- RASTREAMENTO (Ex 5) ---
function trackReport() {
    const input = document.getElementById('track-input').value.trim().toUpperCase();
    const db = JSON.parse(localStorage.getItem(DB_KEY) || '[]');
    
    const found = db.find(r => r.protocol === input);

    if(found) {
        document.getElementById('track-result').classList.remove('hidden');
        document.getElementById('track-status').innerText = found.status;
    } else {
        alert("Protocolo não localizado no sistema.");
        document.getElementById('track-result').classList.add('hidden');
    }
}

// --- ÁREA DO ADMINISTRADOR (Gestão) ---
function renderAdminTable() {
    const db = JSON.parse(localStorage.getItem(DB_KEY) || '[]');
    const tbody = document.getElementById('admin-table-body');
    tbody.innerHTML = ''; 

    if(db.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="p-10 text-center text-slate-600">Base de dados vazia.</td></tr>`;
        return;
    }

    db.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.className = "border-b border-slate-800 hover:bg-slate-800/30 transition";
        tr.innerHTML = `
            <td class="p-4 font-mono text-cyan-400 font-bold">${item.protocol}</td>
            <td class="p-4 text-xs">${item.bairro}</td>
            <td class="p-4">
                <select onchange="updateStatus(${index}, this.value)" class="bg-slate-950 border border-slate-700 text-[10px] p-1 rounded outline-none focus:border-cyan-400">
                    <option value="DENÚNCIA RECEBIDA" ${item.status === 'DENÚNCIA RECEBIDA' ? 'selected' : ''}>RECEBIDA</option>
                    <option value="EM ANÁLISE" ${item.status === 'EM ANÁLISE' ? 'selected' : ''}>EM ANÁLISE</option>
                    <option value="ENCAMINHADA" ${item.status === 'ENCAMINHADA' ? 'selected' : ''}>ENCAMINHADA</option>
                    <option value="CONCLUÍDA" ${item.status === 'CONCLUÍDA' ? 'selected' : ''}>CONCLUÍDA</option>
                </select>
            </td>
            <td class="p-4 text-right">
                <button onclick="deleteItem(${index})" class="text-red-900 hover:text-red-500 text-[10px] font-black uppercase">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function updateStatus(idx, newVal) {
    const db = JSON.parse(localStorage.getItem(DB_KEY) || '[]');
    db[idx].status = newVal;
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    alert("Status do protocolo " + db[idx].protocol + " atualizado.");
}

function deleteItem(idx) {
    if(!confirm("Deseja apagar este registro permanentemente?")) return;
    const db = JSON.parse(localStorage.getItem(DB_KEY) || '[]');
    db.splice(idx, 1);
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    renderAdminTable();
}

function clearAll() {
    if(confirm("AVISO: Todos os registros serão apagados. Continuar?")) {
        localStorage.removeItem(DB_KEY);
        renderAdminTable();
    }
}
