const produtosContainer = document.getElementById('produtos');
const busca = document.getElementById('busca');
const marca = document.getElementById('marca');
const ordenar = document.getElementById('ordenar');
const paginacao = document.getElementById('paginacao');
const contador = document.getElementById('contador');

const POR_PAGINA = 8;
let produtos = [];
let filtrados = [];
let pagina = 1;

async function carregarProdutos() {
  try {
    const response = await fetch('./data/produtos.json');
    if (!response.ok) throw new Error('Falha ao carregar produtos.json');
    produtos = await response.json();
    if (!Array.isArray(produtos)) throw new Error('JSON inválido');
    preencherMarcas();
    aplicarFiltros();
  } catch (erro) {
    console.error(erro);
    produtosContainer.innerHTML = `<div class="estado"><i class="ph ph-warning-circle"></i><h2>Não foi possível carregar os produtos</h2><p>Verifique se o catálogo está sendo aberto por um servidor local.</p></div>`;
    contador.textContent = 'Erro ao carregar';
  }
}

function preencherMarcas() {
  const marcas = [...new Set(produtos.map(p => p.marca).filter(Boolean))].sort((a,b)=>String(a).localeCompare(String(b),'pt-BR'));
  marca.innerHTML = '<option value="">Todas as marcas</option>';
  marcas.forEach(m => marca.add(new Option(m,m)));
}

function aplicarFiltros() {
  const termo = (busca.value || '').trim().toLowerCase();
  const m = marca.value;
  filtrados = produtos.filter(p => {
    const texto = `${p.nome || ''} ${p.marca || ''} ${p.descricao || ''}`.toLowerCase();
    return texto.includes(termo) && (!m || p.marca === m);
  });
  ordenarProdutos();
  pagina = 1;
  renderizar();
}

function ordenarProdutos() {
  const tipo = ordenar.value;
  if (tipo === 'nome') filtrados.sort((a,b)=>String(a.nome).localeCompare(String(b.nome),'pt-BR'));
  if (tipo === 'menor') filtrados.sort((a,b)=>Number(a.preco||0)-Number(b.preco||0));
  if (tipo === 'maior') filtrados.sort((a,b)=>Number(b.preco||0)-Number(a.preco||0));
}

function dinheiro(valor) { return Number(valor||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); }
function esc(s) { return String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

function card(p) {
  return `<article class="card"><a href="detalhe.html?id=${encodeURIComponent(p.id)}"><div class="foto"><img src="./produtos/${esc(p.imagem)}" alt="${esc(p.nome)}" loading="lazy" onerror="this.onerror=null;this.src='./img/logo_eletrica.png'"></div><div class="card-content"><span class="marca-card">${esc(p.marca || 'Marca')}</span><h3>${esc(p.nome)}</h3><div class="card-bottom"><strong class="preco">${dinheiro(p.preco)}</strong><span class="btn-carrinho"><i class="ph ph-arrow-up-right"></i></span></div></div></a></article>`;
}

function renderizar() {
  const inicio=(pagina-1)*POR_PAGINA;
  const paginaProdutos=filtrados.slice(inicio,inicio+POR_PAGINA);
  contador.textContent=`${filtrados.length} produto${filtrados.length===1?'':'s'} encontrado${filtrados.length===1?'':'s'}`;
  if (!paginaProdutos.length) {
    produtosContainer.innerHTML='<div class="estado"><i class="ph ph-magnifying-glass"></i><h2>Nenhum produto encontrado</h2><p>Tente outro termo ou altere os filtros.</p></div>';
    paginacao.innerHTML=''; return;
  }
  produtosContainer.innerHTML=paginaProdutos.map(card).join('');
  renderizarPaginacao();
}

function renderizarPaginacao() {
  const total=Math.ceil(filtrados.length/POR_PAGINA);
  if(total<=1){paginacao.innerHTML='';return;}
  paginacao.innerHTML='';
  const add=(label,disabled,fn,ativo=false)=>{const b=document.createElement('button');b.innerHTML=label;b.disabled=disabled;if(ativo)b.classList.add('ativo');b.onclick=()=>{fn();window.scrollTo({top:0,behavior:'smooth'});};paginacao.appendChild(b);};
  add('<i class="ph ph-caret-left"></i>',pagina===1,()=>{pagina--;renderizar();});
  for(let i=1;i<=total;i++) add(i,false,()=>{pagina=i;renderizar();},i===pagina);
  add('<i class="ph ph-caret-right"></i>',pagina===total,()=>{pagina++;renderizar();});
}

busca.addEventListener('input',aplicarFiltros);
marca.addEventListener('change',aplicarFiltros);
ordenar.addEventListener('change',aplicarFiltros);
carregarProdutos();
