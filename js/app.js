// ===== CURSO: uma linha por unidade. "arquivo" só quando a unidade estiver pronta =====
const MODULOS = [
  { id: "m01", arquivo: "modulo1.html", titulo: "Introdução à informática", horas: 3, resumo: "Hardware, software, internet e IA." },
  { id: "m02", titulo: "Funções básicas do Windows", resumo: "Área de trabalho, Menu Iniciar e atalhos." },
  { id: "m03", titulo: "Janelas e Explorador de Arquivos", resumo: "Organizar janelas e pesquisar arquivos." },
  { id: "m04", titulo: "Arquivos e pastas", resumo: "Copiar, renomear e organizar por projeto." },
  { id: "m05", titulo: "Programas padrão do Windows", resumo: "Bloco de Notas, Paint, Calculadora e captura." },
  { id: "m06", titulo: "LibreOffice Writer", resumo: "Textos, ABNT, mala direta e PDF." },
  { id: "m07", titulo: "LibreOffice Calc", resumo: "Planilhas, fórmulas e organização de dados." },
  { id: "m08", titulo: "Calc: funções e painéis", resumo: "PROCV, SE, tabelas dinâmicas e dashboard." },
  { id: "m09", titulo: "LibreOffice Impress", resumo: "Apresentações claras e integradas." },
  { id: "m10", titulo: "Ferramentas do Google", resumo: "Gmail, Docs, Forms, Drive e Looker Studio." },
  { id: "m11", titulo: "Internet, utilitários e segurança", resumo: "Golpes, senhas, LGPD e backup." },
  { id: "m12", titulo: "IA no dia a dia", resumo: "Prompt, verificação e ética." },
  { id: "m13", titulo: "Identidade profissional digital", resumo: "Currículo, LinkedIn e portfólio." }
];

// ===== ESTADO DO JOGO (salvo no navegador do aluno) =====
const K = "info:estado";
let E = {};
try { E = JSON.parse(localStorage.getItem(K)) || {}; } catch (e) {}
E.xp = E.xp || 0; E.ganhos = E.ganhos || {}; E.seq = E.seq || 0; E.dia = E.dia || "";
const salvar = () => { try { localStorage.setItem(K, JSON.stringify(E)); } catch (e) {} };
const dia = (d) => new Date(d).toISOString().slice(0, 10);
if (E.dia !== dia(Date.now())) { E.seq = E.dia === dia(Date.now() - 864e5) ? E.seq + 1 : 1; E.dia = dia(Date.now()); salvar(); }

const NIVEIS = ["Iniciante", "Explorador", "Praticante", "Analista", "Especialista", "Mestre digital"];
const nivel = () => Math.min(Math.floor(E.xp / 100), NIVEIS.length - 1);
const MEDALHAS = [
  { nome: "Primeiro passo", ok: () => E.xp > 0 },
  { nome: "Mão na massa", ok: () => Object.keys(E.ganhos).some((k) => k.includes(":lab")) },
  { nome: "3 dias seguidos", ok: () => E.seq >= 3 },
  { nome: "Unidade 1 concluída", ok: () => E.ganhos["m01:fim"] },
  { nome: "Nível 3", ok: () => nivel() >= 2 }
];

const aviso = document.createElement("div");
aviso.id = "aviso"; aviso.setAttribute("role", "status");
document.body.appendChild(aviso);
function toast(t) { aviso.textContent = t; aviso.classList.add("on"); setTimeout(() => aviso.classList.remove("on"), 2200); }

function hud() {
  const h = document.getElementById("hud");
  if (h) h.textContent = `Nível ${nivel() + 1} ${NIVEIS[nivel()]} | ${E.xp} XP | Sequência: ${E.seq} dia(s)`;
}
function ganhar(id, xp, msg) {
  if (E.ganhos[id]) return false;
  const antes = nivel();
  E.ganhos[id] = true; E.xp += xp; salvar(); hud();
  toast(`+${xp} XP${msg ? ": " + msg : ""}` + (nivel() > antes ? ` | Novo nível: ${NIVEIS[nivel()]}` : ""));
  return true;
}
hud();

// ===== INÍCIO =====
const lista = document.getElementById("lista-modulos");
if (lista) {
  let feitos = 0;
  MODULOS.forEach((m, i) => {
    const ok = !!E.ganhos[m.id + ":fim"]; if (ok) feitos++;
    const li = document.createElement("li");
    const txt = `<strong>Unidade ${i + 1}: ${m.titulo}</strong><span>${m.resumo}</span>`;
    li.innerHTML = m.arquivo
      ? `<a href="modulos/${m.arquivo}" class="${ok ? "feito" : ""}">${txt}${ok ? ' <span class="estado">Concluída</span>' : ""}</a>`
      : `<a class="breve" aria-disabled="true">${txt}<span>Em breve</span></a>`;
    lista.appendChild(li);
  });
  const prontos = MODULOS.filter((m) => m.arquivo).length;
  const b = document.getElementById("barra"), t = document.getElementById("texto-progresso");
  if (b) { b.max = MODULOS.length; b.value = feitos; }
  if (t) t.textContent = `${feitos} de ${MODULOS.length} unidades concluídas (${prontos} disponíveis)`;
  const nv = document.getElementById("nivel");
  if (nv) nv.innerHTML = `<span>Nível ${nivel() + 1}: ${NIVEIS[nivel()]}</span><span>${E.xp} XP</span>`;
  const bx = document.getElementById("barra-xp");
  if (bx) bx.value = nivel() >= NIVEIS.length - 1 ? 100 : E.xp % 100;
  const md = document.getElementById("medalhas");
  if (md) MEDALHAS.forEach((m) => { const li = document.createElement("li"); const on = !!m.ok(); li.className = on ? "on" : ""; li.textContent = (on ? "Conquistada: " : "Bloqueada: ") + m.nome; md.appendChild(li); });
}

// ===== UNIDADE =====
const atual = document.body.dataset.modulo;
if (atual) {
  const m = MODULOS.find((x) => x.arquivo === atual), i = MODULOS.indexOf(m);
  const btn = document.getElementById("concluir");
  const pintar = () => { const ok = !!E.ganhos[m.id + ":fim"]; btn.setAttribute("aria-pressed", ok); btn.textContent = ok ? "Unidade concluída" : "Concluir unidade (+30 XP)"; };
  if (btn) { pintar(); btn.addEventListener("click", () => { ganhar(m.id + ":fim", 30, "unidade concluída"); pintar(); }); }
  const nav = document.getElementById("navegacao"), p = MODULOS[i + 1];
  if (nav) nav.innerHTML = p && p.arquivo ? `<span></span><a href="${p.arquivo}">Próxima: ${p.titulo}</a>` : "";

  document.querySelectorAll(".quiz").forEach((q) => {
    const fb = q.querySelector(".feedback");
    q.querySelectorAll(".opcao").forEach((b) => b.addEventListener("click", () => {
      const ok = b.dataset.correta === "true";
      q.querySelectorAll(".opcao").forEach((o) => o.classList.remove("certa", "errada"));
      b.classList.add(ok ? "certa" : "errada");
      fb.textContent = ok ? "Correto. " + (q.dataset.explicacao || "") : "Ainda não. Tente outra opção.";
      fb.className = "feedback " + (ok ? "ok" : "erro");
      if (ok) ganhar(q.dataset.id, 10, "resposta certa");
    }));
  });

  document.querySelectorAll(".classif .item").forEach((li, n) => {
    const res = li.querySelector(".res");
    li.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => {
      const ok = b.dataset.v === li.dataset.resp;
      res.textContent = ok ? "Correto" : "Tente de novo";
      res.style.color = ok ? "var(--ok)" : "var(--erro)";
      if (ok) ganhar(li.closest(".classif").dataset.id + ":" + n, 5, "classificação certa");
    }));
  });

  document.querySelectorAll(".lab input").forEach((c) => {
    c.checked = !!E.ganhos[c.dataset.id];
    c.addEventListener("change", () => { if (c.checked) ganhar(c.dataset.id, 10, "laboratório feito"); });
  });

  const fases = { entrada: "entrada", proc: "processamento", saida: "saída" };
  document.querySelectorAll(".botoes [data-fase]").forEach((b) => b.addEventListener("click", () => {
    document.querySelectorAll(".fluxo div").forEach((d) => d.classList.toggle("ativo", d.dataset.fase === b.dataset.fase));
    document.getElementById("fluxo-txt").textContent = `${b.textContent} é um dispositivo de ${fases[b.dataset.fase]}.`;
  }));
}
