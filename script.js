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

// Navegação entre as telas (Views)
function showView(viewId) {
    document.querySelectorAll('.view-section').forEach(v => v.classList.add('hidden'));
    document.getElementById(`view-${viewId}`).classList.remove('hidden');
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