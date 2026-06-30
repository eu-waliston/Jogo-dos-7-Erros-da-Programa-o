// ========== MÚSICA DE FUNDO (sintetizada via Web Audio API) ==========
// Não depende de nenhum arquivo .mp3/.ogg externo — a "trilha sonora" é
// gerada em tempo real com osciladores, então não tem problema de licença
// nem de carregar asset pesado. Toca em loop durante todo o jogo.
const BackgroundMusic = (function () {
    let audioCtx = null;
    let masterGain = null;
    let isPlaying = false;
    let isMuted = false;
    let nextNoteTime = 0;
    let currentStep = 0;
    let schedulerId = null;
    let lastVolume = 0.12;

    // Sequência de notas (em Hz) de um loop curto e calmo, estilo chiptune,
    // repetida indefinidamente. Cada item: [frequência, duração em "beats"]
    // null = pausa.
    const melody = [
        [392.00, 1], [440.00, 1], [523.25, 1], [440.00, 1],
        [392.00, 1], [349.23, 1], [392.00, 2],
        [440.00, 1], [523.25, 1], [587.33, 1], [523.25, 1],
        [440.00, 1], [392.00, 1], [349.23, 2],
    ];
    // Linha de baixo simples tocando junto, uma oitava abaixo
    const bass = [
        [196.00, 4], [174.61, 3], [196.00, 4], [174.61, 3]
    ];

    const tempo = 132; // BPM
    const secondsPerBeat = 60 / tempo;
    const scheduleAheadTime = 0.15; // segundos
    const lookahead = 50; // ms

    function ensureContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContextClass();
            masterGain = audioCtx.createGain();
            masterGain.gain.value = lastVolume;
            masterGain.connect(audioCtx.destination);
        }
    }

    function playNote(freq, time, duration, gainPeak, type) {
        const osc = audioCtx.createOscillator();
        const noteGain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, time);

        noteGain.gain.setValueAtTime(0, time);
        noteGain.gain.linearRampToValueAtTime(gainPeak, time + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.001, time + duration);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(time);
        osc.stop(time + duration + 0.05);
    }

    let melodyStep = 0;
    let melodyTimeAcc = 0;
    let bassStep = 0;
    let bassTimeAcc = 0;

    function scheduler() {
        while (nextNoteTime < audioCtx.currentTime + scheduleAheadTime) {
            // melodia
            const [mFreq, mBeats] = melody[melodyStep];
            const mDuration = mBeats * secondsPerBeat * 0.9;
            if (mFreq) playNote(mFreq, nextNoteTime, mDuration, 0.18, 'square');

            // baixo (toca em paralelo, avança em seu próprio ritmo)
            if (bassTimeAcc <= 0) {
                const [bFreq, bBeats] = bass[bassStep];
                const bDuration = bBeats * secondsPerBeat * 0.95;
                if (bFreq) playNote(bFreq, nextNoteTime, bDuration, 0.14, 'triangle');
                bassTimeAcc = bBeats;
                bassStep = (bassStep + 1) % bass.length;
            }
            bassTimeAcc -= mBeats;

            nextNoteTime += mBeats * secondsPerBeat;
            melodyStep = (melodyStep + 1) % melody.length;
        }
        schedulerId = setTimeout(scheduler, lookahead);
    }

    function start() {
        ensureContext();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        if (isPlaying) return;
        isPlaying = true;
        nextNoteTime = audioCtx.currentTime + 0.1;
        melodyStep = 0;
        bassStep = 0;
        bassTimeAcc = 0;
        scheduler();
    }

    function stop() {
        isPlaying = false;
        if (schedulerId) {
            clearTimeout(schedulerId);
            schedulerId = null;
        }
    }

    function toggleMute() {
        ensureContext();
        isMuted = !isMuted;
        masterGain.gain.linearRampToValueAtTime(
            isMuted ? 0 : lastVolume,
            audioCtx.currentTime + 0.1
        );
        return isMuted;
    }

    function setVolume(value) {
        lastVolume = Math.max(0, Math.min(1, value));
        if (masterGain && !isMuted) {
            masterGain.gain.linearRampToValueAtTime(lastVolume, audioCtx.currentTime + 0.1);
        }
    }

    // Cria um botão flutuante simples de mute/unmute, caso o HTML
    // ainda não tenha um controle próprio para isso.
    function injectToggleButton() {
        if (document.getElementById('bgm-toggle-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'bgm-toggle-btn';
        btn.textContent = '🔊';
        btn.title = 'Música de fundo (ligar/desligar)';
        btn.style.cssText = `
            position: fixed;
            bottom: 16px;
            right: 16px;
            z-index: 9999;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            border: none;
            background: #1f2937;
            color: #fff;
            font-size: 20px;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.35);
        `;
        btn.addEventListener('click', () => {
            const muted = toggleMute();
            btn.textContent = muted ? '🔇' : '🔊';
        });
        document.body.appendChild(btn);
    }

    // Navegadores modernos bloqueiam áudio automático sem interação do
    // usuário. Então a música começa no primeiro clique/toque na página.
    function initAutoplayUnlock() {
        const unlock = () => {
            start();
            document.removeEventListener('click', unlock);
            document.removeEventListener('touchstart', unlock);
            document.removeEventListener('keydown', unlock);
        };
        document.addEventListener('click', unlock, { once: true });
        document.addEventListener('touchstart', unlock, { once: true });
        document.addEventListener('keydown', unlock, { once: true });
    }

    function init(options) {
        const opts = options || {};
        if (typeof opts.volume === 'number') lastVolume = opts.volume;
        injectToggleButton();
        initAutoplayUnlock();
    }

    return {
        init: init,
        start: start,
        stop: stop,
        toggleMute: toggleMute,
        setVolume: setVolume
    };
})();

// Inicializa automaticamente assim que o arquivo é carregado.
document.addEventListener('DOMContentLoaded', () => {
    BackgroundMusic.init({ volume: 0.12 });
});