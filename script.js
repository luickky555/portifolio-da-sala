// script.js — interatividade e animações simples

document.addEventListener('DOMContentLoaded', () => {
  // COUNTERS (contadores simples)
  document.querySelectorAll('.counter').forEach(el => {
    const target = +el.dataset.target || 0;
    let start = 0;
    const duration = 1200;
    const stepTime = Math.max(Math.floor(duration / (target || 1)), 20);
    const increment = Math.ceil(target / (duration / stepTime));
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        el.textContent = target.toString();
        clearInterval(timer);
      } else {
        el.textContent = start.toString();
      }
    }, stepTime);
  });

  // IntersectionObserver: anima entrada dos elementos com classe .animate-card
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-card');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('article, .project-card').forEach(node => observer.observe(node));

  // MODAL: abrir detalhes do projeto
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const closeModal = document.getElementById('close-modal');

  function openProjectModal(key) {
    if (key === 'cardapio') {
      modalTitle.textContent = 'Cardápio Alimentar Interativo';
      modalBody.innerHTML = `<p>O Cardápio Alimentar Interativo permite montar refeições e visualizar micronutrientes instantaneamente (vitaminas, minerais e calorias). Pode gerar relatórios por usuário, considerar restrições alimentares e exportar PDFs para nutricionistas locais.</p><p class="mt-3 text-sm text-gray-600">Funcionalidades técnicas: cálculo dinâmico, banco de dados de alimentos, filtros por alergia e geração de exportações.</p>`;
    } else if (key === 'agrohub') {
      modalTitle.textContent = 'AgroHub';
      modalBody.innerHTML = `<p>O AgroHub é uma plataforma que permite a cada produtor rural registrar sua fazenda, insumos e culturas, publicar excedentes e conectar-se com consumidores locais. Oferece mapas, filtros por cultura e medidas para incentivar a economia circular local.</p>`;
    } else if (key === 'saudemental') {
      modalTitle.textContent = 'Portal de Saúde Mental';
      modalBody.innerHTML = `<p>Portal de apoio com mensagens, áudios relaxantes e integração com profissionais (agendamento e encaminhamento). Inclui funções de TTS para mensagens de apoio e sistema de triagem básica para sugerir contato com psicólogos.</p>`;
    } else {
      modalTitle.textContent = 'Projeto';
      modalBody.textContent = 'Detalhes não disponíveis.';
    }
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
  }

  document.querySelectorAll('.open-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const key = btn.dataset.target;
      openProjectModal(key);
    });
  });

  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    modal.classList.add('hidden');
  });
  modal.addEventListener('click', (evt) => {
    if (evt.target === modal) {
      modal.style.display = 'none';
      modal.classList.add('hidden');
    }
  });

  // DEMO: Cardápio — mostrar micronutrientes do item selecionado
  document.getElementById('food-select').addEventListener('change', (e) => {
    const sel = e.target;
    const opt = sel.selectedOptions[0];
    if (!opt || !opt.dataset.k) {
      document.getElementById('food-info').textContent = 'Escolha um alimento para ver micronutrientes.';
      return;
    }
    // parse simples
    const data = opt.dataset.k.split(';').map(p => p.trim()).filter(Boolean);
    document.getElementById('food-info').innerHTML = data.map(x => `<div class="text-sm">${x}</div>`).join('');
  });

  // DEMO: AgroHub registrar fazenda (apenas simulação)
  document.getElementById('register-farm').addEventListener('click', () => {
    const name = document.getElementById('farm-name').value.trim();
    const crop = document.getElementById('farm-crop').value.trim();
    const fb = document.getElementById('farm-feedback');
    if (!name || !crop) {
      showToast('Preencha nome da fazenda e principal cultura.');
      return;
    }
    fb.textContent = `Fazenda "${name}" com cultura "${crop}" registrada (simulação).`;
    fb.classList.add('text-green-600');
    showToast('Fazenda registrada com sucesso (simulação).');
    // limpar campos
    document.getElementById('farm-name').value = '';
    document.getElementById('farm-crop').value = '';
  });

  // DEMO: Saúde mental — mensagens e TTS (usa Web Speech API)
  const ttsBtn = document.getElementById('play-tts');
  const sendBtn = document.getElementById('send-msg');
  const supportMsg = document.getElementById('support-msg');
  const mhFeedback = document.getElementById('mh-feedback');

  ttsBtn.addEventListener('click', () => {
    const msg = supportMsg.value.trim() || 'Você não está sozinho. Respire fundo e procure ajuda quando necessário.';
    if ('speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(msg);
      utter.lang = 'pt-BR';
      speechSynthesis.speak(utter);
      mhFeedback.textContent = 'Reproduzindo mensagem via TTS...';
    } else {
      mhFeedback.textContent = 'TTS não suportado no seu navegador.';
    }
  });

  sendBtn.addEventListener('click', () => {
    const msg = supportMsg.value.trim();
    if (!msg) {
      showToast('Digite uma mensagem antes de enviar.');
      return;
    }
    // Simulação: mostrar agradecimento e limpar
    mhFeedback.textContent = 'Mensagem enviada ao canal de apoio (simulação).';
    showToast('Mensagem enviada com sucesso (simulação).');
    supportMsg.value = '';
  });

  // Demo buttons that open simple alerts/demos
  document.querySelectorAll('.demo-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const demo = btn.dataset.demo;
      if (demo === 'cardapio') {
        showToast('Demo do Cardápio aberto (simulação).');
      } else if (demo === 'agrohub') {
        showToast('Demo do AgroHub aberto (simulação).');
      } else if (demo === 'saudemental') {
        showToast('Demo do Portal de Saúde Mental aberto (simulação).');
      }
    });
  });

  // Simple toast helper
  function showToast(text, time = 2800) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = text;
    document.body.appendChild(t);
    // force reflow to enable transition
    setTimeout(() => t.classList.add('show'), 20);
    setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => t.remove(), 300);
    }, time);
  }
});
