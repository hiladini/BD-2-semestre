const API_BASE = '/api/funcionarios';
const modal = document.querySelector('#modal');
const tbody = document.querySelector('tbody');
const form = document.querySelector('#formFuncionario');
const sNome = document.querySelector('#m-nome');
const sFuncao = document.querySelector('#m-funcao');
const sSalario = document.querySelector('#m-salario');
const mensagem = document.querySelector('#mensagem');
const tituloModal = document.querySelector('#tituloModal');

let itens = [];
let funcionarioEditando = null;

function abrirModal(funcionario = null) {
  funcionarioEditando = funcionario ? funcionario.id : null;
  tituloModal.textContent = funcionario ? 'Editar funcionário' : 'Novo funcionário';
  sNome.value = funcionario?.nome || '';
  sFuncao.value = funcionario?.funcao || '';
  sSalario.value = funcionario?.salario || '';
  modal.classList.add('active');
  sNome.focus();
}

function fecharModal() {
  modal.classList.remove('active');
  form.reset();
  funcionarioEditando = null;
}

function criarCelula(texto) {
  const td = document.createElement('td');
  td.textContent = texto;
  return td;
}

function inserirItem(item) {
  const tr = document.createElement('tr');
  tr.appendChild(criarCelula(item.nome));
  tr.appendChild(criarCelula(item.funcao));
  tr.appendChild(criarCelula(Number(item.salario).toLocaleString('pt-BR', {
    style: 'currency', currency: 'BRL'
  })));

  const tdEditar = document.createElement('td');
  tdEditar.className = 'acao';
  const btnEditar = document.createElement('button');
  btnEditar.type = 'button';
  btnEditar.title = 'Editar';
  btnEditar.innerHTML = "<i class='bx bx-edit'></i>";
  btnEditar.addEventListener('click', () => abrirModal(item));
  tdEditar.appendChild(btnEditar);

  const tdExcluir = document.createElement('td');
  tdExcluir.className = 'acao';
  const btnExcluir = document.createElement('button');
  btnExcluir.type = 'button';
  btnExcluir.title = 'Excluir';
  btnExcluir.className = 'excluir';
  btnExcluir.innerHTML = "<i class='bx bx-trash'></i>";
  btnExcluir.addEventListener('click', () => excluirItem(item.id));
  tdExcluir.appendChild(btnExcluir);

  tr.append(tdEditar, tdExcluir);
  tbody.appendChild(tr);
}

async function carregarItens() {
  try {
    const response = await fetch(API_BASE);
    if (!response.ok) throw new Error('Não foi possível carregar os funcionários.');
    itens = await response.json();
    tbody.innerHTML = '';
    itens.forEach(inserirItem);
    mensagem.textContent = itens.length ? '' : 'Nenhum funcionário cadastrado.';
  } catch (error) {
    mensagem.textContent = 'Erro ao conectar com o servidor. Verifique se ele está iniciado.';
    console.error(error);
  }
}

async function excluirItem(id) {
  if (!confirm('Deseja realmente excluir este funcionário?')) return;
  try {
    const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Não foi possível excluir.');
    await carregarItens();
  } catch (error) {
    alert(error.message);
  }
}

document.querySelector('#new').addEventListener('click', () => abrirModal());
document.querySelector('#btnCancelar').addEventListener('click', fecharModal);
modal.addEventListener('click', event => {
  if (event.target === modal) fecharModal();
});

form.addEventListener('submit', async event => {
  event.preventDefault();
  const dados = {
    nome: sNome.value.trim(),
    funcao: sFuncao.value.trim(),
    salario: sSalario.value
  };

  const editando = funcionarioEditando !== null;
  const url = editando ? `${API_BASE}/${funcionarioEditando}` : API_BASE;

  try {
    const response = await fetch(url, {
      method: editando ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    const resultado = await response.json();
    if (!response.ok) throw new Error(resultado.error || 'Erro ao salvar.');
    fecharModal();
    await carregarItens();
  } catch (error) {
    alert(error.message);
  }
});

carregarItens();
