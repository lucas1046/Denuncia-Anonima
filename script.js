const DB_NAME = 'MinhasDenuncias';
let tempReport = { cat: '', status: 'Recebida' };

function showView(id) {
    document.querySelectorAll('.view-section').forEach(s => s.classList.add('hidden'));
    document.getElementById(`view-${id}`).classList.remove('hidden');
    
    // CRITICAL: Se for admin, redesenha a tabela toda vez
    if(id === 'admin') renderAdmin();
}

function startReport() {
    tempReport = { cat: '', status: 'Recebida' };
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('selected'));
    document.getElementById('next-1').disabled = true;
    showView('report');
    nextStep(1);
}

function nextStep(n) {
    document.querySelectorAll('.step-content').forEach(s => s.classList.add('hidden'));
    document.getElementById(`step-${n}`).classList.remove('hidden');
}

function selectCat(cat, el) {
    tempReport.cat = cat;
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('selected'));
    el.classList.add('selected');
    document.getElementById('next-1').disabled = false;
    document.getElementById('next-1').className = "mt-8 w-full bg-blue-600 text-white py-3 rounded-xl font-bold";
}

function finishReport() {
    const bairro = document.getElementById('in-bairro').value;
    const relato = document.getElementById('in-relato').value;
    const rua = document.getElementById('in-rua').value;

    if(!bairro || !relato) return alert("Preencha os campos!");

    // Gera protocolo
    const proto = "VOZ-" + Math.floor(1000 + Math.random() * 9000);
    
    const novaDenuncia = {
        protocolo: proto,
        categoria: tempReport.cat,
        bairro: bairro,
        rua: rua,
        relato: relato,
        status: 'Recebida'
    };

    // Salva
    const lista = JSON.parse(localStorage.getItem(DB_NAME) || '[]');
    lista.push(novaDenuncia);
    localStorage.setItem(DB_NAME, JSON.stringify(lista));

    alert("Denúncia enviada! Protocolo: " + proto);
    showView('home');
}

function renderAdmin() {
    const lista = JSON.parse(localStorage.getItem(DB_NAME) || '[]');
    const body = document.getElementById('admin-table-body');
    body.innerHTML = '';

    lista.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.className = "border-b text-sm";
        tr.innerHTML = `
            <td class="p-2 font-mono">${item.protocolo}</td>
            <td class="p-2">${item.bairro}</td>
            <td class="p-2"><span class="text-blue-600 font-bold">${item.status}</span></td>
            <td class="p-2 text-right">
                <select onchange="updateStatus(${index}, this.value)" class="border rounded p-1 text-xs">
                    <option value="Recebida" ${item.status=='Recebida'?'selected':''}>Recebida</option>
                    <option value="Em Análise" ${item.status=='Em Análise'?'selected':''}>Análise</option>
                    <option value="Concluída" ${item.status=='Concluída'?'selected':''}>Concluída</option>
                </select>
                <button onclick="deleteItem(${index})" class="text-red-500 ml-2">×</button>
            </td>
        `;
        body.appendChild(tr);
    });
}

function updateStatus(idx, novoStatus) {
    const lista = JSON.parse(localStorage.getItem(DB_NAME) || '[]');
    lista[idx].status = novoStatus;
    localStorage.setItem(DB_NAME, JSON.stringify(lista));
    renderAdmin();
}

function deleteItem(idx) {
    if(!confirm("Excluir?")) return;
    const lista = JSON.parse(localStorage.getItem(DB_NAME) || '[]');
    lista.splice(idx, 1);
    localStorage.setItem(DB_NAME, JSON.stringify(lista));
    renderAdmin();
}

function track() {
    const busca = document.getElementById('track-in').value;
    const lista = JSON.parse(localStorage.getItem(DB_NAME) || '[]');
    const achado = lista.find(d => d.protocolo === busca);

    if(achado) {
        document.getElementById('track-res').classList.remove('hidden');
        document.getElementById('res-status').innerText = achado.status;
    } else {
        alert("Não encontrado");
    }
}
