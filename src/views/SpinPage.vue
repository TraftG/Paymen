<template>
  <div class="casino-wheel-page">

    <div class="casino-wheel-container">
      <div class="casino-indicator"></div>
      <canvas ref="wheelCanvas" class="casino-wheel"></canvas>
    </div>

    <button @click="spin" :disabled="spinning || alreadySpunToday" class="casino-spin-button">
      Spin
    </button>

    <div v-if="result" class="casino-result">
      <p>Поздравляем! Вы выиграли: <span>{{ result }}</span></p>
    </div>
    
    <div v-if="alreadySpunToday" class="casino-info">
      <p>Вы уже играли сегодня. Попробуйте завтра!</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useScoreStore } from "@/stores/score";

const wheelCanvas = ref(null);
const result = ref(null);
const store = useScoreStore();

const items = [
  { image: '../assets/pp.jpg', label: '1000 RABI$' },
  { image: '../assets/morkov1.png', label: '10000 CARO$' },
  { image: '../assets/pp.jpg', label: '500 RABI$' },
  { image: '../assets/morkov1.png', label: '2000 CARO$' },
  { image: '../assets/pp.jpg', label: '3000 RABI$' },
  { image: '../assets/morkov1.png', label: '5000 CARO$' },
];

const colors = [
  '#ffb74d', '#4caf50', '#ff5252', '#ffd740', '#64b5f6', '#e57373',
];

const segmentAngle = 360 / items.length;
let currentAngle = 0;
let spinning = false;
let spinStartTime = null;
let spinDuration = 5000;
let targetAngle = 0;
const alreadySpunToday = ref(false);

onMounted(() => {
  drawWheel();
  checkIfAlreadySpunToday();
});

function incrementCarrot() {
  store.addCarrot(1000); // Добавляем 1000 CARO
}

function drawWheel() {
  const canvas = wheelCanvas.value;
  canvas.width = 300;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');
  const size = canvas.width / 2;
  const borderWidth = 10; // Ширина рамки

  // Рисуем внешнюю красную рамку
  ctx.lineWidth = borderWidth;
  ctx.strokeStyle = '#d32f2f'; // Красный цвет
  ctx.beginPath();
  ctx.arc(size, size, size - borderWidth / 2, 0, 2 * Math.PI);
  ctx.stroke();

  // Рисуем сегменты с градиентами
  items.forEach((item, index) => {
    const startAngle = (index * segmentAngle * Math.PI) / 180;
    const endAngle = ((index + 1) * segmentAngle * Math.PI) / 180;

    // Создаем градиент для сегмента
    const gradient = ctx.createLinearGradient(size, 0, size, canvas.height);
    gradient.addColorStop(0, getGradientColor(index, 0));
    gradient.addColorStop(1, getGradientColor(index, 1));

    // Рисуем сегмент с градиентом
    ctx.beginPath();
    ctx.moveTo(size, size);
    ctx.arc(size, size, size - borderWidth, startAngle, endAngle);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.stroke();

    // Рисуем текст на сегменте
    ctx.save();
    ctx.translate(size, size);
    ctx.rotate((startAngle + endAngle) / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#fff';
    ctx.font = '13px Arial';
    ctx.fillText(item.label, size - 24, 5);
    ctx.restore();
  });

  // Рисуем желтые круги по краям красной рамки
  const numCircles = 20; // Количество кругов
  const circleRadius = 5; // Радиус каждого круга
  const outerRadius = size - borderWidth / 2; // Радиус, на котором будут располагаться круги

  for (let i = 0; i < numCircles; i++) {
    const angle = (i * (2 * Math.PI)) / numCircles;
    const x = size + outerRadius * Math.cos(angle);
    const y = size + outerRadius * Math.sin(angle);

    ctx.beginPath();
    ctx.arc(x, y, circleRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffd740'; // Желтый цвет
    ctx.fill();
  }
}


// Функция для получения цвета градиента
function getGradientColor(index, stop) {
  const gradientColors = [
    ['#ffb74d', '#ff9800'], // Оранжевый градиент
    ['#4caf50', '#388e3c'], // Зеленый градиент
    ['#ff5252', '#d32f2f'], // Красный градиент
    ['#ffd740', '#ffab00'], // Желтый градиент
    ['#64b5f6', '#1976d2'], // Голубой градиент
    ['#e57373', '#d32f2f'], // Розовый градиент
  ];
  
  return gradientColors[index % gradientColors.length][stop];
}

function spin() {
  if (spinning || alreadySpunToday.value) return;

  incrementCarrot();
  
  spinning = true;
  spinStartTime = performance.now();
  targetAngle = Math.floor(Math.random() * 360 + 3600);

  animateSpin();
}

function animateSpin() {
  const canvas = wheelCanvas.value;
  const elapsedTime = performance.now() - spinStartTime;
  const progress = Math.min(elapsedTime / spinDuration, 1);

  const angle = currentAngle + (targetAngle - currentAngle) * progress;
  canvas.style.transform = `rotate(${angle}deg)`;

  if (progress < 1) {
    requestAnimationFrame(animateSpin);
  } else {
    currentAngle = angle % 360;
    calculateResult();
  }
}

function calculateResult() {
  result.value = '1000 CARO'; // Always show 1000 CARO
  spinning = false;
  alreadySpunToday.value = true; // Mark as spun today
  localStorage.setItem('lastSpinDate', new Date().toISOString()); // Save current date
}

function checkIfAlreadySpunToday() {
  const lastSpinDate = localStorage.getItem('lastSpinDate');
  if (lastSpinDate) {
    const today = new Date().toISOString().split('T')[0];
    const lastSpinDateOnly = lastSpinDate.split('T')[0];
    if (today === lastSpinDateOnly) {
      alreadySpunToday.value = true;
    }
  }
}
</script>

<style scoped>
.casino-wheel-page {
  text-align: center;
  padding: 20px;
}

.casino-wheel-container {
  position: relative;
  display: inline-block;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.casino-wheel {
  border: 4px solid #000;
  border-radius: 50%;
  transition: transform 0.5s ease-in-out;
}

.casino-spin-button {
  margin-top: 20px;
  padding: 12px 24px;
  background-color: #a21111;
  color: white;
  border: none;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.casino-spin-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.casino-result {
  margin-top: 20px;
  font-size: 18px;
  color: #ff5252;
}

.casino-result span {
  font-weight: bold;
}

.casino-info {
  margin-top: 20px;
  font-size: 16px;
  color: #ff8c00;
}
</style>
