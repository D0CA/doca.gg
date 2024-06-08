const cursor = document.querySelector('#cursor');
let timer, blurTimer;

function handleLoading() {
    let loadingText = document.getElementById('loading-text');
    let progress = 0;
    cursor.classList.add('hide'); 
    let interval = setInterval(() => {
        progress += 1;
        if (progress <= 100) {
            loadingText.innerText = progress + '%';
        } else {
            clearInterval(interval);
            cursor.classList.remove('hide'); // Affiche le curseur une fois que le chargement atteint 100%
            setTimeout(function() {
                loadingText.innerText = 'Click to enter';
                document.body.addEventListener('click', function() {
                    document.getElementById('loading').classList.add('hide');
                }, { once: true }); 
            }, 500);
        }
    }, 15); // Ajustez cette valeur pour contrôler la vitesse de chargement
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
document.addEventListener('mousemove', handleMouseMove);
document.addEventListener('click', handleClick);
document.addEventListener('mouseleave', handleMouseLeave);
document.addEventListener('mouseenter', handleMouseEnter);
handleLinkHover();