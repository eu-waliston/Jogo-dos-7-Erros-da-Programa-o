// ========== SISTEMA DE QUESTIONÁRIO E SELEÇÃO ADAPTATIVA ==========
const AdaptiveQuestionnaire = (function() {
    // ========== DEFINIÇÃO DAS TRILHAS PRINCIPAIS ==========
    const trails = {
        iniciante: {
            id: 'iniciante', name: '🌟 Iniciante', icon: '🎓',
            description: 'Para quem está começando do zero. Desafios simplificados, muitas dicas e passo a passo!',
            characteristics: { difficulty: 'beginner', maxErrors: 4, hintFrequency: 'always', timeLimit: null, tutorialExtended: true, dailyGoals: 2, dailyStreak: true },
            profiles: ['iniciante'], color: '#2563eb', emoji: '🎓'
        },
        explorador: {
            id: 'explorador', name: '🔍 Explorador', icon: '🧭',
            description: 'Para aprendizes curiosos. Foco em investigação, puzzles moderados e recompensas por exploração.',
            characteristics: { difficulty: 'easy', maxErrors: 5, hintFrequency: 'contextual', timeLimit: null, tutorialExtended: true, dailyGoals: 3, dailyStreak: true },
            profiles: ['explorador'], color: '#f97316', emoji: '🧭'
        },
        hacker: {
            id: 'hacker', name: '💻 Hacker', icon: '🎯',
            description: 'Para programadores intermediários. Bugs para corrigir, sistemas de lógica e missions técnicas.',
            characteristics: { difficulty: 'intermediate', maxErrors: 6, hintFrequency: 'minimal', timeLimit: null, tutorialExtended: false, dailyGoals: 5, dailyStreak: true },
            profiles: ['hacker'], color: '#22c55e', emoji: '🎯'
        },
        mestre: {
            id: 'mestre', name: '👑 Mestre', icon: '⚡',
            description: 'Para especialistas. Máxima dificuldade, pouquíssimas dicas, desafios contra o tempo.',
            characteristics: { difficulty: 'expert', maxErrors: 7, hintFrequency: 'none', timeLimit: 300, tutorialExtended: false, dailyGoals: 10, dailyStreak: true, leaderboard: true, achievements: true },
            profiles: ['mestre'], color: '#8b5cf6', emoji: '⚡'
        }
    };

    // ========== TEMATIZAÇÃO NARRATIVA ==========
    const themes = {
        fantasia: {
            id: 'fantasia', name: '🧙 Fantasia e Magia', description: 'Reinos mágicos, feitiços e criaturas fantásticas',
            characters: { ally: '🧙‍♂️ Mago do Código', enemy: 'Goblin Ladrão de Feitiços', setting: 'Grimório Antigo' },
            narrative: { intro: 'Bem-vindo ao grimório do código! Você é um aprendiz de magia de programação.', levelIntro: (level) => `O Goblin Ladrão está tentando sabotar o feitiço ${level}. Proteja a magia!`, victory: '✨ FEITIÇO RESTAURADO!', defeat: '💥 O Goblin danificou a magia!' }
        },
        tecnologia: {
            id: 'tecnologia', name: '💻 Tecnologia e Hackers', description: 'Sistemas digitais, IA e segurança cibernética',
            characters: { ally: '🤖 IA Guardiã', enemy: 'Vírus "Glitch"', setting: 'Rede Digital' },
            narrative: { intro: 'Você é um hacker ético em missão para proteger o código!', levelIntro: (level) => `⚠️ ALERTA: O Glitch infectou o Sistema ${level}. Debug imediatamente!`, victory: '✅ DEBUG CONCLUÍDO!', defeat: '💥 MALWARE EXECUTADO!' }
        },
        misterio: {
            id: 'misterio', name: '🕵️ Mistério e Investigação', description: 'Casos para resolver, pistas e narrativa investigativa',
            characters: { ally: '🕵️ Detetive Cibernético', enemy: 'O Falsificador', setting: 'Cena do Crime Digital' },
            narrative: { intro: 'Você é um detetive. Sua missão: encontrar os culpados no código!', levelIntro: (level) => `Caso ${level}: Encontre as pistas escondidas no código!`, victory: '🎯 MISTÉRIO RESOLVIDO!', defeat: '❌ PISTAS PERDIDAS!' }
        },
        competicao: {
            id: 'competicao', name: '🏆 Competição e Desafio', description: 'Rankings, torneios e objetivos de desempenho',
            characters: { ally: '⚡ Campeão', enemy: 'Rival Implacável', setting: 'Arena Digital' },
            narrative: { intro: 'Bem-vindo à arena! Você será testado nos desafios mais difíceis.', levelIntro: (level) => `Rodada ${level}: Supere seu limite e domine o código!`, victory: '🥇 VITÓRIA!', defeat: '⚔️ DERROTA!' }
        }
    };

    // ========== QUESTÕES (COMPLETAS) ==========
    const questions = [
        // Pergunta 1: Experiência com programação
        {
            id: 1, question: 'Você já teve contato com programação?', emoji: '📚',
            options: [
                { text: 'Nunca', value: 'nunca', scores: { iniciante: 3, explorador: 1, hacker: -2, mestre: -5 } },
                { text: 'Já vi alguns conceitos', value: 'basico', scores: { iniciante: 1, explorador: 2, hacker: 0, mestre: -1 } },
                { text: 'Tenho experiência intermediária', value: 'intermediario', scores: { iniciante: -1, explorador: 1, hacker: 3, mestre: 1 } },
                { text: 'Avançado', value: 'avancado', scores: { iniciante: -3, explorador: 1, hacker: 2, mestre: 3 } }
            ]
        },
        // Pergunta 2: Estilo de aprendizado
        {
            id: 2, question: 'Como você prefere aprender algo novo?', emoji: '🧠',
            options: [
                { text: 'Passo a passo com muitos exemplos', value: 'passo', scores: { iniciante: 3, explorador: 1, hacker: -1, mestre: -2 } },
                { text: 'Explorando por conta própria e descobrindo', value: 'explorar', scores: { iniciante: 0, explorador: 3, hacker: 2, mestre: 1 } },
                { text: 'Resolvendo problemas práticos diretos', value: 'pratico', scores: { iniciante: -1, explorador: 1, hacker: 3, mestre: 2 } },
                { text: 'Desafiando-me com problemas complexos', value: 'desafio', scores: { iniciante: -2, explorador: 0, hacker: 2, mestre: 4 } }
            ]
        },
        // Pergunta 3: Preferência de jogos
        {
            id: 3, question: 'Que tipo de jogo você mais gosta?', emoji: '🎮',
            options: [
                { text: 'Jogos de aventura e história', value: 'aventura', themeScore: { fantasia: 3, misterio: 2, tecnologia: 0, competicao: -1 } },
                { text: 'Jogos de estratégia e quebra-cabeça', value: 'estrategia', themeScore: { fantasia: 1, misterio: 3, tecnologia: 2, competicao: 2 } },
                { text: 'Jogos de ação e reflexos', value: 'acao', themeScore: { fantasia: 0, misterio: -1, tecnologia: 2, competicao: 4 } },
                { text: 'Jogos de simulação e construção', value: 'simulacao', themeScore: { fantasia: 1, misterio: 0, tecnologia: 4, competicao: 1 } }
            ]
        },
        // Pergunta 4: Abordagem a problemas
        {
            id: 4, question: 'Quando você enfrenta um erro no código, qual é sua primeira reação?', emoji: '🐛',
            options: [
                { text: 'Pânico, peço ajuda imediatamente', value: 'panico', scores: { iniciante: 2, explorador: -1, hacker: -2, mestre: -3 } },
                { text: 'Leio a mensagem de erro e pesquiso', value: 'pesquisar', scores: { iniciante: 0, explorador: 2, hacker: 1, mestre: 1 } },
                { text: 'Tento entender a lógica e depurar sozinho', value: 'depurar', scores: { iniciante: -2, explorador: 1, hacker: 3, mestre: 2 } },
                { text: 'Uso ferramentas e técnicas avançadas', value: 'ferramentas', scores: { iniciante: -3, explorador: 0, hacker: 2, mestre: 4 } }
            ]
        },
        // Pergunta 5: Competitividade
        {
            id: 5, question: 'O que você acha de competições de programação?', emoji: '🏁',
            options: [
                { text: 'Não gosto, prefiro colaborar', value: 'colaborar', scores: { iniciante: 2, explorador: 1, hacker: 0, mestre: -2 } },
                { text: 'Acho interessante, mas não participo', value: 'interessado', scores: { iniciante: 0, explorador: 1, hacker: 0, mestre: 1 } },
                { text: 'Gosto de participar por diversão', value: 'diversao', scores: { iniciante: -1, explorador: 2, hacker: 1, mestre: 1 } },
                { text: 'Sou viciado em subir rankings', value: 'rank', scores: { iniciante: -3, explorador: 0, hacker: 2, mestre: 4 } }
            ]
        },
        // Pergunta 6: Preferência narrativa
        {
            id: 6, question: 'Em um jogo, o que mais te atrai?', emoji: '📖',
            options: [
                { text: 'A história e os personagens', value: 'historia', themeScore: { fantasia: 4, misterio: 3, tecnologia: 0, competicao: -1 } },
                { text: 'Os desafios e mecânicas', value: 'mecanica', themeScore: { fantasia: 0, misterio: 1, tecnologia: 3, competicao: 4 } },
                { text: 'O mundo e a exploração', value: 'mundo', themeScore: { fantasia: 2, misterio: 2, tecnologia: 2, competicao: 0 } },
                { text: 'A competição e o ranking', value: 'competicao', themeScore: { fantasia: -1, misterio: -1, tecnologia: 0, competicao: 5 } }
            ]
        },
        // Pergunta 7: Paciência para depuração
        {
            id: 7, question: 'Quanto tempo você consegue passar debugando um problema?', emoji: '⏳',
            options: [
                { text: 'Pouco tempo, desisto rápido', value: 'pouco', scores: { iniciante: 1, explorador: -1, hacker: -2, mestre: -3 } },
                { text: 'Até uma hora', value: 'uma_hora', scores: { iniciante: 0, explorador: 1, hacker: 0, mestre: -1 } },
                { text: 'Horas, até resolver', value: 'horas', scores: { iniciante: -2, explorador: 1, hacker: 3, mestre: 2 } },
                { text: 'Dias, se necessário', value: 'dias', scores: { iniciante: -3, explorador: 0, hacker: 2, mestre: 4 } }
            ]
        },
        // Pergunta 8: Tema preferido (existente)
        {
            id: 8, question: 'Qual tema você prefere?', emoji: '🎭',
            options: [
                { text: '🧙 Fantasia e Magia', value: 'fantasia', themeScore: { fantasia: 3, tecnologia: 0, misterio: 0, competicao: 0 } },
                { text: '💻 Tecnologia e Hackers', value: 'tecnologia', themeScore: { fantasia: 0, tecnologia: 3, misterio: 0, competicao: 1 } },
                { text: '🕵️ Mistério e Investigação', value: 'misterio', themeScore: { fantasia: 0, tecnologia: 0, misterio: 3, competicao: 0 } },
                { text: '🏆 Competição e Desafio', value: 'competicao', themeScore: { fantasia: 0, tecnologia: 1, misterio: 0, competicao: 3 } }
            ]
        },
        // Pergunta 9: Preferência por teoria vs prática
        {
            id: 9, question: 'O que você prefere ao estudar programação?', emoji: '📘',
            options: [
                { text: 'Ler teoria e conceitos antes de praticar', value: 'teoria', scores: { iniciante: 2, explorador: 0, hacker: -1, mestre: -1 } },
                { text: 'Ver exemplos práticos primeiro', value: 'exemplos', scores: { iniciante: 1, explorador: 2, hacker: 1, mestre: 0 } },
                { text: 'Mergulhar em projetos reais', value: 'projetos', scores: { iniciante: -2, explorador: 1, hacker: 3, mestre: 3 } },
                { text: 'Resolver muitos exercícios', value: 'exercicios', scores: { iniciante: 0, explorador: 1, hacker: 2, mestre: 1 } }
            ]
        },
        // Pergunta 10: Interesse em história do jogo
        {
            id: 10, question: 'Você gosta de imersão narrativa nos jogos?', emoji: '🎭',
            options: [
                { text: 'Sim, adoro uma boa história', value: 'sim_historia', themeScore: { fantasia: 3, misterio: 3, tecnologia: 0, competicao: -2 } },
                { text: 'Um pouco, mas não essencial', value: 'pouco_historia', themeScore: { fantasia: 0, misterio: 1, tecnologia: 2, competicao: 1 } },
                { text: 'Não, foco só na jogabilidade', value: 'nao_historia', themeScore: { fantasia: -2, misterio: -1, tecnologia: 2, competicao: 4 } }
            ]
        }
    ];

    // ========== ESTADO GLOBAL ==========
    let currentQuestionIndex = 0;
    let responses = {};
    let scores = { iniciante: 0, explorador: 0, hacker: 0, mestre: 0 };
    let themeScores = { fantasia: 0, tecnologia: 0, misterio: 0, competicao: 0 };
    let selectedTrail = null;
    let selectedTheme = null;
    let onQuestionnaireComplete = function() {};

    // ========== FUNÇÕES DE CÁLCULO (INALTERADAS) ==========
    function calculateScores() {
        scores = { iniciante: 0, explorador: 0, hacker: 0, mestre: 0 };
        themeScores = { fantasia: 0, tecnologia: 0, misterio: 0, competicao: 0 };
        Object.keys(responses).forEach(questionId => {
            const question = questions.find(q => q.id === parseInt(questionId));
            if (!question) return;
            const selectedOptionValue = responses[questionId];
            const option = question.options.find(o => o.value === selectedOptionValue);
            if (!option) return;
            if (option.scores) Object.keys(option.scores).forEach(t => scores[t] += option.scores[t]);
            if (option.themeScore) Object.keys(option.themeScore).forEach(t => themeScores[t] += option.themeScore[t]);
        });
    }

    function determineTrail() {
        calculateScores();
        const maxScore = Math.max(scores.iniciante, scores.explorador, scores.hacker, scores.mestre);
        if (maxScore <= -5) return 'iniciante';
        const trailOrder = ['mestre', 'hacker', 'explorador', 'iniciante'];
        for (let trail of trailOrder) { if (scores[trail] === maxScore) return trail; }
        return 'iniciante';
    }

    function determineTheme() {
        const maxThemeScore = Math.max(themeScores.fantasia, themeScores.tecnologia, themeScores.misterio, themeScores.competicao);
        const themeOrder = ['fantasia', 'tecnologia', 'misterio', 'competicao'];
        for (let theme of themeOrder) { if (themeScores[theme] === maxThemeScore) return theme; }
        return 'fantasia';
    }

    function saveProfileToLocalStorage(trail, theme) {
        const profile = { trail, theme, completedAt: new Date().toISOString(), responses, scores, themeScores };
        try {
            localStorage.setItem('playerProfile', JSON.stringify(profile));
        } catch (e) {
            console.warn('Não foi possível salvar o perfil no localStorage:', e);
        }
    }

    // ========== GERENCIAMENTO DE FLUXO E DOM ==========

    function setVisibleScreen(screenId) {
        const screens = ['welcome-screen', 'quiz-flow-container', 'direct-trail-container', 'result-screen'];
        screens.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                element.classList.toggle('hidden', id !== screenId);
            }
        });
    }

    function showModeSelection() {
        setVisibleScreen('welcome-screen');
    }

    function startQuizMode() {
        setVisibleScreen('quiz-flow-container');
        buildQuestionsDOM();
        updateUI();
    }

    function startDirectSelectionMode() {
        setVisibleScreen('direct-trail-container');
        buildDirectSelectionDOM();
    }

    function buildDirectSelectionDOM() {
        const container = document.getElementById('trail-cards-grid');
        if (!container) return;
        container.innerHTML = '';

        // Cria os cards de trilhas dinamicamente
        Object.keys(trails).forEach(trailKey => {
            const trail = trails[trailKey];
            const card = document.createElement('div');
            card.className = 'trail-card';
            card.style.borderLeft = `5px solid ${trail.color}`;
            card.innerHTML = `
                <h3>${trail.name}</h3>
                <p>${trail.description}</p>
                <small>Dificuldade: ${trail.characteristics.difficulty}</small>
            `;
            card.addEventListener('click', () => {
                selectedTrail = trailKey;
                const defaultThemes = {
                    iniciante: 'fantasia',
                    explorador: 'misterio',
                    hacker: 'tecnologia',
                    mestre: 'competicao'
                };
                selectedTheme = defaultThemes[trailKey] || 'tecnologia';

                showResultScreen(true);
            });
            container.appendChild(card);
        });
    }

    function buildQuestionsDOM() {
        const container = document.getElementById('questions-container');
        if (!container) return;
        container.innerHTML = '';

        questions.forEach((question, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = `question-item ${index === 0 ? '' : 'hidden'}`;
            questionDiv.id = `q-item-${index}`;
            
            const questionText = document.createElement('div');
            questionText.className = 'question-text';
            questionText.innerHTML = `<div class="question-number">${question.id}</div><span>${question.emoji} ${question.question}</span>`;
            questionDiv.appendChild(questionText);

            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'answer-options';
            
            question.options.forEach((option) => {
                const optionLabel = document.createElement('label');
                optionLabel.className = 'answer-option';
                
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = `question-${question.id}`;
                radio.value = option.value;
                radio.checked = responses[question.id] === option.value;
                
                radio.addEventListener('change', () => {
                    responses[question.id] = option.value;
                    updateUI();
                });

                const labelText = document.createElement('span');
                labelText.textContent = option.text;
                labelText.style.marginLeft = '10px';

                optionLabel.appendChild(radio);
                optionLabel.appendChild(labelText);
                optionsDiv.appendChild(optionLabel);
            });

            questionDiv.appendChild(optionsDiv);
            container.appendChild(questionDiv);
        });
    }

    function updateQuestionsVisibility() {
        questions.forEach((_, index) => {
            const el = document.getElementById(`q-item-${index}`);
            if (el) el.classList.toggle('hidden', index !== currentQuestionIndex);
        });
    }

    function updateUI() {
        const answeredCount = Object.keys(responses).length;
        const totalQuestions = questions.length;
        const progress = (answeredCount / totalQuestions) * 100;
        
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        if (progressFill) progressFill.style.width = progress + '%';
        if (progressText) progressText.textContent = `Pergunta ${currentQuestionIndex + 1}/${totalQuestions}`;

        const currentQuestion = questions[currentQuestionIndex];
        const currentQuestionAnswered = currentQuestion ? responses[currentQuestion.id] !== undefined : false;
        
        const nextBtn = document.getElementById('questionnaire-next-btn');
        const prevBtn = document.getElementById('questionnaire-prev-btn');

        if (prevBtn) prevBtn.disabled = currentQuestionIndex === 0;
        if (nextBtn) {
            nextBtn.textContent = currentQuestionIndex === questions.length - 1 ? 'ENVIAR RESPOSTAS ✅' : 'PRÓXIMO ➡️';
            nextBtn.disabled = !currentQuestionAnswered;
        }
    }

    function showResultScreen(isDirectSelection = false) {
        if (!isDirectSelection) {
            selectedTrail = determineTrail();
            selectedTheme = determineTheme();
        }

        const trail = trails[selectedTrail];
        const theme = themes[selectedTheme];

        setVisibleScreen('result-screen');

        const resIcon = document.getElementById('result-icon');
        const resTitle = document.getElementById('result-title');
        const resDesc = document.getElementById('result-description');

        if (resIcon) resIcon.textContent = trail.icon;
        if (resTitle) resTitle.textContent = trail.name;
        if (resDesc) resDesc.textContent = trail.description;

        const profileDetailsDiv = document.getElementById('profile-details');
        if (profileDetailsDiv) {
            profileDetailsDiv.innerHTML = `
                <p><strong>Configuração de Trilha ativa!</strong></p>
                <p><strong>Dificuldade:</strong> ${trail.characteristics.difficulty}</p>
                <p><strong>Vidas/Erros Máximos:</strong> ${trail.characteristics.maxErrors}</p>
                <p><strong>Dicas:</strong> ${trail.characteristics.hintFrequency}</p>
            `;
        }
    }

    // ========== FUNÇÕES PÚBLICAS ==========
    const init = function() {
        let savedProfile = null;
        try {
            savedProfile = localStorage.getItem('playerProfile');
        } catch (e) {
            console.warn('Não foi possível ler o localStorage:', e);
        }

        if (savedProfile) {
            try {
                const profile = JSON.parse(savedProfile);
                if (profile && profile.trail && profile.theme) {
                    onQuestionnaireComplete(profile.trail, profile.theme);
                    return;
                }
            } catch (e) {
                console.warn('Perfil salvo estava corrompido, iniciando novo questionário:', e);
            }
        }

        showModeSelection();

        const chooseQuizBtn = document.getElementById('btn-choose-quiz');
        if (chooseQuizBtn) {
            chooseQuizBtn.onclick = startQuizMode;
            chooseQuizBtn.addEventListener('click', startQuizMode);
        }

        const chooseDirectBtn = document.getElementById('btn-choose-direct');
        if (chooseDirectBtn) {
            chooseDirectBtn.onclick = startDirectSelectionMode;
            chooseDirectBtn.addEventListener('click', startDirectSelectionMode);
        }

        const backToWelcomeBtn = document.getElementById('btn-back-to-welcome');
        if (backToWelcomeBtn) {
            backToWelcomeBtn.onclick = showModeSelection;
            backToWelcomeBtn.addEventListener('click', showModeSelection);
        }

        const nextQuestionBtn = document.getElementById('questionnaire-next-btn');
        if (nextQuestionBtn) {
            nextQuestionBtn.addEventListener('click', nextQuestion);
        }

        const previousQuestionBtn = document.getElementById('questionnaire-prev-btn');
        if (previousQuestionBtn) {
            previousQuestionBtn.addEventListener('click', previousQuestion);
        }

        const resultConfirmBtn = document.getElementById('result-confirm-btn');
        if (resultConfirmBtn) {
            resultConfirmBtn.addEventListener('click', () => {
                if (!selectedTrail || !selectedTheme) {
                    selectedTrail = 'iniciante';
                    selectedTheme = 'fantasia';
                }
                saveProfileToLocalStorage(selectedTrail, selectedTheme);
                onQuestionnaireComplete(selectedTrail, selectedTheme);
            });
        }
    };

    const nextQuestion = function() {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            updateQuestionsVisibility();
            updateUI();
        } else {
            showResultScreen(false);
        }
    };

    const previousQuestion = function() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            updateQuestionsVisibility();
            updateUI();
        }
    };

    return {
        init: init,
        setOnCompleteCallback: function(cb) { onQuestionnaireComplete = cb; },
        trails: trails,
        themes: themes
    };
})();