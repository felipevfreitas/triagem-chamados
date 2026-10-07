const nome = $json['Nome'];
const email = $json['E-mail'];
const titulo = $json['Título'];
const descricao = $json['Descrição'];

const texto = `${titulo} ${descricao}`.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

function contem(palavras) {
  for (const p of palavras) {
    if (texto.includes(p)) {
      return true;
    }
  }
  return false;
}

const regrasCategoria = [
  { categoria: 'Acesso', palavras: ['senha', 'login', 'acesso', 'entrar', 'bloqueado', 'autenticacao'] },
  { categoria: 'Erro', palavras: ['erro', 'bug', 'falha', 'travou', 'trava', 'parou', 'nao funciona', 'nao carrega', 'caiu', 'fora do ar'] },
  { categoria: 'Sugestão', palavras: ['sugestao', 'sugiro', 'seria bom', 'poderia ter', 'melhoria', 'ideia'] },
  { categoria: 'Dúvida', palavras: ['duvida', 'como faco', 'como fazer', 'onde fica', 'e possivel', 'gostaria de saber'] },
];

let categoria = 'Outros';

for (const regra of regrasCategoria) {
  if (contem(regra.palavras)) {
    categoria = regra.categoria;
    break;
  }
}

const palavrasUrgentes = ['urgente', 'parou', 'caiu', 'fora do ar', 'nao consigo', 'todos os usuarios', 'travou'];

let prioridade = 'Baixa';
if (contem(palavrasUrgentes)) {
  prioridade = 'Alta';
} else if (categoria === 'Erro' || categoria === 'Acesso') {
  prioridade = 'Média';
}

const agora = new Date();
const protocolo = 'CH-' + agora.toISOString().replace(/\D/g, '').slice(0, 14);

return {
  json: {
    protocolo,
    data: agora.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
    nome,
    email,
    titulo,
    descricao,
    categoria,
    prioridade,
    status: 'Aberto',
  },
};
