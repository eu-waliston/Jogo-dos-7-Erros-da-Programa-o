
(function () {
    // ========== DEFINIÇÃO DOS NÍVEIS ==========
    const levels = [
        { // Nível 0 - Iniciante
            name: "INICIANTE",
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
        { // Nível Intermediário
            name: "INTERMEDIÁRIO",
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
        { // Nível Avançado
            name: "AVANÇADO",
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
        }
    ];

    let currentLevel = 0;
    let currentErrors = [];
    let attempts = 0;
    let canClick = true;
    let levelCompleted = false;
    let showCircles = true;

    // Elementos DOM
    const canvasCorrect = document.getElementById('canvasCorrect');
    const canvasErros = document.getElementById('canvasErros');
    const ctxCorrect = canvasCorrect.getContext('2d');
    const ctxErros = canvasErros.getContext('2d');
    const errorsFoundSpan = document.getElementById('errorsFound');
    const errorsRemainingSpan = document.getElementById('errorsRemaining');
    const attemptCounterSpan = document.getElementById('attemptCounter');
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
    const congratsNextBtn = document.getElementById('congratsNextBtn');
    const congratsResetBtn = document.getElementById('congratsResetBtn');

    // Função para mostrar tela de parabéns
    function showCongrats() {
        const level = levels[currentLevel];
        congratsLevelName.innerText = level.name;
        congratsAttempts.innerText = attempts;

        // Preencher lista de erros
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

    // Função para esconder tela de parabéns
    function hideCongrats() {
        congratsOverlay.classList.add('hidden');
    }

    // Função para avançar nível pela tela de parabéns
    function nextLevelFromCongrats() {
        hideCongrats();
        if (currentLevel + 1 < levels.length) {
            loadLevel(currentLevel + 1);
        } else {
            // Jogo completo!
            feedbackDiv.innerHTML = `<span class="message success">✨ PARABÉNS! VOCÊ COMPLETOU TODOS OS NÍVEIS! ✨</span>`;
            nextLevelBtn.disabled = true;
            levelCompleted = true;
        }
    }

    // Função para resetar pela tela de parabéns
    function resetFromCongrats() {
        hideCongrats();
        loadLevel(0);
    }

    // Função para medir largura do texto
    function getTextWidth(text, ctx) {
        return ctx.measureText(text).width;
    }

    // Desenha código e retorna as posições de cada linha
    function drawCodeAndGetPositions(ctx, codeText) {
        const w = canvasCorrect.width, h = canvasCorrect.height;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "#010409";
        ctx.fillRect(0, 0, w, h);

        ctx.font = "24px 'Fira Code', 'Courier New', monospace";
        ctx.textBaseline = "top";

        const lines = codeText.split('\n');
        let y = 40;
        const lineHeight = 38;
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

    // Atualizar posições dos erros baseado nas linhas atuais
    function updateErrorPositions(linePositions) {
        for (let i = 0; i < currentErrors.length; i++) {
            const err = currentErrors[i];
            const lineInfo = linePositions.find(lp => lp.lineIndex === err.line);

            if (lineInfo) {
                const ctx = ctxErros;
                ctx.font = "24px 'Fira Code', 'Courier New', monospace";
                const textBefore = lineInfo.text.substring(0, err.charPos);
                const widthBefore = ctx.measureText(textBefore).width;

                err.cx = lineInfo.x + widthBefore;
                err.cy = lineInfo.y + 15;
                err.radius = 20;
            } else {
                err.cx = 100 + (i * 50);
                err.cy = 100 + (i * 40);
                err.radius = 20;
            }
        }
    }

    // Desenhar círculos de erro
    function drawErrorCircles(ctx) {
        for (let i = 0; i < currentErrors.length; i++) {
            const err = currentErrors[i];

            if (err.found) {
                ctx.beginPath();
                ctx.arc(err.cx, err.cy, err.radius + 3, 0, 2 * Math.PI);
                ctx.fillStyle = "#22c55ecc";
                ctx.fill();
                ctx.beginPath();
                ctx.arc(err.cx, err.cy, err.radius, 0, 2 * Math.PI);
                ctx.fillStyle = "#166534";
                ctx.fill();
                ctx.font = "bold 20px monospace";
                ctx.fillStyle = "white";
                ctx.fillText("✓", err.cx - 7, err.cy + 8);
            }
            else if (showCircles) {
                ctx.shadowBlur = 8;
                ctx.shadowColor = "rgba(255,0,0,0.5)";

                ctx.beginPath();
                ctx.arc(err.cx, err.cy, err.radius + 5, 0, 2 * Math.PI);
                ctx.fillStyle = "#ef4444cc";
                ctx.fill();
                ctx.beginPath();
                ctx.arc(err.cx, err.cy, err.radius + 1, 0, 2 * Math.PI);
                ctx.fillStyle = "#dc2626";
                ctx.fill();
                ctx.beginPath();
                ctx.arc(err.cx, err.cy, err.radius + 1, 0, 2 * Math.PI);
                ctx.strokeStyle = "white";
                ctx.lineWidth = 3;
                ctx.stroke();

                ctx.shadowBlur = 0;

                ctx.font = "bold 20px monospace";
                ctx.fillStyle = "white";
                ctx.fillText((i + 1).toString(), err.cx - 8, err.cy + 9);
            }
        }
    }

    // Renderização completa
    function renderLevel() {
        const level = levels[currentLevel];

        drawCodeAndGetPositions(ctxCorrect, level.correctCode);

        const linePositions = drawCodeAndGetPositions(ctxErros, level.wrongCode);
        updateErrorPositions(linePositions);
        drawErrorCircles(ctxErros);

        levelNameSpan.innerText = level.name;
        const foundCount = currentErrors.filter(e => e.found).length;
        const remainingCount = currentErrors.filter(e => !e.found).length;
        errorsFoundSpan.innerText = foundCount;
        errorsRemainingSpan.innerText = remainingCount;
        attemptCounterSpan.innerText = attempts;

        if (remainingCount === 0 && !levelCompleted) {
            levelCompleted = true;
            canClick = false;
            // Mostrar tela de parabéns em vez de mensagem simples
            showCongrats();
        }
    }

    // Verificar clique no canvas
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

        if (hitIndex !== -1) {
            currentErrors[hitIndex].found = true;
            const remainingCount = currentErrors.filter(e => !e.found).length;

            feedbackDiv.innerHTML = `<span class="message success">✅ ACERTOU! ${currentErrors[hitIndex].explanation}</span>`;

            if (remainingCount === 0) {
                levelCompleted = true;
                canClick = false;
                showCongrats();
            }

            renderLevel();
        } else {
            if (showCircles) {
                feedbackDiv.innerHTML = `<span class="message error">❌ Clique exatamente nos CÍRCULOS VERMELHOS em cima dos erros!</span>`;
            } else {
                feedbackDiv.innerHTML = `<span class="message error">❌ Nenhum erro aqui! Ative os círculos para ver onde estão.</span>`;
            }
            renderLevel();
        }

        canClick = false;
        setTimeout(() => { if (!levelCompleted) canClick = true; }, 300);
    }

    function toggleCircles() {
        if (levelCompleted) {
            feedbackDiv.innerHTML = `<span class="message">Nível completo! Avance ou reinicie.</span>`;
            return;
        }
        showCircles = !showCircles;
        renderLevel();
        feedbackDiv.innerHTML = showCircles ?
            `<span class="message warning">🔴 CÍRCULOS VISÍVEIS! Clique nos círculos vermelhos!</span>` :
            `<span class="message">⚪ Círculos ocultos. Tente achar os erros sozinho!</span>`;
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
            radius: 20
        }));

        attempts = 0;
        levelCompleted = false;
        canClick = true;
        showCircles = true;
        currentLevel = levelIndex;
        renderLevel();
        nextLevelBtn.disabled = true;
        feedbackDiv.innerHTML = `<span class="message">🔴 Nível ${levelData.name}: CLIQUE NOS CÍRCULOS VERMELHOS em cima dos erros! Encontre os 7 erros.</span>`;
    }

    function nextLevel() {
        const remainingCount = currentErrors.filter(e => !e.found).length;
        if (remainingCount === 0) {
            if (currentLevel + 1 < levels.length) {
                loadLevel(currentLevel + 1);
            } else {
                feedbackDiv.innerHTML = `<span class="message success">✨ PARABÉNS! VOCÊ COMPLETOU TODOS OS NÍVEIS! ✨</span>`;
                nextLevelBtn.disabled = true;
                levelCompleted = true;
            }
        } else {
            feedbackDiv.innerHTML = `<span class="message error">⚠️ Ainda faltam ${remainingCount} erros! Encontre todos os círculos vermelhos.</span>`;
        }
    }

    function resetGame() {
        hideCongrats();
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
