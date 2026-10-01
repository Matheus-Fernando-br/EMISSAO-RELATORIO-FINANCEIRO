const form = document.querySelector("#eventForm");
const doc = document.querySelector("#pdfDocument");
const value = (key) => {
  const nodes = [...document.querySelectorAll(`[data-key="${key}"]`)];
  if (!nodes.length) return "";
  if (nodes[0].type === "checkbox")
    return nodes
      .filter((n) => n.checked)
      .map((n) => n.value)
      .join("  ·  ");
  const checked = nodes.find((n) => n.checked);
  return checked ? checked.value : nodes[0].value || "";
};
const formatDate = (v) => {
  if (!v) return "";
  const [y, m, d] = v.split("-");
  return `${d}/${m}/${y}`;
};
const esc = (v) =>
  String(v || "").replace(
    /[&<>]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c],
  );
const line = (label, key, extra = "") =>
  `<div class="pdf-label">${label}</div><div class="pdf-line ${extra}">${esc(value(key))}</div>`;
const checks = (key, items) =>
  `<div class="pdf-checks">${items.map((item) => `<span>${item}${(value(key) || "").includes(item) ? " ✓" : ""}</span>`).join("")}</div>`;
function pageHeader(title = "", sub = "") {
  return `<div class="pdf-header"><div class="pdf-logo"><span class="pdf-logo-mark">⌁</span><span>GENOMA<small>ATITUDE DE ENSINO</small></span></div></div>${title ? `<div class="pdf-title">${title}</div><div class="pdf-subtitle">${sub}</div>` : ""}`;
}
function footer(n) {
  return `<div class="pdf-footer">Rede Genoma Sistema de Ensino&nbsp; • &nbsp;Documento interno de gestão&nbsp; • &nbsp;Página ${n} de 3</div>`;
}
function build() {
  const p1 = `<section class="pdf-page">${pageHeader("SOLICITAÇÃO E AUTORIZAÇÃO DE EVENTO", "Formulário Padrão – Rede Genoma")}<div class="pdf-grid"><div class="pdf-cell">Sede / unidade<b>${esc(value("sede"))}</b></div><div class="pdf-cell">Gestor responsável<b>${esc(value("gestor"))}</b></div><div class="pdf-cell">Data da solicitação<b>${esc(formatDate(value("dataSolicitacao")))}</b></div><div class="pdf-cell">Data prevista do evento<b>${esc(formatDate(value("dataEvento")))}</b></div></div><div class="pdf-section-title">1. DADOS DO EVENTO</div>${line("Nome do evento", "nomeEvento")}${'<div class="pdf-label">Tipo de evento</div>' + checks("tipo", ["Pedagógico", "Institucional", "Comemorativo", "Esportivo", "Cultural", "Outro"])}${'<div class="pdf-label">Público-alvo</div>' + checks("publico", ["Alunos", "Famílias", "Colaboradores", "Comunidade", "Outro"])}${line("Local de realização", "local")}<div class="pdf-label">Horário previsto</div><div class="pdf-inline"><div>Início<div class="pdf-line">${esc(value("inicio"))}</div></div><div>Término<div class="pdf-line">${esc(value("termino"))}</div></div><div>Participantes<div class="pdf-line">${esc(value("participantes"))}</div></div></div><div class="pdf-section-title">2. JUSTIFICATIVA, OBJETIVO E PROGRAMAÇÃO</div>${line("Motivo / justificativa do evento", "motivo", "tall")}${line("Objetivo / Resultado esperado", "objetivo", "tall")}${line("Descrição do evento e programação prevista", "programacao", "x-tall")}${footer(1)}</section>`;
  const p2 = `<section class="pdf-page">${pageHeader()}<div class="pdf-section-title">3. ESTRUTURA, CUSTOS E FORNECEDORES</div>${line("Estrutura, materiais, serviços e demais necessidades", "estrutura", "x-tall")}${line("Fornecedores / Prestadores previstos (se houver)", "fornecedores", "tall")}${line("Valor estimado total do evento", "valor")}<div class="pdf-label">Orçamentos / documentos anexos</div>${checks("anexos", ["Sim", "Não", "Não se aplica"])}<div class="pdf-section-title">4. SOLICITAÇÃO</div><p style="font-size:8px;line-height:1.4">Declaro que as informações acima são verdadeiras e que o evento somente será divulgado, contratado ou realizado após a autorização formal registrada neste documento.</p><div class="signature">Gestor da Unidade — Solicitante<br>Data: ${esc(formatDate(value("dataAssinatura"))) || "____/____/____"}</div>${footer(2)}</section>`;
  const p3 = `<section class="pdf-page">${pageHeader()}<div class="pdf-section-title">5. AUTORIZAÇÃO</div><div class="pdf-note">Nenhum evento que envolva despesas, contratação de fornecedores, utilização de estrutura externa ou compromissos financeiros em nome da Rede Genoma deverá ser confirmado, divulgado ou realizado antes da análise e autorização desta solicitação.</div>${checks("status", ["AUTORIZADO", "AUTORIZADO COM RESSALVAS", "NÃO AUTORIZADO"])}${line("Ressalvas / Observações", "ressalvas", "x-tall")}<div style="text-align:right;margin-top:8mm">Data de autorização: ____/____/____</div><div class="signatures"><div><b>Rodrigo G. Ferreira Campos</b><br>Diretor de Eventos – Rede Genoma</div><div><b>Valquíria Fernandes</b><br>Gestora Financeira – Rede Genoma</div><div><b>Nilson Cunha</b><br>Maintenedor – Rede Genoma</div></div>${footer(3)}</section>`;
  doc.innerHTML = p1 + p2 + p3;
}
form.addEventListener("input", build);
form.addEventListener("change", build);
build();
document.querySelector("#themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  document.querySelector("#themeToggle").innerHTML = dark
    ? "☀ <span>Modo claro</span>"
    : "☾ <span>Modo escuro</span>";
  localStorage.setItem("genoma-theme", dark ? "dark" : "light");
});
if (localStorage.getItem("genoma-theme") === "dark")
  document.querySelector("#themeToggle").click();
async function generate() {
  build();
  const button = document.querySelector("#generatePdf");
  const old = button.innerHTML;
  button.disabled = true;
  button.innerHTML = "Gerando PDF...";
  const opt = {
    margin: 0,
    filename: `solicitacao-evento-${new Date().toISOString().slice(0, 10)}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };
  try {
    await html2pdf().set(opt).from(doc).save();
  } finally {
    button.disabled = false;
    button.innerHTML = old;
  }
}
document.querySelector("#generatePdf").addEventListener("click", generate);
document
  .querySelector("#generatePdfBottom")
  .addEventListener("click", generate);
