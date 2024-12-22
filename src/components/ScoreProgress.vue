<template>
  <div class="progress">
    <h4 class="progress-level">
      <span>{{ store.currentScore }} / {{ store.level.value }}</span>
      <span>Level {{ store.level.level + 1 }}</span>
    </h4>
    
    <!-- Прогресс-бар -->
    <div class="progress-container">
      <div class="progress-value" :style="{ width: progress + '%' }"></div>
    </div>

    <!-- Состояние кликов -->
    <div class="clicks-status">
      <p>Clicks: <span>{{ store.clicks }} / {{ store.maxClicks }}</span></p>
    </div>
  </div>
</template>

<script setup>
import { useScoreStore } from '@/stores/score'
import { computed } from 'vue'

const store = useScoreStore()

const progress = computed(() => (100 * store.currentScore) / store.level.value)
</script>



