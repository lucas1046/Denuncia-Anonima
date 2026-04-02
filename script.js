// Banco de Dados Local
let reports = JSON.parse(localStorage.getItem('safereport_db')) || [];

// 1. Gerenciador de Navegação (Abas e Landing Page)
function showSection(sectionId) {
    // Esconde todas as seções principais
    const sections = ['hero-wrapper', 'user-section', 'status-section', 'admin-section'];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.classList.add('hidden');
    });

    // Mostra a seção desejada
    const target = document.getElementById(sectionId);
    if(target) {
        target.classList.remove('hidden');
        target.classList.add('active-section');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Se for admin, carrega os dados
    if(sectionId === 'admin-section') renderAdmin();
}

// 2. Envio de Denúncia (Exercícios 1-4)
const reportForm = document.getElementById('report-form');
reportForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Gerar Protocolo Único
    const protocol = "SR" + Math.floor(100000 + Math.random() * 900000);
    
    const newReport = {
        id: Date.now(),
        protocol: protocol,
        category: document.getElementById('category').value,
        neighborhood: document.getElementById('neighborhood').value,
        street: document.getElementById('street').value,
        description: document.getElementById('description').value,
        status: 'Recebida',
        date: new Date().toLocaleDateString('pt-BR')
    };

    reports.push(newReport);
    localStorage.setItem('safereport_db', JSON.stringify(reports));

    // Exibir Modal com Protocolo
    document.getElementById('protocol-number').innerText = protocol;
    document.getElementById('modal-protocol').classList.remove('hidden');
});

function closeModal() {
    document.getElementById('modal-protocol').classList.add('hidden');
    reportForm.reset();
    showSection('status-section');
}

// 3. Consulta de Status (Exercício 5)
function checkStatus() {
    const search = document.getElementById('search-protocol').value.trim().toUpperCase();
    const resultDiv = document.getElementById('status-result');
    const found = reports.find(r => r.protocol === search);

    if(found) {
        resultDiv.innerHTML = `
            <div style="background: white; padding: 25px; border-radius: 12px; border: 2px solid var(--primary); margin-top: 25px">
                <p><strong>Protocolo:</strong> ${found.protocol}</p>
                <p><strong>Status:</strong> <span style="color: var(--primary); font-weight: bold">${found.status}</span></p>
                <p><strong>Categoria:</strong> ${found.category}</p>
                <p><strong>Enviado em:</strong> ${found.date}</p>
            </div>
        `;
    } else {
        resultDiv.innerHTML = `<p style="color:red; margin-top: 20px; text-align:center">Protocolo não encontrado. Verifique o código.</p>`;
    }
}

// 4. Funções Administrativas
function renderAdmin() {
    const tbody = document.getElementById('admin-table-body');
    tbody.innerHTML = '';

    if(reports.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center">Nenhuma denúncia registrada.</td></tr>';
        return;
    }

    reports.forEach((report) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${report.protocol}</td>
            <td>${report.category}</td>
            <td>${report.neighborhood}</td>
            <td>
                <select onchange="updateStatus(${report.id}, this.value)">
                    <option ${report.status === 'Recebida' ? 'selected' : ''}>Recebida</option>
                    <option ${report.status === 'Em análise' ? 'selected' : ''}>Em análise</option>
                    <option ${report.status === 'Encaminhada' ? 'selected' : ''}>Encaminhada</option>
                    <option ${report.status === 'Concluída' ? 'selected' : ''}>Concluída</option>
                </select>
            </td>
            <td>
                <button onclick="deleteReport(${report.id})" style="color: red; border: none; background: none; cursor: pointer; font-weight: bold">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.updateStatus = function(id, newStatus) {
    reports = reports.map(r => r.id === id ? {...r, status: newStatus} : r);
    localStorage.setItem('safereport_db', JSON.stringify(reports));
    alert("Status atualizado!");
};

window.deleteReport = function(id) {
    if(confirm("Deseja apagar este registro permanentemente?")) {
        reports = reports.filter(r => r.id !== id);
        localStorage.setItem('safereport_db', JSON.stringify(reports));
        renderAdmin();
    }
};
