const donationGoal = 80;

function getStorage(key, fallback) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
}

function setStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function showMessage(element, text) {
    if (!element) return;
    element.textContent = text;
}

function handleInscricao(event) {
    event.preventDefault();
    const nome = document.getElementById('nome').value.trim();
    const serie = document.getElementById('serie').value;
    const contato = document.getElementById('contato').value.trim();
    const modalidade = document.getElementById('modalidade').value;
    const disponibilidade = document.getElementById('disponibilidade').value.trim();

    if (!nome || !contato || !disponibilidade) {
        showMessage(document.getElementById('mensagem-inscricao'), 'Por favor, preencha todos os campos.');
        return;
    }

    const inscricao = { nome, serie, contato, modalidade, disponibilidade, data: new Date().toLocaleDateString() };
    const inscricoes = getStorage('inscricoes', []);
    inscricoes.push(inscricao);
    setStorage('inscricoes', inscricoes);

    showMessage(document.getElementById('mensagem-inscricao'), 'Inscrição enviada com sucesso! Obrigado por participar.');
    event.target.reset();
}

function loadMemorias() {
    const muralList = document.getElementById('mural-list');
    if (!muralList) return;

    const memorias = getStorage('memorias', []);
    muralList.innerHTML = memorias.length ? '' : '<p>Não há memórias publicadas ainda. Seja o primeiro a compartilhar!</p>';

    memorias.slice().reverse().forEach(memoria => {
        const card = document.createElement('div');
        card.className = 'memoria-card';
        card.innerHTML = `<h4>${memoria.autor}</h4><p>${memoria.mensagem}</p><small>${memoria.data}</small>`;
        muralList.appendChild(card);
    });
}

function handleMemoria(event) {
    event.preventDefault();
    const autor = document.getElementById('autor').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();
    if (!autor || !mensagem) return;

    const memoria = { autor, mensagem, data: new Date().toLocaleDateString() };
    const memorias = getStorage('memorias', []);
    memorias.push(memoria);
    setStorage('memorias', memorias);

    event.target.reset();
    loadMemorias();
}

function atualizarThermometro() {
    const totalDoacoes = getStorage('doacoes', 0);
    const percent = Math.min(100, Math.round((totalDoacoes / donationGoal) * 100));
    const fill = document.getElementById('thermometer-fill');
    const text = document.getElementById('thermometer-text');

    if (fill) {
        fill.style.width = percent + '%';
    }

    if (text) {
        text.textContent = `${totalDoacoes} de ${donationGoal} itens arrecadados (${percent}%)`;
    }
}

function handleDoacao(event) {
    event.preventDefault();
    const quantidadeField = document.getElementById('quantidade');
    const quantidade = Number(quantidadeField.value);
    if (!quantidade || quantidade < 1) return;

    const totalDoacoes = getStorage('doacoes', 0) + quantidade;
    setStorage('doacoes', totalDoacoes);
    quantidadeField.value = '1';
    atualizarThermometro();
}

document.addEventListener('DOMContentLoaded', function () {
    const inscricaoForm = document.getElementById('inscricao-form');
    if (inscricaoForm) {
        inscricaoForm.addEventListener('submit', handleInscricao);
    }

    const memoriaForm = document.getElementById('memoria-form');
    if (memoriaForm) {
        memoriaForm.addEventListener('submit', handleMemoria);
        loadMemorias();
    }

    const doacaoForm = document.getElementById('doacao-form');
    if (doacaoForm) {
        doacaoForm.addEventListener('submit', handleDoacao);
        atualizarThermometro();
    }
});