<template>
  <div class="text-content">
    <h1 class="title">Your Friends</h1>

    <div class="center">
      <button class="referal" @click="copy">{{ referalText }}</button>
    </div>

    <h3 v-if="friends.length === 0" class="no-friends">No friends yet</h3>

    <ul class="list">
      <li class="list-item" v-for="friend in friends" :key="friend.id">
        <span class="friend-name">{{ friend.name }}</span>
        <span class="list-btn done">50</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useTelegram } from '@/services/telegram'
import { useAppStore } from '@/stores/app'
import { ref, computed } from 'vue'

const app = useAppStore()
const { user } = useTelegram()

const referalText = ref('Your referral link')

// Преобразуем друзей в массив [{ id: 42, name: 'Vladilen' }]
const friends = computed(() =>
  Object.keys(app.user?.friends ?? {}).map((id) => ({
    id,
    name: app.user.friends[id],
  }))
)

function copy() {
  navigator.clipboard.writeText(
    'https://t.me/RabbyCoin_bot?start=' + user?.id
  )
  referalText.value = 'Copied!'
}
</script>

<style scoped>
.text-content {
  max-width: 600px;
  margin: auto;
  padding: 30px;
  background-color: #1a1a1a;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  color: #ffffff;
  font-family: 'Chalkboard SE', sans-serif;
}

.title {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
}

.center {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.referal {
  background-color: #000000;
  border: none;
  border-radius: 6px;
  padding: 12px 24px;
  font-size: 16px;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-family: 'Chalkboard SE', sans-serif;
}

.referal:hover {
  background-color: #333333;
}

.no-friends {
  text-align: center;
  color: #999;
  font-size: 16px;
}

.list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  background-color: #2c2c2c;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.list-item:hover {
  background-color: #444;
}

.friend-name {
  font-size: 18px;
  font-weight: bold;
  color: #e0e0e0;
}

.list-btn {
  background-color: #4caf50;
  border-radius: 6px;
  padding: 8px 16px;
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}
</style>
