/* =========================================================
   Painel Administrativo — Tempo de Avançar
   Camada de demonstração (front-end puro, dados em memória).
   Em produção: substituir por chamadas fetch() aos endpoints
   PHP descritos em /php (auth.php, api_presenca.php, etc).
   ========================================================= */

const CONTAS_DEMO = {
  professor: { senha: '1234', papel: 'professor', nome: 'Prof. Marcos Lima' },
  admin: { senha: '1234', papel: 'admin', nome: 'Ana Beatriz (Admin)' }
};

const ALUNOS = [
  { nome: 'Kauã Silva', idade: 9, turma: 'Jiu-Jitsu Infantil', faixa: 'Cinza', graus: 2, desde: 'Mar/2025', proxima: 'Nov/2026', responsavel: 'Fernanda Silva', contato: '(11) 98888-1122' },
  { nome: 'Alice Ferreira', idade: 11, turma: 'Jiu-Jitsu Infantil', faixa: 'Amarela', graus: 3, desde: 'Jan/2024', proxima: 'Dez/2026', responsavel: 'Renato Ferreira', contato: '(11) 97777-2233' },
  { nome: 'Davi Santos', idade: 14, turma: 'Jiu-Jitsu Juvenil', faixa: 'Laranja', graus: 1, desde: 'Jun/2025', proxima: 'Fev/2027', responsavel: 'Marta Santos', contato: '(11) 96666-3344' },
  { nome: 'Sophia Costa', idade: 10, turma: 'Jiu-Jitsu Infantil', faixa: 'Cinza', graus: 4, desde: 'Set/2024', proxima: 'Out/2026', responsavel: 'Diego Costa', contato: '(11) 95555-4455' },
  { nome: 'Miguel Rocha', idade: 16, turma: 'Jiu-Jitsu Juvenil', faixa: 'Verde', graus: 0, desde: 'Ago/2026', proxima: 'Ago/2027', responsavel: 'Patrícia Rocha', contato: '(11) 94444-5566' },
  { nome: 'Helena Martins', idade: 8, turma: 'Reforço Escolar', faixa: 'Branca', graus: 1, desde: 'Fev/2026', proxima: '—', responsavel: 'Juliana Martins', contato: '(11) 93333-6677' }
];

const FINANCEIRO = [
  { data: '02/09/2026', descricao: 'Doação Pix — Instituto Avançar', categoria: 'Doação', tipo: 'entrada', valor: 1200 },
  { data: '01/09/2026', descricao: 'Compra de quimonos (12 un.)', categoria: 'Material', tipo: 'saida', valor: 1860 },
  { data: '30/08/2026', descricao: 'Doação Pix — pessoa física', categoria: 'Doação', tipo: 'entrada', valor: 150 },
  { data: '28/08/2026', descricao: 'Aluguel do espaço', categoria: 'Estrutura', tipo: 'saida', valor: 2200 },
  { data: '25/08/2026', descricao: 'Doação Konbat Sports', categoria: 'Patrocínio', tipo: 'entrada', valor: 3000 }
];

/* ---------- Formatação ---------- */
function formatarMoeda(v) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }
const CORES_FAIXA = { 'Branca': '#F4F7F9', 'Cinza': '#8B8F97', 'Amarela': '#E8C547', 'Laranja': '#E3872B', 'Verde': '#3FAE58' };

/* ---------- LOGIN (páginas admin/login.html) ---------- */
const formLogin = document.getElementById('formLogin');
if (formLogin) {
  formLogin.addEventListener('submit', function (e) {
    e.preventDefault();
    const usuario = document.getElementById('usuario').value.trim().toLowerCase();
    const senha = document.getElementById('senha').value;
    const conta = CONTAS_DEMO[usuario];
    const avisoErro = document.getElementById('avisoErro');

    if (conta && conta.senha === senha) {
      // Em produção: enviar para php/auth.php e receber um token/sessão validada no servidor
      sessionStorage.setItem('ta_usuario', JSON.stringify({ usuario, papel: conta.papel, nome: conta.nome }));
      window.location.href = 'dashboard.html';
    } else {
      avisoErro.classList.add('ativo');
    }
  });
}

/* ---------- DASHBOARD (admin/dashboard.html) ---------- */
const painelLateral = document.getElementById('lateral');
if (painelLateral) {
  const sessao = JSON.parse(sessionStorage.getItem('ta_usuario') || 'null');

  if (!sessao) {
    window.location.href = 'login.html';
  } else {
    document.getElementById('nomeUsuario').textContent = sessao.nome;
    document.getElementById('cargoUsuario').textContent = sessao.papel === 'admin' ? 'Administrador' : 'Professor';

    // Controle de acesso: caixa financeiro é exclusivo do papel "admin"
    if (sessao.papel !== 'admin') {
      document.querySelector('[data-somente-admin]').style.opacity = '.35';
      document.querySelector('[data-somente-admin]').title = 'Disponível apenas para administradores';
    }

    document.getElementById('btnSair').addEventListener('click', function () {
      sessionStorage.removeItem('ta_usuario');
      window.location.href = 'login.html';
    });

    /* Navegação entre seções */
    const botoesMenu = document.querySelectorAll('.menu-lateral button');
    botoesMenu.forEach(function (botao) {
      botao.addEventListener('click', function () {
        const destino = botao.dataset.secao;

        if (destino === 'financeiro' && sessao.papel !== 'admin') {
          document.getElementById('conteudoFinanceiro').style.display = 'none';
          document.getElementById('bloqueioFinanceiro').style.display = 'flex';
        }

        botoesMenu.forEach(b => b.classList.remove('ativo'));
        botao.classList.add('ativo');
        document.querySelectorAll('.painel-secao').forEach(s => s.classList.remove('ativa'));
        document.getElementById('secao-' + destino).classList.add('ativa');
      });
    });

    /* Preenche tabela de presença */
    const tabelaPresenca = document.getElementById('tabelaPresenca');
    if (tabelaPresenca) {
      tabelaPresenca.innerHTML = ALUNOS.map(function (a, i) {
        return `<tr>
          <td><input type="checkbox" class="check-presenca" checked data-aluno="${i}"></td>
          <td>${a.nome}</td>
          <td><span class="badge-faixa"><span class="ponto-faixa" style="background:${CORES_FAIXA[a.faixa]}"></span>${a.faixa}</span></td>
          <td><span class="badge badge-presente">Presente</span></td>
        </tr>`;
      }).join('');

      tabelaPresenca.addEventListener('change', function (e) {
        if (!e.target.classList.contains('check-presenca')) return;
        const linha = e.target.closest('tr');
        const badge = linha.querySelector('.badge');
        if (e.target.checked) {
          badge.textContent = 'Presente';
          badge.className = 'badge badge-presente';
        } else {
          badge.textContent = 'Faltou';
          badge.className = 'badge badge-falta';
        }
      });

      document.getElementById('btnSalvarPresenca').addEventListener('click', function () {
        // Em produção: enviar via fetch('php/api_presenca.php', {method:'POST', body: JSON.stringify(dados)})
        this.textContent = 'Presença salva ✓';
        setTimeout(() => (this.textContent = 'Salvar presença'), 2000);
      });
    }

    /* Preenche tabela de alunos */
    const tabelaAlunos = document.getElementById('tabelaAlunos');
    if (tabelaAlunos) {
      function desenharAlunos(lista) {
        tabelaAlunos.innerHTML = lista.map(a => `<tr>
          <td>${a.nome}</td><td>${a.idade}</td><td>${a.turma}</td>
          <td>${a.responsavel}</td><td>${a.contato}</td>
        </tr>`).join('');
      }
      desenharAlunos(ALUNOS);
      document.getElementById('buscaAluno').addEventListener('input', function () {
        const termo = this.value.toLowerCase();
        desenharAlunos(ALUNOS.filter(a => a.nome.toLowerCase().includes(termo)));
      });
    }

    /* Preenche tabela de faixas */
    const tabelaFaixas = document.getElementById('tabelaFaixas');
    if (tabelaFaixas) {
      tabelaFaixas.innerHTML = ALUNOS.map(a => `<tr>
        <td>${a.nome}</td>
        <td><span class="badge-faixa"><span class="ponto-faixa" style="background:${CORES_FAIXA[a.faixa]}"></span>${a.faixa}</span></td>
        <td>${a.graus} grau(s)</td>
        <td>${a.desde}</td>
        <td>${a.proxima}</td>
      </tr>`).join('');
    }

    /* Preenche tabela financeira (protegida) */
    const tabelaFinanceiro = document.getElementById('tabelaFinanceiro');
    if (tabelaFinanceiro) {
      tabelaFinanceiro.innerHTML = FINANCEIRO.map(f => `<tr>
        <td>${f.data}</td><td>${f.descricao}</td><td>${f.categoria}</td>
        <td>${f.tipo === 'entrada' ? 'Entrada' : 'Saída'}</td>
        <td style="color:${f.tipo === 'entrada' ? '#4ADE80' : '#ff8a75'}; font-weight:700;">
          ${f.tipo === 'entrada' ? '+' : '-'} ${formatarMoeda(f.valor)}
        </td>
      </tr>`).join('');
      const totalDoacoes = FINANCEIRO.filter(f => f.categoria === 'Doação' || f.categoria === 'Patrocínio').reduce((s, f) => s + f.valor, 0);
      const resumo = document.getElementById('resumoDoacoes');
      if (resumo) resumo.textContent = formatarMoeda(totalDoacoes);
    }
  }
}
