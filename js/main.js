document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Revelação ao rolar: elementos entram das laterais e se
     acomodam no lugar conforme entram na tela ---------- */
  if ('IntersectionObserver' in window) {
    document.body.classList.add('pronto-revelar');

    const observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('ativo');
          observador.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal').forEach(function (elemento) {
      observador.observe(elemento);
    });
  }

  /* ---------- Hero: vídeo controlado pelo scroll (com suavização) ---------- */
  const heroScrub = document.getElementById('heroScrub');
  const heroVideo = document.getElementById('heroVideo');
  if (heroScrub && heroVideo) {
    const ehTelaPequena = () => window.innerWidth <= 960;

    if (ehTelaPequena()) {
      // Em telas pequenas mantemos o vídeo em loop normal (mais leve e mais previsível no touch)
      heroVideo.autoplay = true;
      heroVideo.loop = true;
      heroVideo.play().catch(() => {});
    } else {
      let duracaoPronta = false;
      let progressoAlvo = 0;   // 0→1, calculado a partir do scroll (pode "pular")
      let progressoAtual = 0;  // 0→1, o que realmente vira currentTime (suavizado)
      let precisaAtualizar = false;

      heroVideo.addEventListener('loadedmetadata', function () {
        duracaoPronta = true;
      });

      function calcularProgressoPeloScroll() {
        const retangulo = heroScrub.getBoundingClientRect();
        const alturaRolavel = heroScrub.offsetHeight - window.innerHeight;
        if (alturaRolavel <= 0) return;
        let progresso = -retangulo.top / alturaRolavel;
        progressoAlvo = Math.max(0, Math.min(1, progresso));
        precisaAtualizar = true;
      }

      // Loop contínuo em requestAnimationFrame: em vez de saltar direto pro
      // tempo calculado pelo scroll, caminha uma fração da distância a cada
      // quadro (lerp). Isso evita o "engasgo" de ficar buscando keyframes
      // toda hora e deixa o movimento do vídeo fluido mesmo em rolagens rápidas.
      function suavizar() {
        if (duracaoPronta && heroVideo.duration) {
          const diferenca = progressoAlvo - progressoAtual;
          if (Math.abs(diferenca) > 0.0008) {
            progressoAtual += diferenca * 0.14; // fator de suavização
            const tempoAlvo = progressoAtual * heroVideo.duration;
            if (Math.abs(tempoAlvo - heroVideo.currentTime) > 0.02) {
              heroVideo.currentTime = tempoAlvo;
            }
          }
        }
        requestAnimationFrame(suavizar);
      }

      window.addEventListener('scroll', calcularProgressoPeloScroll, { passive: true });
      window.addEventListener('load', calcularProgressoPeloScroll);
      requestAnimationFrame(suavizar);
    }
  }

  /* ---------- Header dinâmico ao rolar ---------- */
  const cabecalho = document.getElementById('cabecalho');
  window.addEventListener('scroll', function () {
    cabecalho.classList.toggle('rolado', window.scrollY > 40);
  });

  /* ---------- Menu mobile ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const menuMobile = document.getElementById('menuMobile');
  menuToggle.addEventListener('click', function () {
    const aberto = menuMobile.style.display === 'block';
    menuMobile.style.display = aberto ? 'none' : 'block';
    menuToggle.textContent = aberto ? '☰' : '✕';
  });
  menuMobile.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      menuMobile.style.display = 'none';
      menuToggle.textContent = '☰';
    });
  });

  /* ---------- Formulário de agendamento de visita ---------- */
  const formVisita = document.getElementById('formVisita');
  if (formVisita) {
    formVisita.addEventListener('submit', function (e) {
      e.preventDefault();
      // Em produção: enviar via fetch() para php/api_agendamentos.php
      // fetch('php/api_agendamentos.php', { method: 'POST', body: new FormData(formVisita) })
      document.getElementById('confirmacaoVisita').classList.add('ativo');
      formVisita.reset();
    });
  }

  /* ---------- Doação: seleção de valor + QR code + copiar chave Pix ---------- */
  const chipsValor = document.querySelectorAll('.chip-valor');
  chipsValor.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chipsValor.forEach(c => c.classList.remove('selecionado'));
      chip.classList.add('selecionado');
    });
  });

  const imgQr = document.getElementById('imgQrCode');
  if (imgQr) imgQr.src = 'assets/pix-qrcode.png';

  const btnCopiarPix = document.getElementById('btnCopiarPix');
  if (btnCopiarPix) {
    btnCopiarPix.addEventListener('click', function () {
      const chave = document.getElementById('chavePixTexto').textContent;
      navigator.clipboard.writeText(chave).then(function () {
        const textoOriginal = btnCopiarPix.textContent;
        btnCopiarPix.textContent = 'COPIADO!';
        setTimeout(() => (btnCopiarPix.textContent = textoOriginal), 2000);
      });
    });
  }

  /* ---------- Carrossel de apoiadores (infinito, CSS-driven) ---------- */
  const apoiadores = [
    'Instituto Avançar', 'Grupo Mestre', 'Konbat Sports', 'Farmácia Vida',
    'Construtora Alicerce', 'Studio 220', 'Rede Educar+', 'Banco Solidário'
  ];
  const trilho = document.getElementById('trilhoApoiadores');
  if (trilho) {
    // Duplica a lista para permitir o loop infinito via CSS
    const lista = [...apoiadores, ...apoiadores];
    trilho.innerHTML = lista.map(nome => `<div class="apoiador">${nome}</div>`).join('');
  }

});
