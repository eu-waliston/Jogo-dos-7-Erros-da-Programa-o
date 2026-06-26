# 🎮 Sistema de Questionário Adaptativo - Jogo dos 7 Erros

## 📋 Visão Geral

Sistema completo de onboarding interativo que identifica o perfil, experiência e preferências do jogador para direciona-lo automaticamente para uma trilha de jogo personalizada.

---

## 🎯 Características Principais

### 1. **Questionário de 8 Perguntas**
O sistema coleta informações através de 8 perguntas estratégicas:

- **Pergunta 1:** Experiência prévia com programação
- **Pergunta 2:** Capacidade de identificar erros em código
- **Pergunta 3:** Preferência de dificuldade em jogos
- **Pergunta 4:** Comportamento quando comete erros
- **Pergunta 5:** Preferência por receber dicas
- **Pergunta 6:** Atenção a detalhes
- **Pergunta 7:** Preferência de ritmo (calma vs. contra o tempo)
- **Pergunta 8:** Tema narrativo preferido

### 2. **4 Trilhas Principais**

#### 🌟 **INICIANTE**
- **Ícone:** 🎓
- **Dificuldade:** Beginner
- **Max Erros:** 4
- **Dicas:** Frequentes (sempre mostradas)
- **Sem limite de tempo**
- **Tutorial expandido**
- **Indicado para:** Nunca programou ou pouco contato

#### 🔍 **EXPLORADOR**
- **Ícone:** 🧭
- **Dificuldade:** Easy
- **Max Erros:** 5
- **Dicas:** Contextuais
- **Sem limite de tempo**
- **Foco em investigação e descoberta**
- **Indicado para:** Aprendizes curiosos, conhecimento médio

#### 💻 **HACKER**
- **Ícone:** 🎯
- **Dificuldade:** Intermediate
- **Max Erros:** 6
- **Dicas:** Mínimas
- **Sem limite de tempo**
- **Desafios técnicos avançados**
- **Indicado para:** Programadores intermediários

#### 👑 **MESTRE**
- **Ícone:** ⚡
- **Dificuldade:** Expert
- **Max Erros:** 7
- **Dicas:** Nenhuma
- **Limite de Tempo:** 5 minutos por fase
- **Leaderboards e Conquistas**
- **Indicado para:** Especialistas e experts

### 3. **Tematização Narrativa**

O jogo adapta sua narrativa de acordo com a preferência do jogador:

#### 🧙 **Fantasia e Magia**
- Personagem Aliado: 🧙‍♂️ Mago do Código
- Antagonista: Goblin Ladrão de Feitiços
- Cenário: Grimório Antigo
- Mensagens adaptadas para universo mágico

#### 💻 **Tecnologia e Hackers**
- Personagem Aliado: 🤖 IA Guardiã
- Antagonista: Vírus "Glitch"
- Cenário: Rede Digital
- Foco em segurança e debugging

#### 🕵️ **Mistério e Investigação**
- Personagem Aliado: 🕵️ Detetive Cibernético
- Antagonista: O Falsificador
- Cenário: Cena do Crime Digital
- Jogabilidade baseada em resolução de casos

#### 🏆 **Competição e Desafio**
- Personagem Aliado: ⚡ Campeão
- Antagonista: Rival Implacável
- Cenário: Arena Digital
- Foco em rankings e performance

---

## 🔧 Sistema de Pontuação

Cada resposta contribui com pontos para as diferentes trilhas:

### Exemplo de Pontuação (Pergunta 1):
```
Nunca           → Iniciante: +3, Explorador: +1, Hacker: -2, Mestre: -5
Pouco           → Iniciante: +2, Explorador: +2, Hacker: +1, Mestre: -2
Médio           → Iniciante: 0,  Explorador: +2, Hacker: +3, Mestre: +1
Avançado        → Iniciante: -3, Explorador: +1, Hacker: +2, Mestre: +3
```

A trilha determinada é a que obtém a **maior pontuação final**.

### Sistema de Tematização:

Independente da trilha técnica, o jogador também acumula pontos em temas:
- Fantasia e Magia
- Tecnologia e Hackers
- Mistério e Investigação
- Competição e Desafio

---

## 💾 Persistência de Dados

O sistema salva o perfil do jogador no **localStorage** com os seguintes dados:

```javascript
{
  "trail": "hacker",
  "theme": "tecnologia",
  "completedAt": "2026-06-18T10:30:00.000Z",
  "responses": {
    "1": "avancado",
    "2": "sim",
    ...
  },
  "scores": {
    "iniciante": -2,
    "explorador": 1,
    "hacker": 8,
    "mestre": 3
  },
  "themeScores": {
    "fantasia": 0,
    "tecnologia": 5,
    "misterio": 0,
    "competicao": 1
  }
}
```

**Benefício:** O jogador não precisa responder o questionário novamente. Ele pode:
1. Refazer o questionário a qualquer momento clicando em "VOLTAR AO MENU"
2. Novo questionário é disparado quando localStorage é limpo

---

## 🎮 Fluxo do Jogo

```
START
  ↓
[Verificar localStorage]
  ├→ Perfil existente? 
  │   └→ SIM: Carrega perfil salvo
  │
  └→ Sem perfil?
      └→ Mostra Questionário Modal
          ↓
        [8 Perguntas]
          ↓
        [Cálculo de Trilha + Tema]
          ↓
        [Tela de Resultado]
          ↓
        [Aplica Adaptações]
          ↓
        [Inicia Jogo com Personalizações]
          ↓
        [Narrativa Adaptada]
          ↓
        [Dificuldade Personalizada]
          ↓
        [Tema Visual Aplicado]
```

---

## 🎨 Arquivos Implementados

### 1. **HTML**
- **Arquivo:** `7-erros/index.html`
- **Adições:** Elemento modal para questionário com IDs específicos

### 2. **JavaScript - Questionário**
- **Arquivo:** `7-erros/script/questionnaire.js` (NOVO)
- **Funções Principais:**
  - `AdaptiveQuestionnaire.init()` - Inicializa o questionário
  - `nextQuestion()` - Navega para próxima pergunta
  - `previousQuestion()` - Volta para pergunta anterior
  - `determineTrail()` - Calcula melhor trilha
  - `determineTheme()` - Define tema narrativo
  - `saveProfileToLocalStorage()` - Persiste dados

### 3. **JavaScript - Integração**
- **Arquivo:** `7-erros/script/script.js`
- **Funções Adicionadas:**
  - `initAdaptiveQuestionnaire()` - Inicia sistema adaptativo
  - `applyTrailAdaptations()` - Aplica customizações
  - `applyThemeNarrative()` - Adapta narrativa

### 4. **CSS**
- **Arquivo:** `7-erros/style/styles.css`
- **Estilos Adicionados:**
  - `.questionnaire-modal` - Container principal
  - `.questionnaire-container` - Caixa de perguntas
  - `.question-item` - Individual question
  - `.answer-option` - Opções de resposta
  - `.result-screen` - Tela de resultado
  - E muitos mais estilos de animação e responsividade

---

## 🔌 Como Usar

### Para o Desenvolvimento:

1. **Abrir o jogo:**
   ```
   file:///caminho/até/7-erros/index.html
   ```

2. **Responder o questionário:**
   - Clique nas opções de resposta
   - Botão "PRÓXIMO" ativa quando resposta é selecionada
   - Avance através das 8 perguntas

3. **Ver resultado:**
   - Após a pergunta 8, clique "ENVIAR RESPOSTAS ✅"
   - Sistema mostra trilha recomendada e detalhes

4. **Jogar:**
   - Clique "🚀 COMEÇAR A AVENTURA"
   - Jogo iniciará com perfil personalizado

5. **Refazer questionário:**
   - Clique "🏠 VOLTAR AO MENU" durante o jogo
   - localStorage será limpo
   - Novo questionário será exibido

---

## 📊 Estatísticas do Sistema

- **Total de Perguntas:** 8
- **Trilhas Disponíveis:** 4
- **Temas Narrativos:** 4
- **Combinações Possíveis:** 16 (4 trilhas × 4 temas)
- **Pontuação por Pergunta:** -5 a +3
- **Intervalo de Pontuação Final:** -40 a +24 por trilha

---

## 🎯 Algoritmo de Decisão

```javascript
// Pseudocódigo simplificado

function determineTrail() {
  // 1. Soma pontos para cada trilha
  let scores = { iniciante: 0, explorador: 0, hacker: 0, mestre: 0 };
  
  // 2. Para cada resposta, adiciona pontos
  for each response:
    scores[trail] += points;
  
  // 3. Encontra a trilha com maior pontuação
  let maxScore = Math.max(...scores);
  
  // 4. Se pontuação é muito baixa, força iniciante
  if (maxScore <= -5) return 'iniciante';
  
  // 5. Se "mestre" tiver score alto, prioriza
  if (scores.mestre >= scores.hacker && scores.mestre > maxScore - 2)
    return 'mestre';
  
  // 6. Retorna trilha com maior score
  return Object.keys(scores).find(trail => scores[trail] === maxScore);
}
```

---

## 🚀 Melhorias Futuras

1. **Adaptação Dinâmica:**
   - Ajustar dificuldade automaticamente durante o jogo
   - Aumentar/diminuir erros permitidos baseado no desempenho

2. **Analytics:**
   - Registrar estatísticas de cada jogador
   - Identificar padrões de aprendizado

3. **Mais Conteúdo:**
   - Expandir para 10+ níveis
   - Adicionar novos temas e narrativas

4. **Multiplayer:**
   - Competição entre jogadores
   - Rankings globais

5. **Acessibilidade:**
   - Suporte a temas de alto contraste
   - Leitura de tela (screen readers)

---

## 🔐 Segurança e Validação

- Validação de respostas antes de salvar
- localStorage limitado a dados não-sensíveis
- IDs de questões mapeados para prevenir tampering
- Scores recalculados a partir das respostas (não armazenados em frontend)

---

## 📝 Notas de Implementação

### Por que 4 trilhas?
As 4 trilhas (Iniciante, Explorador, Hacker, Mestre) cobrem os perfis mais comuns em educação de programação:
- Completo iniciante
- Explorador cauteloso
- Programador intermediário
- Especialista

### Por que 4 temas?
Os temas fazem o mesmo jogo parecer diferente para cada jogador:
- Mantém engajamento
- Personaliza narrativa
- Aumenta retenção

### Mudanças para Perfis Existentes
Mantivemos compatibilidade com o sistema anterior:
- "mago" = trilha iniciante
- "hacker" = trilha hacker
- "detetive" = trilha explorador/mestre
- Novos nomes e narrativas aplicados via tema

---

## 📞 Suporte

Para questões sobre implementação:
1. Verifique `questionnaire.js` para lógica do questionário
2. Verifique `script.js` para integração com o jogo
3. Verifique `styles.css` para estilos do modal

---

**Versão:** 1.0  
**Data:** Junho 2026  
**Status:** Implementado e Testado ✅
