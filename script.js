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

    showMessage(document.getElementById('mensagem-inscricao'), '✅ Inscrição enviada com sucesso! Obrigado por participar.');
    event.target.reset();
}

function loadMemorias() {
    const muralList = document.getElementById('mural-list');
    if (!muralList) return;

    const memorias = getStorage('memorias', []);
    muralList.innerHTML = memorias.length ? '' : '<p style="text-align: center; color: #999; padding: 2rem;">Não há memórias publicadas ainda. Seja o primeiro a compartilhar!</p>';

    memorias.slice().reverse().forEach((memoria, index) => {
        const card = document.createElement('div');
        card.className = 'memoria-card';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `<h4>👤 ${memoria.autor}</h4><p>${memoria.mensagem}</p><small>📅 ${memoria.data}</small>`;
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
        text.textContent = `🎯 ${totalDoacoes} de ${donationGoal} itens arrecadados (${percent}%)`;
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
    
    const btn = event.target.querySelector('button');
    const originalText = btn.textContent;
    btn.textContent = '✅ Doação registrada!';
    setTimeout(() => { btn.textContent = originalText; }, 2000);
    
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

    new Carousel('carousel');
    if (typeof L !== 'undefined') {
        initMap();
    }
    setupScrollAnimations();
});

// Carrossel
class Carousel {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        this.currentIndex = 0;
        this.items = this.container.querySelectorAll('.carousel-item');
        this.indicators = this.container.querySelectorAll('.indicator');
        if (this.items.length === 0) return;
        this.init();
    }

    init() {
        this.updateCarousel();
        const prevBtn = this.container.querySelector('.carousel-control-prev');
        const nextBtn = this.container.querySelector('.carousel-control-next');
        if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
        if (nextBtn) nextBtn.addEventListener('click', () => this.next());
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goTo(index));
        });
        setInterval(() => this.next(), 6000);
    }

    updateCarousel() {
        this.items.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentIndex);
        });
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.items.length;
        this.updateCarousel();
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.updateCarousel();
    }

    goTo(index) {
        this.currentIndex = index;
        this.updateCarousel();
    }
}

// Mapa com Leaflet
function initMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;
    const escolaCoord = [-23.5505, -46.6333];
    const ilpiCoord = [-23.5515, -46.6325];
    const map = L.map('map').setView([-23.551, -46.633], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
    L.circleMarker(escolaCoord, {
        radius: 10,
        fillColor: '#8C5A4D',
        color: '#fff',
        weight: 3,
        opacity: 1,
        fillOpacity: 0.8
    })
    .addTo(map)
    .bindPopup('<b>Escola Paulo de Tarso</b><br/>Alunos voluntários')
    .openPopup();
    L.circleMarker(ilpiCoord, {
        radius: 10,
        fillColor: '#D4886B',
        color: '#fff',
        weight: 3,
        opacity: 1,
        fillOpacity: 0.8
    })
    .addTo(map)
    .bindPopup('<b>ILPI</b><br/>Idosos participantes');
}

// Scroll Animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    document.querySelectorAll('section, .card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}