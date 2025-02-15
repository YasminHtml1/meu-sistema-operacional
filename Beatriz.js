let zIndexCounter = 1;
// Armazenamento global para arquivos
let photoGallery = [];
let musicLibrary = [];
// Pastas virtuais para o explorador
let virtualFolders = {
  "imagens": photoGallery,
  "musicas": musicLibrary
};

/* Variáveis para modelos de ML (mantidas para outros usos) */
let sentimentModel = null;
let mlFeedback = [];
let imageClassifier = null;

/* Temas disponíveis (novos temas adicionados) */
const themes = {
  "Padrão": {
    desktopBg: "url('https://picsum.photos/3840/2160?blur=2')",
    desktopBgSize: "cover",
    windowHeaderBg: "#007acc",
    windowHeaderText: "#fff",
    bodyBg: "#008080"
  },
  "Dark": {
    desktopBg: "#333",
    desktopBgSize: "cover",
    windowHeaderBg: "#555",
    windowHeaderText: "#fff",
    bodyBg: "#222"
  },
  "Frutiger Aero Pink": {
    desktopBg: "linear-gradient(135deg, #ff99cc, #ff66b2)",
    desktopBgSize: "cover",
    windowHeaderBg: "#ff66b2",
    windowHeaderText: "#fff",
    bodyBg: "#ffccdd"
  },
  "Light": {
    desktopBg: "#f0f0f0",
    desktopBgSize: "cover",
    windowHeaderBg: "#ccc",
    windowHeaderText: "#000",
    bodyBg: "#fff"
  },
  "Nature": {
    desktopBg: "url('https://i.imgur.com/DPa2LKo.jpg')",
    desktopBgSize: "cover",
    windowHeaderBg: "#4CAF50",
    windowHeaderText: "#fff",
    bodyBg: "#A5D6A7"
  },
  "Neon": {
    desktopBg: "#000",
    desktopBgSize: "cover",
    windowHeaderBg: "#39ff14",
    windowHeaderText: "#000",
    bodyBg: "#111"
  },
  "Ocean": {
    desktopBg: "url('https://picsum.photos/3840/2160?water')",
    desktopBgSize: "cover",
    windowHeaderBg: "#0077be",
    windowHeaderText: "#fff",
    bodyBg: "#e0f7fa"
  },
  "Vintage": {
    desktopBg: "url('https://picsum.photos/3840/2160?grayscale')",
    desktopBgSize: "cover",
    windowHeaderBg: "#8b4513",
    windowHeaderText: "#fff",
    bodyBg: "#f5deb3"
  }
};

/* Função para abrir janelas de aplicativos */
function openWindow(appName) {
  const win = document.createElement('div');
  win.classList.add('window');
  win.style.top = '50px';
  win.style.left = '50px';
  win.style.zIndex = zIndexCounter++;

  const header = document.createElement('div');
  header.classList.add('window-header');
  header.innerHTML = `${appName} <span class="close-btn" onclick="closeWindow(event, this)">X</span>`;
  win.appendChild(header);

  const content = document.createElement('div');
  content.classList.add('window-content');

  switch(appName) {
    case 'Calculadora':
      content.innerHTML = `
        <input type="text" id="calc-display-${zIndexCounter}" class="calc-input" readonly>
        <div class="calc-buttons">
          <button onclick="appendCalc('7', 'calc-display-${zIndexCounter}')">7</button>
          <button onclick="appendCalc('8', 'calc-display-${zIndexCounter}')">8</button>
          <button onclick="appendCalc('9', 'calc-display-${zIndexCounter}')">9</button>
          <button onclick="appendCalc('+', 'calc-display-${zIndexCounter}')">+</button>
        </div>
        <div class="calc-buttons">
          <button onclick="appendCalc('4', 'calc-display-${zIndexCounter}')">4</button>
          <button onclick="appendCalc('5', 'calc-display-${zIndexCounter}')">5</button>
          <button onclick="appendCalc('6', 'calc-display-${zIndexCounter}')">6</button>
          <button onclick="appendCalc('-', 'calc-display-${zIndexCounter}')">-</button>
        </div>
        <div class="calc-buttons">
          <button onclick="appendCalc('1', 'calc-display-${zIndexCounter}')">1</button>
          <button onclick="appendCalc('2', 'calc-display-${zIndexCounter}')">2</button>
          <button onclick="appendCalc('3', 'calc-display-${zIndexCounter}')">3</button>
          <button onclick="appendCalc('*', 'calc-display-${zIndexCounter}')">*</button>
        </div>
        <div class="calc-buttons">
          <button onclick="appendCalc('0', 'calc-display-${zIndexCounter}')">0</button>
          <button onclick="appendCalc('.', 'calc-display-${zIndexCounter}')">.</button>
          <button onclick="calculate('calc-display-${zIndexCounter}')">=</button>
          <button onclick="appendCalc('/', 'calc-display-${zIndexCounter}')">/</button>
        </div>
        <button onclick="clearCalc('calc-display-${zIndexCounter}')" style="margin-top: 5px; width: 100%;">C</button>
      `;
      break;
    case 'Bloco de Notas':
      content.innerHTML = `<textarea style="width: 100%; height: 100%; resize: none; padding: 5px; font-size: 14px;"></textarea>`;
      break;
    case 'Navegador': {
      const uniqueId = Date.now() + Math.floor(Math.random() * 1000);
      content.innerHTML = `
        <div class="browser-url-container">
          <input type="text" id="browser-url-${uniqueId}" placeholder="Digite a URL...">
          <button onclick="loadPage(${uniqueId})">Ir</button>
        </div>
        <iframe id="browser-iframe-${uniqueId}" class="browser-iframe" src="about:blank"></iframe>
      `;
      break;
    }
    case 'Temas': {
      let buttonsHtml = `<div class="theme-buttons">`;
      for (const themeName in themes) {
        buttonsHtml += `<button onclick="setTheme('${themeName}')">${themeName}</button>`;
      }
      buttonsHtml += `</div>`;
      content.innerHTML = buttonsHtml;
      break;
    }
    case 'Loja':
      content.innerHTML = `
        <div class="loja-container">
          <h3>Loja de Aplicativos</h3>
          <p>Baixe novos aplicativos para seu sistema.</p>
          <div style="display: flex; gap: 20px; flex-wrap: wrap; justify-content: center;">
            <div style="text-align: center;">
              <img src="https://img.icons8.com/color/96/000000/artificial-intelligence.png" alt="RPS Challenge">
              <div>RPS Challenge</div>
              <button onclick="downloadAppCustom('RPS Challenge')">Baixar</button>
            </div>
            <div style="text-align: center;">
              <img src="https://img.icons8.com/color/96/000000/number.png" alt="Guess the Number">
              <div>Guess the Number</div>
              <button onclick="downloadAppCustom('Guess the Number')">Baixar</button>
            </div>
          </div>
          <h3>Upload de Arquivos</h3>
          <p>Use o Terminal para armazenar arquivos:</p>
          <p><strong>storephoto [URL]</strong> e <strong>storemusic [URL]</strong></p>
        </div>
      `;
      break;
    case 'Snake':
      content.innerHTML = `<canvas id="snakeCanvas" class="snake" width="380" height="260"></canvas>`;
      break;
    case 'Tic Tac Toe':
      content.innerHTML = `
        <div class="ttt-board" id="tttBoard">
          ${new Array(9).fill(0).map((_, i) => `<div class="ttt-cell" data-index="${i}"></div>`).join('')}
        </div>
        <div class="ttt-message" id="tttMessage">Vez do X</div>
        <button class="ttt-restart" onclick="initTicTacToe()">Reiniciar</button>
      `;
      break;
    case 'Relógio':
      content.innerHTML = `
        <div style="text-align:center; font-size: 24px; margin-top: 50px;">
          Relógio: <span id="clockTime"></span>
        </div>
      `;
      updateClock();
      break;
    case 'Música':
      content.innerHTML = `
        <div style="padding:10px; text-align:center;">
          <p>Player de Música</p>
          <audio controls style="width: 100%;">
            <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg">
            Seu navegador não suporta áudio.
          </audio>
        </div>
      `;
      break;
    case 'Galeria':
      content.innerHTML = `
        <div id="gallery-container">
          <!-- Fotos serão exibidas aqui -->
        </div>
        <p style="text-align:center; margin-top:10px;">Use o comando <strong>showphotos</strong> no Terminal para atualizar</p>
      `;
      renderGallery();
      break;
    case 'Calendário':
      content.innerHTML = `<div id="calendar-container"><!-- Calendário gerado dinamicamente --></div>`;
      initCalendar();
      break;
    case 'Terminal':
      content.innerHTML = `
        <div id="terminal-container">
          <div id="terminal-output"></div>
          <div>
            <span>cmd&gt; </span><input id="terminal-input" type="text">
          </div>
        </div>
      `;
      setTimeout(() => {
        const termContainer = document.getElementById('terminal-container');
        const termInput = document.getElementById('terminal-input');
        termContainer.addEventListener('click', () => { termInput.focus(); });
        initTerminal();
      }, 0);
      break;
    case 'Chat':
      content.innerHTML = `
        <div id="chat-container">
          <div id="chat-output"></div>
          <input id="chat-input" type="text" placeholder="Digite sua mensagem...">
        </div>
      `;
      initChat();
      break;
    case 'Contatos':
      content.innerHTML = `
        <div style="text-align:left; margin: 10px;">
          <h3>Contatos</h3>
          <ul>
            <li>João</li>
            <li>Maria</li>
            <li>Carlos</li>
          </ul>
        </div>
      `;
      break;
    case 'Explorador de Arquivos':
      content.innerHTML = `
        <div id="file-explorer">
          <h3>Explorador de Arquivos</h3>
          <h4>Imagens</h4>
          <ul id="file-images"></ul>
          <h4>Músicas</h4>
          <ul id="file-music"></ul>
          <h4>Pastas</h4>
          <ul id="file-folders"></ul>
        </div>
      `;
      initFileExplorer();
      break;
    case 'Editor de Imagens':
      content.innerHTML = `
        <div style="background: #000; color: #0f0; height:100%; padding:10px; font-family: monospace;">
          <p>cmd&gt; iniciar editor_de_imagens</p>
          <p>Carregando editor de imagens...</p>
        </div>
      `;
      break;
    case 'Configurações':
      content.innerHTML = `
        <div style="background: #000; color: #0f0; height:100%; padding:10px; font-family: monospace;">
          <p>cmd&gt; abrir configuracoes</p>
          <p>Carregando configurações...</p>
        </div>
      `;
      break;
    case 'Bloco de Tarefas':
      content.innerHTML = `
        <div id="tasks-container" style="padding:10px;">
          <h3>Minhas Tarefas</h3>
          <input type="text" id="new-task" placeholder="Nova tarefa..." style="width:80%; padding:5px;">
          <button onclick="addTask()">Adicionar</button>
          <ul id="tasks-list" style="margin-top:10px;"></ul>
        </div>
      `;
      break;
    case 'RPS Challenge':  // Renomeado de "ML Assistente"
      content.innerHTML = `
        <div id="rps-game-container" style="padding:10px;">
          <h3>Rock, Paper, Scissors com IA</h3>
          <p>Escolha sua jogada:</p>
          <button onclick="playerMove('rock')">Rock</button>
          <button onclick="playerMove('paper')">Paper</button>
          <button onclick="playerMove('scissors')">Scissors</button>
          <div id="game-result" style="margin-top:10px;"></div>
          <div id="game-score" style="margin-top:10px;">Score: Você 0 - IA 0</div>
          <div id="rps-stats" style="margin-top:10px;"></div>
          <button onclick="initRPSGame()">Resetar Estatísticas</button>
        </div>
      `;
      initRPSGame();
      break;
    case 'Guess the Number':
      // Inclui uma imagem ilustrativa para o jogo
      content.innerHTML = `
        <div id="guess-game-container" style="padding:10px; text-align:center;">
          <img src="https://img.icons8.com/color/96/000000/number.png" alt="Guess the Number" style="margin-bottom:10px;">
          <h3>Guess the Number</h3>
          <p>Pense em um número entre 1 e 100. Quando estiver pronto, clique em "Iniciar".</p>
          <button onclick="startGuessGame()">Iniciar</button>
          <div id="guess-output" style="margin-top:10px;"></div>
          <div id="guess-controls" style="margin-top:10px; display:none;">
            <button onclick="guessHigher()">Higher</button>
            <button onclick="guessLower()">Lower</button>
            <button onclick="guessCorrect()">Correct</button>
          </div>
        </div>
      `;
      initGuessGame();
      break;
    case 'Recursos':
      content.innerHTML = `
        <div id="resource-stats">
          <p>Carregando informações de recursos...</p>
        </div>
      `;
      setInterval(updateResources, 1000);
      break;
    default:
      content.innerHTML = `<p>Aplicativo em desenvolvimento...</p>`;
  }

  win.appendChild(content);
  document.getElementById('desktop').appendChild(win);
  makeDraggable(win, header);

  if(appName === 'Snake') {
    initSnakeGame();
  } else if(appName === 'Tic Tac Toe') {
    initTicTacToe();
  }
}

function closeWindow(event, element) {
  event.stopPropagation();
  element.parentElement.parentElement.remove();
}

function makeDraggable(win, header) {
  let offsetX = 0, offsetY = 0, isDragging = false;
  header.addEventListener('mousedown', function(e) {
    isDragging = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    win.style.zIndex = zIndexCounter++;
  });
  document.addEventListener('mousemove', function(e) {
    if (isDragging) {
      win.style.left = (e.clientX - offsetX) + 'px';
      win.style.top = (e.clientY - offsetY) + 'px';
    }
  });
  document.addEventListener('mouseup', function() {
    isDragging = false;
  });
}

/* Funções da Calculadora */
function appendCalc(value, displayId) {
  const display = document.getElementById(displayId);
  if (display) display.value += value;
}
function calculate(displayId) {
  const display = document.getElementById(displayId);
  try {
    display.value = eval(display.value);
  } catch(e) {
    display.value = 'Erro';
  }
}
function clearCalc(displayId) {
  const display = document.getElementById(displayId);
  if (display) display.value = '';
}

/* Navegador Simulado */
function loadPage(uniqueId) {
  const urlInput = document.getElementById('browser-url-' + uniqueId);
  const iframe = document.getElementById('browser-iframe-' + uniqueId);
  let url = urlInput.value.trim();
  if (url !== '') {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'http://' + url;
    }
    iframe.src = url;
  }
}

/* Aplicar Tema */
function setTheme(themeName) {
  const theme = themes[themeName];
  if (!theme) return;
  document.documentElement.style.setProperty('--desktop-bg', theme.desktopBg);
  document.documentElement.style.setProperty('--desktop-bg-size', theme.desktopBgSize);
  document.documentElement.style.setProperty('--window-header-bg', theme.windowHeaderBg);
  document.documentElement.style.setProperty('--window-header-text', theme.windowHeaderText);
  document.documentElement.style.setProperty('--body-bg', theme.bodyBg);
  document.documentElement.style.setProperty('--download-progress-bg', theme.windowHeaderBg);
}

/* Adicionar novo ícone ao Desktop */
function addDesktopIcon(appName, iconUrl, displayName) {
  const iconsContainer = document.getElementById('iconsContainer');
  const newIcon = document.createElement('div');
  newIcon.classList.add('icon');
  newIcon.onclick = () => openWindow(appName);
  newIcon.innerHTML = `<img src="${iconUrl}" alt="${displayName}"><div>${displayName}</div>`;
  iconsContainer.appendChild(newIcon);
}

/* Função personalizada de Download na Loja com progresso em KB/MB */
function downloadAppCustom(appName) {
  const storeWindow = document.querySelector('.window-content');
  const overlay = document.createElement('div');
  overlay.classList.add('download-overlay');
  let fileSize = 0;
  if (appName === 'RPS Challenge') {
    fileSize = 3 * 1024 * 1024; // 3 MB
  } else if (appName === 'Guess the Number') {
    fileSize = 2 * 1024 * 1024; // 2 MB
  }
  overlay.innerHTML = `
    <div>Baixando ${appName}...</div>
    <div class="progress-bar"><div class="progress-fill"></div></div>
    <div id="download-info"></div>
  `;
  storeWindow.appendChild(overlay);
  let downloaded = 0;
  const progressFill = overlay.querySelector('.progress-fill');
  const downloadInfo = overlay.querySelector('#download-info');
  const interval = setInterval(() => {
    const increment = 100 * 1024; // 100 KB por tick
    downloaded += increment;
    if (downloaded > fileSize) downloaded = fileSize;
    let percent = (downloaded / fileSize) * 100;
    progressFill.style.width = percent.toFixed(2) + '%';
    downloadInfo.innerHTML = `${formatBytes(downloaded)} de ${formatBytes(fileSize)} (${percent.toFixed(2)}%)`;
    if (downloaded >= fileSize) {
      clearInterval(interval);
      overlay.innerHTML = `<div>${appName} baixado com sucesso!</div>`;
      setTimeout(() => {
        overlay.remove();
        if (appName === 'RPS Challenge') {
          document.getElementById("mlAssistenteIcon").style.display = "block";
        } else if (appName === 'Guess the Number') {
          document.getElementById("guessNumberIcon").style.display = "block";
        }
      }, 1500);
    }
  }, 200);
}

/* Jogo Snake */
function initSnakeGame() {
  const canvas = document.getElementById("snakeCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const box = 20;
  let snake = [];
  snake[0] = { x: 9 * box, y: 7 * box };
  let food = {
    x: Math.floor(Math.random() * 19) * box,
    y: Math.floor(Math.random() * 13) * box
  };
  let score = 0;
  let d = "RIGHT";
  document.onkeydown = null;
  document.addEventListener("keydown", direction);
  function direction(event) {
    let key = event.keyCode;
    if (key === 37 && d !== "RIGHT") d = "LEFT";
    else if (key === 38 && d !== "DOWN") d = "UP";
    else if (key === 39 && d !== "LEFT") d = "RIGHT";
    else if (key === 40 && d !== "UP") d = "DOWN";
  }
  function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
      if (head.x === array[i].x && head.y === array[i].y) return true;
    }
    return false;
  }
  function draw() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < snake.length; i++) {
      ctx.fillStyle = i === 0 ? "lime" : "white";
      ctx.fillRect(snake[i].x, snake[i].y, box, box);
      ctx.strokeStyle = "red";
      ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    if (d === "LEFT") snakeX -= box;
    if (d === "UP") snakeY -= box;
    if (d === "RIGHT") snakeX += box;
    if (d === "DOWN") snakeY += box;
    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision({ x: snakeX, y: snakeY }, snake)) {
      clearInterval(game);
      alert("Game Over! Pontuação: " + score);
      return;
    }
    let newHead = { x: snakeX, y: snakeY };
    if (snakeX === food.x && snakeY === food.y) {
      score++;
      food = {
        x: Math.floor(Math.random() * 19) * box,
        y: Math.floor(Math.random() * 13) * box
      };
    } else {
      snake.pop();
    }
    snake.unshift(newHead);
  }
  let game = setInterval(draw, 100);
}

/* Jogo Tic Tac Toe */
function initTicTacToe() {
  const board = document.getElementById("tttBoard");
  const messageDiv = document.getElementById("tttMessage");
  if (!board || !messageDiv) return;
  const cells = board.querySelectorAll(".ttt-cell");
  let turn = "X";
  let gameOver = false;
  messageDiv.textContent = "Vez do " + turn;
  cells.forEach(cell => {
    cell.textContent = "";
    cell.onclick = function() {
      if (gameOver || cell.textContent !== "") return;
      cell.textContent = turn;
      if (checkWin(turn)) {
        messageDiv.textContent = turn + " venceu!";
        gameOver = true;
        return;
      }
      if ([...cells].every(cell => cell.textContent !== "")) {
        messageDiv.textContent = "Empate!";
        gameOver = true;
        return;
      }
      turn = turn === "X" ? "O" : "X";
      messageDiv.textContent = "Vez do " + turn;
    }
  });
  function checkWin(player) {
    const winCombos = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    return winCombos.some(combo => combo.every(index => cells[index].textContent === player));
  }
}

/* Atualizar relógio */
function updateClock() {
  const clockElement = document.getElementById('clockTime');
  if (clockElement) {
    const now = new Date();
    clockElement.textContent = now.toLocaleTimeString("pt-BR");
  }
  setTimeout(updateClock, 1000);
}

/* Renderizar Galeria */
function renderGallery() {
  const container = document.getElementById('gallery-container');
  if (container) {
    container.innerHTML = '';
    if (photoGallery.length === 0) {
      container.innerHTML = '<p>Nenhuma foto armazenada.</p>';
    } else {
      photoGallery.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        container.appendChild(img);
      });
    }
  }
}

/* Explorador de Arquivos Virtual */
function initFileExplorer() {
  const fileImages = document.getElementById('file-images');
  const fileMusic = document.getElementById('file-music');
  const fileFolders = document.getElementById('file-folders');
  if (fileImages) {
    fileImages.innerHTML = '';
    if (photoGallery.length === 0) {
      fileImages.innerHTML = '<li>Nenhuma imagem armazenada.</li>';
    } else {
      photoGallery.forEach((url, index) => {
        fileImages.innerHTML += `<li>Imagem ${index+1}: <a href="${url}" target="_blank">Visualizar</a></li>`;
      });
    }
  }
  if (fileMusic) {
    fileMusic.innerHTML = '';
    if (musicLibrary.length === 0) {
      fileMusic.innerHTML = '<li>Nenhuma música armazenada.</li>';
    } else {
      musicLibrary.forEach((url, index) => {
        fileMusic.innerHTML += `<li>Música ${index+1}: <a href="${url}" target="_blank">Ouvir</a></li>`;
      });
    }
  }
  if (fileFolders) {
    fileFolders.innerHTML = '';
    for (let folder in virtualFolders) {
      fileFolders.innerHTML += `<li onclick="openFolder('${folder}')" style="cursor:pointer;">Pasta: ${folder} (${virtualFolders[folder].length} arquivo(s))</li>`;
    }
  }
}

/* Função para abrir uma pasta em nova janela */
function openFolder(folderName) {
  const win = document.createElement('div');
  win.classList.add('window');
  win.style.top = '100px';
  win.style.left = '100px';
  win.style.zIndex = zIndexCounter++;
  const header = document.createElement('div');
  header.classList.add('window-header');
  header.innerHTML = `Pasta: ${folderName} <span class="close-btn" onclick="closeWindow(event, this)">X</span>`;
  win.appendChild(header);
  const content = document.createElement('div');
  content.classList.add('window-content');
  const files = virtualFolders[folderName];
  let html = `<h4>Conteúdo da pasta "${folderName}"</h4>`;
  if (files.length === 0) {
    html += "<p>Pasta vazia.</p>";
  } else {
    html += "<ul>";
    files.forEach((file, index) => {
      html += `<li>Arquivo ${index+1}: <a href="${file}" target="_blank">Visualizar</a></li>`;
    });
    html += "</ul>";
  }
  content.innerHTML = html;
  win.appendChild(content);
  document.getElementById('desktop').appendChild(win);
  makeDraggable(win, header);
}

/* Aplicativo Chat */
function initChat() {
  const chatOutput = document.getElementById('chat-output');
  const chatInput = document.getElementById('chat-input');
  if (!chatOutput || !chatInput) return;
  chatInput.focus();
  chatInput.addEventListener('keydown', function(e) {
    if(e.key === "Enter") {
      const msg = chatInput.value.trim();
      if(msg === "") return;
      chatOutput.innerHTML += `<div><strong>Você:</strong> ${msg}</div>`;
      setTimeout(() => {
        chatOutput.innerHTML += `<div><strong>ChatBot:</strong> Resposta automática: "${msg.toUpperCase()}"</div>`;
        chatOutput.scrollTop = chatOutput.scrollHeight;
      }, 1000);
      chatInput.value = "";
      chatOutput.scrollTop = chatOutput.scrollHeight;
    }
  });
}

/* Terminal com Histórico e Comandos */
function initTerminal() {
  const termOutput = document.getElementById('terminal-output');
  const termInput = document.getElementById('terminal-input');
  if (!termInput || !termOutput) return;
  let commandHistory = [];
  let historyIndex = -1;
  const commands = {
    help: "Comandos: help, date, time, theme, clear, echo, storephoto [URL], storemusic [URL], showphotos, showmusic, listapps, openapp [nome], mlassist, about, ver, cmd, love, ls, cd, pwd, reboot, shutdown, ping, fortune, weather, randomfact, joke, listfiles, mkdir [nome], speak, history, exit",
    date: () => new Date().toLocaleDateString("pt-BR"),
    time: () => new Date().toLocaleTimeString("pt-BR"),
    theme: () => "Temas disponíveis: " + Object.keys(themes).join(", "),
    clear: () => { termOutput.innerHTML = ""; return ""; },
    echo: (args) => args.join(" "),
    storephoto: (args) => {
      if(args.length === 0) return "Uso: storephoto [URL]";
      photoGallery.push(args[0]);
      renderGallery();
      return "Foto armazenada com sucesso!";
    },
    storemusic: (args) => {
      if(args.length === 0) return "Uso: storemusic [URL]";
      musicLibrary.push(args[0]);
      return "Música armazenada com sucesso!";
    },
    showphotos: () => { renderGallery(); return "Galeria de fotos atualizada."; },
    showmusic: () => { return "Músicas armazenadas: " + (musicLibrary.length ? musicLibrary.join(", ") : "Nenhuma música armazenada."); },
    listapps: () => {
      const apps = Array.from(document.querySelectorAll('.icons-container .icon'))
                .map(icon => icon.textContent.trim())
                .join(", ");
      return "Aplicativos instalados: " + apps;
    },
    openapp: (args) => {
      if(args.length === 0) return "Uso: openapp [nome do aplicativo]";
      const appName = args.join(" ");
      openWindow(appName);
      return `Abrindo ${appName}...`;
    },
    mlassist: () => { openWindow('RPS Challenge'); return "RPS Challenge aberto."; },
    about: () => "Sistema Operacional Simulado v3.0 - Desenvolvido com carinho e criatividade!",
    ver: () => "Versão 3.0",
    cmd: () => "Você está no CMD virtual!",
    love: () => "Você é incrível! ❤️ Nunca se esqueça disso!",
    ls: () => "documentos  downloads  fotos  musicas  videos",
    cd: (args) => args[0] ? `Alterando diretório para ${args[0]}...` : "Uso: cd [diretório]",
    pwd: () => "/home/usuario",
    reboot: () => "Reiniciando o sistema... (simulação)",
    shutdown: () => "Desligando o sistema... (simulação)",
    ping: () => "Pong!",
    fortune: () => {
      const fortunes = [
        "A vida é bela!",
        "Sorria, o universo sorri com você!",
        "Tudo ficará bem.",
        "Você é amado!",
        "Grandes coisas estão por vir.",
        "Mantenha a fé.",
        "O melhor ainda está por vir.",
        "Você é uma estrela!",
        "Nunca desista dos seus sonhos.",
        "O sol sempre nasce de novo."
      ];
      return fortunes[Math.floor(Math.random() * fortunes.length)];
    },
    weather: () => "Clima: Sol com algumas nuvens. Temperatura: 25°C (simulação).",
    randomfact: () => {
      const facts = [
        "O coração de uma baleia azul é do tamanho de um carro pequeno.",
        "O café é a segunda bebida mais consumida no mundo, depois da água.",
        "As abelhas podem reconhecer rostos humanos.",
        "O maior deserto do mundo é a Antártida.",
        "As listras de uma zebra são únicas, como as impressões digitais.",
        "O bambu pode crescer até 91 centímetros em um dia.",
        "A Terra é o único planeta que não recebeu o nome de um deus romano ou grego.",
        "Cães conseguem detectar doenças através do olfato.",
        "Os flamingos se alimentam com a cabeça para baixo.",
        "O sol sempre nasce de novo."
      ];
      return facts[Math.floor(Math.random() * facts.length)];
    },
    joke: () => {
      const jokes = [
        "Por que o computador foi ao médico? Porque estava com um vírus!",
        "Por que o programador não gosta de natureza? Porque tem muitos bugs!",
        "Qual é o cúmulo da paciência? Esperar um JavaScript carregar.",
        "Por que a abelha sempre leva o celular? Porque ela tem o *buzz*.",
        "O que o código disse para o bug? 'Vou te consertar!'"
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    },
    listfiles: () => {
      let list = "Arquivos em /home/usuario:<br>";
      list += "foto1.jpg<br>musica1.mp3<br>documento.txt";
      return list;
    },
    mkdir: (args) => {
      if(args.length === 0) return "Uso: mkdir [nome_da_pasta]";
      const folderName = args.join(" ");
      if(virtualFolders[folderName]) {
        return `A pasta "${folderName}" já existe.`;
      } else {
        virtualFolders[folderName] = [];
        return `Pasta "${folderName}" criada com sucesso.`;
      }
    },
    speak: (args) => {
      let text = args.join(" ");
      if (!text) return "Uso: speak [texto]";
      if ('speechSynthesis' in window) {
        let utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
        return "Falando: " + text;
      } else {
        return "Seu navegador não suporta síntese de fala.";
      }
    },
    history: () => commandHistory.join("<br>"),
    exit: () => { return "Saindo do terminal..."; }
  };

  termInput.focus();
  termInput.addEventListener('keydown', function(e) {
    if(e.key === "Enter") {
      const inputText = termInput.value.trim();
      if(inputText === "") return;
      termOutput.innerHTML += `<div><span>cmd&gt; </span>${inputText}</div>`;
      commandHistory.push(inputText);
      historyIndex = commandHistory.length;
      const parts = inputText.split(" ");
      const cmd = parts[0].toLowerCase();
      const args = parts.slice(1);
      let result = "";
      if(commands.hasOwnProperty(cmd)) {
        result = typeof commands[cmd] === "function" ? commands[cmd](args) : commands[cmd];
        if(cmd === "exit") {
          result += "<br>Terminal encerrado.";
          termOutput.innerHTML += `<div>${result}</div>`;
          termInput.disabled = true;
          return;
        }
      } else {
        result = "Comando não reconhecido. Digite 'help' para ver os comandos disponíveis.";
      }
      termOutput.innerHTML += `<div>${result}</div>`;
      termInput.value = "";
      termOutput.scrollTop = termOutput.scrollHeight;
    } else if(e.key === "ArrowUp") {
      if(commandHistory.length && historyIndex > 0) {
        historyIndex--;
        termInput.value = commandHistory[historyIndex];
      }
      e.preventDefault();
    } else if(e.key === "ArrowDown") {
      if(commandHistory.length && historyIndex < commandHistory.length - 1) {
        historyIndex++;
        termInput.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        termInput.value = "";
      }
      e.preventDefault();
    }
  });
}

/* Bloco de Tarefas - Gerenciamento simples de tarefas */
function addTask() {
  const taskInput = document.getElementById('new-task');
  const tasksList = document.getElementById('tasks-list');
  const taskText = taskInput.value.trim();
  if (taskText === "") return;
  const li = document.createElement('li');
  li.textContent = taskText;
  const rmBtn = document.createElement('button');
  rmBtn.textContent = "X";
  rmBtn.style.marginLeft = "10px";
  rmBtn.onclick = () => li.remove();
  li.appendChild(rmBtn);
  tasksList.appendChild(li);
  taskInput.value = "";
}

/* ================================
   NOVO APLICATIVO: Jogo de Rock, Paper, Scissors com IA aprimorado (RPS Challenge)
   ================================ */
let rpsPlayerScore = 0;
let rpsAIScore = 0;
let rpsMoveCount = { rock: 0, paper: 0, scissors: 0 };

function initRPSGame() {
  rpsPlayerScore = 0;
  rpsAIScore = 0;
  rpsMoveCount = { rock: 0, paper: 0, scissors: 0 };
  const resultDiv = document.getElementById('game-result');
  if(resultDiv) resultDiv.innerHTML = "";
  const scoreDiv = document.getElementById('game-score');
  if(scoreDiv) scoreDiv.innerHTML = "Score: Você 0 - IA 0";
  const statsDiv = document.getElementById('rps-stats');
  if(statsDiv) statsDiv.innerHTML = "";
}

function playerMove(move) {
  rpsMoveCount[move] = (rpsMoveCount[move] || 0) + 1;
  let predictedMove = move;
  let maxCount = 0;
  for (let m in rpsMoveCount) {
    if (rpsMoveCount[m] > maxCount) {
      maxCount = rpsMoveCount[m];
      predictedMove = m;
    }
  }
  let aiMove = "";
  if (predictedMove === "rock") {
    aiMove = "paper";
  } else if (predictedMove === "paper") {
    aiMove = "scissors";
  } else if (predictedMove === "scissors") {
    aiMove = "rock";
  } else {
    aiMove = ["rock", "paper", "scissors"][Math.floor(Math.random() * 3)];
  }
  let result = "";
  if (move === aiMove) {
    result = "Empate!";
  } else if (
      (move === "rock" && aiMove === "scissors") ||
      (move === "paper" && aiMove === "rock") ||
      (move === "scissors" && aiMove === "paper")
  ) {
    result = "Você venceu!";
    rpsPlayerScore++;
  } else {
    result = "IA venceu!";
    rpsAIScore++;
  }
  document.getElementById('game-result').innerHTML = `Você jogou <strong>${move}</strong>. IA jogou <strong>${aiMove}</strong>.<br>Resultado: ${result}`;
  document.getElementById('game-score').innerHTML = `Score: Você ${rpsPlayerScore} - IA ${rpsAIScore}`;
  document.getElementById('rps-stats').innerHTML = `Suas jogadas: Rock: ${rpsMoveCount.rock}, Paper: ${rpsMoveCount.paper}, Scissors: ${rpsMoveCount.scissors}`;
}
/* ================================
   FIM DO RPS CHALLENGE
   ================================ */

/* ================================
   NOVO APLICATIVO: Jogo Guess the Number
   ================================ */
let guessLowerBound = 1;
let guessUpperBound = 100;
let guessCurrent = 0;
let guessAttempts = 0;

function initGuessGame() {
  guessLowerBound = 1;
  guessUpperBound = 100;
  guessCurrent = 0;
  guessAttempts = 0;
  const output = document.getElementById('guess-output');
  if (output) output.innerHTML = "";
  const controls = document.getElementById('guess-controls');
  if (controls) controls.style.display = "none";
}

function startGuessGame() {
  guessAttempts = 1;
  guessCurrent = Math.floor((guessLowerBound + guessUpperBound) / 2);
  const output = document.getElementById('guess-output');
  if (output) output.innerHTML = `Tentativa ${guessAttempts}: O computador adivinha <strong>${guessCurrent}</strong>.`;
  const controls = document.getElementById('guess-controls');
  if (controls) controls.style.display = "block";
}

function guessHigher() {
  guessAttempts++;
  guessLowerBound = guessCurrent + 1;
  guessCurrent = Math.floor((guessLowerBound + guessUpperBound) / 2);
  updateGuessOutput();
}

function guessLower() {
  guessAttempts++;
  guessUpperBound = guessCurrent - 1;
  guessCurrent = Math.floor((guessLowerBound + guessUpperBound) / 2);
  updateGuessOutput();
}

function guessCorrect() {
  const output = document.getElementById('guess-output');
  if (output) output.innerHTML += `<br>O computador acertou em ${guessAttempts} tentativas!`;
  const controls = document.getElementById('guess-controls');
  if (controls) controls.style.display = "none";
}

function updateGuessOutput() {
  const output = document.getElementById('guess-output');
  if (output) output.innerHTML = `Tentativa ${guessAttempts}: O computador adivinha <strong>${guessCurrent}</strong>.`;
}
/* ================================
   FIM DO JOGO GUESS THE NUMBER
   ================================ */

/* Atualiza as informações dos recursos do sistema */
function updateResources() {
  const resContainer = document.getElementById('resource-stats');
  if (!resContainer) return;
  let html = '';
  if (performance.memory) {
    let used = performance.memory.usedJSHeapSize;
    let total = performance.memory.totalJSHeapSize;
    let limit = performance.memory.jsHeapSizeLimit;
    html += `<p>Memória: ${formatBytes(used)} / ${formatBytes(total)} (Limite: ${formatBytes(limit)})</p>`;
  } else {
    html += `<p>Memória: Não disponível</p>`;
  }
  if (navigator.hardwareConcurrency) {
    html += `<p>Cores: ${navigator.hardwareConcurrency}</p>`;
  }
  if (navigator.connection) {
    html += `<p>Conexão: ${navigator.connection.effectiveType} - Downlink: ${navigator.connection.downlink} Mbps - RTT: ${navigator.connection.rtt} ms</p>`;
  } else {
    html += `<p>Conexão: Não disponível</p>`;
  }
  resContainer.innerHTML = html;
}
function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  let kb = bytes / 1024;
  if (kb < 1024) return kb.toFixed(2) + ' KB';
  let mb = kb / 1024;
  if (mb < 1024) return mb.toFixed(2) + ' MB';
  let gb = mb / 1024;
  return gb.toFixed(2) + ' GB';
}