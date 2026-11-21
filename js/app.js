// ===== LISTA DE MÓDULOS =====
// Para criar um módulo novo: crie o arquivo em modulos/ e adicione uma linha aqui.
const MODULOS = [
  { arquivo: "modulo1.html", titulo: "Módulo 1: Como usar esta apostila", resumo: "Estrutura, edição e publicação." },
  { arquivo: "modulo2.html", titulo: "Módulo 2: Exemplo de atividade", resumo: "Quiz, resposta escondida e conclusão." }
];

const CHAVE = "apostila:progresso";
const lerProgresso = () => { try { return JSON.parse(localStorage.getItem(CHAVE)) || {}; } catch (e) { return {}; } };
const salvarProgresso = (p) => { try { localStorage.setItem(CHAVE, JSON.stringify(p)); } catch (e) {} };

// ===== PÁGINA INICIAL =====
const lista = document.getElementById("lista-modulos");
if (lista) {
  const prog = lerProgresso();
  let feitos = 0;
  MODULOS.forEach((m) => {
    const ok = !!prog[m.arquivo];
    if (ok) feitos++;
    const li = document.createElement("li");
    li.innerHTML = `<a href="modulos/${m.arquivo}" class="${ok ? "feito" : ""}"><strong>${m.titulo}</strong><span>${m.resumo}</span>${ok ? ' <span class="estado">Concluído</span>' : ""}</a>`;
    lista.appendChild(li);
  });
  const barra = document.getElementById("barra");
  const texto = document.getElementById("texto-progresso");
  if (barra) { barra.max = MODULOS.length; barra.value = feitos; }
  if (texto) texto.textContent = `${feitos} de ${MODULOS.length} módulos concluídos`;
}

// ===== PÁGINAS DE MÓDULO =====
const atual = document.body.dataset.modulo;
if (atual) {
  const prog = lerProgresso();
  const btn = document.getElementById("concluir");
  const pintar = () => {
    btn.setAttribute("aria-pressed", prog[atual] ? "true" : "false");
    btn.textContent = prog[atual] ? "Módulo concluído (clique para desfazer)" : "Marcar como concluído";
  };
  if (btn) {
    pintar();
    btn.addEventListener("click", () => { prog[atual] = !prog[atual]; salvarProgresso(prog); pintar(); });
  }
  const i = MODULOS.findIndex((m) => m.arquivo === atual);
  const nav = document.getElementById("navegacao");
  if (nav && i >= 0) {
    const ant = MODULOS[i - 1], prox = MODULOS[i + 1];
    nav.innerHTML = (ant ? `<a href="${ant.arquivo}">Anterior: ${ant.titulo}</a>` : "<span></span>") +
                    (prox ? `<a href="${prox.arquivo}">Próximo: ${prox.titulo}</a>` : "");
  }
}

// ===== QUIZZES =====
document.querySelectorAll(".quiz").forEach((q) => {
  const fb = q.querySelector(".feedback");
  q.querySelectorAll(".opcao").forEach((b) => {
    b.addEventListener("click", () => {
      const acertou = b.dataset.correta === "true";
      q.querySelectorAll(".opcao").forEach((o) => o.classList.remove("certa", "errada"));
      b.classList.add(acertou ? "certa" : "errada");
      fb.textContent = acertou ? "Correto. " + (q.dataset.explicacao || "") : "Ainda não. Tente outra opção.";
      fb.className = "feedback " + (acertou ? "ok" : "erro");
    });
  });
});
