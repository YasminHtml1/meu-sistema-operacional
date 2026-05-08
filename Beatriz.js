/* ================================================
   SimOS 4.0 — Beatriz.js
   Bugs corrigidos + novos recursos
   ================================================ */

let zIndexCounter = 100;
let photoGallery = [];
let musicLibrary = [];
let virtualFolders = { "imagens": photoGallery, "musicas": musicLibrary };
let contacts = [
  { name: "João Silva" },
  { name: "Maria Oliveira" },
  { name: "Carlos Souza" }
];

/* ── Temas ── */
const themes = {
  "Padrão":          { desktopBg: "url('https://picsum.photos/3840/2160?blur=2')", desktopBgSize: "cover", windowHeaderBg: "#007acc", windowHeaderText: "#fff", bodyBg: "#008080" },
  "Dark":            { desktopBg: "#1a1a2e", desktopBgSize: "cover", windowHeaderBg: "#16213e", windowHeaderText: "#e0e0e0", bodyBg: "#0f3460" },
  "Frutiger Aero":   { desktopBg: "linear-gradient(135deg,#a8edea,#fed6e3)", desktopBgSize: "cover", windowHeaderBg: "#5b86e5", windowHeaderText: "#fff", bodyBg: "#c9d6ff" },
  "Pink":            { desktopBg: "linear-gradient(135deg,#ff99cc,#ff66b2)", desktopBgSize: "cover", windowHeaderBg: "#ff66b2", windowHeaderText: "#fff", bodyBg: "#ffccdd" },
  "Light":           { desktopBg: "#e8eaf6", desktopBgSize: "cover", windowHeaderBg: "#5c6bc0", windowHeaderText: "#fff", bodyBg: "#c5cae9" },
  "Nature":          { desktopBg: "linear-gradient(135deg,#56ab2f,#a8e063)", desktopBgSize: "cover", windowHeaderBg: "#2e7d32", windowHeaderText: "#fff", bodyBg: "#388e3c" },
  "Neon":            { desktopBg: "#000", desktopBgSize: "cover", windowHeaderBg: "#39ff14", windowHeaderText: "#000", bodyBg: "#050505" },
  "Ocean":           { desktopBg: "linear-gradient(135deg,#1a6b9e,#0d2137)", desktopBgSize: "cover", windowHeaderBg: "#0077be", windowHeaderText: "#fff", bodyBg: "#006994" },
  "Sunset":          { desktopBg: "linear-gradient(135deg,#f7971e,#ffd200,#f7971e)", desktopBgSize: "cover", windowHeaderBg: "#e65100", windowHeaderText: "#fff", bodyBg: "#bf360c" },
  "Vintage":         { desktopBg: "url('https://picsum.photos/3840/2160?grayscale')", desktopBgSize: "cover", windowHeaderBg: "#8b4513", windowHeaderText: "#fff", bodyBg: "#c8a97a" },
  "Roxo":            { desktopBg: "linear-gradient(135deg,#667eea,#764ba2)", desktopBgSize: "cover", windowHeaderBg: "#512da8", windowHeaderText: "#fff", bodyBg: "#7b1fa2" }
};

/* ── Taskbar Clock ── */
function updateTaskbarClock() {
  const el = document.getElementById('taskbar-clock');
  if (el) {
    const now = new Date();
    el.innerHTML = now.toLocaleTimeString('pt-BR') + '<br><span style="font-size:11px">' + now.toLocaleDateString('pt-BR') + '</span>';
  }
  setTimeout(updateTaskbarClock, 1000);
}
updateTaskbarClock();

/* ── Menu Iniciar ── */
function toggleStartMenu() {
  const menu = document.getElementById('start-menu');
  if (!menu) return;
  menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}
document.addEventListener('click', function(e) {
  const menu = document.getElementById('start-menu');
  const btn = document.getElementById('taskbar-start');
  if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
    menu.style.display = 'none';
  }
});

/* ── Abrir Janela ── */
function openWindow(appName) {
  // BUG FIX: captura o ID antes de criar o innerHTML (evita zIndex errado nos botões da calc)
  const winId = zIndexCounter++;
  const win = document.createElement('div');
  win.classList.add('window');
  // Posição com leve offset pra não empilhar
  const offset = (winId % 10) * 22;
  win.style.top  = (60 + offset) + 'px';
  win.style.left = (60 + offset) + 'px';
  win.style.zIndex = winId;

  // Header com botões macOS-style
  const header = document.createElement('div');
  header.classList.add('window-header');
  header.innerHTML = `
    <span class="close-btn" title="Fechar" onclick="closeWindow(event,this)">✕</span>
    <span class="min-btn"   title="Minimizar" onclick="minimizeWindow(event,this)">−</span>
    <span class="max-btn"   title="Maximizar" onclick="maximizeWindow(event,this)">+</span>
    <span class="win-title">${appName}</span>
  `;
  win.appendChild(header);

  const content = document.createElement('div');
  content.classList.add('window-content');
  const cid = 'wc-' + winId; // ID único para esta janela
  content.id = cid;

  switch(appName) {

    /* ── Calculadora ── */
    case 'Calculadora': {
      const did = 'calc-' + winId;
      content.innerHTML = `
        <input type="text" id="${did}" class="calc-input" readonly placeholder="0">
        <div class="calc-buttons">
          <button class="calc-clear" onclick="clearCalc('${did}')">C</button>
          <button class="calc-op"    onclick="appendCalc('(','${did}')">(</button>
          <button class="calc-op"    onclick="appendCalc(')','${did}')">)</button>
          <button class="calc-op"    onclick="appendCalc('/','${did}')">÷</button>
        </div>
        <div class="calc-buttons">
          <button onclick="appendCalc('7','${did}')">7</button>
          <button onclick="appendCalc('8','${did}')">8</button>
          <button onclick="appendCalc('9','${did}')">9</button>
          <button class="calc-op" onclick="appendCalc('*','${did}')">×</button>
        </div>
        <div class="calc-buttons">
          <button onclick="appendCalc('4','${did}')">4</button>
          <button onclick="appendCalc('5','${did}')">5</button>
          <button onclick="appendCalc('6','${did}')">6</button>
          <button class="calc-op" onclick="appendCalc('-','${did}')">−</button>
        </div>
        <div class="calc-buttons">
          <button onclick="appendCalc('1','${did}')">1</button>
          <button onclick="appendCalc('2','${did}')">2</button>
          <button onclick="appendCalc('3','${did}')">3</button>
          <button class="calc-op" onclick="appendCalc('+','${did}')">+</button>
        </div>
        <div class="calc-buttons">
          <button onclick="appendCalc('0','${did}')" style="flex:2">0</button>
          <button onclick="appendCalc('.','${did}')">.</button>
          <button class="calc-eq" onclick="calculate('${did}')">=</button>
        </div>
      `;
      break;
    }

    /* ── Bloco de Notas ── */
    case 'Bloco de Notas':
      content.innerHTML = `
        <div style="display:flex;gap:6px;margin-bottom:6px;flex-wrap:wrap">
          <button onclick="noteSave('${cid}')" style="padding:3px 8px;font-size:12px;cursor:pointer">💾 Salvar</button>
          <button onclick="noteClear('${cid}')" style="padding:3px 8px;font-size:12px;cursor:pointer">🗑️ Limpar</button>
          <select onchange="noteFontSize(this,'${cid}')" style="font-size:12px">
            <option value="13">13px</option><option value="15">15px</option>
            <option value="18">18px</option><option value="22">22px</option>
          </select>
        </div>
        <textarea id="note-${winId}" style="width:100%;height:calc(100% - 36px);resize:none;padding:6px;font-size:13px;font-family:monospace;border:1px solid #ddd;border-radius:4px"></textarea>
      `;
      // Carrega rascunho salvo
      setTimeout(() => {
        const ta = document.getElementById('note-' + winId);
        if (ta) ta.value = localStorage.getItem('notepad-draft') || '';
      }, 0);
      break;

    /* ── Navegador ── */
    case 'Navegador': {
      const uid = 'br-' + winId;
      content.innerHTML = `
        <div class="browser-url-container">
          <input type="text" id="${uid}-url" placeholder="Digite uma URL...">
          <button onclick="loadPage('${uid}')">Ir</button>
        </div>
        <iframe id="${uid}-frame" class="browser-iframe" src="about:blank" sandbox="allow-scripts allow-same-origin allow-forms"></iframe>
      `;
      const urlInput = content.querySelector(`#${uid}-url`);
      urlInput.addEventListener('keydown', e => { if (e.key === 'Enter') loadPage(uid); });
      break;
    }

    /* ── Temas ── */
    case 'Temas': {
      let html = '<div class="theme-buttons">';
      for (const t in themes) html += `<button onclick="setTheme('${t}')">${t}</button>`;
      html += '</div>';
      content.innerHTML = html;
      break;
    }

    /* ── Loja ── */
    case 'Loja':
      content.innerHTML = `
        <div class="loja-container">
          <h3 style="font-size:16px">🛒 Loja de Aplicativos</h3>
          <p style="font-size:12px;color:#666">Dê duplo clique nos ícones para abrir apps.</p>
          <div style="display:flex;gap:20px;flex-wrap:wrap;justify-content:center">
            <div style="text-align:center">
              <img src="https://img.icons8.com/color/64/artificial-intelligence.png">
              <div style="font-size:13px;margin:4px 0">RPS Challenge</div>
              <button onclick="downloadAppCustom('RPS Challenge',this)">Baixar</button>
            </div>
            <div style="text-align:center">
              <img src="https://img.icons8.com/color/64/number.png">
              <div style="font-size:13px;margin:4px 0">Guess the Number</div>
              <button onclick="downloadAppCustom('Guess the Number',this)">Baixar</button>
            </div>
          </div>
          <hr style="width:100%;border-color:#eee">
          <p style="font-size:12px"><strong>Terminal:</strong> storephoto [URL] · storemusic [URL]</p>
        </div>
      `;
      break;

    /* ── Snake ── */
    case 'Snake':
      win.style.width  = '420px';
      win.style.height = '360px';
      content.style.padding = '6px';
      content.innerHTML = `
        <div style="text-align:center;font-size:12px;margin-bottom:4px;color:#555">Use as setas do teclado. Pontos: <span id="snake-score-${winId}">0</span></div>
        <canvas id="snakeCanvas-${winId}" class="snake" width="400" height="280"></canvas>
      `;
      break;

    /* ── Tic Tac Toe ── */
    case 'Tic Tac Toe':
      win.style.width  = '330px';
      win.style.height = '380px';
      content.innerHTML = `
        <div class="ttt-message" id="tttMsg-${winId}">Vez do ✖</div>
        <div class="ttt-board" id="tttBoard-${winId}">
          ${Array(9).fill(0).map((_,i) => `<div class="ttt-cell" data-index="${i}"></div>`).join('')}
        </div>
        <button class="ttt-restart" onclick="initTicTacToe('tttBoard-${winId}','tttMsg-${winId}')">Reiniciar</button>
      `;
      break;

    /* ── Relógio ── */
    case 'Relógio':
      win.style.width  = '300px';
      win.style.height = '180px';
      content.innerHTML = `
        <div id="clock-display">
          <div id="clock-time" id="clockTime-${winId}">--:--:--</div>
          <div id="clock-date"></div>
        </div>
      `;
      updateWindowClock(winId);
      break;

    /* ── Música ── */
    case 'Música':
      content.innerHTML = `
        <div id="music-player">
          <h4>🎵 Player de Música</h4>
          <audio id="audio-${winId}" controls style="width:100%;margin-bottom:8px">
            <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg">
          </audio>
          <div style="font-size:12px;color:#666;margin-bottom:6px">Músicas da biblioteca:</div>
          <ul id="music-list">
            <li onclick="playMusic(this,'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3','audio-${winId}')">🎵 SoundHelix Song 1</li>
            <li onclick="playMusic(this,'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3','audio-${winId}')">🎵 SoundHelix Song 2</li>
            <li onclick="playMusic(this,'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3','audio-${winId}')">🎵 SoundHelix Song 3</li>
          </ul>
        </div>
      `;
      break;

    /* ── Galeria ── */
    case 'Galeria':
      content.innerHTML = `
        <div id="gallery-container"></div>
        <p style="text-align:center;margin-top:8px;font-size:11px;color:#888">Use <strong>storephoto [URL]</strong> no Terminal</p>
      `;
      renderGallery();
      break;

    /* ── Calendário ── */
    case 'Calendário':
      content.innerHTML = `<div id="calendar-container"></div>`;
      initCalendar();
      break;

    /* ── Terminal ── */
    case 'Terminal': {
      content.style.padding = '0';
      content.innerHTML = `
        <div id="terminal-container">
          <div id="terminal-output"></div>
          <div id="terminal-input-line">
            <span id="terminal-prompt">user@simos:~$ </span>
            <input id="terminal-input" type="text" autocomplete="off" spellcheck="false">
          </div>
        </div>
      `;
      setTimeout(() => {
        const tc = document.getElementById('terminal-container');
        const ti = document.getElementById('terminal-input');
        if (tc && ti) {
          tc.addEventListener('click', () => ti.focus());
          initTerminal();
          ti.focus();
        }
      }, 0);
      break;
    }

    /* ── Chat ── */
    case 'Chat':
      content.innerHTML = `
        <div id="chat-container">
          <div id="chat-output">
            <div><strong style="color:#007acc">Sistema:</strong> Bem-vindo ao Chat! 💬</div>
          </div>
          <div id="chat-input-row">
            <input id="chat-input" type="text" placeholder="Digite sua mensagem...">
            <button id="chat-send" onclick="sendChat()">Enviar</button>
          </div>
        </div>
      `;
      setTimeout(() => initChat(), 0);
      break;

    /* ── Contatos ── */
    case 'Contatos':
      content.innerHTML = `
        <div style="padding:8px">
          <h3 style="margin-bottom:8px;font-size:15px">👥 Contatos</h3>
          <div id="contact-add-row">
            <input id="contact-input" type="text" placeholder="Novo contato...">
            <button onclick="addContact()">+ Adicionar</button>
          </div>
          <ul id="contacts-list"></ul>
        </div>
      `;
      renderContacts();
      break;

    /* ── Explorador de Arquivos ── */
    case 'Explorador de Arquivos':
      content.innerHTML = `
        <div id="file-explorer">
          <h3 style="margin-bottom:6px;font-size:14px">📁 Explorador de Arquivos</h3>
          <h4>Imagens</h4><ul id="file-images"></ul>
          <h4>Músicas</h4><ul id="file-music"></ul>
          <h4>Pastas</h4><ul id="file-folders"></ul>
        </div>
      `;
      initFileExplorer();
      break;

    /* ── Paint (novo!) ── */
    case 'Paint': {
      win.style.width  = '520px';
      win.style.height = '420px';
      content.style.padding = '0';
      content.innerHTML = `
        <div id="paint-toolbar">
          <label>Cor: <input type="color" id="paint-color-${winId}" value="#000000"></label>
          <label>Tamanho: <input type="range" id="paint-size-${winId}" min="1" max="30" value="4" style="width:70px"></label>
          <button onclick="paintClear('canvas-${winId}')">🗑️ Limpar</button>
          <button onclick="paintFill('canvas-${winId}','#ffffff')">⬜ Fundo Branco</button>
          <button onclick="paintFill('canvas-${winId}','#000000')">⬛ Fundo Preto</button>
          <button onclick="paintDownload('canvas-${winId}')">⬇ Salvar</button>
          <select id="paint-tool-${winId}">
            <option value="pen">✏️ Caneta</option>
            <option value="eraser">🧹 Borracha</option>
            <option value="line">📏 Linha</option>
          </select>
        </div>
        <canvas id="canvas-${winId}" id="paint-canvas" style="width:100%;height:calc(100% - 44px);display:block;cursor:crosshair;background:#fff"></canvas>
      `;
      setTimeout(() => initPaint(winId), 0);
      break;
    }

    /* ── Configurações (melhorada) ── */
    case 'Configurações':
      content.innerHTML = `
        <div id="config-container">
          <h3>⚙️ Configurações</h3>
          <label>Tema:
            <select onchange="setTheme(this.value)">
              ${Object.keys(themes).map(t => `<option value="${t}">${t}</option>`).join('')}
            </select>
          </label>
          <label style="margin-top:10px">Tamanho das janelas:
            <select onchange="setDefaultWindowSize(this.value)">
              <option value="small">Pequeno (360×280)</option>
              <option value="medium" selected>Médio (460×340)</option>
              <option value="large">Grande (600×450)</option>
            </select>
          </label>
          <label style="margin-top:10px">
            <input type="checkbox" id="cfg-anim" checked onchange="toggleAnimations(this.checked)"> Animações de ícones
          </label>
          <button onclick="resetDesktop()" style="margin-top:14px;padding:6px 14px;background:#e53935;color:#fff;border:none;border-radius:4px;cursor:pointer">🔄 Fechar todas as janelas</button>
        </div>
      `;
      break;

    /* ── Bloco de Tarefas ── */
    case 'Bloco de Tarefas':
      content.innerHTML = `
        <div id="tasks-container">
          <h3>✅ Minhas Tarefas</h3>
          <div id="task-row">
            <input type="text" id="new-task" placeholder="Nova tarefa...">
            <button onclick="addTask()" style="padding:6px 12px;background:var(--window-header-bg);color:#fff;border:none;border-radius:4px;cursor:pointer">+</button>
          </div>
          <ul id="tasks-list"></ul>
        </div>
      `;
      break;

    /* ── RPS Challenge ── */
    case 'RPS Challenge':
      content.innerHTML = `
        <div id="rps-game-container" style="padding:10px;text-align:center">
          <h3>✊✋✌️ RPS Challenge</h3>
          <p style="font-size:12px;color:#666;margin-bottom:8px">A IA aprende suas jogadas!</p>
          <div style="display:flex;gap:10px;justify-content:center;font-size:28px;margin-bottom:8px">
            <button onclick="playerMove('rock')"    style="font-size:28px;padding:8px 12px;cursor:pointer;border-radius:8px;border:1px solid #ccc">✊</button>
            <button onclick="playerMove('paper')"   style="font-size:28px;padding:8px 12px;cursor:pointer;border-radius:8px;border:1px solid #ccc">✋</button>
            <button onclick="playerMove('scissors')" style="font-size:28px;padding:8px 12px;cursor:pointer;border-radius:8px;border:1px solid #ccc">✌️</button>
          </div>
          <div id="game-result"  style="margin:8px 0;font-size:14px;min-height:36px"></div>
          <div id="game-score"   style="font-weight:bold">Score: Você 0 × IA 0</div>
          <div id="rps-stats"    style="font-size:12px;color:#888;margin-top:4px"></div>
          <button onclick="initRPSGame()" style="margin-top:10px;padding:5px 12px;font-size:12px;cursor:pointer;border-radius:4px;border:1px solid #ccc">Resetar</button>
        </div>
      `;
      initRPSGame();
      break;

    /* ── Guess the Number ── */
    case 'Guess the Number':
      content.innerHTML = `
        <div id="guess-game-container" style="padding:10px;text-align:center">
          <h3>🔢 Guess the Number</h3>
          <p style="font-size:13px;margin:8px 0">Pense em um número entre 1 e 100.<br>O computador vai adivinhar!</p>
          <button onclick="startGuessGame()" style="padding:7px 18px;background:var(--window-header-bg);color:#fff;border:none;border-radius:4px;cursor:pointer">Iniciar</button>
          <div id="guess-output" style="margin-top:10px;font-size:14px;min-height:30px"></div>
          <div id="guess-controls" style="margin-top:8px;display:none;gap:8px;justify-content:center;display:none">
            <button onclick="guessHigher()" style="padding:6px 14px;cursor:pointer;border-radius:4px;border:1px solid #ccc">⬆ Maior</button>
            <button onclick="guessLower()"  style="padding:6px 14px;cursor:pointer;border-radius:4px;border:1px solid #ccc">⬇ Menor</button>
            <button onclick="guessCorrect()" style="padding:6px 14px;background:#4caf50;color:#fff;cursor:pointer;border-radius:4px;border:none">✔ Acertou!</button>
          </div>
        </div>
      `;
      initGuessGame();
      break;

    /* ── Recursos ── */
    case 'Recursos':
      content.innerHTML = `<div id="resource-stats"><p>Carregando...</p></div>`;
      setInterval(updateResources, 1000);
      updateResources();
      break;

    default:
      content.innerHTML = `<div style="padding:20px;text-align:center;color:#888">🚧 Aplicativo em desenvolvimento...</div>`;
  }

  win.appendChild(content);
  document.getElementById('desktop').appendChild(win);
  makeDraggable(win, header);
  win.addEventListener('mousedown', () => { win.style.zIndex = zIndexCounter++; });

  // Inicia jogos após DOM estar pronto
  if (appName === 'Snake')       setTimeout(() => initSnakeGame(winId), 50);
  if (appName === 'Tic Tac Toe') setTimeout(() => initTicTacToe('tttBoard-' + winId, 'tttMsg-' + winId), 50);
}

/* ── Fechar / Minimizar / Maximizar ── */
function closeWindow(e, el) {
  e.stopPropagation();
  el.closest('.window').remove();
}
function minimizeWindow(e, el) {
  e.stopPropagation();
  const win = el.closest('.window');
  const content = win.querySelector('.window-content');
  if (content.style.display === 'none') {
    content.style.display = '';
    win.style.height = '';
  } else {
    content.style.display = 'none';
    win.style.height = '32px';
  }
}
let maximizedWin = null;
function maximizeWindow(e, el) {
  e.stopPropagation();
  const win = el.closest('.window');
  if (win._maximized) {
    win.style.top    = win._prevTop;
    win.style.left   = win._prevLeft;
    win.style.width  = win._prevWidth;
    win.style.height = win._prevHeight;
    win._maximized = false;
  } else {
    win._prevTop    = win.style.top;
    win._prevLeft   = win.style.left;
    win._prevWidth  = win.style.width;
    win._prevHeight = win.style.height;
    win.style.top    = '0';
    win.style.left   = '0';
    win.style.width  = '100vw';
    win.style.height = 'calc(100vh - 40px)';
    win._maximized = true;
  }
}

/* ── Draggable ── */
function makeDraggable(win, header) {
  let ox = 0, oy = 0, dragging = false;
  header.addEventListener('mousedown', function(e) {
    if (e.target.classList.contains('close-btn') ||
        e.target.classList.contains('min-btn') ||
        e.target.classList.contains('max-btn')) return;
    dragging = true;
    ox = e.clientX - win.offsetLeft;
    oy = e.clientY - win.offsetTop;
    win.style.zIndex = zIndexCounter++;
    e.preventDefault();
  });
  document.addEventListener('mousemove', function(e) {
    if (!dragging) return;
    win.style.left = (e.clientX - ox) + 'px';
    win.style.top  = Math.max(0, e.clientY - oy) + 'px';
  });
  document.addEventListener('mouseup', () => { dragging = false; });
}

/* ── Calculadora ── */
function appendCalc(v, id) {
  const d = document.getElementById(id);
  if (!d) return;
  if (d.value === 'Erro') d.value = '';
  d.value += v;
}
function calculate(id) {
  const d = document.getElementById(id);
  if (!d) return;
  try { d.value = Function('"use strict"; return (' + d.value + ')')(); }
  catch(e) { d.value = 'Erro'; }
}
function clearCalc(id) {
  const d = document.getElementById(id);
  if (d) d.value = '';
}

/* ── Bloco de Notas ── */
function noteSave(cid) {
  const ta = document.querySelector('#' + cid + ' textarea');
  if (ta) { localStorage.setItem('notepad-draft', ta.value); alert('Salvo!'); }
}
function noteClear(cid) {
  const ta = document.querySelector('#' + cid + ' textarea');
  if (ta) ta.value = '';
}
function noteFontSize(sel, cid) {
  const ta = document.querySelector('#' + cid + ' textarea');
  if (ta) ta.style.fontSize = sel.value + 'px';
}

/* ── Navegador ── */
function loadPage(uid) {
  const urlEl   = document.getElementById(uid + '-url');
  const frameEl = document.getElementById(uid + '-frame');
  if (!urlEl || !frameEl) return;
  let url = urlEl.value.trim();
  if (!url) return;
  if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
  frameEl.src = url;
}

/* ── Tema ── */
function setTheme(name) {
  const t = themes[name];
  if (!t) return;
  document.documentElement.style.setProperty('--desktop-bg', t.desktopBg);
  document.documentElement.style.setProperty('--desktop-bg-size', t.desktopBgSize);
  document.documentElement.style.setProperty('--window-header-bg', t.windowHeaderBg);
  document.documentElement.style.setProperty('--window-header-text', t.windowHeaderText);
  document.documentElement.style.setProperty('--body-bg', t.bodyBg);
  document.documentElement.style.setProperty('--download-progress-bg', t.windowHeaderBg);
}

/* ── Loja / Download ── */
function downloadAppCustom(appName, btn) {
  // BUG FIX: usava querySelector('.window-content') que pegava janela errada
  const storeContent = btn.closest('.window-content');
  const overlay = document.createElement('div');
  overlay.classList.add('download-overlay');
  const fileSize = appName === 'RPS Challenge' ? 3*1024*1024 : 2*1024*1024;
  overlay.innerHTML = `
    <div style="font-size:15px;margin-bottom:10px">⬇ Baixando ${appName}...</div>
    <div class="progress-bar"><div class="progress-fill" id="dl-fill"></div></div>
    <div id="dl-info" style="margin-top:8px;font-size:13px"></div>
  `;
  storeContent.appendChild(overlay);
  let downloaded = 0;
  const fill = overlay.querySelector('#dl-fill');
  const info = overlay.querySelector('#dl-info');
  const iv = setInterval(() => {
    downloaded += 150*1024;
    if (downloaded > fileSize) downloaded = fileSize;
    const pct = (downloaded/fileSize*100).toFixed(1);
    fill.style.width = pct + '%';
    info.textContent = formatBytes(downloaded) + ' / ' + formatBytes(fileSize) + ' (' + pct + '%)';
    if (downloaded >= fileSize) {
      clearInterval(iv);
      overlay.innerHTML = `<div style="font-size:16px">✅ ${appName} instalado!</div>`;
      setTimeout(() => {
        overlay.remove();
        if (appName === 'RPS Challenge')    document.getElementById('mlAssistenteIcon').style.display = 'block';
        if (appName === 'Guess the Number') document.getElementById('guessNumberIcon').style.display = 'block';
      }, 1500);
    }
  }, 150);
}

/* ── Snake (corrigido: ID único por janela, sem vazamento de intervalo) ── */
function initSnakeGame(winId) {
  const canvas = document.getElementById('snakeCanvas-' + winId);
  const scoreEl = document.getElementById('snake-score-' + winId);
  if (!canvas) return;
  canvas.width  = canvas.parentElement.clientWidth  - 12 || 400;
  canvas.height = canvas.parentElement.clientHeight - 40 || 280;
  const ctx = canvas.getContext('2d');
  const box = 20;
  const cols = Math.floor(canvas.width  / box);
  const rows = Math.floor(canvas.height / box);
  let snake = [{ x: Math.floor(cols/2)*box, y: Math.floor(rows/2)*box }];
  let food  = randomFood();
  let score = 0, d = 'RIGHT', gameOver = false;

  function randomFood() {
    return { x: Math.floor(Math.random()*cols)*box, y: Math.floor(Math.random()*rows)*box };
  }

  const keyHandler = function(e) {
    if ([37,38,39,40].includes(e.keyCode)) e.preventDefault();
    if (e.keyCode===37 && d!=='RIGHT') d='LEFT';
    else if (e.keyCode===38 && d!=='DOWN')  d='UP';
    else if (e.keyCode===39 && d!=='LEFT')  d='RIGHT';
    else if (e.keyCode===40 && d!=='UP')    d='DOWN';
  };
  document.addEventListener('keydown', keyHandler);

  // Para intervalo se a janela for removida
  const observer = new MutationObserver(() => {
    if (!document.contains(canvas)) {
      clearInterval(giv);
      document.removeEventListener('keydown', keyHandler);
      observer.disconnect();
    }
  });
  observer.observe(document.getElementById('desktop'), { childList: true, subtree: true });

  function draw() {
    if (gameOver) return;
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Comida
    ctx.fillStyle = '#ff4444';
    ctx.beginPath();
    ctx.arc(food.x+box/2, food.y+box/2, box/2-1, 0, Math.PI*2);
    ctx.fill();
    // Cobra
    snake.forEach((seg, i) => {
      ctx.fillStyle = i===0 ? '#39ff14' : '#00cc00';
      ctx.fillRect(seg.x+1, seg.y+1, box-2, box-2);
    });
    // Score no canvas
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '12px monospace';
    ctx.fillText('Score: ' + score, 5, 14);
    // Mover
    let nx = snake[0].x, ny = snake[0].y;
    if (d==='LEFT')  nx -= box;
    if (d==='RIGHT') nx += box;
    if (d==='UP')    ny -= box;
    if (d==='DOWN')  ny += box;
    if (nx<0||nx>=canvas.width||ny<0||ny>=canvas.height||snake.some(s=>s.x===nx&&s.y===ny)) {
      gameOver = true;
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle = '#fff';
      ctx.font = '20px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over! Score: '+score, canvas.width/2, canvas.height/2);
      return;
    }
    const newHead = { x: nx, y: ny };
    if (nx===food.x && ny===food.y) { score++; food = randomFood(); if (scoreEl) scoreEl.textContent = score; }
    else snake.pop();
    snake.unshift(newHead);
  }
  const giv = setInterval(draw, 100);
}

/* ── Tic Tac Toe (corrigido: IDs únicos) ── */
function initTicTacToe(boardId, msgId) {
  const board = document.getElementById(boardId);
  const msg   = document.getElementById(msgId);
  if (!board || !msg) return;
  const cells = board.querySelectorAll('.ttt-cell');
  let turn = 'X', over = false;
  msg.textContent = 'Vez do ✖';
  cells.forEach(c => {
    c.textContent = '';
    c.style.background = '#eee';
    c.onclick = function() {
      if (over || c.textContent) return;
      c.textContent = turn === 'X' ? '✖' : '⭕';
      c.style.color = turn === 'X' ? '#e53935' : '#1e88e5';
      if (checkWin(turn)) {
        msg.textContent = (turn==='X'?'✖':'⭕') + ' Venceu! 🎉';
        over = true; return;
      }
      if ([...cells].every(c => c.textContent)) {
        msg.textContent = 'Empate! 🤝'; over = true; return;
      }
      turn = turn === 'X' ? 'O' : 'X';
      msg.textContent = 'Vez do ' + (turn==='X'?'✖':'⭕');
    };
  });
  function checkWin(p) {
    const sym = p==='X'?'✖':'⭕';
    return [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
      .some(combo => combo.every(i => cells[i].textContent === sym));
  }
}

/* ── Relógio por janela (corrigido: cada janela tem seu próprio timer) ── */
function updateWindowClock(winId) {
  const timeEl = document.getElementById('clock-time');
  const dateEl = document.getElementById('clock-date');
  // Procura dentro da janela correta
  const wins = document.querySelectorAll('.window');
  let found = false;
  wins.forEach(w => {
    const t = w.querySelector('#clock-time');
    const d2 = w.querySelector('#clock-date');
    if (t) {
      found = true;
      const now = new Date();
      t.textContent = now.toLocaleTimeString('pt-BR');
      if (d2) d2.textContent = now.toLocaleDateString('pt-BR', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
    }
  });
  if (found) setTimeout(() => updateWindowClock(winId), 1000);
}

/* ── Música ── */
function playMusic(li, url, audioId) {
  document.querySelectorAll('#music-list li').forEach(l => l.classList.remove('playing'));
  li.classList.add('playing');
  const audio = document.getElementById(audioId);
  if (audio) { audio.src = url; audio.play(); }
}

/* ── Galeria ── */
function renderGallery() {
  const c = document.getElementById('gallery-container');
  if (!c) return;
  if (!photoGallery.length) { c.innerHTML = '<p style="color:#888;text-align:center;padding:20px">Nenhuma foto.</p>'; return; }
  c.innerHTML = '';
  photoGallery.forEach(url => {
    const img = document.createElement('img');
    img.src = url;
    img.onclick = () => window.open(url, '_blank');
    c.appendChild(img);
  });
}

/* ── Calendário ── */
let calYear, calMonth;
function initCalendar() {
  const now = new Date();
  calYear  = now.getFullYear();
  calMonth = now.getMonth();
  renderCalendar();
}
function renderCalendar() {
  const c = document.getElementById('calendar-container');
  if (!c) return;
  const now = new Date();
  const months = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const days   = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  const first  = new Date(calYear, calMonth, 1).getDay();
  const total  = new Date(calYear, calMonth+1, 0).getDate();
  let html = `
    <div class="cal-nav">
      <button onclick="calPrev()">◀</button>
      <strong>${months[calMonth]} ${calYear}</strong>
      <button onclick="calNext()">▶</button>
    </div>
    <table><thead><tr>${days.map(d=>`<th>${d}</th>`).join('')}</tr></thead><tbody><tr>`;
  for (let i=0;i<first;i++) html += '<td></td>';
  for (let d=1;d<=total;d++) {
    const isToday = d===now.getDate() && calMonth===now.getMonth() && calYear===now.getFullYear();
    html += `<td${isToday?' class="today"':''}>${d}</td>`;
    if ((first+d)%7===0 && d<total) html += '</tr><tr>';
  }
  html += '</tr></tbody></table>';
  c.innerHTML = html;
}
function calPrev() { calMonth--; if(calMonth<0){calMonth=11;calYear--;} renderCalendar(); }
function calNext() { calMonth++; if(calMonth>11){calMonth=0;calYear++;} renderCalendar(); }

/* ── Explorador de Arquivos ── */
function initFileExplorer() {
  const imgs   = document.getElementById('file-images');
  const music  = document.getElementById('file-music');
  const folders = document.getElementById('file-folders');
  if (imgs) {
    imgs.innerHTML = photoGallery.length
      ? photoGallery.map((u,i)=>`<li>🖼 Imagem ${i+1}: <a href="${u}" target="_blank">Abrir</a></li>`).join('')
      : '<li style="color:#888">Nenhuma imagem.</li>';
  }
  if (music) {
    music.innerHTML = musicLibrary.length
      ? musicLibrary.map((u,i)=>`<li>🎵 Música ${i+1}: <a href="${u}" target="_blank">Ouvir</a></li>`).join('')
      : '<li style="color:#888">Nenhuma música.</li>';
  }
  if (folders) {
    folders.innerHTML = Object.keys(virtualFolders).map(f =>
      `<li onclick="openFolder('${f}')" style="cursor:pointer">📁 ${f} (${virtualFolders[f].length} arquivo(s))</li>`
    ).join('');
  }
}
function openFolder(name) {
  const win = document.createElement('div');
  win.classList.add('window');
  win.style.cssText = 'top:110px;left:110px;z-index:' + (zIndexCounter++);
  const header = document.createElement('div');
  header.classList.add('window-header');
  header.innerHTML = `<span class="close-btn" onclick="closeWindow(event,this)">✕</span><span class="win-title">📁 ${name}</span>`;
  win.appendChild(header);
  const content = document.createElement('div');
  content.classList.add('window-content');
  const files = virtualFolders[name] || [];
  content.innerHTML = files.length
    ? '<ul>' + files.map((f,i)=>`<li>Arquivo ${i+1}: <a href="${f}" target="_blank">Abrir</a></li>`).join('') + '</ul>'
    : '<p style="color:#888">Pasta vazia.</p>';
  win.appendChild(content);
  document.getElementById('desktop').appendChild(win);
  makeDraggable(win, header);
}

/* ── Contatos ── */
function renderContacts() {
  const list = document.getElementById('contacts-list');
  if (!list) return;
  list.innerHTML = contacts.map((c,i) => `
    <li>
      <div class="contact-avatar">${c.name[0].toUpperCase()}</div>
      ${c.name}
      <button onclick="removeContact(${i})" style="margin-left:auto;background:#ff5f57;color:#fff;border:none;border-radius:50%;width:20px;height:20px;cursor:pointer;font-size:11px">✕</button>
    </li>
  `).join('');
}
function addContact() {
  const inp = document.getElementById('contact-input');
  if (!inp || !inp.value.trim()) return;
  contacts.push({ name: inp.value.trim() });
  inp.value = '';
  renderContacts();
}
function removeContact(i) {
  contacts.splice(i, 1);
  renderContacts();
}

/* ── Chat (melhorado com respostas variadas) ── */
const chatReplies = [
  'Interessante! Conte mais. 🤔', 'Entendido! 👍', 'Haha, adorei! 😄',
  'Isso é fascinante!', 'Hmm, deixa eu pensar... 🤔', 'Com certeza! ✅',
  'Não tenho certeza sobre isso... 😅', 'Boa pergunta!', 'Que legal! 🎉',
  'Pode repetir? Não entendi bem.', 'Concordo plenamente!', 'Nossa, sério?! 😮'
];
function initChat() {
  const input = document.getElementById('chat-input');
  const send  = document.getElementById('chat-send');
  if (!input) return;
  input.addEventListener('keydown', e => { if (e.key==='Enter') sendChat(); });
}
function sendChat() {
  const input  = document.getElementById('chat-input');
  const output = document.getElementById('chat-output');
  if (!input || !output) return;
  const msg = input.value.trim();
  if (!msg) return;
  output.innerHTML += `<div><strong style="color:#007acc">Você:</strong> ${msg}</div>`;
  input.value = '';
  output.scrollTop = output.scrollHeight;
  setTimeout(() => {
    const reply = chatReplies[Math.floor(Math.random()*chatReplies.length)];
    output.innerHTML += `<div><strong style="color:#e53935">Bot:</strong> ${reply}</div>`;
    output.scrollTop = output.scrollHeight;
  }, 600 + Math.random()*800);
}

/* ── Terminal ── */
function initTerminal() {
  const termOutput = document.getElementById('terminal-output');
  const termInput  = document.getElementById('terminal-input');
  if (!termInput || !termOutput) return;
  termOutput.innerHTML = '<div style="color:#0a0">SimOS 4.0 Terminal — digite <strong>help</strong> para ver os comandos.</div>';
  let history = [], histIdx = -1;

  const cmds = {
    help: () => 'Comandos: help, date, time, clear, echo, ls, cd, pwd, mkdir, storephoto, storemusic, showphotos, showmusic, listapps, openapp, fortune, joke, randomfact, weather, ping, speak, color, ver, about, love, history, exit',
    date: () => new Date().toLocaleDateString('pt-BR', {weekday:'long',year:'numeric',month:'long',day:'numeric'}),
    time: () => new Date().toLocaleTimeString('pt-BR'),
    clear: () => { termOutput.innerHTML = ''; return ''; },
    echo: args => args.join(' ') || '(nada)',
    ls: () => '<span style="color:#6af">documentos/</span>  <span style="color:#6af">downloads/</span>  <span style="color:#6af">fotos/</span>  <span style="color:#6af">musicas/</span>  README.txt',
    cd: args => args[0] ? `Diretório alterado para /${args[0]}` : 'Uso: cd [pasta]',
    pwd: () => '/home/usuario',
    mkdir: args => {
      if (!args[0]) return 'Uso: mkdir [nome]';
      const n = args.join(' ');
      if (virtualFolders[n]) return `Pasta "${n}" já existe.`;
      virtualFolders[n] = [];
      return `<span style="color:#0f0">✔ Pasta "${n}" criada.</span>`;
    },
    storephoto: args => {
      if (!args[0]) return 'Uso: storephoto [URL]';
      photoGallery.push(args[0]);
      renderGallery();
      return '<span style="color:#0f0">✔ Foto armazenada!</span>';
    },
    storemusic: args => {
      if (!args[0]) return 'Uso: storemusic [URL]';
      musicLibrary.push(args[0]);
      return '<span style="color:#0f0">✔ Música armazenada!</span>';
    },
    showphotos: () => { renderGallery(); return 'Galeria atualizada.'; },
    showmusic:  () => musicLibrary.length ? musicLibrary.map((u,i)=>`${i+1}. ${u}`).join('<br>') : 'Nenhuma música.',
    listapps:   () => Array.from(document.querySelectorAll('#iconsContainer .icon div')).map(d=>d.textContent).join(', '),
    openapp: args => {
      if (!args.length) return 'Uso: openapp [nome]';
      openWindow(args.join(' '));
      return 'Abrindo...';
    },
    fortune: () => ['A vida é bela!','Sorria, o universo sorri com você!','Grandes coisas estão por vir.','Você é uma estrela! ⭐','O melhor ainda está por vir.'][Math.floor(Math.random()*5)],
    joke: () => ['Por que o PC foi ao médico? Tinha vírus!','Por que o dev não gosta de floresta? Muitos bugs!','Qual o cúmulo da paciência? Esperar o JS carregar.','O que o código disse ao bug? "Vou te consertar!"'][Math.floor(Math.random()*4)],
    randomfact: () => ['O coração de baleia azul é do tamanho de um carro.','As abelhas reconhecem rostos humanos.','O maior deserto é a Antártida.','O bambu cresce 91cm por dia.'][Math.floor(Math.random()*4)],
    weather: () => `☀ Sol, 25°C — Sem previsão de chuva. (simulação)`,
    ping: () => 'Pong! 🏓',
    speak: args => {
      const txt = args.join(' ');
      if (!txt) return 'Uso: speak [texto]';
      if ('speechSynthesis' in window) { speechSynthesis.speak(new SpeechSynthesisUtterance(txt)); return 'Falando: ' + txt; }
      return 'Síntese de voz não suportada.';
    },
    color: args => {
      const c = args[0] || '#0f0';
      termOutput.style.color = c;
      document.getElementById('terminal-input').style.color = c;
      document.getElementById('terminal-prompt').style.color = c;
      return `Cor alterada para ${c}`;
    },
    ver:   () => 'SimOS 4.0',
    about: () => 'SimOS 4.0 — Sistema Operacional Simulado. Feito com 💚',
    love:  () => 'Você é incrível! ❤️ Nunca esqueça disso!',
    history: () => history.length ? history.join('<br>') : '(histórico vazio)',
    exit: () => { termInput.disabled = true; return 'Terminal encerrado.'; }
  };

  termInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      const raw = termInput.value.trim();
      if (!raw) return;
      termOutput.innerHTML += `<div><span style="color:#6af">user@simos:~$</span> ${raw}</div>`;
      history.push(raw); histIdx = history.length;
      const parts = raw.split(' ');
      const cmd = parts[0].toLowerCase();
      const args = parts.slice(1);
      let result = cmds.hasOwnProperty(cmd)
        ? (typeof cmds[cmd]==='function' ? cmds[cmd](args) : cmds[cmd])
        : `<span style="color:#f44">Comando não encontrado: ${cmd}. Digite 'help'.</span>`;
      if (result) termOutput.innerHTML += `<div>${result}</div>`;
      termInput.value = '';
      termOutput.scrollTop = termOutput.scrollHeight;
    } else if (e.key === 'ArrowUp') {
      if (histIdx > 0) { histIdx--; termInput.value = history[histIdx]; }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      histIdx < history.length-1 ? (histIdx++, termInput.value = history[histIdx]) : (histIdx=history.length, termInput.value='');
      e.preventDefault();
    }
  });
}

/* ── Paint (novo!) ── */
function initPaint(winId) {
  const canvas = document.getElementById('canvas-' + winId);
  if (!canvas) return;
  // Ajusta tamanho ao container
  const resize = () => {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width  = rect.width;
    canvas.height = rect.height - 44;
  };
  resize();
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  let painting = false, lastX=0, lastY=0, startX=0, startY=0, snapshot;

  function getColor() { return document.getElementById('paint-color-'+winId)?.value || '#000'; }
  function getSize()  { return document.getElementById('paint-size-'+winId)?.value  || 4; }
  function getTool()  { return document.getElementById('paint-tool-'+winId)?.value  || 'pen'; }

  canvas.addEventListener('mousedown', e => {
    painting = true;
    const r = canvas.getBoundingClientRect();
    startX = e.clientX - r.left; startY = e.clientY - r.top;
    lastX = startX; lastY = startY;
    if (getTool()==='line') snapshot = ctx.getImageData(0,0,canvas.width,canvas.height);
  });
  canvas.addEventListener('mousemove', e => {
    if (!painting) return;
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const tool = getTool();
    ctx.lineWidth   = getSize();
    ctx.lineCap     = 'round';
    if (tool==='eraser') {
      ctx.strokeStyle = '#ffffff';
      ctx.beginPath(); ctx.moveTo(lastX,lastY); ctx.lineTo(x,y); ctx.stroke();
    } else if (tool==='pen') {
      ctx.strokeStyle = getColor();
      ctx.beginPath(); ctx.moveTo(lastX,lastY); ctx.lineTo(x,y); ctx.stroke();
    } else if (tool==='line') {
      ctx.putImageData(snapshot,0,0);
      ctx.strokeStyle = getColor();
      ctx.beginPath(); ctx.moveTo(startX,startY); ctx.lineTo(x,y); ctx.stroke();
    }
    lastX=x; lastY=y;
  });
  canvas.addEventListener('mouseup',   () => { painting=false; });
  canvas.addEventListener('mouseleave',() => { painting=false; });
}
function paintClear(id) {
  const c = document.getElementById(id); if(!c)return;
  c.getContext('2d').clearRect(0,0,c.width,c.height);
  c.getContext('2d').fillStyle='#fff'; c.getContext('2d').fillRect(0,0,c.width,c.height);
}
function paintFill(id,color) {
  const c = document.getElementById(id); if(!c)return;
  c.getContext('2d').fillStyle=color; c.getContext('2d').fillRect(0,0,c.width,c.height);
}
function paintDownload(id) {
  const c = document.getElementById(id); if(!c)return;
  const a = document.createElement('a'); a.download='desenho.png'; a.href=c.toDataURL(); a.click();
}

/* ── Bloco de Tarefas ── */
function addTask() {
  const inp  = document.getElementById('new-task');
  const list = document.getElementById('tasks-list');
  const txt  = inp?.value.trim();
  if (!txt) return;
  const li = document.createElement('li');
  const cb = document.createElement('input');
  cb.type = 'checkbox';
  cb.onchange = () => li.classList.toggle('done', cb.checked);
  const span = document.createElement('span');
  span.textContent = txt;
  const del = document.createElement('button');
  del.textContent = '✕'; del.className = 'task-del-btn';
  del.onclick = () => li.remove();
  li.appendChild(cb); li.appendChild(span); li.appendChild(del);
  list.appendChild(li);
  inp.value = '';
  inp.focus();
}
document.addEventListener('keydown', e => {
  if (e.key==='Enter' && document.activeElement?.id==='new-task') addTask();
});

/* ── RPS Challenge ── */
let rpsPlayer=0, rpsAI=0, rpsMoves={rock:0,paper:0,scissors:0};
function initRPSGame() {
  rpsPlayer=0; rpsAI=0; rpsMoves={rock:0,paper:0,scissors:0};
  const r=document.getElementById('game-result'); if(r) r.innerHTML='';
  const s=document.getElementById('game-score');  if(s) s.textContent='Score: Você 0 × IA 0';
  const st=document.getElementById('rps-stats');  if(st) st.textContent='';
}
function playerMove(move) {
  rpsMoves[move]++;
  let predicted=move, max=0;
  for(const m in rpsMoves) if(rpsMoves[m]>max){max=rpsMoves[m];predicted=m;}
  const counter = {rock:'paper',paper:'scissors',scissors:'rock'};
  const aiMove  = counter[predicted] || ['rock','paper','scissors'][Math.floor(Math.random()*3)];
  const emojis  = {rock:'✊',paper:'✋',scissors:'✌️'};
  let result='', color='#666';
  if (move===aiMove) { result='Empate! 🤝'; }
  else if (counter[move]!==aiMove) { result='Você venceu! 🎉'; rpsPlayer++; color='#2e7d32'; }
  else { result='IA venceu! 🤖'; rpsAI++; color='#c62828'; }
  const r=document.getElementById('game-result');
  if(r) r.innerHTML=`${emojis[move]} vs ${emojis[aiMove]} — <span style="color:${color};font-weight:bold">${result}</span>`;
  const s=document.getElementById('game-score');
  if(s) s.textContent=`Score: Você ${rpsPlayer} × IA ${rpsAI}`;
  const st=document.getElementById('rps-stats');
  if(st) st.textContent=`✊${rpsMoves.rock} ✋${rpsMoves.paper} ✌️${rpsMoves.scissors}`;
}

/* ── Guess the Number ── */
let gLow=1, gHigh=100, gCur=0, gTries=0;
function initGuessGame() { gLow=1; gHigh=100; gCur=0; gTries=0; const o=document.getElementById('guess-output'); if(o)o.innerHTML=''; const c=document.getElementById('guess-controls'); if(c)c.style.display='none'; }
function startGuessGame() {
  gTries=1; gCur=Math.floor((gLow+gHigh)/2);
  const o=document.getElementById('guess-output'); if(o) o.innerHTML=`<strong>Tentativa ${gTries}:</strong> O número é <big><strong>${gCur}</strong></big>?`;
  const c=document.getElementById('guess-controls'); if(c) c.style.display='flex';
}
function guessHigher()  { gTries++; gLow=gCur+1;  gCur=Math.floor((gLow+gHigh)/2); _updateGuess(); }
function guessLower()   { gTries++; gHigh=gCur-1; gCur=Math.floor((gLow+gHigh)/2); _updateGuess(); }
function _updateGuess() { const o=document.getElementById('guess-output'); if(o) o.innerHTML=`<strong>Tentativa ${gTries}:</strong> O número é <big><strong>${gCur}</strong></big>?`; }
function guessCorrect() {
  const o=document.getElementById('guess-output'); if(o) o.innerHTML+=`<br><span style="color:green">✔ Acertei em ${gTries} tentativa(s)!</span>`;
  const c=document.getElementById('guess-controls'); if(c) c.style.display='none';
}

/* ── Recursos ── */
function updateResources() {
  const el = document.getElementById('resource-stats');
  if (!el) return;
  let html = '';
  html += `<p>🕐 Hora: ${new Date().toLocaleTimeString('pt-BR')}</p>`;
  if (performance.memory) {
    const used=performance.memory.usedJSHeapSize, total=performance.memory.totalJSHeapSize;
    html += `<p>💾 Memória JS: ${formatBytes(used)} / ${formatBytes(total)}</p>`;
  } else { html += `<p>💾 Memória: indisponível</p>`; }
  html += `<p>🔲 Núcleos: ${navigator.hardwareConcurrency || '?'}</p>`;
  html += `<p>🌐 Plataforma: ${navigator.platform}</p>`;
  html += `<p>📐 Tela: ${screen.width}×${screen.height}</p>`;
  html += `<p>🗂 Janelas abertas: ${document.querySelectorAll('.window').length}</p>`;
  el.innerHTML = html;
}
function formatBytes(b) {
  if (b<1024) return b+' B';
  if (b<1048576) return (b/1024).toFixed(1)+' KB';
  if (b<1073741824) return (b/1048576).toFixed(1)+' MB';
  return (b/1073741824).toFixed(2)+' GB';
}

/* ── Configurações ── */
function setDefaultWindowSize(size) {
  const sizes = { small:'360px 280px', medium:'460px 340px', large:'600px 450px' };
  if (!sizes[size]) return;
  const [w,h] = sizes[size].split(' ');
  document.querySelectorAll('.window').forEach(win => { win.style.width=w; win.style.height=h; });
}
function toggleAnimations(on) {
  document.querySelectorAll('.icon').forEach(ic => {
    ic.style.transition = on ? 'background 0.15s, transform 0.1s' : 'none';
  });
}
function resetDesktop() {
  if (confirm('Fechar todas as janelas?')) document.querySelectorAll('.window').forEach(w=>w.remove());
}

/* ── Adicionar ícone ao desktop ── */
function addDesktopIcon(appName, iconUrl, displayName) {
  const c = document.getElementById('iconsContainer');
  const d = document.createElement('div');
  d.classList.add('icon');
  d.ondblclick = () => openWindow(appName);
  d.innerHTML = `<img src="${iconUrl}" alt="${displayName}"><div>${displayName}</div>`;
  c.appendChild(d);
}
