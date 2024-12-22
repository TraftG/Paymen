<template>
  <div class="text-content">
    <h1 class="title">Your Tasks</h1>
    <h3 v-if="app.tasks.length === 0" class="loading">Loading tasks...</h3>
    <ul class="list">
      <li 
        class="list-item" 
        v-for="task in app.tasks" 
        :key="task.id"
        :class="{ done: app.user?.tasks?.[task.id] }"
      >
        <div class="task-info">
          <span class="task-title">{{ task.title }}</span>
          <span class="task-amount">{{ task.amount }} 
            Rabi</span>
        </div>
        <a
          @click.prevent="openTask(task)"
          target="_blank"
          class="list-btn"
          :class="{ done: app.user?.tasks?.[task.id] }"
        >
          {{ app.user?.tasks?.[task.id] ? 'Done' : 'Complete' }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useTelegram } from '@/services/telegram'
import { useAppStore } from '@/stores/app'
import { onMounted } from 'vue'

const { tg } = useTelegram()
const app = useAppStore()

onMounted(() => {
  app.fetchTasks()
})

function openTask(task) {
  app.completeTask(task)
  if (task.url.includes('t.me')) {
    tg.openTelegramLink(task.url)
  } else {
    tg.openLink(task.url)
  }
}
</script>

<style scoped>
/* Применение Comic Neue Bold */
.title {
  font-family: 'Chalkboard SE', sans-serif;
  font-weight: bold;
  font-size: 32px;
  text-align: left;
  margin-bottom: 10px;
  color: #ffffff;
}

.loading {
  text-align: center;
  color: #999;
  font-family: 'Chalkboard SE', sans-serif;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  background-color: #2c2c2c;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.task-title {
  font-size: 18px;
  font-weight: bold;
  color: #e0e0e0;
  font-family: 'Chalkboard SE', sans-serif;
}

.task-amount {
  font-size: 16px;
  color: #bbbbbb;
  margin-top: 5px;
}

.list-btn {
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  color: #000000;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  font-family: 'Chalkboard SE', sans-serif;
}

.list-btn:hover {
  background-color: #000000;
}

.list-btn.done {
  background-color: #ffffff;
  color: #000000;
}

</style>
