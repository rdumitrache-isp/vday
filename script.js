const symbols = ['💖', '🌹', '🍫', '🧸', '💍', '💌'];
const spinBtn = document.getElementById('spin-btn');
const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];
const resultMessage = document.getElementById('result-message');
const resultTitle = resultMessage.querySelector('h2');
const prizeText = document.getElementById('prize-text');
const bgHearts = document.getElementById('background-hearts');

// Modal Elements
const modal = document.getElementById('task-modal');
const closeModalBtn = document.getElementById('close-modal-btn');

// Valentine Modal Elements
const valModal = document.getElementById('valentine-modal');
const valQuestion = document.getElementById('valentine-question');
const valYesBtn = document.getElementById('val-yes-btn');
const valNoBtn = document.getElementById('val-no-btn');

let winCount = 0;
let daScale = 1;
let stage = 1; // intrebarea sigur.

closeModalBtn.addEventListener('click', () => {
    modal.classList.add('hidden-modal');

    // Porneste muzica la interactiune
    const audio = document.getElementById('melodie');
    if (audio) {
        audio.play().catch(e => console.log("Nu merge muzica, sigur trebuie aprobare", e));
        audio.volume = 0.5; // Volum la 50% sa nu urle
    }
});

// sintaxa cu logica de "nu" si "da"
valNoBtn.addEventListener('click', () => {
    daScale += 0.5;
    valYesBtn.style.transform = `scale(${daScale})`;

    // Optional: sa fie enervant
    // const randomX = Math.random() * 100 - 50;
    // const randomY = Math.random() * 100 - 50;
    // valNoBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
});

valYesBtn.addEventListener('click', () => {
    if (stage === 1) {
        stage = 2;
        valQuestion.innerText = "Sigur?";
        valYesBtn.innerText = "DA";
        valNoBtn.innerText = "Du-te dracu de paduche";
        daScale = 1; // reset si se face mai mare.
        valYesBtn.style.transform = `scale(1)`;
    } else if (stage === 2) {
        valModal.innerHTML = `
            <div class="modal-content">
                <h2 style="font-size: 3rem; color: #ff4d6d;">ok❤️</h2>
                <p style="font-size: 1.5rem;">Spui ca ne vedem atunci</p>
                <div style="font-size: 5rem; margin-top: 20px;">💑</div>
            </div>
        `;
        triggerConfetti();
        triggerConfetti();
        triggerConfetti();
    }
});

// la o linie
const prizes = {
    '💖': { title: "Jackpot!", text: "Bravo baba mea!" },
    '🌹': { title: "Linie de flori!", text: "Pentru floarea mea!" },
    '🍫': { title: "Ciocolata!", text: "Dulce ca tine" },
    '🧸': { title: "Eu!", text: "EU!" },
    '💍': { title: "Au!", text: "Semn divin" },
    '💌': { title: "Mesaj!", text: "Il ai zilnic" }
};

const defaultPrize = { title: "hai baba mea!", text: "rupe-le" };

// urmeaza sunet

// inimioare peste tot
function createFloatingHearts() {
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart-bg');
        heart.innerHTML = ['❤️', '💕', '💗'][Math.floor(Math.random() * 3)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 5 + 5) + 's';
        heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
        bgHearts.appendChild(heart);
    }
}
createFloatingHearts();

spinBtn.addEventListener('click', spin);

function spin() {
    if (spinBtn.disabled) return;

    // resetare mana
    spinBtn.disabled = true;
    spinBtn.innerText = "Mult noroc...";
    resultMessage.classList.remove('show');
    resultMessage.style.opacity = '0';
    document.querySelector('.slot-machine').classList.remove('win-pulse');

    // pornire automata vizuale
    reels.forEach(reel => {
        reel.classList.add('spinning');
        reel.innerHTML = `<div class="symbol">❓</div>`; // blur pe CSS
    });

    // rata castig
    let finalSymbols = [];
    const forceWin = Math.random() < 0.7;

    if (forceWin) {
        const winningSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        finalSymbols = [winningSymbol, winningSymbol, winningSymbol];
    } else {
        finalSymbols = [
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)]
        ];
    }

    // intarziere pe rotire
    const delays = [1000, 1500, 2000];

    delays.forEach((delay, index) => {
        setTimeout(() => {
            const reel = reels[index];
            reel.classList.remove('spinning');

            // linie ampulea - use pre-calculated
            const symbol = finalSymbols[index];

            // actualizare elemente per linie
            reel.innerHTML = `<div class="symbol">${symbol}</div>`;

            // convulzie vizuala
            reel.animate([
                { transform: 'scale(1.2)' },
                { transform: 'scale(1)' }
            ], { duration: 200 });

            // If last reel
            if (index === 2) {
                checkWin(finalSymbols);
            }
        }, delay);
    });
}

function checkWin(results) {
    spinBtn.disabled = false;
    spinBtn.innerText = "Invarte";

    const [s1, s2, s3] = results;
    let win = false;

    if (s1 === s2 && s2 === s3) {
        win = true;
        winCount++;
        const prize = prizes[s1];
        showResult(prize.title, prize.text, true);

        if (winCount === 10) {
            setTimeout(() => {
                valModal.classList.remove('hidden-modal');
            }, 2000); // astept dupa 10 maini
        }
    } else {
        // sintaxa 
        // daca 2 elemente sunt identice
        if (s1 === s2 || s2 === s3 || s1 === s3) {
            showResult("Hai regina ca poti!", "Daca te lasi acum, inseamna ca ma lasi pe viitor!", false);
        } else {
            showResult(defaultPrize.title, defaultPrize.text, false);
        }
    }
}

function showResult(title, text, isWin) {
    resultTitle.innerText = title;
    prizeText.innerText = text;
    resultMessage.classList.add('show');

    if (isWin) {
        document.querySelector('.slot-machine').classList.add('win-pulse');
        triggerConfetti();
    }
}

// confetti ce plm
function triggerConfetti() {
    const burstCount = 30;
    const machineRect = document.querySelector('.slot-machine').getBoundingClientRect();
    const centerX = machineRect.left + machineRect.width / 2;
    const centerY = machineRect.top + machineRect.height / 2;

    for (let i = 0; i < burstCount; i++) {
        const heart = document.createElement('div');
        heart.innerText = '💖';
        heart.style.position = 'fixed';
        heart.style.left = centerX + 'px';
        heart.style.top = centerY + 'px';
        heart.style.fontSize = '24px';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '100';
        document.body.appendChild(heart);

        // Random explosion direction
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 200 + 100;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        heart.animate([
            { transform: 'translate(0,0) scale(1)', opacity: 1 },
            { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
        ], {
            duration: 1000 + Math.random() * 1000,
            easing: 'cubic-bezier(0, .9, .57, 1)',
            fill: 'forwards'
        }).onfinish = () => heart.remove();
    }
}
