(function () {
    // ========== PERFIS NARRATIVOS E HISTÓRIA ==========
    const profiles = {
        hacker: {
            name: "Hacker de Elite",
            enemyName: "Vírus 'Glitch'",
            enemyColor: "#22c55e",
            enemyEyeColor: "#000",
            levelNames: [
                "MISSÃO 1: Saudação do Servidor Oculto",
                "MISSÃO 2: Quebra do Firewall de Acesso",
                "MISSÃO 3: Loop do Núcleo do Sistema",
                "MISSÃO 4: Interface de Login da Intranet",
                "MISSÃO 5: Backdoor do Painel de Controle"
            ],
            levelIntros: [
                "🖥️ SISTEMA INICIADO: O Vírus 'Glitch' foi detectado tentando alterar a mensagem de boas-vindas do servidor oculto.",
                "🖥️ ALERTA: O Glitch está corrompendo a lógica de idade do firewall. Proteja o banco de dados!",
                "🖥️ EMERGÊNCIA: Um loop infinito foi inserido no núcleo para sobrecarregar a CPU. Prepare-se para interceptar!",
                "🖥️ INVASÃO FRONT-END: O vírus está desfigurando a página principal da intranet da corporação.",
                "🖥️ BACKDOOR DETECTADO: O Glitch tentou adulterar o formulário de envio de dados para vazar senhas. Pare-o!"
            ],
            stealMsg: "💥 MALWARE EXECUTADO! O Glitch criptografou a sintaxe. Acesse os pontos vermelhos para debugar e restaurar a linha de código!",
            winMsg: "✅ DEBUG CONCLUÍDO! O código está limpo.",
            drawEnemy: function(ctx, x, y) {
                ctx.fillStyle = this.enemyColor;
                ctx.fillRect(x, y, 25, 25);
                ctx.fillStyle = "#010409";
                ctx.font = "14px monospace";
                ctx.fillText("01", x + 4, y + 18);
            }
        },
        mago: {
            name: "Mago do Código",
            enemyName: "Goblin Ladrão de Feitiços",
            enemyColor: "#8b5cf6",
            enemyEyeColor: "#fbbf24",
            levelNames: [
                "CAPÍTULO 1: Feitiço de Invocação",
                "CAPÍTULO 2: Encantamento de Barreira",
                "CAPÍTULO 3: Ritual de Repetição Astral",
                "CAPÍTULO 4: Pergaminho de Ilusão",
                "CAPÍTULO 5: Contrato de Pacto Mágico"
            ],
            levelIntros: [
                "🧙‍♂️ O grimório foi aberto. Um Goblin sorrateiro se aproxima do feitiço básico de invocação...",
                "🧙‍♂️ Atenção! O Goblin quer quebrar a magia de barreira que protege os aprendizes mais jovens.",
                "🧙‍♂️ O ritual astral está instável! O Goblin Ladrão tenta sabotar as linhas de repetição de energia.",
                "🧙‍♂️ As antigas escrituras em HTML (Hiper-Texto Mágico Antigo) estão sendo reescritas pela criatura!",
                "🧙‍♂️ O ritual final: O Goblin quer adulterar as assinaturas do Pacto Mágico de Envio. Defenda as runas!"
            ],
            stealMsg: "💥 ZAP! O Goblin sugou as runas e desestabilizou o feitiço! Conserte os nós mágicos nas linhas!",
            winMsg: "✅ FEITIÇO RESTAURADO! A magia flui perfeitamente.",
            drawEnemy: function(ctx, x, y) {
                ctx.fillStyle = this.enemyColor;
                ctx.beginPath();
                ctx.moveTo(x + 12.5, y);
                ctx.lineTo(x + 25, y + 25);
                ctx.lineTo(x, y + 25);
                ctx.fill();
                ctx.fillStyle = this.enemyEyeColor;
                ctx.fillRect(x + 8, y + 12, 10, 4);
            }
        },
        detetive: {
            name: "Detetive Cibernético",
            enemyName: "Falsificador",
            enemyColor: "#f97316",
            enemyEyeColor: "#000",
            levelNames: [
                "CASO 1: O Registro de Ponto Falso",
                "CASO 2: Sabotagem na Câmera de Segurança",
                "CASO 3: Rastreamento de Pegadas Digitais",
                "CASO 4: O Site de Phishing",
                "CASO 5: Formulário de Extorsão"
            ],
            levelIntros: [
                "🕵️ Detetive, temos um caso. O Falsificador está tentando alterar os registros de entrada do suspeito principal.",
                "🕵️ Ele está na sala das câmeras! Está tentando mudar a lógica de quem tem autorização para entrar no cofre.",
                "🕵️ Estamos seguindo as pegadas dele num loop de dados, mas ele está tentando apagar seus rastros do sistema.",
                "🕵️ Encontramos uma página falsa que ele usou como isca. Ele está alterando a estrutura para enganar vítimas.",
                "🕵️ A peça final: o formulário usado para roubar as credenciais. Ele vai tentar esconder as provas finais!"
            ],
            stealMsg: "💥 CENA DO CRIME ADULTERADA! O Falsificador danificou as provas. Encontre as contradições na sintaxe para desmascará-lo!",
            winMsg: "✅ MISTÉRIO RESOLVIDO! Você encontrou as falhas do criminoso.",
            drawEnemy: function(ctx, x, y) {
                ctx.fillStyle = this.enemyColor;
                ctx.fillRect(x, y, 25, 25);
                ctx.fillStyle = this.enemyEyeColor;
                ctx.fillRect(x, y + 6, 25, 8);
                ctx.fillStyle = "white";
                ctx.fillRect(x + 4, y + 8, 4, 4);
                ctx.fillRect(x + 16, y + 8, 4, 4);
            }
        }
    };

    let currentProfile = profiles.detetive;

    // ========== DEFINIÇÃO DOS CÓDIGOS E ERROS ==========
    const levels = [
        {
            language: "🐍 Python",
            correctCode: `def saudacao(nome):
    print("Olá, " + nome + "!")
    return True`,
            wrongCode: `def saudacao(nome)
    print('Olá, ' + nome + "!)
    return True`,
            errors: [
                { line: 0, charPos: 16, explanation: "❌ Faltou ':' após 'def saudacao(nome)'" },
                { line: 1, charPos: 10, explanation: "❌ Aspas misturadas: abriu com ' e fechou com \"" },
                { line: 1, charPos: 4, explanation: "❊ Indentação incorreta (faltam 4 espaços)" },
                { line: 2, charPos: 4, explanation: "🔁 'return' deveria estar indentado" },
                { line: 1, charPos: 28, explanation: "📦 String sem fechamento correto de aspas" },
                { line: 0, charPos: 0, explanation: "🧩 Código após def precisa ser indentado" },
                { line: 2, charPos: 11, explanation: "⚙️ 'True' está correto, mas o return está fora do lugar" }
            ]
        },
        {
            language: "🐍 Python",
            correctCode: `idade = 18
if idade >= 18:
    print("Maior de idade")
else:
    print("Menor de idade")`,
            wrongCode: `idade = 18
if idade > 18:
    print("Maior de idade")
else
    print("Menor de idade")`,
            errors: [
                { line: 1, charPos: 9, explanation: "❌ Operador incorreto: deveria ser '>=' não '>'" },
                { line: 3, charPos: 4, explanation: "❌ Faltou ':' após 'else'" },
                { line: 4, charPos: 4, explanation: "⚠️ Indentação do print incorreta" },
                { line: 2, charPos: 4, explanation: "📌 Print com indentação correta mas falta algo" },
                { line: 4, charPos: 10, explanation: "🐞 Print sem aspas no texto" },
                { line: 3, charPos: 0, explanation: "🧪 Else sem indentação correta" },
                { line: 1, charPos: 15, explanation: "🔁 Condição if com problema lógico" }
            ]
        },
        {
            language: "🐍 Python",
            correctCode: `for i in range(3):
    print(f"Valor: {i}")
    if i == 1:
        break`,
            wrongCode: `for i in range(3)
    print("Valor: " + i)
    if i = 1
        break`,
            errors: [
                { line: 0, charPos: 17, explanation: "❌ Faltou ':' no final do for" },
                { line: 1, charPos: 19, explanation: "❌ Concatenação inválida: int com string" },
                { line: 2, charPos: 8, explanation: "⚠️ Indentação do if está errada" },
                { line: 2, charPos: 10, explanation: "⚡ Atribuição '=' ao invés de comparação '=='" },
                { line: 2, charPos: 15, explanation: "📌 Faltando ':' após o if" },
                { line: 0, charPos: 14, explanation: "🔄 range(3) sem fechamento correto" },
                { line: 1, charPos: 12, explanation: "🔁 Deveria usar f-string ao invés de concatenação" }
            ]
        },
        {
            language: "🌐 HTML",
            correctCode: `<div class="container">
    <h1>Bem-vindo ao Site</h1>
    <p>Este é um parágrafo de exemplo</p>
    <img src="foto.jpg" alt="Minha Foto">
</div>`,
            wrongCode: `<div class="container">
    <h1>Bem-vindo ao Site</h2>
    <p>Este é um parágrafo de exemplo
    <img src="foto.jpg">
</div>`,
            errors: [
                { line: 1, charPos: 28, explanation: "❌ Tag h1 fechada com /h2 (tag errada)" },
                { line: 2, charPos: 37, explanation: "❌ Tag p não foi fechada corretamente" },
                { line: 3, charPos: 20, explanation: "❌ Imagem sem atributo alt (acessibilidade)" },
                { line: 0, charPos: 5, explanation: "📌 Classe container sem aspas? não" },
                { line: 1, charPos: 10, explanation: "⚠️ Título com espaçamento incorreto" },
                { line: 4, charPos: 0, explanation: "🔁 Div fechada mas estrutura confusa" },
                { line: 2, charPos: 5, explanation: "🧩 Parágrafo sem conteúdo bem formatado" }
            ]
        },
        {
            language: "🌐 HTML",
            correctCode: `<form action="/enviar" method="POST">
    <label for="nome">Nome:</label>
    <input type="text" id="nome" name="nome">
    <button type="submit">Enviar</button>
</form>`,
            wrongCode: `<form action="/enviar" method=POST>
    <label>Nome:</label>
    <input type="text" id="nome" nome="nome">
    <button type="submit">Enviar</button>
</from>`,
            errors: [
                { line: 0, charPos: 32, explanation: "❌ Atributo method sem aspas (method=POST)" },
                { line: 1, charPos: 10, explanation: "❌ Label sem atributo for para associar ao input" },
                { line: 2, charPos: 35, explanation: "❌ Atributo 'nome' inválido (deveria ser 'name')" },
                { line: 4, charPos: 2, explanation: "❌ Tag de fechamento </from> inválida (era </form>)" },
                { line: 0, charPos: 5, explanation: "📌 Action sem aspas? está ok" },
                { line: 3, charPos: 15, explanation: "🔁 Button sem tipo definido corretamente" },
                { line: 1, charPos: 25, explanation: "🧪 Label sem fechamento adequado" }
            ]
        }
    ];

    let thief = {
        active: false,
        x: -60,
        y: 80,
        speed: 5,
        targetLine: null,
        hasStolen: false
    };

    let currentLevel = 0;
    let currentWrongCode = "";
    let currentErrors = [];
    let attempts = 0;
    let wrongAttempts = 0;
    let canClick = false; 
    let levelCompleted = false;
    let showCircles = false;
    let helpActivated = false;
    let helpUsedCount = 0;

    // --- CONFIGURAÇÕES POR PERFIL ---
    const profileConfig = {
        mago: { maxErrors: 5, useCanvas: false, useScratch: true, difficulty: 'beginner' },
        hacker: { maxErrors: 7, useCanvas: true, useScratch: false, difficulty: 'intermediate' },
        detetive: { maxErrors: 7, useCanvas: true, useScratch: false, difficulty: 'advanced' }
    };

    // --- DADOS DOS BLOCOS SCRATCH (Mago) ---
    const scratchBlocksData = {
        olhos: "👀 Abrir os olhos",
        pijama: "👕 Tirar o pijama",
        meia: "🧦 Colocar meia primeiro",
        lanche: "🥪 Comer lanche",
        pasta: "🪥 Usar pasta de dente",
        mochila: "🎒 Pegar a mochila",
        escola: "🏫 Ir para a escola"
    };

    // Elementos DOM
    const canvasCorrect = document.getElementById('canvasCorrect');
    const canvasErros = document.getElementById('canvasErros');
    const ctxCorrect = canvasCorrect.getContext('2d');
    const ctxErros = canvasErros.getContext('2d');
    const errorsFoundSpan = document.getElementById('errorsFound');
    const errorsRemainingSpan = document.getElementById('errorsRemaining');
    const attemptCounterSpan = document.getElementById('attemptCounter');
    const errorCountSpan = document.getElementById('errorCount');
    const levelNameSpan = document.getElementById('levelName');
    const feedbackDiv = document.getElementById('feedbackMsg');
    const nextLevelBtn = document.getElementById('nextLevelBtn');
    const resetBtn = document.getElementById('resetBtn');
    const backToMenuBtn = document.getElementById('backToMenuBtn');
    const forceHelpBtn = document.getElementById('forceHelpBtn');

    const congratsOverlay = document.getElementById('congratsOverlay');
    const congratsLevelName = document.getElementById('congratsLevelName');
    const errorsListContainer = document.getElementById('errorsListContainer');
    const congratsAttempts = document.getElementById('congratsAttempts');
    const congratsHelpUsed = document.getElementById('congratsHelpUsed');
    const congratsNextBtn = document.getElementById('congratsNextBtn');
    const congratsResetBtn = document.getElementById('congratsResetBtn');

    // ========== GERENCIADOR DE ESTADO DO JOGO ==========
    const gameState = {
        profileSelected: false,
        currentProfile: null,
        currentTrail: null,
        currentTheme: null,
        currentLevel: 0,
        isGameStarted: false,
        canBackToMenu: true
    };

    // --- SETUP DO QUESTIONÁRIO INICIAL COM SISTEMA ADAPTATIVO ---
    function initAdaptiveQuestionnaire() {
        const modal = document.getElementById('questionnaire-modal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.style.opacity = '1';
        }

        const finalizeSelection = (trail, theme) => {
            gameState.currentTrail = trail;
            gameState.currentTheme = theme;

            const trailToProfile = {
                iniciante: 'mago',
                explorador: 'detetive',
                hacker: 'hacker',
                mestre: 'detetive'
            };

            const profileKey = trailToProfile[trail] || 'detetive';
            currentProfile = Object.assign({}, profiles[profileKey]);
            currentProfile.levelNames = profiles[profileKey].levelNames.slice();
            currentProfile.levelIntros = profiles[profileKey].levelIntros.slice();
            gameState.profileSelected = true;
            gameState.currentProfile = profileKey;

            applyTrailAdaptations(trail, theme);

            if (modal) {
                modal.style.opacity = '0';
                setTimeout(() => {
                    modal.classList.add('hidden');
                    initGameEngine();
                }, 300);
            } else {
                initGameEngine();
            }
        };

        AdaptiveQuestionnaire.setOnCompleteCallback(finalizeSelection);
        AdaptiveQuestionnaire.init();
    }

    function applyTrailAdaptations(trail, theme) {
        const trailConfig = AdaptiveQuestionnaire.trails[trail];
        const themeConfig = AdaptiveQuestionnaire.themes[theme];
        
        gameState.trailConfig = trailConfig;
        gameState.themeConfig = themeConfig;
        
        if (currentProfile) {
            currentProfile.trailName = trailConfig.name;
            currentProfile.themeNarrative = themeConfig;
            applyThemeNarrative(currentProfile, themeConfig);
        }
    }

    function applyThemeNarrative(profile, themeConfig) {
        if (profile.levelNames) {
            profile.levelNames = profile.levelNames.map((name, idx) => {
                return `${themeConfig.characters.setting} - ${name}`;
            });
        }
        if (themeConfig.narrative) {
            profile.stealMsg = themeConfig.narrative.defeat;
            profile.winMsg = themeConfig.narrative.victory;
        }
    }

    function animateStat(element) {
        element.classList.add('animate');
        setTimeout(() => element.classList.remove('animate'), 300);
    }

    function updateHelpButton() {
        if (wrongAttempts >= 2 && !helpActivated && !levelCompleted) {
            forceHelpBtn.style.display = 'block';
            forceHelpBtn.disabled = false;
            forceHelpBtn.classList.add('visible');
            feedbackDiv.innerHTML = `<span class="message warning">💡 DICA DISPONÍVEL! Clique no botão "MOSTRA DICAS" para ver os círculos dos erros!</span>`;
        }
    }

    function renderLevel() {
        const linePositions = drawCodeAndGetPositions(ctxErros, currentWrongCode);
        updateErrorPositions(linePositions);
        
        // SEMPRE desenha as bolinhas verdes para os erros encontrados
        drawFoundErrors(ctxErros);
        
        // Desenha os círculos vermelhos (dicas) apenas se showCircles estiver ativo
        if (showCircles) {
            drawHintCircles(ctxErros);
        }

        const level = levels[currentLevel];
        levelNameSpan.innerText = `${level.language} - ${currentProfile.levelNames[currentLevel]}`;
        
        const foundCount = currentErrors.filter(e => e.found).length;
        const remainingCount = currentErrors.filter(e => !e.found).length;
        errorsFoundSpan.innerText = foundCount;
        errorsRemainingSpan.innerText = remainingCount;
        attemptCounterSpan.innerText = attempts;
        errorCountSpan.innerText = wrongAttempts;

        if (remainingCount === 0 && !levelCompleted) {
            levelCompleted = true;
            canClick = false;
            showCongrats();
        }
    }

    // Desenha as bolinhas verdes com "✓" para erros já encontrados (sempre)
    function drawFoundErrors(ctx) {
        for (let i = 0; i < currentErrors.length; i++) {
            const err = currentErrors[i];
            if (err.found) {
                ctx.beginPath();
                ctx.arc(err.cx, err.cy, err.radius + 2, 0, 2 * Math.PI);
                ctx.fillStyle = "#22c55e66";
                ctx.fill();
                ctx.beginPath();
                ctx.arc(err.cx, err.cy, err.radius - 1, 0, 2 * Math.PI);
                ctx.fillStyle = "#16653499";
                ctx.fill();
                ctx.font = "bold 14px monospace";
                ctx.fillStyle = "white";
                ctx.fillText("✓", err.cx - 4, err.cy + 5);
            }
        }
    }

    // Desenha os círculos vermelhos (dicas) apenas se showCircles for true
    function drawHintCircles(ctx) {
        if (!canClick && !levelCompleted) return;
        for (let i = 0; i < currentErrors.length; i++) {
            const err = currentErrors[i];
            if (!err.found) {
                ctx.shadowBlur = 4;
                ctx.shadowColor = "rgba(255,0,0,0.2)";
                ctx.beginPath();
                ctx.arc(err.cx, err.cy, err.radius + 3, 0, 2 * Math.PI);
                ctx.fillStyle = "#ef444433";
                ctx.fill();
                ctx.beginPath();
                ctx.arc(err.cx, err.cy, err.radius, 0, 2 * Math.PI);
                ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
                ctx.lineWidth = 1.5;
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
        }
    }

    function showCongrats() {
        const level = levels[currentLevel];
        congratsLevelName.innerText = `${level.language} - ${currentProfile.levelNames[currentLevel]}`;
        congratsAttempts.innerText = attempts;
        congratsHelpUsed.innerText = helpUsedCount;
        errorsListContainer.innerHTML = '';
        currentErrors.forEach((err, index) => {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-item';
            errorDiv.innerHTML = `<div class="error-number">${index + 1}</div><div class="error-text">${err.explanation}</div>`;
            errorsListContainer.appendChild(errorDiv);
        });
        congratsOverlay.classList.remove('hidden');
    }

    function hideCongrats() { congratsOverlay.classList.add('hidden'); }

    function nextLevelFromCongrats() {
        hideCongrats();
        if (currentLevel + 1 < levels.length) {
            loadLevel(currentLevel + 1);
        } else {
            feedbackDiv.innerHTML = `<span class="message success">✨ FIM DE JOGO! VOCÊ COMPLETOU TODAS AS MISSÕES COMO ${currentProfile.name.toUpperCase()}! ✨</span>`;
            nextLevelBtn.disabled = true;
            levelCompleted = true;
        }
    }

    function resetFromCongrats() {
        hideCongrats();
        loadLevel(0);
    }

    function drawCodeAndGetPositions(ctx, codeText) {
        const w = ctx.canvas.width, h = ctx.canvas.height;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "#010409";
        ctx.fillRect(0, 0, w, h);
        ctx.font = "20px 'Fira Code', 'Courier New', monospace";
        ctx.textBaseline = "top";

        const lines = codeText.split('\n');
        let y = 40;
        const linePositions = [];

        for (let i = 0; i < lines.length; i++) {
            ctx.fillStyle = "#e6edf3";
            ctx.fillText(lines[i], 35, y);
            linePositions.push({ lineIndex: i, y: y, x: 35, text: lines[i] });
            y += 32;
        }
        return linePositions;
    }

    function updateErrorPositions(linePositions) {
        for (let i = 0; i < currentErrors.length; i++) {
            const err = currentErrors[i];
            const lineInfo = linePositions.find(lp => lp.lineIndex === err.line);
            if (lineInfo) {
                const textBefore = lineInfo.text.substring(0, err.charPos);
                err.cx = lineInfo.x + ctxErros.measureText(textBefore).width;
                err.cy = lineInfo.y + 12;
                err.radius = 14;
            }
        }
    }

    function allowDrop(ev) {
        ev.preventDefault();
    }

    function drag(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
        ev.dataTransfer.setData("type", ev.target.getAttribute("data-id"));
    }

    function drop(ev) {
        ev.preventDefault();
        
        if (levelCompleted || !canClick) return;
        
        var dataId = ev.dataTransfer.getData("text");
        var pieceType = ev.dataTransfer.getData("type");
        var expectedType = ev.target.getAttribute("data-expected");

        attempts++;
        animateStat(attemptCounterSpan);

        if (pieceType === expectedType) {
            var nodeCopy = document.getElementById(dataId).cloneNode(true);
            nodeCopy.removeAttribute("draggable");
            nodeCopy.removeAttribute("ondragstart");
            nodeCopy.style.cursor = "default";
            
            ev.target.innerHTML = "";
            ev.target.appendChild(nodeCopy);
            ev.target.className = "s-block success";
            ev.target.removeAttribute("ondrop");
            ev.target.removeAttribute("ondragover");
            ev.target.removeAttribute("data-expected");
            
            const errorIndex = currentErrors.findIndex(e => e.blockId === expectedType);
            if (errorIndex !== -1) {
                currentErrors[errorIndex].found = true;
            }
            
            animateStat(errorsFoundSpan);
            animateStat(errorsRemainingSpan);
            
            const foundCount = currentErrors.filter(e => e.found).length;
            const remainingCount = currentErrors.filter(e => !e.found).length;
            
            errorsFoundSpan.innerText = foundCount;
            errorsRemainingSpan.innerText = remainingCount;
            
            feedbackDiv.innerHTML = `<span class="message success">✨ Correto! ${scratchBlocksData[expectedType]}</span>`;
            
            document.getElementById(dataId).style.opacity = "0.3";
            document.getElementById(dataId).style.pointerEvents = "none";
            
            if (remainingCount === 0 && !levelCompleted) {
                levelCompleted = true;
                canClick = false;
                setTimeout(() => showCongrats(), 500);
            }
            // Redesenha para mostrar a bolinha verde imediatamente
            renderLevel();
        } else {
            wrongAttempts++;
            animateStat(errorCountSpan);
            ev.target.style.animation = "errorShake 0.5s ease";
            setTimeout(() => ev.target.style.animation = "", 500);
            feedbackDiv.innerHTML = `<span class="message error">❌ Errado! Esta peça não se encaixa aqui.</span>`;
        }
        
        canClick = false;
        setTimeout(() => { if (!levelCompleted) canClick = true; }, 300);
    }

    function activateHelp() {
        if (!helpActivated && !levelCompleted && wrongAttempts >= 2) {
            helpActivated = true;
            showCircles = true;
            helpUsedCount++;
            renderLevel();
            feedbackDiv.innerHTML = `<span class="message warning">🔆 DICA ATIVADA! Círculos vermelhos mostram onde estão os erros!</span>`;
            forceHelpBtn.disabled = true;
            forceHelpBtn.style.opacity = '0.5';
        }
    }

    function toggleCircles() {
        if (levelCompleted) return;
        if (!helpActivated && wrongAttempts >= 2) {
            activateHelp();
        } else if (helpActivated) {
            showCircles = !showCircles;
            renderLevel();
        } else {
            feedbackDiv.innerHTML = `<span class="message warning">💡 Você precisa errar pelo menos 2 vezes para liberar as dicas.</span>`;
        }
    }

    function handleCanvasClick(e) {
        if (levelCompleted || !canClick) return;
        const rect = canvasErros.getBoundingClientRect();
        let clientX = e.touches ? e.touches[0].clientX : e.clientX;
        let clientY = e.touches ? e.touches[0].clientY : e.clientY;
        if (e.touches) e.preventDefault();

        let canvasX = (clientX - rect.left) * (canvasErros.width / rect.width);
        let canvasY = (clientY - rect.top) * (canvasErros.height / rect.height);

        let hitIndex = -1;
        for (let i = 0; i < currentErrors.length; i++) {
            const err = currentErrors[i];
            if (!err.found) {
                const dist = Math.sqrt(Math.pow(canvasX - err.cx, 2) + Math.pow(canvasY - err.cy, 2));
                if (dist <= err.radius + 15) { hitIndex = i; break; }
            }
        }

        attempts++;
        animateStat(attemptCounterSpan);

        if (hitIndex !== -1) {
            currentErrors[hitIndex].found = true;
            feedbackDiv.innerHTML = `<span class="message success">${currentProfile.winMsg} <br> ${currentErrors[hitIndex].explanation}</span>`;
            animateStat(errorsFoundSpan);
            animateStat(errorsRemainingSpan);

            if (currentErrors.filter(e => !e.found).length === 0) {
                levelCompleted = true;
                canClick = false;
                showCongrats();
            }
            renderLevel(); // Redesenha para mostrar a bolinha verde
        } else {
            wrongAttempts++;
            animateStat(errorCountSpan);
            feedbackDiv.innerHTML = `<span class="message error">❌ Errou! Analise o código com cuidado.</span>`;
            renderLevel();
            updateHelpButton();
        }
        canClick = false;
        setTimeout(() => { if (!levelCompleted) canClick = true; }, 300);
    }

    function loadScratchBlocks() {
        const blockIds = ['correto1', 'correto2', 'correto3', 'correto4', 'correto5', 'correto6', 'correto7'];
        blockIds.forEach(id => {
            const block = document.getElementById(id);
            if (block) {
                block.style.opacity = '1';
                block.style.pointerEvents = 'auto';
                block.style.visibility = 'visible';
                block.draggable = true;
                block.ondragstart = function(e) { drag(e); };
            }
        });
        
        const dropzones = document.querySelectorAll('.dropzone.error');
        const dropzoneMap = {
            'olhos': 'Dormir mais 😴',
            'pijama': 'Sair de pijama 💤',
            'meia': 'Sapato sem meia 👟',
            'lanche': 'Comer o prato 🍽️',
            'pasta': 'Lavar com suco 🥤',
            'mochila': 'Levar o gato 🐱',
            'escola': 'Ir para o parque 🎡'
        };
        
        dropzones.forEach(zone => {
            const expectedType = zone.getAttribute('data-expected');
            zone.innerHTML = dropzoneMap[expectedType] || zone.innerHTML;
            zone.className = 's-block error';
            zone.ondrop = function(e) { drop(e); };
            zone.ondragover = function(e) { allowDrop(e); };
            zone.setAttribute('data-expected', expectedType);
        });
    }

    function loadLevel(levelIndex) {
        const levelData = levels[levelIndex];
        const config = profileConfig[gameState.currentProfile];
        
        thief.active = true;
        thief.x = -60;
        thief.y = 40 + (Math.floor(Math.random() * levelData.correctCode.split("\n").length) * 32);
        
        currentWrongCode = levelData.correctCode;
        
        if (config.useScratch) {
            loadScratchBlocks();
            const blockIds = ['olhos', 'pijama', 'meia', 'lanche', 'pasta', 'mochila', 'escola'];
            currentErrors = blockIds.slice(0, config.maxErrors).map((blockId, idx) => ({
                id: idx,
                blockId: blockId,
                explanation: `✅ ${scratchBlocksData[blockId]}`,
                found: false
            }));
        } else {
            setTimeout(() => { startThiefAnimation(); }, 800);
            
            let levelErrors = levelData.errors.slice(0, config.maxErrors);
            currentErrors = levelErrors.map((err, idx) => ({
                id: idx, line: err.line, charPos: err.charPos, explanation: err.explanation, found: false, cx: 0, cy: 0, radius: 14
            }));
        }

        attempts = 0; wrongAttempts = 0; levelCompleted = false; canClick = false; showCircles = false; helpActivated = false; helpUsedCount = 0; currentLevel = levelIndex;
        forceHelpBtn.style.display = 'none';
        forceHelpBtn.disabled = true;
        forceHelpBtn.style.opacity = '1';

        const areaCanvas = document.getElementById('areaCanvas');
        const areaScratch = document.getElementById('area-scratch');
        
        if (config.useScratch) {
            if (areaScratch) areaScratch.classList.remove('hidden');
            if (areaCanvas) areaCanvas.classList.add('hidden');
            canClick = true;
        } else {
            if (areaCanvas) areaCanvas.classList.remove('hidden');
            if (areaScratch) areaScratch.classList.add('hidden');
        }

        renderLevel();
        drawCodeAndGetPositions(ctxCorrect, levelData.correctCode);
        nextLevelBtn.disabled = true;

        feedbackDiv.innerHTML = `<span class="message warning">${currentProfile.levelIntros[currentLevel]}</span>`;
    }

    function startThiefAnimation() {
        function animate() {
            if (!thief.active) return;
            thief.x += thief.speed;
            renderLevel(); 
            currentProfile.drawEnemy(ctxErros, thief.x, thief.y); 

            if (thief.x < canvasErros.width + 50) requestAnimationFrame(animate);
            else { thief.active = false; stealCodeLine(); }
        }
        animate();
    }

    function stealCodeLine() {
        currentWrongCode = levels[currentLevel].wrongCode; 
        canClick = true; 
        renderLevel();
        feedbackDiv.innerHTML = `<span class="message error">${currentProfile.stealMsg}</span>`;
    }

    function nextLevel() {
        if (currentLevel + 1 < levels.length) loadLevel(currentLevel + 1);
    }

    function resetGame() {
        hideCongrats(); loadLevel(0);
    }

    function backToMenu() {
        hideCongrats();
        levelCompleted = true;
        canClick = false;
        thief.active = false;
        
        const gameContainer = document.querySelector('.game-container');
        if (gameContainer) gameContainer.style.opacity = '0';
        
        setTimeout(() => {
            gameState.profileSelected = false;
            gameState.currentProfile = null;
            gameState.currentTrail = null;
            gameState.currentTheme = null;
            currentProfile = profiles.detetive;
            currentLevel = 0;
            
            try {
                localStorage.removeItem('playerProfile');
            } catch (e) {
                console.warn('Não foi possível limpar o localStorage:', e);
            }
            
            showInitialScreen();
            
            const newGameContainer = document.querySelector('.game-container');
            if (newGameContainer) newGameContainer.style.opacity = '1';
        }, 300);
    }

    function attachEvents() {
        canvasErros.addEventListener('click', handleCanvasClick);
        canvasErros.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleCanvasClick({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY, touches: e.touches });
        }, { passive: false }); 
        nextLevelBtn.addEventListener('click', nextLevel);
        resetBtn.addEventListener('click', resetGame);
        backToMenuBtn.addEventListener('click', backToMenu);
        forceHelpBtn.addEventListener('click', toggleCircles);
        congratsNextBtn.addEventListener('click', nextLevelFromCongrats);
        congratsResetBtn.addEventListener('click', resetFromCongrats);
    }

    function initGameEngine() {
        canvasCorrect.width = 700; canvasCorrect.height = 500;
        canvasErros.width = 700; canvasErros.height = 500;
        attachEvents();
        loadLevel(0);
    }

    // ========== TELA INICIAL ==========
    function showInitialScreen() {
        let initialScreen = document.getElementById('initial-screen');
        if (!initialScreen) {
            initialScreen = document.createElement('div');
            initialScreen.id = 'initial-screen';
            initialScreen.className = 'initial-screen';
            document.body.prepend(initialScreen);
        }

        const modal = document.getElementById('questionnaire-modal');
        if (modal) modal.classList.add('hidden');

        initialScreen.innerHTML = `
            <div class="initial-content">
                <h1>🔍 7 Erros de Programação</h1>
                <p>Encontre os erros no código e torne-se um mestre!</p>
                <button id="play-button">▶ Play</button>
            </div>
        `;

        const styleId = 'initial-screen-style';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                .initial-screen {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #0d1117, #161b22);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                    color: #e6edf3;
                    font-family: 'Segoe UI', system-ui, sans-serif;
                }
                .initial-screen .initial-content {
                    text-align: center;
                    max-width: 600px;
                    padding: 2rem;
                }
                .initial-screen h1 {
                    font-size: 4rem;
                    font-weight: 800;
                    background: linear-gradient(135deg, #f97316, #8b5cf6);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 0.5rem;
                    text-shadow: 0 0 30px rgba(139, 92, 246, 0.3);
                }
                .initial-screen p {
                    font-size: 1.2rem;
                    color: #8b949e;
                    margin-bottom: 2.5rem;
                }
                .initial-screen #play-button {
                    background: linear-gradient(135deg, #22c55e, #16a34a);
                    border: none;
                    color: white;
                    font-size: 1.5rem;
                    font-weight: bold;
                    padding: 1rem 3rem;
                    border-radius: 50px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(34, 197, 94, 0.4);
                    letter-spacing: 1px;
                }
                .initial-screen #play-button:hover {
                    transform: scale(1.05);
                    box-shadow: 0 6px 25px rgba(34, 197, 94, 0.6);
                }
                .initial-screen #play-button:active {
                    transform: scale(0.95);
                }
                .hidden {
                    display: none !important;
                }
            `;
            document.head.appendChild(style);
        }

        initialScreen.classList.remove('hidden');

        const playBtn = document.getElementById('play-button');
        if (playBtn) {
            playBtn.addEventListener('click', function() {
                initialScreen.classList.add('hidden');
                initAdaptiveQuestionnaire();
            });
        }
    }

    // ========== INICIALIZAÇÃO ==========
    document.addEventListener('DOMContentLoaded', function() {
        showInitialScreen();
    });
})();