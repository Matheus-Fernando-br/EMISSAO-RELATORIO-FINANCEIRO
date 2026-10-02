const form = document.querySelector("#eventForm");
const doc = document.querySelector("#pdfDocument");

const getNodes = (key) => [...document.querySelectorAll(`[data-key="${key}"]`)];
const value = (key) => {
  const nodes = getNodes(key);
  if (!nodes.length) return "";
  if (nodes[0].type === "checkbox")
    return nodes.filter((node) => node.checked).map((node) => node.value);
  const selected = nodes.find((node) => node.checked);
  return selected ? selected.value : nodes[0].value || "";
};
const values = (key) =>
  Array.isArray(value(key)) ? value(key) : value(key) ? [value(key)] : [];
const esc = (text) =>
  String(text ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
const dateBR = (text) => {
  if (!text) return "";
  const [year, month, day] = text.split("-");
  return `${day}/${month}/${year}`;
};
const checked = (key, item) => (values(key).includes(item) ? "✓" : "");
const text = (key, className = "") =>
  `<span class="overlay-text ${className}">${esc(value(key))}</span>`;
const mark = (key, item, className = "") =>
  `<span class="overlay-check ${className}">${checked(key, item)}</span>`;

function page(number, contents) {
  return `<section class="pdf-page page-${number}">${contents}</section>`;
}

function buildDocument() {
  const p1 = page(
    1,
    `
    ${text("sede", "p1-sede")}
    ${text("gestor", "p1-gestor")}
    <span class="overlay-text p1-data-solicitacao">${esc(dateBR(value("dataSolicitacao")))}</span>
    <span class="overlay-text p1-data-evento">${esc(dateBR(value("dataEvento")))}</span>
    ${text("nomeEvento", "p1-nome-evento")}
    ${mark("tipo", "Pedagógico", "p1-tipo-1")}${mark("tipo", "Institucional", "p1-tipo-2")}${mark("tipo", "Comemorativo", "p1-tipo-3")}${mark("tipo", "Esportivo", "p1-tipo-4")}${mark("tipo", "Cultural", "p1-tipo-5")}${mark("tipo", "Outro", "p1-tipo-6")}
    ${mark("publico", "Alunos", "p1-publico-1")}${mark("publico", "Famílias", "p1-publico-2")}${mark("publico", "Colaboradores", "p1-publico-3")}${mark("publico", "Comunidade", "p1-publico-4")}${mark("publico", "Outro", "p1-publico-5")}
    ${text("local", "p1-local")}
    ${text("inicio", "p1-inicio")}${text("termino", "p1-termino")}${text("participantes", "p1-participantes")}
    ${text("motivo", "p1-motivo")}${text("objetivo", "p1-objetivo")}${text("programacao", "p1-programacao")}
  `,
  );

  const p2 = page(
    2,
    `
    ${text("estrutura", "p2-estrutura")}
    ${text("fornecedores", "p2-fornecedores")}
    ${text("valor", "p2-valor")}
    ${mark("anexos", "Sim", "p2-anexos-1")}${mark("anexos", "Não", "p2-anexos-2")}${mark("anexos", "Não se aplica", "p2-anexos-3")}
    <span class="overlay-text p2-data-assinatura">${esc(dateBR(value("dataAssinatura")))}</span>
  `,
  );

  const p3 = page(
    3,
    `
    ${mark("status", "AUTORIZADO", "p3-status-1")}${mark("status", "AUTORIZADO COM RESSALVAS", "p3-status-2")}${mark("status", "NÃO AUTORIZADO", "p3-status-3")}
    ${text("ressalvas", "p3-ressalvas")}
  `,
  );

  doc.innerHTML = p1 + p2 + p3;
}

form.addEventListener("input", buildDocument);
form.addEventListener("change", buildDocument);
buildDocument();

const themeToggle = document.querySelector("#themeToggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  themeToggle.innerHTML = dark
    ? "☀ <span>Modo claro</span>"
    : "☾ <span>Modo escuro</span>";
  localStorage.setItem("genoma-theme", dark ? "dark" : "light");
});
if (localStorage.getItem("genoma-theme") === "dark") themeToggle.click();

async function generate() {
  buildDocument();
  const button = document.querySelector("#generatePdf");
  const bottomButton = document.querySelector("#generatePdfBottom");
  const oldText = button.innerHTML;
  button.disabled = true;
  bottomButton.disabled = true;
  button.innerHTML = "Gerando PDF...";

  const options = {
    margin: 0,
    filename: `solicitacao-evento-${new Date().toISOString().slice(0, 10)}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      letterRendering: true,
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
      compress: true,
    },
    pagebreak: { mode: ["css"] },
  };

  try {
    await html2pdf().set(options).from(doc).save();
  } finally {
    button.disabled = false;
    bottomButton.disabled = false;
    button.innerHTML = oldText;
  }
}

document.querySelector("#generatePdf").addEventListener("click", generate);
document
  .querySelector("#generatePdfBottom")
  .addEventListener("click", generate);
