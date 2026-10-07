# Triagem de Chamados com n8n

Um fluxo no n8n que recebe chamados de suporte por um formulário, tenta descobrir sozinho do que se trata e o quão urgente é, salva tudo numa planilha do Google Sheets e me avisa no Discord quando aparece algo urgente.

![Fluxo no n8n](imagens/fluxo.png)

## Por que fiz isso

Trabalhei quase dois anos com suporte de software, e uma parte chata do dia era ler cada chamado que chegava, entender o que era e decidir o que atender primeiro. Quis ver se dava para automatizar pelo menos essa primeira triagem, e aproveitei para aprender n8n, que eu nunca tinha usado.

## Como funciona

A pessoa abre o chamado num formulário simples (nome, e-mail, título e descrição):

![Formulário](imagens/formulario.png)

Depois disso, um nó de código em JavaScript ([`classificacao.js`](classificacao.js)) lê o título e a descrição e procura palavras-chave:

- **Categoria:** se fala de senha ou login, é *Acesso*. Se fala de erro, bug, travou etc., é *Erro*. Também tem *Sugestão*, *Dúvida* e *Outros* quando nada bate.
- **Prioridade:** palavras como "urgente", "travou", "fora do ar" ou "não consigo" deixam o chamado como *Alta*. Erros e problemas de acesso ficam *Média*, e o resto *Baixa*.

Todo chamado vai para a planilha. Formatei com cores por prioridade e um campo de status para a equipe ir atualizando:

![Planilha](imagens/planilha.png)

E se a prioridade for alta, chega um alerta no Discord:

![Discord](imagens/discord.png)

## O que aprendi (e os bugs no caminho)

- No começo, **tudo caía em "Outros"**. Depois de um tempo descobri que tinha usado aspas simples em vez de crase na template string, então o texto que eu analisava era literalmente `${titulo} ${descricao}` 😅
- Precisei **remover os acentos** do texto antes de comparar, senão "Não consigo" e "nao consigo" eram tratados como coisas diferentes.
- Testando, vi que "sistema fora do ar" era urgente mas caía em "Outros", porque "fora do ar" só estava na lista de urgência. Ajustei as listas.
- Aprendi a configurar OAuth no Google Cloud para conectar o Google Sheets, e a usar webhook do Discord sem deixar a URL exposta no código (ela fica só nas credenciais do n8n).

## Limitações / o que eu ainda quero melhorar

- A busca é por trecho exato da palavra, então "pararam" não é reconhecido como "parou". Dá para ver isso no chamado de pagamentos, que ficou como "Outros". Talvez dê para resolver comparando pelo radical das palavras, ou usando IA para classificar.
- O protocolo é gerado pela data e hora, então dois chamados no mesmo segundo teriam o mesmo número. Ele também usa o horário UTC, e não o de Brasília.
- Queria mandar um e-mail de confirmação com o protocolo para quem abriu o chamado.

## Se quiser rodar

1. Instale o [Node.js](https://nodejs.org) e rode `npx n8n` (no PowerShell, talvez precise ser `npx.cmd n8n`).
2. Importe o [`triagem-chamados.json`](triagem-chamados.json) no n8n.
3. Crie uma planilha com estas colunas: `protocolo, data, nome, email, titulo, descricao, categoria, prioridade, status`.
4. Configure as credenciais do Google Sheets (OAuth2) e do Discord (webhook), e selecione a sua planilha no nó do Google Sheets.

## Feito com

n8n · JavaScript · Google Sheets · Discord
