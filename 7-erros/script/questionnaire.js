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

    // ========== QUESTÕES (Reduzidas para o exemplo, mantenha as suas) ==========
    const questions = [
        {
            id: 1, question: 'Você já teve contato com programação?', emoji: '📚',
            options: [
                { text: 'Nunca', value: 'nunca', scores: { iniciante: 3, explorador: 1, hacker: -2, mestre: -5 } },
                { text: 'Avançado', value: 'avancado', scores: { iniciante: -3, explorador: 1, hacker: 2, mestre: 3 } }
            ]
        },
        {
            id: 8, question: 'Qual tema você prefere?', emoji: '🎭',
            options: [
                { text: '🧙 Fantasia e Magia', value: 'fantasia', themeScore: { fantasia: 3, tecnologia: 0, misterio: 0, competicao: 0 } },
                { text: '💻 Tecnologia e Hackers', value: 'tecnologia', themeScore: { fantasia: 0, tecnologia: 3, misterio: 0, competicao: 1 } }
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
        localStorage.setItem('playerProfile', JSON.stringify(profile));
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
        const savedProfile = localStorage.getItem('playerProfile');
        if (savedProfile) {
            const profile = JSON.parse(savedProfile);
            onQuestionnaireComplete(profile.trail, profile.theme);
            return;
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