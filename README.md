# Gerador de Solicitação de Evento — Genoma

Site estático em HTML, CSS e JavaScript para preencher o formulário e gerar um PDF A4 de 3 páginas baseado no modelo fornecido.

## Importante: como abrir corretamente

O arquivo enviado é um **ZIP**. Primeiro clique com o botão direito nele e escolha **Extrair tudo**. Depois, abra a pasta extraída e confirme que ela contém diretamente o arquivo `index.html`.

### Abrir diretamente no navegador

Dê duplo clique no arquivo `index.html`. O site deve abrir no Chrome, Edge ou Firefox. Para o botão de geração do PDF funcionar, mantenha uma conexão com a internet, pois a biblioteca de PDF é carregada por CDN.

### Usar Live Server no VS Code

1. Extraia o ZIP.
2. No VS Code, vá em **File > Open Folder**.
3. Selecione a pasta que contém diretamente `index.html`, `styles.css` e `script.js`.
4. Clique com o botão direito em `index.html`.
5. Escolha **Open with Live Server**.

Não abra o arquivo de dentro do ZIP e não selecione a pasta-pai errada.

### Usar sem extensão no VS Code

No terminal, dentro da pasta que contém o `index.html`, execute:

```bash
python3 -m http.server 4173
```

Depois acesse `http://localhost:4173` no navegador. No Linux/macOS também é possível executar `./start-local.sh`.

## Publicar na Vercel

- Importe o ZIP achatado ou a pasta do projeto na Vercel.
- Framework preset: **Other**.
- Build command: deixe vazio.
- Output directory: `.` (raiz do projeto).

A exportação usa `html2pdf.js` via CDN. Para uso sem internet, baixe a biblioteca e troque o script CDN no `index.html` por uma cópia local.

## Arquivos

- `index.html`: interface e campos.
- `styles.css`: identidade visual, responsividade e layout A4.
- `script.js`: preenchimento da prévia, tema e exportação.
- `Genoma_Evento_simples_modelo.pdf`: modelo original para download.
- `vercel.json`: configuração de hospedagem estática.
- `start-local.sh`: servidor local simples.
