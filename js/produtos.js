const prodContainer=document.getElementById('produto');
const relContainer=document.getElementById('relacionados');
const id=new URLSearchParams(location.search).get('id');

const dinheiro=v=>Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

async function carregaProd(){
  try{
    const r=await fetch('./data/produtos.json');
    if(!r.ok) throw new Error('Falha ao carregar JSON');
    const produtos=await r.json();
    const produto=produtos.find(p=>String(p.id)===String(id));
    if(!produto){prodContainer.innerHTML=`<div class="produto-erro"><i class="ph ph-package"></i><h2>Produto não encontrado</h2><p>O produto solicitado não existe no catálogo.</p><a href="index.html" class="btn-principal">Voltar ao catálogo</a></div>`;return;}
    mostraProduto(produto);
    mostraRelacionados(produtos,produto);
  }catch(e){console.error(e);prodContainer.innerHTML=`<div class="produto-erro"><i class="ph ph-warning-circle"></i><h2>Erro ao carregar produto</h2><p>Verifique se o catálogo está sendo aberto por um servidor local.</p><a href="index.html" class="btn-principal">Voltar ao catálogo</a></div>`;}
}

function mostraProduto(p){
  document.title=`${p.nome} | Elétrica Total`;
  prodContainer.innerHTML=`<article class="prodDetalhe"><div class="prodFoto"><span class="foto-badge">PRODUTO</span><img src="./produtos/${esc(p.imagem)}" alt="${esc(p.nome)}" onerror="this.onerror=null;this.src='./img/logo_eletrica.png'"></div><div class="prodInfo"><span class="marca">${esc(p.marca||'Marca')}</span><h1>${esc(p.nome)}</h1><p class="desc">${esc(p.descricao||'Produto de qualidade para instalações elétricas.')}</p><div class="preco">${dinheiro(p.preco)}</div><button class="btn-comprar" onclick="comprarProduto(${JSON.stringify(String(p.nome))})"><i class="ph ph-shopping-cart"></i> Comprar produto</button></div></article>`;
}

function mostraRelacionados(produtos,atual){
  const relacionados=produtos.filter(p=>String(p.id)!==String(atual.id)&&p.marca===atual.marca).slice(0,4);
  if(!relacionados.length){relContainer.innerHTML='<p class="sem-relacionados">Não temos produtos relacionados para este item.</p>';return;}
  relContainer.innerHTML=relacionados.map(p=>`<article class="card"><a href="detalhe.html?id=${encodeURIComponent(p.id)}"><div class="foto"><img src="./produtos/${esc(p.imagem)}" alt="${esc(p.nome)}" loading="lazy" onerror="this.onerror=null;this.src='./img/logo_eletrica.png'"></div><div class="card-content"><span class="marca-card">${esc(p.marca||'Marca')}</span><h3>${esc(p.nome)}</h3><strong class="preco">${dinheiro(p.preco)}</strong></div></a></article>`).join('');
}
function comprarProduto(nome){alert(`Você selecionou: ${nome}`);}
carregaProd();
