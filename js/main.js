const wishScene = document.getElementById('wishScene');
const flowerScene = document.getElementById('flowerScene');

const backgroundMusic = document.getElementById('backgroundMusic');

const moonButton = document.getElementById('moonButton');
const moonInstruction = document.getElementById('moonInstruction');

const wishStars = document.querySelectorAll('.wish-star');
const starDust = document.getElementById('starDust');

const flowerFrame = document.getElementById('flowerFrame');

const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');

const wishTitle = document.getElementById('wishTitle');


let caughtStars = 0;
let starsCanBeCaught = false;
let starMovementInterval = null;

let experienceStarted = false;

let confetti = [];


const colors = [
  '#ff004c',
  '#ffe600',
  '#00ffcc',
  '#00a2ff',
  '#ff7b00',
  '#b100ff',
  '#ffffff'
];


/* =====================================================
   AJUSTAR CANVAS
===================================================== */

function resizeCanvas() {

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

}

resizeCanvas();

window.addEventListener('resize', resizeCanvas);


/* =====================================================
   POSICIÓN INICIAL DE LAS ESTRELLAS
===================================================== */

function resetStars() {

  caughtStars = 0;
  starsCanBeCaught = false;

  wishStars.forEach((star, index) => {

    star.classList.remove('caught');
    star.classList.remove('moving');

    star.style.opacity = '1';
    star.style.display = 'block';

    const start = 8;
    const end = 68;

    const step =
      (end - start) /
      (wishStars.length - 1);

    star.style.left =
      `${start + index * step}%`;

    star.style.top = '63%';

  });

}

resetStars();


/* =====================================================
   TOCAR LA LUNA
===================================================== */

moonButton.addEventListener('click', () => {

  /*
    Evita que el proceso se ejecute varias veces
    si se vuelve a tocar la luna.
  */

  if (experienceStarted) {
    return;
  }

  experienceStarted = true;


  /* INICIAR MÚSICA */

  if (backgroundMusic.paused) {

    backgroundMusic.play().catch((error) => {

      console.log(
        'No se pudo iniciar la música:',
        error
      );

    });

  }


  /* Ocultar texto "Toca la luna" */

  moonInstruction.classList.add('hidden');


  /* Efecto visual de luna tocada */

  moonButton.classList.add('moon-touched');


  /* Iniciar la escena */

  showWish();

});


/* =====================================================
   ESCENA DEL DESEO
===================================================== */

function showWish() {

  // Desaparece "Toca la luna"
  wishTitle.textContent = '';

  // Después de 2 segundos aparece el mensaje
  setTimeout(() => {
    wishTitle.textContent = 'Feliz día de las flores amarillas Miel';
  }, 5000);

  caughtStars = 0;
  starsCanBeCaught = false;


  wishStars.forEach((star, index) => {

    star.classList.remove('caught');
    star.classList.remove('moving');

    star.style.opacity = '1';
    star.style.display = 'block';


    const start = 8;
    const end = 68;

    const step =
      (end - start) /
      (wishStars.length - 1);


    star.style.left =
      `${start + index * step}%`;

    star.style.top = '63%';

  });


  clearInterval(starMovementInterval);


  /*
    Espera 12 segundos mientras aparece
    "Pide un deseo..."
  */

  setTimeout(() => {

    wishTitle.textContent = '¡Atrápalas!';

    starsCanBeCaught = true;


    wishStars.forEach((star) => {

      star.classList.add('moving');

    });


    moveStarsRandomly();


    starMovementInterval = setInterval(
      moveStarsRandomly,
      800
    );

  }, 12000);

}


/* =====================================================
   MOVIMIENTO ALEATORIO DE LAS ESTRELLAS
===================================================== */

function moveStarsRandomly() {

  const sceneWidth =
    wishScene.clientWidth;

  const sceneHeight =
    wishScene.clientHeight;


  wishStars.forEach((star) => {

    if (
      star.classList.contains('caught')
    ) {
      return;
    }


    const starWidth =
      star.offsetWidth;

    const starHeight =
      star.offsetHeight;


    const marginX = 50;
    const marginTop = 150;
    const marginBottom = 80;


    const maxX =
      sceneWidth -
      starWidth -
      marginX;


    const maxY =
      sceneHeight -
      starHeight -
      marginBottom;


    const randomX =
      marginX +
      Math.random() *
      (maxX - marginX);


    const randomY =
      marginTop +
      Math.random() *
      (maxY - marginTop);


    star.style.left =
      `${randomX}px`;

    star.style.top =
      `${randomY}px`;

  });

}


/* =====================================================
   ATRAPAR ESTRELLAS
===================================================== */

wishStars.forEach((star) => {

  star.addEventListener(
    'pointerdown',
    (event) => {

      event.preventDefault();


      if (!starsCanBeCaught) {
        return;
      }


      if (
        star.classList.contains('caught')
      ) {
        return;
      }


      const starRect =
        star.getBoundingClientRect();


      const sceneRect =
        wishScene.getBoundingClientRect();


      const centerX =
        starRect.left -
        sceneRect.left +
        starRect.width / 2;


      const centerY =
        starRect.top -
        sceneRect.top +
        starRect.height / 2;


      createStarDust(
        centerX,
        centerY
      );


      star.classList.add('caught');

      star.style.opacity = '0';


      caughtStars++;


      /*
        Cuando atrapa las cuatro estrellas
        pasa a las flores.
      */

      if (
        caughtStars ===
        wishStars.length
      ) {

        starsCanBeCaught = false;

        clearInterval(
          starMovementInterval
        );


        setTimeout(
          showFlowerScene,
          1000
        );

      }

    }
  );

});


/* =====================================================
   POLVO DE ESTRELLAS
===================================================== */

function createStarDust(x, y) {

  starDust.innerHTML = '';

  starDust.style.left =
    `${x}px`;

  starDust.style.top =
    `${y}px`;


  for (let i = 0; i < 55; i++) {

    const particle =
      document.createElement('span');


    particle.className =
      'dust-particle';


    const angle =
      Math.random() *
      Math.PI *
      2;


    const distance =
      35 +
      Math.random() *
      120;


    const moveX =
      Math.cos(angle) *
      distance;


    const moveY =
      Math.sin(angle) *
      distance;


    const size =
      3 +
      Math.random() *
      7;


    particle.style.setProperty(
      '--move-x',
      `${moveX}px`
    );


    particle.style.setProperty(
      '--move-y',
      `${moveY}px`
    );


    particle.style.setProperty(
      '--size',
      `${size}px`
    );


    particle.style.animationDelay =
      `${Math.random() * 0.12}s`;


    starDust.appendChild(
      particle
    );

  }


  setTimeout(() => {

    starDust.innerHTML = '';

  }, 1300);

}


/* =====================================================
   CAMBIAR DE ESCENA
===================================================== */

function changeScene(
  current,
  next
) {

  current.classList.remove(
    'active'
  );

  next.classList.add(
    'active'
  );

}


/* =====================================================
   MOSTRAR FLORES
===================================================== */

function showFlowerScene() {

  changeScene(
    wishScene,
    flowerScene
  );


  if (flowerFrame) {

    flowerFrame.src =
      'about:blank';


    setTimeout(() => {

      flowerFrame.src =
        flowerFrame.dataset.src +
        `?t=${Date.now()}`;

    }, 100);

  }

}


/* =====================================================
   CONFETI
===================================================== */

function launchConfetti(
  x = window.innerWidth / 2,
  y = window.innerHeight / 2
) {

  for (let i = 0; i < 170; i++) {

    confetti.push({

      x,
      y,

      size:
        Math.random() *
        8 +
        4,

      color:
        colors[
          Math.floor(
            Math.random() *
            colors.length
          )
        ],

      speedX:
        (Math.random() - 0.5) *
        12,

      speedY:
        Math.random() *
        -12 -
        3,

      gravity:
        Math.random() *
        0.25 +
        0.14,

      rotation:
        Math.random() *
        360,

      rotationSpeed:
        (Math.random() - 0.5) *
        14,

      life: 120

    });

  }

}


/* =====================================================
   TOCAR PANTALLA EN ESCENA FINAL
===================================================== */

window.addEventListener(
  'pointerdown',
  (e) => {

    if (
      !flowerScene.classList.contains(
        'active'
      )
    ) {
      return;
    }


    launchConfetti(
      e.clientX,
      e.clientY
    );

  }
);


/* =====================================================
   ANIMACIÓN DEL CONFETI
===================================================== */

function animateConfetti() {

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  confetti =
    confetti.filter(
      piece =>
        piece.life > 0
    );


  confetti.forEach(
    piece => {

      piece.x +=
        piece.speedX;

      piece.y +=
        piece.speedY;

      piece.speedY +=
        piece.gravity;

      piece.rotation +=
        piece.rotationSpeed;

      piece.life--;


      ctx.save();


      ctx.translate(
        piece.x,
        piece.y
      );


      ctx.rotate(
        piece.rotation *
        Math.PI /
        180
      );


      ctx.fillStyle =
        piece.color;


      ctx.fillRect(
        -piece.size / 2,
        -piece.size / 2,
        piece.size,
        piece.size * 1.7
      );


      ctx.restore();

    }
  );


  requestAnimationFrame(
    animateConfetti
  );

}


animateConfetti();