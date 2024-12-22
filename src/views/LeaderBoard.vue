<template>
  <div class="leaderboard-container">
    <div class="leaderboard-header">
      <h1>Leaderboard</h1>
    </div>
    <div class="leaderboard-list">
      <div v-if="leaderboard.length > 0">
        <div v-for="(user, index) in leaderboard" :key="user.id" class="leaderboard-item" :class="getRankClass(index)">
          <div class="rank">{{ index + 1 }}</div>
          <div class="user-info">
            <span class="user-name">{{ user.telegram_id }}</span>
            <span class="user-score">{{ user.score }} Rabi</span>
          </div>
        </div>
      </div>
      <div v-else class="no-data">No data available</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getLeaderboard } from '../services/leaderboard'

const leaderboard = ref([])

const fetchLeaderboard = async () => {
  leaderboard.value = await getLeaderboard()
}

const getRankClass = (index) => {
  if (index === 0) {
    return 'gold'
  } else if (index === 1) {
    return 'silver'
  } else if (index === 2) {
    return 'bronze'
  }
  return ''
}

onMounted(() => {
  fetchLeaderboard()
})
</script>

<style scoped>
/* Полноэкранный контейнер */
.leaderboard-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  width: 100vw; /* Используем всю ширину экрана */
  height: 100vh; /* Используем всю высоту экрана */
  background-color: #1e1e1e;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

/* Заголовок */
.leaderboard-header {
  align-items: flex-start;
  margin-bottom: 20px;
}

.leaderboard-header h1 {
  font-size: 32px;
  color: #ffffff;
  margin: 0;
}

/* Прокручиваемый список */
.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  height: calc(100vh - 80px); /* Высота экрана за вычетом заголовка */
  overflow-y: auto; /* Прокрутка */
  scrollbar-width: thin;
  scrollbar-color: #888 #333;
}

.leaderboard-list::-webkit-scrollbar {
  width: 8px;
}

.leaderboard-list::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 4px;
}

/* Элемент списка */
.leaderboard-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #2b2b2b;
  border-radius: 8px;
  width: 100%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.rank {
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
  margin-right: 20px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
}

.user-score {
  font-size: 16px;
  color: #aaaaaa;
}

.no-data {
  text-align: center;
  color: #dbc4c4;
  font-size: 22px;
  padding-top: 20px;
}

/* Специальные классы для первых трех мест */
.gold {
  background-color: #ffcc3f; /* Золотой цвет для первого места */
  border: 2px solid #ffcc3f;
}

.silver {
  background-color: #919191; /* Серебряный цвет для второго места */
  border: 2px solid #919191;
}

.bronze {
  background-color: #ad5f12; /* Бронзовый цвет для третьего места */
  border: 2px solid #ad5f12;
}
</style>
