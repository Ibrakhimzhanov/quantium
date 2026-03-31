const capabilityData = [
  {
    title: "Ответы на основе обученных данных",
    description:
      "Система отвечает на вопросы, используя загруженные и обученные материалы компании, что сокращает время поиска информации и уменьшает нагрузку на сотрудников."
  },
  {
    title: "Работа в рамках утверждённой области знаний",
    description:
      "AI ограничен заданными политиками доступа и рамками знаний, поэтому не выходит за пределы допустимой информации."
  },
  {
    title: "Внутренняя база знаний для сотрудников",
    description:
      "Подходит для внутренних порталов, инструкций, регламентов, onboarding-материалов и служебных запросов внутри компании."
  },
  {
    title: "Чат на сайте компании",
    description:
      "Решение можно встроить на корпоративный сайт для обработки вопросов клиентов в формате контролируемой чат-платформы."
  },
  {
    title: "Поддержка в мобильном приложении",
    description:
      "AI-модуль может быть подключён к мобильному приложению и выдавать быстрые ответы пользователям в привычном интерфейсе."
  },
  {
    title: "Передача запроса сотруднику",
    description:
      "Если запрос выходит за рамки полномочий или базы знаний, система перенаправляет обращение ответственному сотруднику."
  },
  {
    title: "Создание задач в Jira и Service Desk",
    description:
      "AI может инициировать рабочие процессы и автоматически формировать задачи в Jira, Service Desk и других корпоративных инструментах."
  },
  {
    title: "Интеграция с внутренними системами",
    description:
      "Подключение к существующим платформам компании позволяет встроить AI в текущий технологический контур без лишних разрывов."
  },
  {
    title: "Персонализированная информация",
    description:
      "При идентифицированном обращении система способна выдавать персонализированную информацию в пределах заданных политик доступа."
  },
  {
    title: "Классификация данных по доступу",
    description:
      "Поддерживается разграничение по категориям: открытые, внутренние и конфиденциальные данные, с отдельными сценариями обработки."
  },
  {
    title: "Работа на локальных серверах предприятия",
    description:
      "При необходимости решение разворачивается внутри инфраструктуры заказчика, что важно для закрытых корпоративных контуров."
  },
  {
    title: "Безопасная работа с конфиденциальной информацией",
    description:
      "Архитектура продукта учитывает требования к защите чувствительных данных и безопасному доступу к корпоративным знаниям."
  }
];

const starCanvas = document.getElementById("starfield");
const soundToggle = document.getElementById("soundToggle");
const capabilityButtons = Array.from(document.querySelectorAll("[data-capability]"));
const capabilityDetail = document.getElementById("capabilityDetail");
const capabilityDetailTitle = capabilityDetail?.querySelector(".capability-detail-title");
const capabilityDetailText = capabilityDetail?.querySelector(".capability-detail-text");
const revealNodes = document.querySelectorAll("[data-reveal]");
const counters = document.querySelectorAll("[data-counter]");
const leadForm = document.getElementById("leadForm");
const formNote = document.getElementById("formNote");
const heroStage = document.querySelector(".hero-stage");

let audioContext;
let ambientNodes = [];
let audioRunning = false;
let ambientLoopTimer = null;

function initStarfield() {
  if (!starCanvas) return;

  const context = starCanvas.getContext("2d");
  const stars = [];
  const STAR_COUNT = window.innerWidth < 768 ? 90 : 170;
  const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  const resize = () => {
    const ratio = window.devicePixelRatio || 1;
    starCanvas.width = window.innerWidth * ratio;
    starCanvas.height = window.innerHeight * ratio;
    starCanvas.style.width = `${window.innerWidth}px`;
    starCanvas.style.height = `${window.innerHeight}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const createStar = () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    radius: Math.random() * 1.8 + 0.3,
    alpha: Math.random() * 0.8 + 0.2,
    velocity: Math.random() * 0.12 + 0.02,
    depth: Math.random() * 0.6 + 0.2
  });

  const seedStars = () => {
    stars.length = 0;
    for (let index = 0; index < STAR_COUNT; index += 1) {
      stars.push(createStar());
    }
  };

  const render = () => {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    context.fillStyle = "rgba(4, 8, 18, 0.1)";
    context.fillRect(0, 0, window.innerWidth, window.innerHeight);

    stars.forEach((star) => {
      const shiftX = (pointer.x - window.innerWidth / 2) * star.depth * 0.0008;
      const shiftY = (pointer.y - window.innerHeight / 2) * star.depth * 0.0008;

      star.y += star.velocity;
      if (star.y > window.innerHeight + 10) {
        star.y = -10;
        star.x = Math.random() * window.innerWidth;
      }

      context.beginPath();
      context.fillStyle = `rgba(220, 236, 255, ${star.alpha})`;
      context.shadowColor = "rgba(122, 247, 255, 0.45)";
      context.shadowBlur = 10;
      context.arc(star.x + shiftX * 60, star.y + shiftY * 60, star.radius, 0, Math.PI * 2);
      context.fill();
    });

    requestAnimationFrame(render);
  };

  resize();
  seedStars();
  render();

  window.addEventListener("resize", () => {
    resize();
    seedStars();
  });

  window.addEventListener("pointermove", (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  });
}

function setCapability(index) {
  const item = capabilityData[index];
  if (!item || !capabilityDetail) return;

  capabilityButtons.forEach((button) => {
    const isActive = Number(button.dataset.capability) === index;
    button.classList.toggle("is-active", isActive);
  });

  if (capabilityDetailTitle) {
    capabilityDetailTitle.textContent = item.title;
  }

  if (capabilityDetailText) {
    capabilityDetailText.textContent = item.description;
  }
}

function initCapabilities() {
  capabilityButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setCapability(Number(button.dataset.capability));
    });

    button.addEventListener("pointerenter", () => {
      setCapability(Number(button.dataset.capability));
    });
  });

  setCapability(0);
}

function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealNodes.forEach((node) => observer.observe(node));
}

function animateCounter(node) {
  const target = Number(node.dataset.counter || "0");
  const duration = 1500;
  const start = performance.now();

  const tick = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    node.textContent = Math.floor(progress * target).toString();
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      node.textContent = target.toString();
    }
  };

  requestAnimationFrame(tick);
}

function initCounters() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.6
    }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function playTone(oscillatorType, frequency, duration, volume, delay = 0) {
  if (!audioContext) return null;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  const now = audioContext.currentTime + delay;

  oscillator.type = oscillatorType;
  oscillator.frequency.setValueAtTime(frequency, now);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(900, now);
  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.exponentialRampToValueAtTime(volume, now + 0.6);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start(now);
  oscillator.stop(now + duration + 0.1);

  return { oscillator };
}

function initAmbientAudio() {
  if (audioContext) return;

  const ContextClass = window.AudioContext || window.webkitAudioContext;
  if (!ContextClass) return;

  audioContext = new ContextClass();
}

function scheduleAmbientLoop() {
  if (!audioContext || !audioRunning) return;

  const chord = [196.0, 246.94, 293.66, 392.0];
  chord.forEach((note, index) => {
    ambientNodes.push(playTone("sine", note, 8, 0.02, index * 0.35));
  });

  ambientNodes.push(playTone("triangle", 98.0, 10, 0.012, 0));
  ambientNodes.push(playTone("sawtooth", 587.33, 6.5, 0.003, 2.2));

  ambientLoopTimer = window.setTimeout(scheduleAmbientLoop, 5800);
}

async function toggleAmbientAudio() {
  initAmbientAudio();
  if (!audioContext) return;

  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  audioRunning = !audioRunning;
  soundToggle.setAttribute("aria-pressed", String(audioRunning));

  if (!audioRunning) {
    if (ambientLoopTimer) {
      window.clearTimeout(ambientLoopTimer);
      ambientLoopTimer = null;
    }
    ambientNodes.forEach((node) => {
      if (node?.oscillator) {
        try {
          node.oscillator.stop();
        } catch (error) {
          // Ignore nodes that already stopped.
        }
      }
    });
    ambientNodes = [];
    return;
  }

  if (ambientLoopTimer) {
    window.clearTimeout(ambientLoopTimer);
  }
  scheduleAmbientLoop();
}

function initForm() {
  if (!leadForm) return;

  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(leadForm);
    const name = (formData.get("name") || "").toString().trim();
    const phone = (formData.get("phone") || "").toString().trim();
    const message = (formData.get("message") || "").toString().trim();

    if (!name || !phone || !message) {
      formNote.textContent = "Заполните все поля формы.";
      formNote.style.color = "#ff7da6";
      return;
    }

    const subject = encodeURIComponent(`Заявка с сайта Quantum Code Lab от ${name}`);
    const body = encodeURIComponent(
      `Имя: ${name}\nТелефон: ${phone}\n\nСообщение:\n${message}`
    );

    formNote.textContent = "Почтовое приложение откроется для отправки заявки.";
    formNote.style.color = "#6fffb2";
    window.location.href = `mailto:codelabquantum@gmail.com?subject=${subject}&body=${body}`;
  });
}

function initParallaxCards() {
  const cards = document.querySelectorAll(".system-row, .application-band, .reason-row");
  cards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 4;
      const rotateX = ((y / rect.height) - 0.5) * -3;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateX(8px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

function initHeroDepth() {
  if (!heroStage) return;

  heroStage.addEventListener("pointermove", (event) => {
    const rect = heroStage.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 8;
    const rotateX = ((y / rect.height) - 0.5) * -6;
    heroStage.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  heroStage.addEventListener("pointerleave", () => {
    heroStage.style.transform = "";
  });
}

function init() {
  initStarfield();
  initCapabilities();
  initReveal();
  initCounters();
  initForm();
  initParallaxCards();
  initHeroDepth();

  if (soundToggle) {
    soundToggle.addEventListener("click", toggleAmbientAudio);
  }
}

init();
