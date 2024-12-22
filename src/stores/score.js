import { defineStore } from 'pinia';
import debounce from 'lodash.debounce';
import { updateScore, updateCarrotScore, getScore, getCarrotScore } from '@/api/app';

const debouncedUpdateScore = debounce(updateScore, 500);
const debouncedUpdateCarrotScore = debounce(updateCarrotScore, 500);

const baseLevelScore = 25;

const levels = new Array(15)
  .fill(0)
  .map((_, i) => baseLevelScore * Math.pow(2, i));

const levelScores = levels.map((_, level) => {
  let sum = 0;
  for (let [index, value] of levels.entries()) {
    if (index >= level) {
      return sum + value;
    }
    sum += value;
  }
  return sum;
});

function computeLevelByScore(score) {
  for (let [index, value] of levelScores.entries()) {
    if (score <= value) {
      return {
        level: index,
        value: levels[index],
      };
    }
  }
}

export const useScoreStore = defineStore('score', {
  state: () => ({
    score: 0,
    carrotScore: 0,
    previousLevel: 0,
    clicks: 1000,
    maxClicks: 1000,
    regenInterval: null,
    doubleTapActive: false,
    lastTapTime: null,
  }),
  getters: {
    level: (state) => computeLevelByScore(state.score),
    currentScore(state) {
      if (this.level.level === 0) {
        return state.score;
      }
      return state.score - levelScores[this.level.level - 1];
    },
    canClick(state) {
      return state.clicks > 0;
    },
  },
  actions: {
    add(score = 1) {
      if (this.canClick) {
        this.score += this.doubleTapActive ? score * 2 : score;
        this.clicks -= 1;
        this.checkLevelChange();
        debouncedUpdateScore(this.score);
      }
    },
    addCarrot(score = 1) {
      this.carrotScore += score;
      debouncedUpdateCarrotScore(this.carrotScore);
    },
    setScore(score) {
      this.score = score;
      this.checkLevelChange();
      debouncedUpdateScore(this.score);
    },
    setCarrotScore(score) {
      this.carrotScore = score;
      debouncedUpdateCarrotScore(this.carrotScore);
    },
    activateDoubleTap() {
      this.doubleTapActive = true;
    },
    checkLevelChange() {
      const currentLevel = this.level.level;
      if (currentLevel !== this.previousLevel) {
        this.previousLevel = currentLevel;
        console.log(`Level changed to: ${currentLevel}`);
      }
    },
    startClickRegen() {
      if (this.regenInterval) {
        clearInterval(this.regenInterval);
      }
      this.regenInterval = setInterval(() => {
        if (this.clicks < this.maxClicks) {
          this.clicks += 1;
        }
      }, 1000);
    },
    async init() {
      try {
        const scoreFromDB = await getScore();
        const carrotScoreFromDB = await getCarrotScore();
        this.setScore(scoreFromDB || 0);
        this.setCarrotScore(carrotScoreFromDB || 0);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }

      this.startClickRegen();
      this.checkLevelChange();
    },
    // Метод для проверки двухтапового клика
    handleDoubleTap() {
      const currentTime = Date.now();
      if (this.lastTapTime && currentTime - this.lastTapTime <= 300) {
        this.activateDoubleTap();
      }
      this.lastTapTime = currentTime;
    },
  },
  persist: true,
});
