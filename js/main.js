document.addEventListener('DOMContentLoaded', function () {

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
