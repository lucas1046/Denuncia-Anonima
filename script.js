/**
 * SafeVoice - Lógica de Persistência e Navegação
 * Chave do localStorage: 'DATABASE_VOICE'
 */

const STORAGE_KEY = 'DATABASE_VOICE';

// Estado temporário da denúncia atual (em memória)
let currentReport = {
    category: '',
    bairro: '',
    rua: '',
    relato: '',
    protocol: '',
    status: 'RECEBIDA' // Status iniciais: RECEBIDA, EM ANÁLISE, CONCLUÍDA
};

// 1. NAVEGAÇÃO ENTRE TELAS
function showView(viewId) {
    // Esconde todas as seções
    document.querySelectorAll('.view-section').forEach(s => s.classList.add('hidden'));
    // Mostra a selecionada
    document.getElementById(`view-${viewId}`).classList.remove('hidden');

    // Se entrar no admin, renderiza a tabela na hora
    if(viewId === 'admin') renderAdminTable();
}

// 2. CONTROLE DO FORMULÁRIO PASSO A PASSO
function startFlow() {
    // Reseta o objeto temporário
    currentReport = { category: '', bairro: '', rua: '', relato: '', protocol: '', status: 'RECEBIDA' };
    
    // Reseta estilos visuais das categorias
    document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('selected'));
    
    showView('report');
    nextStep(1);
}

function setCat(name, element) {
    currentReport.category = name;
    // Highlight visual
    document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('selected'));
    element.classList.add('selected');
    
    // Avança automaticamente após 300ms para o passo 2
    setTimeout(() => nextStep(2), 300);
}

function nextStep(n) {
    document.querySelectorAll('.step-content').forEach(s => s.classList.add('hidden'));
    document.getElementById(`step-${n}`).classList.remove('hidden');

    // Atualiza indicadores de linha no topo
    document.getElementById('step-2-indicator').className = (n >= 2) ? 'h-1 flex-1 bg-cyan-400' : 'h-1 flex-1 bg-slate-800';
}

function prevStep() {
    nextStep(1);
}

// 3. FINALIZAÇÃO E PERSISTÊNCIA
function finalize() {
    const bairro = document.getElementById('field-bairro').value.trim();
    const rua = document.getElementById('field-rua').value.trim();
    const relato = document.getElementById('field-relato').value.trim();

    if(!bairro || !relato) return alert("Bairro e Relato são obrigatórios!");

    // Gera protocolo aleatório (Ex: VOZ-4921)
    const proto = "VOZ-" + Math.floor(1000 + Math.random() * 9000);
    
    // Monta o objeto final
    const fullReport = {
        ...currentReport,
        bairro, rua, relato,
        protocol: proto,
        date: new Date().toLocaleDateString('pt-br')
    };

    // SALVA NO LOCALSTORAGE (DATABASE)
    const db = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    db.push(fullReport);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));

    // Mostra Modal de Sucesso
    document.getElementById('display-proto').innerText = proto;
    document.getElementById('modal-success').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal-success').classList.add('hidden');
    // Limpa campos
    document.getElementById('field-bairro').value = "";
    document.getElementById('field-rua').value = "";
    document.getElementById('field-relato').value = "";
    showView('home');
}

// 4. CONSULTA (USER TRACKING)
function trackReport() {
    const input = document.getElementById('track-input').value.trim().toUpperCase();
    const db = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    const found = db.find(r => r.protocol === input);

    if(found) {
        document.getElementById('track-result').classList.remove('hidden');
        document.getElementById('track-status').innerText = found.status;
    } else {
        alert("Protocolo não encontrado na nossa base.");
        document.getElementById('track-result').classList.add('hidden');
    }
}

// 5. PAINEL ADMIN (GESTÃO)
function renderAdminTable() {
    const db = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const tbody = document.getElementById('admin-table-body');
    tbody.innerHTML = ''; // Limpa a tabela

    db.forEach((report, index) => {
        const tr = document.createElement('tr');
        tr.className = "border-b border-slate-800 hover:bg-slate-800/30 transition";
        tr.innerHTML = `
            <td class="p-4 font-mono text-cyan-400 font-bold">${report.protocol}</td>
            <td class="p-4">${report.bairro}</td>
            <td class="p-4">
                <select onchange="updateStatus(${index}, this.value)" class="bg-slate-950 border border-slate-700 text-[10px] p-1 rounded">
                    <option value="RECEBIDA" ${report.status === 'RECEBIDA' ? 'selected' : ''}>RECEBIDA</option>
                    <option value="EM ANÁLISE" ${report.status === 'EM ANÁLISE' ? 'selected' : ''}>EM ANÁLISE</option>
                    <option value="CONCLUÍDA" ${report.status === 'CONCLUÍDA' ? 'selected' : ''}>CONCLUÍDA</option>
                </select>
            </td>
            <td class="p-4">
                <button onclick="deleteReport(${index})" class="text-red-900 hover:text-red-500 font-bold">EXCLUIR</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function updateStatus(idx, newStatus) {
    const db = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    db[idx].status = newStatus;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    alert("Status do protocolo " + db[idx].protocol + " atualizado para " + newStatus);
}

function deleteReport(idx) {
    if(!confirm("Deseja apagar este registro permanentemente?")) return;
    const db = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    db.splice(idx, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    renderAdminTable();
}

function clearAll() {
    if(confirm("ATENÇÃO: Isso apagará TODOS os dados do site. Confirmar?")) {
        localStorage.removeItem(STORAGE_KEY);
        renderAdminTable();
    }
}
