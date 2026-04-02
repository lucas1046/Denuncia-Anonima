# 🛡️ Voz Cidadã - Sistema de Denúncias Anônimas

O **Voz Cidadã** é uma plataforma web completa para o registo e gestão de denúncias de irregularidades. O sistema foi desenhado para garantir o anonimato do cidadão e, ao mesmo tempo, oferecer ferramentas de gestão para administradores acompanharem e atualizarem o status de cada caso.

## 🚀 Funcionalidades

O sistema foi estruturado para atender tanto o cidadão quanto o órgão fiscalizador:

### Para o Cidadão:
- **Categorização Inteligente:** Denúncias divididas em 4 blocos (Segurança, Direitos, Meio Ambiente e Serviços).
- **Geolocalização Detalhada:** Campos específicos para Bairro, Rua e Ponto de Referência.
- **Upload de Evidências:** Interface preparada para anexar arquivos comprobatórios (simulação).
- **Protocolo de Segurança:** Geração automática de códigos únicos (ex: `VOZ-2026-XA42`).
- **Acompanhamento de Status:** Consulta pública do progresso da denúncia via protocolo.

### Para o Administrador:
- **Painel de Gestão:** Área restrita para visualizar todos os relatos registrados no sistema.
- **Controle de Status:** Alteração em tempo real do estado da denúncia (Recebida, Em Análise, Encaminhada, Concluída).
- **Moderação de Dados:** Opção para excluir registros inválidos ou duplicados da base de dados.

## 🛠️ Tecnologias Utilizadas

* **HTML5:** Estrutura semântica e acessível.
* **Tailwind CSS:** Design moderno, responsivo e baseado em utilitários.
* **JavaScript (Vanilla):** Lógica de navegação, persistência e manipulação do DOM.
* **LocalStorage:** Simulação de banco de dados persistente no lado do cliente (browser).

## 📁 Estrutura de Arquivos

```text
├── index.html      # Estrutura principal e views (Cidadão + Admin)
├── style.css       # Estilos personalizados, animações e componentes
├── script.js       # Lógica do formulário, protocolos e gestão admin
└── README.md       # Documentação do projeto
