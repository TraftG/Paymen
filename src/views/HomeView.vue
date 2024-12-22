<template>
  <div class="game-container">
    <!-- Кнопка для подключения кошелька -->
    <div class="wallet-button">
      <TonConnectButton />
    </div>

    <!-- Заголовок с морковками -->
    <div class="header-carrot">
      <div class="score-carrot">
        <img src="@/assets/morkov1.png" alt="" class="carrot-icon" />
        <div class="score-car">
          <span class="carrotscore">{{ store.carrotScore }} $CARO</span>
        </div>
      </div>
    </div>

    <!-- Заголовок с очками зайца -->
    <div class="header-rabbit">
      <div class="score-rabbit">
        <img src="@/assets/pp.jpg" alt="" class="rabbit-icon" />
        <div class="score-rab">
          <span class="rabbitscore">{{ store.score }} $RABI</span>
        </div>
      </div>
    </div>

    <!-- Заяц -->
    <div class="circle">
      <img
        @click="incrementRabbit"
        ref="rabbitImg"
        id="circle"
        :src="rabbitSkin"
        alt="rabbit-skin"
      />
    </div>

    <!-- Куст для получения морковок -->
    <div class="kust" @click="incrementCarrot">
      <img ref="kustImg" id="kust" :src="kust" alt="kust" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useScoreStore } from "@/stores/score";
import kust from "@/assets/snowkust.png";
import rabbit from "@/assets/chrrabbyt.png";
import { TonConnectButton } from "ton-ui-vue";
import mixpanel from "mixpanel-browser";

const store = useScoreStore();
const rabbitImg = ref(null);
const kustImg = ref(null);
const rabbitSkin = rabbit;

// Инициализация Mixpanel
mixpanel.init("dd53dc09474c6337c7e7826186e2cc14", {
  debug: true,
});
mixpanel.track("Game Loaded", { time: new Date().toISOString() });

onMounted(async () => {
  await store.init();
});

// Увеличение количества морковок
function incrementCarrot(event) {
  store.addCarrot(1);

  const rect = event.target.getBoundingClientRect();
  const plusCarrot = document.createElement("div");
  plusCarrot.classList.add("plus-one");
  plusCarrot.textContent = "+1";
  plusCarrot.style.left = `${event.clientX - rect.left}px`;
  plusCarrot.style.top = `${event.clientY - rect.top}px`;

  kustImg.value.parentElement.appendChild(plusCarrot);

  setTimeout(() => plusCarrot.remove(), 2000);

  // Mixpanel: отслеживание морковки
  mixpanel.track("Carrot Collected", {
    amount: 1,
    totalCarrots: store.carrotScore,
  });
}

// Увеличение очков зайца
function incrementRabbit(event) {
  if (store.carrotScore > 0) {
    store.addCarrot(-1);
    store.add(1);

    const rect = event.target.getBoundingClientRect();
    const plusRabbit = document.createElement("div");
    plusRabbit.classList.add("plus-one");
    plusRabbit.textContent = "+1";
    plusRabbit.style.left = `${event.clientX - rect.left}px`;
    plusRabbit.style.top = `${event.clientY - rect.top}px`;

    rabbitImg.value.parentElement.appendChild(plusRabbit);

    setTimeout(() => plusRabbit.remove(), 2000);

    // Mixpanel: отслеживание зайца
    mixpanel.track("Rabbit Fed", {
      amount: 1,
      totalRabbits: store.score,
    });
  } else {
    console.log("Недостаточно морковок для зайца!");
  }
}

</script>

<style scoped>
.game-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-image: url("@/assets/christmas.jpg");
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

.wallet-button {
  position: absolute;
  top: 10px; /* Расстояние от верхнего края */
  right: 10px; /* Расстояние от правого края */
  z-index: 10; /* Обеспечивает, чтобы кнопка была на переднем плане */
}

/* Позиционирование для текста с очками и морковками */
.header-carrot,
.header-rabbit {
  position: absolute;
  top: 10px; /* Расстояние от верхнего края */
  left: 10px; /* Расстояние от левого края */
  display: flex;
  flex-direction: column;
}

.score-carrot,
.score-rabbit {
  display: flex;
  align-items: center;
  gap: 10px;
}

.carrot-icon,
.rabbit-icon {
  width: 40px;
  height: auto;
  border-radius: 100%;
}

/* Белый шрифт для очков */
.carrotscore,
.rabbitscore {
  font-size: 20px;
  color: #ca8a04;
  font-weight: bold;
}

/* Добавляем отступ для блока с зайцем */
.header-rabbit {
  top: 60px; 
}

/* Для "круга" с зайцем */
.circle {
  position: fixed; /* Фиксированное позиционирование */
  top: 300px; /* Расстояние от верхнего края экрана */
  left: 200px; /* Расстояние от левого края экрана */
  width: 50px; /* Размер круга */
  height: 150px; /* Высота круга */
  border-radius: 10%; /* Делаем круглый элемент */
  z-index: 1; /* Для размещения поверх других элементов */
}

.kust {
  position: absolute; /* Позиционирование относительно родительского контейнера */
  left: -6px; /* Отступ от левого края */
  bottom: -6px; /* Отступ от нижнего края */

}

/* Всплывающий текст */
.plus-carrot,
.plus-rabbit {
  position: absolute;
  font-size: 16px;
  font-weight: bold;
  color: #ff5722;
  animation: float 1s ease-out;
}

@keyframes float {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-30px);
    opacity: 0;
  }
}

</style>
