document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Hero: vídeo controlado pelo scroll ---------- */
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
      let ultimoTempoAlvo = 0;
      let animando = false;

      heroVideo.addEventListener('loadedmetadata', function () {
        duracaoPronta = true;
      });

      function atualizarQuadroPeloScroll() {
        animando = false;
        if (!duracaoPronta || !heroVideo.duration) return;

        const retangulo = heroScrub.getBoundingClientRect();
        const alturaRolavel = heroScrub.offsetHeight - window.innerHeight;
        if (alturaRolavel <= 0) return;

        // progresso 0→1 conforme a faixa .hero-scrub passa pela tela
        let progresso = -retangulo.top / alturaRolavel;
        progresso = Math.max(0, Math.min(1, progresso));

        const tempoAlvo = progresso * heroVideo.duration;
        if (Math.abs(tempoAlvo - ultimoTempoAlvo) > 0.01) {
          heroVideo.currentTime = tempoAlvo;
          ultimoTempoAlvo = tempoAlvo;
        }
      }

      window.addEventListener('scroll', function () {
        if (!animando) {
          animando = true;
          requestAnimationFrame(atualizarQuadroPeloScroll);
        }
      }, { passive: true });

      // posição inicial (caso a página já carregue rolada, ex: voltando de outra aba)
      window.addEventListener('load', atualizarQuadroPeloScroll);
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
