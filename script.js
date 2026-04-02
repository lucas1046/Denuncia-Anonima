// Banco de dados simulado no LocalStorage
let reports = JSON.parse(localStorage.getItem('reports')) || [];

// 1. Navegação entre Abas
function showSection(sectionId) {
    document.querySelectorAll('main > section').forEach(section => {
        section.classList.remove('active-section');
        section.classList.add('hidden');
    });
    const target = document.getElementById(sectionId);
    target.classList.remove('hidden');
    target.classList.add('active-section');

    if(sectionId === 'admin-section') renderAdminTable();
}

// 2. Envio de Denúncia & Exercício 4 (Protocolo)
const reportForm = document.getElementById('report-form');
reportForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const protocol = "SR" + Date.now().toString().slice(-6); // Gerador Simples
    
    const newReport = {
        protocol: protocol,
        category: document.getElementById('category').value,
        neighborhood: document.getElementById('neighborhood').value,
        street: document.getElementById('street').value,
        description: document.getElementById('description').value,
        status: 'Recebida',
        date: new Date().toLocaleDateString()
    };

    reports.push(newReport);
    localStorage.setItem('reports', JSON.stringify(reports));

    // Mostrar Modal de Sucesso
    document.getElementById('protocol-number').innerText = protocol;
    document.getElementById('modal-protocol').classList.remove('hidden');
    reportForm.reset();
});

function closeModal() {
    document.getElementById('modal-protocol').classList.add('hidden');
    showSection('status-section');
}

// 3. Exercício 5: Consulta de Status
function checkStatus() {
    const search = document.getElementById('search-protocol').value.toUpperCase();
    const resultDiv = document.getElementById('status-result');
    const report = reports.find(r => r.protocol === search);

    if (report) {
        resultDiv.innerHTML = `
            <div class="fieldset" style="margin-top:20px; padding:20px; border:1px solid #ddd; border-radius:8px">
                <p><strong>Status Atual:</strong> <span class="badge status-${report.status.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}">${report.status}</span></p>
                <p><strong>Categoria:</strong> ${report.category}</p>
                <p><strong>Data de Envio:</strong> ${report.date}</p>
            </div>
        `;
    } else {
        resultDiv.innerHTML = `<p style="color:red; margin-top:10px">Protocolo não encontrado.</p>`;
    }
}

// 4. Área Administrativa (Consulta e Edição)
function renderAdminTable() {
    const tbody = document.getElementById('admin-table-body');
    tbody.innerHTML = '';

    reports.forEach((report, index) => {
        tbody.innerHTML += `
            <tr>
                <td>#${report.protocol}</td>
                <td>${report.category}</td>
                <td>${report.neighborhood}</td>
                <td>
                    <select onchange="updateStatus(${index}, this.value)">
                        <option value="Recebida" ${report.status === 'Recebida' ? 'selected' : ''}>Recebida</option>
                        <option value="Em análise" ${report.status === 'Em análise' ? 'selected' : ''}>Em análise</option>
                        <option value="Encaminhada" ${report.status === 'Encaminhada' ? 'selected' : ''}>Encaminhada</option>
                        <option value="Concluída" ${report.status === 'Concluída' ? 'selected' : ''}>Concluída</option>
                    </select>
                </td>
                <td>
                    <button onclick="deleteReport(${index})" class="btn-secondary" style="background:var(--danger)">Excluir</button>
                </td>
            </tr>
        `;
    });
}

function updateStatus(index, newStatus) {
    reports[index].status = newStatus;
    localStorage.setItem('reports', JSON.stringify(reports));
    alert('Status atualizado com sucesso!');
}

function deleteReport(index) {
    if(confirm("Deseja remover este registro?")) {
        reports.splice(index, 1);
        localStorage.setItem('reports', JSON.stringify(reports));
        renderAdminTable();
    }
}
