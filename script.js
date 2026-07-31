const assets = [
  { id: 'TR-001', name: 'Trefiladora 01', location: 'Fábrica de Barras Industriais I', type: 'Principal', status: 'Operando' },
  { id: 'EN-002', name: 'Endireitadeira 02', location: 'Fábrica de Barras Industriais II', type: 'Principal', status: 'Operando' },
  { id: 'PT-014', name: 'Ponte Rolante 14', location: 'Logística Fábrica 1', type: 'Auxiliar', status: 'Atenção' },
  { id: 'CF-003', name: 'Cortadora de Fio 03', location: 'Fábrica de Barras Industriais I', type: 'Principal', status: 'Operando' },
  { id: 'EM-008', name: 'Empilhadeira 08', location: 'Logística Fábrica 2', type: 'Auxiliar', status: 'Parado' },
  { id: 'LD-005', name: 'Laboratório Dimensional', location: 'Gestão da Qualidade', type: 'Infraestrutura', status: 'Operando' }
];

const processes = [
  ['1', 'Logística / Recebimento', 'Recebimento, armazenagem e apoio à produção'],
  ['2', 'Fabricação de Barras Industriais', 'Trefilação, corte, acabamento e movimentação'],
  ['3', 'Gestão da Qualidade', 'Ensaios, análises e controle da qualidade'],
  ['4', 'Expedição', 'Conferência, carregamento e atendimento ao cliente']
];

let selectedFilter = 'Todos';
const rows = document.querySelector('#assetRows');
const catalog = document.querySelector('#assetCatalog');
const toast = document.querySelector('#toast');
const sidebar = document.querySelector('#sidebar');
const sidebarToggle = document.querySelector('#sidebarToggle');

function setSidebarCollapsed(collapsed) {
  sidebar.classList.toggle('collapsed', collapsed);
  sidebarToggle.setAttribute('aria-expanded', String(!collapsed));
  const action = collapsed ? 'Expandir' : 'Recolher';
  sidebarToggle.setAttribute('aria-label', `${action} navegação`);
  sidebarToggle.title = `${action} navegação`;
}

sidebarToggle.addEventListener('click', () => setSidebarCollapsed(!sidebar.classList.contains('collapsed')));

document.querySelectorAll('.tree-parent').forEach(button => button.addEventListener('click', () => {
  const leaves = document.getElementById(button.getAttribute('aria-controls'));
  const isExpanded = leaves.hidden;
  leaves.hidden = !isExpanded;
  button.setAttribute('aria-expanded', String(isExpanded));
}));

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2400);
}

function renderAssets() {
  const term = document.querySelector('#assetSearch').value.toLowerCase();
  const visible = assets.filter(asset => (selectedFilter === 'Todos' || asset.status === selectedFilter) && `${asset.name} ${asset.id} ${asset.location}`.toLowerCase().includes(term));
  rows.innerHTML = visible.length ? visible.map(asset => `<tr><td><div class="asset-name"><span class="asset-icon">⚙</span><span>${asset.name}<small style="display:block;color:#8490a3">${asset.id}</small></span></div></td><td>${asset.location}</td><td>${asset.type}</td><td><span class="status ${asset.status.toLowerCase()}">${asset.status}</span></td><td><button class="detail-button" data-id="${asset.id}">DETALHES</button></td></tr>`).join('') : '<tr><td colspan="5">Nenhum ativo encontrado.</td></tr>';
  catalog.innerHTML = assets.map(asset => `<article class="catalog-card"><small>${asset.id}</small><h2>${asset.name}</h2><p>${asset.location}</p><span class="status ${asset.status.toLowerCase()}">${asset.status}</span><br><button class="detail-button" data-id="${asset.id}">VER DETALHES →</button></article>`).join('');
}

function navigate(route) {
  document.querySelectorAll('.page').forEach(page => page.classList.toggle('active', page.dataset.page === route));
  document.querySelectorAll('.nav-item').forEach(item => item.classList.toggle('active', item.dataset.route === route));
  document.querySelector('#main-content').focus();
}

document.querySelectorAll('[data-route]').forEach(item => item.addEventListener('click', event => { event.preventDefault(); navigate(item.dataset.route); }));
document.querySelectorAll('.process-card').forEach(card => card.addEventListener('click', () => { navigate('processes'); showToast(`${card.dataset.process} selecionado`); }));
document.querySelectorAll('[data-area]').forEach(button => button.addEventListener('click', () => { navigate('assets'); showToast(`Unidade: ${button.dataset.plant} — Área: ${button.dataset.area}`); }));
document.querySelectorAll('[data-doc]').forEach(button => button.addEventListener('click', () => { navigate('documents'); showToast(`Categoria aberta: ${button.dataset.doc}`); }));
document.querySelectorAll('.filters button').forEach(button => button.addEventListener('click', () => { selectedFilter = button.dataset.filter; document.querySelectorAll('.filters button').forEach(item => item.classList.toggle('active', item === button)); renderAssets(); }));
document.querySelector('#assetSearch').addEventListener('input', renderAssets);
document.addEventListener('click', event => { const button = event.target.closest('[data-id]'); if (button) showToast(`Abrindo ficha do ativo ${button.dataset.id}`); });

document.querySelector('#newAsset').addEventListener('click', () => document.querySelector('#assetDialog').showModal());
document.querySelector('#saveAsset').addEventListener('click', event => {
  const name = document.querySelector('#newAssetName');
  if (!name.value.trim()) { event.preventDefault(); name.reportValidity(); return; }
  assets.push({ id: `AT-${String(assets.length + 1).padStart(3, '0')}`, name: name.value.trim(), location: document.querySelector('#newAssetLocation').value, type: document.querySelector('#newAssetType').value, status: 'Operando' });
  renderAssets(); name.value = ''; showToast('Ativo cadastrado com sucesso');
});

document.querySelector('#processList').innerHTML = processes.map(([number, name, description]) => `<article class="catalog-card"><small>MACROPROCESSO ${number}</small><h2>${name}</h2><p>${description}</p><button class="detail-button" data-process-name="${name}">EXPLORAR →</button></article>`).join('');
document.querySelectorAll('[data-process-name]').forEach(button => button.addEventListener('click', () => showToast(`Exibindo etapas de ${button.dataset.processName}`)));
renderAssets();
