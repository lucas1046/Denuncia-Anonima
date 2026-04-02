// Objeto para armazenar os dados da denúncia atual
let denuncia = {
    categoria: '',
    bairro: '',
    rua: '',
    referencia: '',
    relato: '',
    protocolo: '',
    status: 'Recebida'
};
// Carrega as denúncias na tabela do administrador
function loadAdminReports() {
    const storage = JSON.parse(localStorage.getItem('reports') || '[]');
    const tableBody = document.getElementById('admin-table-body');
    const emptyMsg = document.getElementById('admin-empty');

    tableBody.innerHTML = '';

    if (storage.length === 0) {
        emptyMsg.classList.remove('hidden');
        return;
    }

    emptyMsg.classList.add('hidden');

    storage.forEach((report, index) => {
        const tr = document.createElement('tr');
        tr.className = "border-b border-slate-50 hover:bg-slate-50 transition";
        
        tr.innerHTML = `
            <td class="py-4 px-2 font-mono text-xs font-bold">${report.protocol}</td>
            <td class="py-4 px-2 text-sm">${report.category}</td>
            <td class="py-4 px-2 text-sm">${report.bairro}</td>
            <td class="py-4 px-2">
                <span class="px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-blue-100 text-blue-700">
                    ${report.status}
                </span>
            </td>
            <td class="py-4 px-2 text-right">
                <select class="select-status" onchange="updateStatus(${index}, this.value)">
                    <option value="Recebida" ${report.status === 'Recebida' ? 'selected' : ''}>Recebida</option>
                    <option value="Em Análise" ${report.status === 'Em Análise' ? 'selected' : ''}>Em Análise</option>
                    <option value="Encaminhada" ${report.status === 'Encaminhada' ? 'selected' : ''}>Encaminhada</option>
                    <option value="Concluída" ${report.status === 'Concluída' ? 'selected' : ''}>Concluída</option>
                </select>
                <button onclick="deleteReport(${index})" class="text-red-400 hover:text-red-600 ml-2">
                    <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

// Atualiza o status de uma denúncia específica
function updateStatus(index, newStatus) {
    const storage = JSON.parse(localStorage.getItem('reports') || '[]');
    storage[index].status = newStatus;
    localStorage.setItem('reports', JSON.stringify(storage));
    alert(`Status da denúncia ${storage[index].protocol} atualizado para: ${newStatus}`);
    loadAdminReports(); // Recarrega a tabela
}

// Exclui uma denúncia
function deleteReport(index) {
    if(confirm("Tem certeza que deseja excluir este registro permanentemente?")) {
        const storage = JSON.parse(localStorage.getItem('reports') || '[]');
        storage.splice(index, 1);
        localStorage.setItem('reports', JSON.stringify(storage));
        loadAdminReports();
    }
}

// Navegação entre as telas (Views)
function showView(viewId) {
    document.querySelectorAll('.view-section').forEach(v => v.classList.add('hidden'));
    document.getElementById(`view-${viewId}`).classList.remove('hidden');
    
    if(viewId === 'admin') {
        loadAdminReports();
    }
}

// Inicia o processo de denúncia
function startReport() {
    resetForm();
    showView('report');
    goToStep(1);
}

// Reseta o formulário
function resetForm() {
    denuncia = { categoria: '', bairro: '', rua: '', referencia: '', relato: '', protocolo: '', status: 'Recebida' };
    document.querySelectorAll('.category-card').forEach(c => c.classList.remove('selected'));
    document.getElementById('btn-next-1').disabled = true;
    document.getElementById('btn-next-1').className = 'btn-disabled';
    document.querySelectorAll('input, textarea').forEach(i => i.value = '');
}

// Lógica de trocar os passos (1, 2 e 3)
function goToStep(num) {
    document.querySelectorAll('.step-content').forEach(s => s.classList.remove('active'));
    document.getElementById(`step-${num}`).classList.add('active');
    
    // Atualiza as bolinhas indicadoras
    const dots = document.querySelectorAll('.step-dot');
    dots.forEach((dot, idx) => {
        if (idx + 1 <= num) dot.classList.add('active');
        else dot.classList.remove('active');
    });
}

// Seleção de categoria
function selectCategory(cat, element) {
    denuncia.categoria = cat;
    document.querySelectorAll('.category-card').forEach(c => c.classList.remove('selected'));
    element.classList.add('selected');
    
    const btn = document.getElementById('btn-next-1');
    btn.disabled = false;
    btn.className = 'bg-blue-600 text-white px-8 py-3 rounded-xl font-bold';
}

// Finaliza e gera o protocolo
function submitDenuncia() {
    denuncia.bairro = document.getElementById('in-bairro').value;
    denuncia.rua = document.getElementById('in-rua').value;
    denuncia.relato = document.getElementById('in-relato').value;

    if (!denuncia.bairro || !denuncia.rua || !denuncia.relato) {
        alert("Preencha os campos obrigatórios!");
        return;
    }

    // Gerador de protocolo simples
    const id = Math.random().toString(36).substring(2, 6).toUpperCase();
    denuncia.protocolo = `VOZ-${new Date().getFullYear()}-${id}`;

    // Salva no banco de dados do navegador (localStorage)
    const db = JSON.parse(localStorage.getItem('denuncias') || '[]');
    db.push({...denuncia});
    localStorage.setItem('denuncias', JSON.stringify(db));

    document.getElementById('display-protocol').innerText = denuncia.protocolo;
    showView('success');
}

// Consulta de protocolo
function trackProtocol() {
    const input = document.getElementById('track-input').value.trim().toUpperCase();
    const db = JSON.parse(localStorage.getItem('denuncias') || '[]');
    const achado = db.find(d => d.protocolo === input);

    const resDiv = document.getElementById('track-result');
    if (achado) {
        resDiv.classList.remove('hidden');
        document.getElementById('res-status').innerText = achado.status;
    } else {
        alert("Protocolo não encontrado!");
    }
}
