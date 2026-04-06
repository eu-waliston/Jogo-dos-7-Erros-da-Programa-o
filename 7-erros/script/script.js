(function () {
    // ========== DEFINIÇÃO DOS NÍVEIS ==========
    const levels = [
        {
            name: "PYTHON - INICIANTE",
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
            name: "PYTHON - INTERMEDIÁRIO",
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
            name: "PYTHON - AVANÇADO",
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
            name: "HTML - BÁSICO",
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
            name: "HTML - AVANÇADO",
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

    let currentLevel = 0;
    let currentErrors = [];
    let attempts = 0;
    let wrongAttempts = 0;
    let canClick = true;
    let levelCompleted = false;
    let showCircles = false;
    let helpActivated = false;
    let helpUsedCount = 0;
    let pulseAnimationId = null;
    let pulseActive = false;

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
    const forceHelpBtn = document.getElementById('forceHelpBtn');

    // Elementos da tela de parabéns
    const congratsOverlay = document.getElementById('congratsOverlay');
    const congratsLevelName = document.getElementById('congratsLevelName');
    const errorsListContainer = document.getElementById('errorsListContainer');
    const congratsAttempts = document.getElementById('congratsAttempts');
    const congratsHelpUsed = document.getElementById('congratsHelpUsed');
    const congratsNextBtn = document.getElementById('congratsNextBtn');
    const congratsResetBtn = document.getElementById('congratsResetBtn');

    // Variáveis para animação de pulso
    let pulseFrame = 0;
    let pulseDirection = 1;

    function animateStat(element) {
        element.classList.add('animate');
        setTimeout(() => element.classList.remove('animate'), 300);
    }

    function updateHelpButton() {
        if (wrongAttempts >= 1 && !helpActivated && !levelCompleted) {
            forceHelpBtn.style.display = 'block';
            forceHelpBtn.disabled = false;
            forceHelpBtn.classList.add('visible');
            feedbackDiv.innerHTML = `<span class="message warning">💡 DICA DISPONÍVEL! Clique no botão "MOSTRA DICAS" para ver os círculos dos erros!</span>`;
            setTimeout(() => {
                if (!levelCompleted && wrongAttempts >= 2 && !helpActivated) {
                    feedbackDiv.innerHTML = `<span class="message warning">🔴 Você errou ${wrongAttempts} vezes! Ative as dicas clicando no botão laranja!</span>`;
                }
            }, 4000);
        }
    }

    // Iniciar animação de pulso nos erros (após 1 erro)
    function startPulseAnimation() {
        if (pulseActive) return;
        pulseActive = true;
        pulseFrame = 0;
        pulseDirection = 1;

        function animatePulse() {
            if (!pulseActive || levelCompleted || helpActivated) {
                pulseActive = false;
                return;
            }

            // Atualiza o frame do pulso (oscila entre 0 e 1)
            pulseFrame += 0.05 * pulseDirection;
            if (pulseFrame >= 1) {
                pulseFrame = 1;
                pulseDirection = -1;
            } else if (pulseFrame <= 0) {
                pulseFrame = 0;
                pulseDirection = 1;
            }

            // Re-renderiza com o efeito de pulso
            renderLevelWithPulse(pulseFrame);

            pulseAnimationId = requestAnimationFrame(animatePulse);
        }

        pulseAnimationId = requestAnimationFrame(animatePulse);
    }

    function stopPulseAnimation() {
        if (pulseAnimationId) {
            cancelAnimationFrame(pulseAnimationId);
            pulseAnimationId = null;
        }
        pulseActive = false;
        renderLevel(); // Renderiza sem o pulso
    }

    function renderLevelWithPulse(pulseIntensity) {
        const level = levels[currentLevel];

        drawCodeAndGetPositions(ctxCorrect, level.correctCode);

        const linePositions = drawCodeAndGetPositions(ctxErros, level.wrongCode);
        updateErrorPositions(linePositions);
        drawErrorCircles(ctxErros, pulseIntensity);

        levelNameSpan.innerText = `${level.language} - ${level.name}`;
        const foundCount = currentErrors.filter(e => e.found).length;
        const remainingCount = currentErrors.filter(e => !e.found).length;
        errorsFoundSpan.innerText = foundCount;
        errorsRemainingSpan.innerText = remainingCount;
        attemptCounterSpan.innerText = attempts;
        errorCountSpan.innerText = wrongAttempts;

        if (remainingCount === 0 && !levelCompleted) {
            levelCompleted = true;
            canClick = false;
            stopPulseAnimation();
            showCongrats();
        }
    }

    function drawErrorCircles(ctx, pulseIntensity = 0) {
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
            else if (showCircles) {
                ctx.shadowBlur = 4;
                ctx.shadowColor = "rgba(255,0,0,0.2)";

                ctx.beginPath();
                ctx.arc(err.cx, err.cy, err.radius + 3, 0, 2 * Math.PI);
                ctx.fillStyle = "#ef444433";
                ctx.fill();

                ctx.beginPath();
                ctx.arc(err.cx, err.cy, err.radius + 1, 0, 2 * Math.PI);
                ctx.fillStyle = "#dc262655";
                ctx.fill();

                ctx.beginPath();
                ctx.arc(err.cx, err.cy, err.radius - 2, 0, 2 * Math.PI);
                ctx.fillStyle = "#ef444488";
                ctx.fill();

                ctx.beginPath();
                ctx.arc(err.cx, err.cy, err.radius, 0, 2 * Math.PI);
                ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
                ctx.lineWidth = 1.5;
                ctx.stroke();

                ctx.shadowBlur = 0;

                ctx.font = "bold 12px monospace";
                ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
                ctx.fillText((i + 1).toString(), err.cx - 4, err.cy + 5);
            }
            else if (pulseIntensity > 0 && wrongAttempts >= 1 && !helpActivated && !err.found) {
                // EFEITO DE PULSO - círculo quase transparente que aumenta e diminui
                const scale = 1 + (pulseIntensity * 0.4); // Aumenta até 40% do tamanho
                const opacity = 0.3 + (pulseIntensity * 0.2); // Opacidade varia entre 0.3 e 0.5
                const pulseRadius = err.radius + 5 + (pulseIntensity * 8);

                ctx.shadowBlur = 8;
                ctx.shadowColor = `rgba(255, 100, 0, ${opacity * 0.5})`;

                // Círculo pulsante externo
                ctx.beginPath();
                ctx.arc(err.cx, err.cy, pulseRadius, 0, 2 * Math.PI);
                ctx.fillStyle = `rgba(255, 100, 0, ${opacity * 0.3})`;
                ctx.fill();

                // Círculo médio pulsante
                ctx.beginPath();
                ctx.arc(err.cx, err.cy, err.radius + 3 + (pulseIntensity * 4), 0, 2 * Math.PI);
                ctx.fillStyle = `rgba(255, 120, 0, ${opacity * 0.4})`;
                ctx.fill();

                // Círculo interno com brilho
                ctx.beginPath();
                ctx.arc(err.cx, err.cy, err.radius - 2, 0, 2 * Math.PI);
                ctx.fillStyle = `rgba(255, 80, 0, ${opacity * 0.5})`;
                ctx.fill();

                // Borda pulsante
                ctx.beginPath();
                ctx.arc(err.cx, err.cy, err.radius + 1, 0, 2 * Math.PI);
                ctx.strokeStyle = `rgba(255, 150, 50, ${0.6 + pulseIntensity * 0.4})`;
                ctx.lineWidth = 2 + pulseIntensity * 2;
                ctx.stroke();

                ctx.shadowBlur = 0;

                // Número visível mesmo com pulso
                ctx.font = "bold 12px monospace";
                ctx.fillStyle = `rgba(255, 200, 100, 0.9)`;
                ctx.fillText((i + 1).toString(), err.cx - 4, err.cy + 5);
            }
        }
    }

    function showCongrats() {
        const level = levels[currentLevel];
        congratsLevelName.innerText = `${level.language} - ${level.name}`;
        congratsAttempts.innerText = attempts;
        congratsHelpUsed.innerText = helpUsedCount;

        errorsListContainer.innerHTML = '';
        currentErrors.forEach((err, index) => {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-item';
            errorDiv.style.animationDelay = `${index * 0.05}s`;
            errorDiv.innerHTML = `
                    <div class="error-number">${index + 1}</div>
                    <div class="error-text">${err.explanation}</div>
                `;
            errorsListContainer.appendChild(errorDiv);
        });

        congratsOverlay.classList.remove('hidden');
    }

    function hideCongrats() {
        congratsOverlay.classList.add('hidden');
    }

    function nextLevelFromCongrats() {
        hideCongrats();
        if (currentLevel + 1 < levels.length) {
            loadLevel(currentLevel + 1);
        } else {
            feedbackDiv.innerHTML = `<span class="message success">✨ PARABÉNS! VOCÊ COMPLETOU TODOS OS 5 NÍVEIS! ✨</span>`;
            nextLevelBtn.disabled = true;
            levelCompleted = true;
        }
    }

    function resetFromCongrats() {
        hideCongrats();
        loadLevel(0);
    }

    function drawCodeAndGetPositions(ctx, codeText) {
        const w = canvasCorrect.width, h = canvasCorrect.height;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "#010409";
        ctx.fillRect(0, 0, w, h);

        ctx.font = "20px 'Fira Code', 'Courier New', monospace";
        ctx.textBaseline = "top";

        const lines = codeText.split('\n');
        let y = 40;
        const lineHeight = 32;
        const paddingX = 35;

        const linePositions = [];

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            ctx.fillStyle = "#e6edf3";
            ctx.fillText(line, paddingX, y);

            linePositions.push({
                lineIndex: i,
                y: y,
                x: paddingX,
                text: line
            });

            y += lineHeight;
            if (y > h - 30) break;
        }

        return linePositions;
    }

    function updateErrorPositions(linePositions) {
        for (let i = 0; i < currentErrors.length; i++) {
            const err = currentErrors[i];
            const lineInfo = linePositions.find(lp => lp.lineIndex === err.line);

            if (lineInfo) {
                const ctx = ctxErros;
                ctx.font = "20px 'Fira Code', 'Courier New', monospace";
                const textBefore = lineInfo.text.substring(0, err.charPos);
                const widthBefore = ctx.measureText(textBefore).width;

                err.cx = lineInfo.x + widthBefore;
                err.cy = lineInfo.y + 12;
                err.radius = 14;
            } else {
                err.cx = 100 + (i * 50);
                err.cy = 100 + (i * 40);
                err.radius = 14;
            }
        }
    }

    function renderLevel() {
        renderLevelWithPulse(0);
    }

    function activateHelp() {
        if (!helpActivated && !levelCompleted && wrongAttempts >= 2) {
            helpActivated = true;
            showCircles = true;
            helpUsedCount++;
            stopPulseAnimation(); // Para a animação de pulso
            renderLevel();
            feedbackDiv.innerHTML = `<span class="message warning">🔆 DICA ATIVADA! Círculos vermelhos mostram onde estão os erros!</span>`;
            forceHelpBtn.disabled = true;
            forceHelpBtn.style.opacity = '0.5';
        }
    }

    function handleCanvasClick(e) {
        if (levelCompleted || !canClick) return;

        const rect = canvasErros.getBoundingClientRect();
        const scaleX = canvasErros.width / rect.width;
        const scaleY = canvasErros.height / rect.height;

        let clientX, clientY;
        if (e.touches) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
            e.preventDefault();
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        let canvasX = (clientX - rect.left) * scaleX;
        let canvasY = (clientY - rect.top) * scaleY;

        if (canvasX < 0 || canvasX > canvasErros.width || canvasY < 0 || canvasY > canvasErros.height) return;

        let hitIndex = -1;
        for (let i = 0; i < currentErrors.length; i++) {
            const err = currentErrors[i];
            if (!err.found) {
                const dx = canvasX - err.cx;
                const dy = canvasY - err.cy;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist <= err.radius + 12) {
                    hitIndex = i;
                    break;
                }
            }
        }

        attempts++;
        animateStat(attemptCounterSpan);

        if (hitIndex !== -1) {
            // ACERTOU
            currentErrors[hitIndex].found = true;
            const remainingCount = currentErrors.filter(e => !e.found).length;

            feedbackDiv.innerHTML = `<span class="message success">✅ ACERTOU! ${currentErrors[hitIndex].explanation}</span>`;
            animateStat(errorsFoundSpan);
            animateStat(errorsRemainingSpan);

            // Se ainda faltam erros e tem pulso ativo, continua
            if (remainingCount > 0 && wrongAttempts >= 1 && !helpActivated) {
                // Continua o pulso
            } else if (remainingCount === 0) {
                stopPulseAnimation();
            }

            if (remainingCount === 0) {
                levelCompleted = true;
                canClick = false;
                stopPulseAnimation();
                showCongrats();
            }

            renderLevel();
        } else {
            // ERROU
            const wasWrongAttempts = wrongAttempts;
            wrongAttempts++;
            animateStat(errorCountSpan);

            // Se foi o PRIMEIRO erro, inicia a animação de pulso
            if (wasWrongAttempts === 0 && wrongAttempts === 1 && !helpActivated) {
                startPulseAnimation();
                feedbackDiv.innerHTML = `<span class="message warning">🔵 DICA VISUAL ATIVADA! Os erros estão pulsando! Após 2 erros, círculos fixos aparecerão.</span>`;
            } else if (wrongAttempts < 2) {
                const remainingToHelp = 2 - wrongAttempts;
                feedbackDiv.innerHTML = `<span class="message error">❌ Errou! Faltam ${remainingToHelp} erro(s) para liberar as dicas fixas. Os erros estão pulsando!</span>`;
            } else {
                feedbackDiv.innerHTML = `<span class="message error">❌ Errou! Clique no botão laranja para ver as dicas fixas!</span>`;
            }

            renderLevel();
            updateHelpButton();
        }

        canClick = false;
        setTimeout(() => { if (!levelCompleted) canClick = true; }, 300);
    }

    function toggleCircles() {
        if (levelCompleted) {
            feedbackDiv.innerHTML = `<span class="message">Nível completo! Avance ou reinicie.</span>`;
            return;
        }

        if (wrongAttempts >= 2 && !helpActivated) {
            activateHelp();
        } else if (helpActivated) {
            showCircles = !showCircles;
            if (!showCircles && wrongAttempts >= 1 && !helpActivated) {
                // Se esconder círculos e tiver pulso, reativa o pulso
                startPulseAnimation();
            } else if (showCircles) {
                stopPulseAnimation();
            }
            renderLevel();
            feedbackDiv.innerHTML = showCircles ?
                `<span class="message warning">🔴 CÍRCULOS VISÍVEIS! Clique nos círculos vermelhos!</span>` :
                `<span class="message">⚪ Círculos ocultos. ${wrongAttempts >= 1 ? 'Os erros estão pulsando!' : 'Tente achar os erros sozinho!'}</span>`;
        } else {
            feedbackDiv.innerHTML = `<span class="message error">⚠️ Você precisa errar ${2 - wrongAttempts} vez(es) para liberar as dicas!</span>`;
        }
    }

    function loadLevel(levelIndex) {
        const levelData = levels[levelIndex];
        currentErrors = levelData.errors.map((err, idx) => ({
            id: idx,
            line: err.line,
            charPos: err.charPos,
            explanation: err.explanation,
            found: false,
            cx: 0,
            cy: 0,
            radius: 14
        }));

        attempts = 0;
        wrongAttempts = 0;
        levelCompleted = false;
        canClick = true;
        showCircles = false;
        helpActivated = false;
        helpUsedCount = 0;
        currentLevel = levelIndex;

        // Para animação de pulso se estiver ativa
        stopPulseAnimation();

        // Reset botão de ajuda
        forceHelpBtn.style.display = 'none';
        forceHelpBtn.disabled = true;
        forceHelpBtn.style.opacity = '1';

        renderLevel();
        nextLevelBtn.disabled = true;
        feedbackDiv.innerHTML = `<span class="message">🔴 Nível ${levelData.language} - ${levelData.name}: Encontre os 7 erros! Após 1 erro, os erros vão piscar! Após 2 erros, dicas fixas serão liberadas.</span>`;
    }

    function nextLevel() {
        const remainingCount = currentErrors.filter(e => !e.found).length;
        if (remainingCount === 0) {
            if (currentLevel + 1 < levels.length) {
                loadLevel(currentLevel + 1);
            } else {
                feedbackDiv.innerHTML = `<span class="message success">✨ PARABÉNS! VOCÊ COMPLETOU TODOS OS 5 NÍVEIS! ✨</span>`;
                nextLevelBtn.disabled = true;
                levelCompleted = true;
            }
        } else {
            feedbackDiv.innerHTML = `<span class="message error">⚠️ Ainda faltam ${remainingCount} erros! Encontre todos os círculos.</span>`;
        }
    }

    function resetGame() {
        hideCongrats();
        stopPulseAnimation();
        loadLevel(0);
    }

    function initCanvasDimensions() {
        canvasCorrect.width = 700;
        canvasCorrect.height = 500;
        canvasErros.width = 700;
        canvasErros.height = 500;
    }

    function attachEvents() {
        canvasErros.addEventListener('click', handleCanvasClick);
        canvasErros.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            handleCanvasClick({ clientX: touch.clientX, clientY: touch.clientY });
        });
        nextLevelBtn.addEventListener('click', nextLevel);
        resetBtn.addEventListener('click', resetGame);
        forceHelpBtn.addEventListener('click', toggleCircles);
        congratsNextBtn.addEventListener('click', nextLevelFromCongrats);
        congratsResetBtn.addEventListener('click', resetFromCongrats);
    }

    function init() {
        initCanvasDimensions();
        attachEvents();
        loadLevel(0);
    }

    init();
})();