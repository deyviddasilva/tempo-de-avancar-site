# Tempo de Avançar — Golpe de Mestre
Site institucional + painel administrativo para a ONG de jiu-jitsu e reforço escolar.

## 1. Estrutura de pastas

```
site/
├── index.html              Site público (one-page)
├── admin/
│   ├── login.html           Tela de login do painel
│   └── dashboard.html       Painel (presença, alunos, faixas, financeiro)
├── css/
│   ├── style.css            Design tokens + estilos do site público
│   └── admin.css            Estilos do painel (reaproveita as variáveis do style.css)
├── js/
│   ├── main.js               Menu, formulário de visita, doação, carrossel
│   └── admin.js               Login de demonstração + telas do painel
├── assets/
│   ├── logo-round.png        Logo redonda em alta resolução (para header/footer)
│   ├── logo-original-upscaled.png  Logo original com qualidade melhorada
│   ├── hero-bg.mp4 / .webm   Vídeo de fundo do topo (kimono), otimizado para web
│   └── pix-qrcode.png        QR Code Pix gerado (chave de exemplo — troque pela real)
└── php/
    ├── config.php             Conexão PDO com o MySQL
    ├── db.sql                 Schema completo do banco de dados
    ├── auth.php                Login + função exigirLogin()
    ├── api_presenca.php        Listar/gravar presença
    ├── api_financeiro.php      Caixa financeiro (só admin)
    └── api_agendamentos.php    Recebe o formulário de agendamento de visita
```

## 2. Como visualizar agora (sem servidor)

O site já funciona 100% "offline": abra `index.html` direto no navegador. O painel
administrativo (`admin/login.html`) também funciona sozinho, usando dados de
demonstração guardados em `js/admin.js` (sem precisar de banco de dados ainda).

**Contas de teste do painel:**
- Professor: `professor` / `1234` (não vê o caixa financeiro)
- Administrador: `admin` / `1234` (vê tudo, incluindo o financeiro)

## 3. Como ligar ao PHP + MySQL de verdade

1. Suba a pasta `php/` para o seu servidor (Apache/Nginx com PHP 8+).
2. Crie o banco rodando o arquivo `php/db.sql` no MySQL.
3. Edite `php/config.php` com host, usuário e senha do seu banco.
4. Gere o hash da senha do admin real:
   ```
   php -r "echo password_hash('sua_senha_forte', PASSWORD_DEFAULT);"
   ```
   e atualize a linha `INSERT INTO usuarios` no `db.sql` (ou faça um UPDATE depois).
5. No front-end, troque as simulações por chamadas reais, por exemplo:
   - `js/admin.js`, na função de login → troque o `if (conta && conta.senha === senha)`
     por um `fetch('../php/auth.php', {method:'POST', body: JSON.stringify({usuario, senha})})`.
   - `js/main.js`, no envio do formulário de visita → descomente o `fetch('php/api_agendamentos.php', ...)`.
   - `js/admin.js`, no botão "Salvar presença" → chame `php/api_presenca.php`.

   Os comentários `// Em produção: ...` já indicam exatamente onde trocar em cada arquivo.

**Importante sobre segurança do financeiro:** o `php/api_financeiro.php` já
confere no servidor (`exigirLogin('admin')`) se quem está pedindo os dados é
realmente um administrador — a regra não depende só do JavaScript escondendo
o botão no front-end, que poderia ser burlado.

## 4. Sistema de design (para você continuar mexendo)

### Cores
| Nome                | Hex       | Uso                                   |
|----------------------|-----------|----------------------------------------|
| Preto profundo        | `#0A0C10` | Fundo principal                       |
| Preto suave           | `#12151C` | Fundo de seções alternadas            |
| Azul marinho           | `#0D2A47` | Gradientes, painel de agendamento     |
| Azul elétrico (destaque)| `#2FA8E8` | Links, botões primários, ícones     |
| Azul claro             | `#8FD3F4` | Textos de apoio sobre fundo escuro    |
| Branco gelo            | `#F4F7F9` | Texto principal                       |
| Grafite                | `#1B2029` | Cartões                               |
| Vermelho da faixa       | `#B4392C` | CTA de doação — referência à faixa vermelha do cinto da logo |

A paleta preto/azul/branco pedida foi mantida como base; o vermelho vem
diretamente do detalhe da faixa preta na logo e é usado só no botão de doação,
para não virar "mais uma cor aleatória".

### Tipografia
- **Anton** (display, caixa alta, condensada) → títulos. Remete à força e
  disciplina do jiu-jitsu, sem cair no clichê de fonte "esportiva" óbvia.
- **Manrope** (corpo) → textos, formulários, menus. Geométrica, legível, moderna.

Ambas carregadas via Google Fonts no `<head>` de cada página.

### Layout
- Cortes diagonais entre seções (`.corte`) fazem referência direta ao corte
  diagonal da faixa preta no centro da logo — um elemento estrutural com
  significado, não decoração aleatória.
- Vídeo em loop no topo (baseado na animação em preto e branco que vocês
  desenvolveram), com camada de gradiente para garantir contraste do texto.
- Carrossel de apoiadores em loop infinito por CSS puro (sem biblioteca),
  pausa ao passar o mouse.

## 5. Conteúdo que ainda é fictício (trocar antes de publicar)
- Texto "+12 anos", números da seção de estatísticas, nomes de apoiadores.
- Chave Pix (`doacoes@tempodeavancar.org.br`) e QR Code — o QR atual foi gerado
  com dados de exemplo, gere o real com o app do seu banco.
- Endereço, telefone e CNPJ do rodapé.
- Fotos da ONG (hoje o site usa a logo em destaque; o ideal é substituir por
  fotos reais dos alunos e do CT assim que vocês tiverem em mãos).

## 6. Próximos passos sugeridos
- Conectar os formulários (visita e doação) ao PHP.
- Trocar a autenticação de demonstração por sessões reais via `auth.php`.
- Adicionar upload de logo dos apoiadores (tabela `apoiadores` já existe no banco).
- Modo de emissão de recibo/comprovante de doação por e-mail.
