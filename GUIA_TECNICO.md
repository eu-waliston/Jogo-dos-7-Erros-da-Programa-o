# 🔧 Guia Técnico Rápido - Questionário Adaptativo

## 📁 Estrutura de Arquivos

```
7-erros/
├── index.html                    # Contém modal do questionário
├── style/
│   └── styles.css               # +300 linhas de estilos novo CSS
├── script/
│   ├── questionnaire.js          # NOVO - Lógica do questionário (400+ linhas)
│   └── script.js                 # MODIFICADO - Integração do sistema
└── ../SISTEMA_ADAPTATIVO.md      # Documentação completa
```

---

## 🎯 API do AdaptiveQuestionnaire

### Métodos Públicos

```javascript
// Inicializar o questionário
AdaptiveQuestionnaire.init();

// Definir callback quando questionário completa
AdaptiveQuestionnaire.setOnCompleteCallback((trail, theme) => {
    console.log(`Trilha: ${trail}, Tema: ${theme}`);
});

// Acessar dados das trilhas
AdaptiveQuestionnaire.trails.hacker // { id, name, icon, description, characteristics, ... }

// Acessar dados dos temas
AdaptiveQuestionnaire.themes.tecnologia // { id, name, description, characters, narrative, ... }

// Acessar perguntas
AdaptiveQuestionnaire.questions // Array de 8 perguntas com opções
```

### Estrutura de Trilha

```javascript
{
  id: 'hacker',
  name: '💻 Hacker',
  icon: '🎯',
  description: 'Para programadores intermediários...',
  characteristics: {
    difficulty: 'intermediate',
    maxErrors: 6,
    hintFrequency: 'minimal',
    timeLimit: null,
    tutorialExtended: false,
    dailyGoals: 5,
    dailyStreak: true
  },
  profiles: ['hacker'],          // Mapeamento para perfis existentes
  color: '#22c55e',
  emoji: '🎯'
}
```

### Estrutura de Tema

```javascript
{
  id: 'tecnologia',
  name: '💻 Tecnologia e Hackers',
  description: 'Sistemas digitais, IA e segurança cibernética',
  characters: {
    ally: '🤖 IA Guardiã',
    enemy: 'Vírus "Glitch"',
    setting: 'Rede Digital'
  },
  narrative: {
    intro: 'Você é um hacker ético...',
    levelIntro: (level) => `⚠️ ALERTA: O Glitch infectou o Sistema ${level}...`,
    victory: '✅ DEBUG CONCLUÍDO!',
    defeat: '💥 MALWARE EXECUTADO!'
  }
}
```

---

## 💾 LocalStorage

### Estrutura Armazenada

```javascript
localStorage.getItem('playerProfile') // Retorna JSON

{
  "trail": "hacker",
  "theme": "tecnologia",
  "completedAt": "2026-06-18T10:30:00.000Z",
  "responses": { "1": "avancado", "2": "sim", ... },
  "scores": { "iniciante": -2, "explorador": 1, ... },
  "themeScores": { "fantasia": 0, "tecnologia": 5, ... }
}
```

### Operações

```javascript
// Verificar se perfil existe
const saved = localStorage.getItem('playerProfile');
const profile = JSON.parse(saved);

// Limpar perfil
localStorage.removeItem('playerProfile');

// Para forçar novo questionário
localStorage.clear(); // Cuidado: limpa tudo!
```

---

## 🔀 Fluxo de Integração

### 1. Quando a Página Carrega

```javascript
// Em script.js
initAdaptiveQuestionnaire();
  ↓
AdaptiveQuestionnaire.setOnCompleteCallback((trail, theme) => {
    gameState.currentTrail = trail;
    gameState.currentTheme = theme;
    applyTrailAdaptations(trail, theme);
    initGameEngine();
});
```

### 2. Aplicar Adaptações

```javascript
function applyTrailAdaptations(trail, theme) {
    const trailConfig = AdaptiveQuestionnaire.trails[trail];
    const themeConfig = AdaptiveQuestionnaire.themes[theme];
    
    gameState.trailConfig = trailConfig;
    gameState.themeConfig = themeConfig;
    
    // Adaptam narrativa do perfil
    applyThemeNarrative(currentProfile, themeConfig);
}
```

### 3. Adaptar Narrativa

```javascript
function applyThemeNarrative(profile, themeConfig) {
    // Modifica nomes das fases
    profile.levelNames = profile.levelNames.map(name => 
        `${themeConfig.characters.setting} - ${name}`
    );
    
    // Altera mensagens
    profile.stealMsg = themeConfig.narrative.defeat;
    profile.winMsg = themeConfig.narrative.victory;
}
```

---

## 🎨 Seletores CSS Importante

```css
/* Modal do Questionário */
.questionnaire-modal                  /* Container principal */
.questionnaire-container              /* Caixa interna */
.questionnaire-header                 /* Cabeçalho com título */
.progress-bar                         /* Barra de progresso */
.progress-fill                        /* Preenchimento dinâmico */

/* Perguntas */
.question-item                        /* Container da pergunta */
.question-text                        /* Texto da pergunta */
.question-number                      /* Número da pergunta */
.answer-options                       /* Container de opções */
.answer-option                        /* Opção individual */

/* Resultado */
.result-screen                        /* Tela de resultado */
.result-card                          /* Card com resultado */
.result-icon                          /* Ícone da trilha */
.profile-details                      /* Detalhes do perfil */
```

---

## 🔍 Debugging

### Console Logs Úteis

```javascript
// No questionnaire.js (renderQuestions)
console.log('Resposta registrada:', question.id, option.value);
console.log('Total de respostas:', Object.keys(responses).length);

// Para verificar cálculo de trilha
console.log('Scores finais:', scores);
console.log('Theme scores:', themeScores);
console.log('Trilha selecionada:', selectedTrail);
console.log('Tema selecionado:', selectedTheme);
```

### Verificar Estado no Navegador

```javascript
// No console do navegador (F12)
localStorage.getItem('playerProfile')   // Ver perfil salvo
Object.keys(localStorage)               // Ver todas as chaves
localStorage.clear()                    // Limpar dados
```

---

## 🎯 Customização

### Adicionar Nova Trilha

```javascript
const trails = {
    // ... trilhas existentes
    novaTrilha: {
        id: 'novaTrilha',
        name: '🆕 Nova Trilha',
        icon: '🎯',
        description: 'Descrição...',
        characteristics: {
            difficulty: 'custom',
            maxErrors: 5,
            hintFrequency: 'contextual',
            timeLimit: null
        },
        profiles: ['novaPerfil'],
        color: '#new-color',
        emoji: '🆕'
    }
};

// Depois, em script.js adicionar mapeamento
const trailToProfile = {
    'novaTrilha': 'novaPerfil'
};
```

### Adicionar Novo Tema

```javascript
const themes = {
    // ... temas existentes
    novoTema: {
        id: 'novoTema',
        name: '🆕 Novo Tema',
        description: 'Descrição...',
        characters: {
            ally: '🆕 Aliado',
            enemy: '🆕 Inimigo',
            setting: '🆕 Cenário'
        },
        narrative: {
            intro: '🆕 Introdução...',
            levelIntro: (level) => `🆕 Nível ${level}...`,
            victory: '🆕 Vitória!',
            defeat: '🆕 Derrota!'
        }
    }
};
```

### Modificar Perguntas

```javascript
const questions = [
    {
        id: 1,
        question: 'Sua pergunta?',
        emoji: '❓',
        options: [
            { 
                text: 'Opção 1',
                value: 'option1',
                scores: { 
                    iniciante: 3, 
                    explorador: 1, 
                    hacker: -2, 
                    mestre: -5 
                }
            }
        ]
    }
];
```

---

## ⚡ Otimizações

### Performance

- Modal usa display:none (não renderiza DOM oculto)
- Perguntas renderizadas sob demanda (só uma visível)
- Event listeners adicionados apenas quando necessário
- localStorage para evitar recálculos

### Espaço

- questionnaire.js: ~400 linhas
- CSS adicionado: ~300 linhas
- Tamanho total: ~700 linhas de novo código

### Compatibilidade

- ES6+ (não usa IE11)
- Funciona em mobile (touch events considerados)
- CSS Grid e Flexbox apenas (sem IE9 compat)

---

## 🐛 Problemas Conhecidos e Soluções

| Problema | Causa | Solução |
|----------|-------|--------|
| Botão Next desabilitado | Pergunta não respondida | Clique em uma opção |
| Tema não aplicado | Perfil não em gameState | Verificar initAdaptiveQuestionnaire() |
| localStorage não funciona | Modo incógnito/Private | Usar localStorage-mock |
| Modal não aparece | z-index baixo | Verificar z-index: 10001 |
| Questão não renderiza | CSS hidden conflitando | Usar !important se necessário |

---

## 📊 Fluxograma de Decisão

```
┌─ Pergunta 1 ─────────────────────────────────────┐
│ Experiência?                                      │
│ Never: Iniciante+3                               │
│ Little: Balanced                                  │
│ Medium: Hacker+3                                  │
│ Advanced: Mestre+3                                │
└─────────────────────────────────────────────────┘
                    ↓
         ┌─ Perguntas 2-7 ─┐
         │ Acumula Pontos  │
         └─────────────────┘
                    ↓
         ┌─ Pergunta 8 ─────┐
         │ Define Tema      │
         │ +3 para tema sel │
         └──────────────────┘
                    ↓
    ┌──────────────────────────────┐
    │ Maior Score = Trilha Final    │
    │ Maior Theme Score = Tema Final │
    └──────────────────────────────┘
                    ↓
         ┌──────────────────┐
         │ Salva em Storage │
         │ Inicia Jogo      │
         └──────────────────┘
```

---

## 🔗 Referências Rápidas

- **Modal:** `document.getElementById('questionnaire-modal')`
- **Container:** `document.getElementById('questionnaire-container')`
- **Perguntas:** `document.getElementById('questions-container')`
- **Resultado:** `document.getElementById('result-screen')`
- **Botão Next:** `document.getElementById('questionnaire-next-btn')`
- **Botão Prev:** `document.getElementById('questionnaire-prev-btn')`
- **Botão Confirmar:** `document.getElementById('result-confirm-btn')`

---

**Última Atualização:** Junho 2026  
**Mantido por:** Sistema Adaptativo v1.0
