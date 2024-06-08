const cursor = document.querySelector('#cursor');
let timer, blurTimer;

document.querySelectorAll('a').forEach(link => {
    link.addEventListener('mouseover', function() {
        let hoverSound = document.getElementById('hover-sound');
        hoverSound.volume = 0.1; // Ajuste le volume à 50%
        hoverSound.currentTime = 0;
        hoverSound.play();
    });
});

// Ajoutez un gestionnaire d'événements pour détecter la première interaction de l'utilisateur
document.documentElement.addEventListener('mousedown', function() {
    document.documentElement.setAttribute('user-has-interacted', '');
}, { once: true });

function typeWriter(text, element) {
    let index = 0;
    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index) === ' ' ? '&nbsp;' : text.charAt(index);
            index++;
        } else {
            clearInterval(interval);
            // Ajoute l'animation de la barre clignotante à la fin du texte
            element.classList.add('blinking-cursor');
        }
    }, 100); // Ajustez cette valeur pour contrôler la vitesse de l'animation d'écriture
}

function handleLoading() {
    let loadingText = document.getElementById('loading-text');
    if (!loadingText) return;
    let progress = 0;
    let interval = setInterval(() => {
        progress += 1;
        if (progress <= 100) {
            loadingText.innerText = progress + '%';
        } else {
            clearInterval(interval);
            setTimeout(function() {
                loadingText.innerHTML = '';
                typeWriter('Click to enter', loadingText);
            }, 500);
        }
    }, 15); // Ajustez cette valeur pour contrôler la vitesse de chargement
}

function handleLoadingClick() {
    const loading = document.getElementById('loading');
    loading.classList.add('hide');
}

function handleMouseMove(e) {
    clearTimeout(timer);
    clearTimeout(blurTimer);
    cursor.classList.remove("blur");
    cursor.setAttribute("style", "top: "+(e.pageY)+"px; left: "+(e.pageX)+"px;");
    timer = setTimeout(() => {
        blurTimer = setTimeout(() => {
            cursor.classList.add("blur");
        }, 500); // Délai avant que le flou ne se réactive
    }, 100);
}

function handleClick() {
    cursor.classList.add("expand");
    setTimeout(() => {
        cursor.classList.remove("expand");
    }, 500)
}

function handleMouseLeave() {
    cursor.classList.add('hide');
}

function handleMouseEnter() {
    cursor.classList.remove('hide');
}

function handleLinkHover() {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('mouseover', () => {
            cursor.classList.add('red');
        });
        link.addEventListener('mouseout', () => {
            cursor.classList.remove('red');
        });
    });
}

window.addEventListener('load', handleLoading);
const loading = document.getElementById('loading');
if (loading) {
    loading.addEventListener('click', handleLoadingClick);
}
document.addEventListener('mousemove', handleMouseMove);
document.addEventListener('click', handleClick);
document.addEventListener('mouseleave', handleMouseLeave);
document.addEventListener('mouseenter', handleMouseEnter);

handleLinkHover();