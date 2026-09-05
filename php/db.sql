-- =========================================================
-- Banco de dados — ONG Tempo de Avançar (Golpe de Mestre)
-- =========================================================
CREATE DATABASE IF NOT EXISTS tempo_de_avancar CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tempo_de_avancar;

-- Usuários do painel (professores e administradores)
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    usuario VARCHAR(60) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,      -- gerado com password_hash()
    papel ENUM('professor','admin') NOT NULL DEFAULT 'professor',
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Turmas oferecidas
CREATE TABLE turmas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,             -- Ex: "Jiu-Jitsu Infantil"
    tipo ENUM('jiu_jitsu','reforco_escolar') NOT NULL,
    dia_semana VARCHAR(20),
    horario TIME,
    professor_id INT,
    FOREIGN KEY (professor_id) REFERENCES usuarios(id)
);

-- Alunos
CREATE TABLE alunos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    data_nascimento DATE,
    turma_id INT,
    responsavel_nome VARCHAR(150),
    responsavel_contato VARCHAR(30),
    endereco VARCHAR(255),
    observacoes TEXT,
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (turma_id) REFERENCES turmas(id)
);

-- Histórico de faixas (jiu-jitsu)
CREATE TABLE faixas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id INT NOT NULL,
    faixa ENUM('Branca','Cinza','Amarela','Laranja','Verde','Azul','Roxa','Marrom','Preta') NOT NULL,
    graus TINYINT NOT NULL DEFAULT 0,
    data_graduacao DATE NOT NULL,
    professor_id INT,
    observacao VARCHAR(255),
    FOREIGN KEY (aluno_id) REFERENCES alunos(id),
    FOREIGN KEY (professor_id) REFERENCES usuarios(id)
);

-- Controle de presença
CREATE TABLE presencas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id INT NOT NULL,
    turma_id INT NOT NULL,
    data_aula DATE NOT NULL,
    presente TINYINT(1) NOT NULL DEFAULT 1,
    registrado_por INT,
    FOREIGN KEY (aluno_id) REFERENCES alunos(id),
    FOREIGN KEY (turma_id) REFERENCES turmas(id),
    FOREIGN KEY (registrado_por) REFERENCES usuarios(id),
    UNIQUE KEY unico_por_dia (aluno_id, turma_id, data_aula)
);

-- Caixa financeiro (acesso restrito a admins na aplicação)
CREATE TABLE financeiro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(200) NOT NULL,
    categoria VARCHAR(60) NOT NULL,          -- Doação, Patrocínio, Material, Estrutura...
    tipo ENUM('entrada','saida') NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data_movimento DATE NOT NULL,
    registrado_por INT,
    FOREIGN KEY (registrado_por) REFERENCES usuarios(id)
);

-- Doações feitas pelo site (Pix)
CREATE TABLE doacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_doador VARCHAR(150),
    email_doador VARCHAR(150),
    valor DECIMAL(10,2) NOT NULL,
    metodo ENUM('pix','cartao','outro') DEFAULT 'pix',
    status ENUM('pendente','confirmada') DEFAULT 'pendente',
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Solicitações de visita ao CT (formulário do site)
CREATE TABLE agendamentos_visita (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    telefone VARCHAR(30) NOT NULL,
    email VARCHAR(150) NOT NULL,
    interesse VARCHAR(100),
    data_preferida DATE,
    mensagem TEXT,
    status ENUM('novo','contatado','concluido') DEFAULT 'novo',
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Apoiadores/patrocinadores exibidos no carrossel
CREATE TABLE apoiadores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    logo_url VARCHAR(255),
    site_url VARCHAR(255),
    ordem INT DEFAULT 0,
    ativo TINYINT(1) DEFAULT 1
);

-- Usuário administrador inicial (senha: 1234 — TROCAR em produção)
-- Gere o hash real com: php -r "echo password_hash('sua_senha', PASSWORD_DEFAULT);"
INSERT INTO usuarios (nome, usuario, senha_hash, papel) VALUES
('Administrador', 'admin', '$2y$10$exemploDeHashSubstituirAntesDeUsarEmProducao000000000', 'admin');
