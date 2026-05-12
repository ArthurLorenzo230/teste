// script.js

// Sistema de Agendamento
document.getElementById('agendamento-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const materia = document.getElementById('materia').value;
    const data = document.getElementById('data').value;
    const hora = document.getElementById('hora').value;
    
    const agendamento = { materia, data, hora };
    let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
    agendamentos.push(agendamento);
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
    
    alert('Agendamento realizado com sucesso!');
});

// Upload de Materiais
function uploadMaterial() {
    const fileInput = document.getElementById('upload-material');
    const file = fileInput.files[0];
    if (file) {
        // Simular upload - em um site real, enviaria para servidor
        let materiais = JSON.parse(localStorage.getItem('materiais')) || [];
        materiais.push({ nome: file.name, tipo: file.type });
        localStorage.setItem('materiais', JSON.stringify(materiais));
        
        atualizarMateriaisList();
        alert('Material enviado com sucesso!');
    }
}

function atualizarMateriaisList() {
    const materiais = JSON.parse(localStorage.getItem('materiais')) || [];
    const list = document.getElementById('materiais-list');
    list.innerHTML = '';
    materiais.forEach(material => {
        const item = document.createElement('p');
        item.textContent = `${material.nome} (${material.tipo})`;
        list.appendChild(item);
    });
}

// Ranking de Horas
function atualizarRanking() {
    // Simular ranking - em um site real, seria calculado do servidor
    const ranking = [
        { nome: 'João Silva', horas: 25 },
        { nome: 'Maria Santos', horas: 20 },
        { nome: 'Pedro Oliveira', horas: 18 }
    ];
    
    const list = document.getElementById('ranking-list');
    list.innerHTML = '';
    ranking.forEach((tutor, index) => {
        const item = document.createElement('li');
        item.textContent = `${index + 1}. ${tutor.nome} - ${tutor.horas} horas`;
        list.appendChild(item);
    });
}

// Formulário de Voluntário
document.getElementById('voluntario-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const nome = document.getElementById('nome').value;
    const serie = document.getElementById('serie').value;
    const disponibilidade = Array.from(document.getElementById('disponibilidade').selectedOptions).map(option => option.value);
    
    const voluntario = { nome, serie, disponibilidade };
    let voluntarios = JSON.parse(localStorage.getItem('voluntarios')) || [];
    voluntarios.push(voluntario);
    localStorage.setItem('voluntarios', JSON.stringify(voluntarios));
    
    alert('Cadastro realizado com sucesso!');
});

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    atualizarMateriaisList();
    atualizarRanking();
});