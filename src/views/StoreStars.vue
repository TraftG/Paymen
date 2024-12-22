<template>
  <div class="product-container">
    <div v-for="(product, index) in products" :key="index" class="product-card">
      <img :src="product.image" :alt="product.title" class="product-image" />
      <h3>{{ product.title }}</h3>
      <p>{{ product.description }}</p>
      <p>{{ product.price }} {{ product.currency }}</p>
      
      <button 
        v-if="product.title === 'Starter Pack Expert'" 
        @click="buyProduct('Starter Pack Expert')"
        :disabled="paymentInProgress"
        class="clickable-button"
      >
        <img src="../assets/stars.png" alt="100 Stars" class="star-icon" />
        100
      </button>
      <button 
        v-if="product.title === 'Starter Pack Dude'" 
        @click="buyProduct('Starter Pack Dude')"
        :disabled="paymentInProgress"
        class="clickable-button"
      >
        <img src="../assets/stars.png" alt="50 Stars" class="star-icon" />
        50
      </button>

      <p v-if="canDoubleTap">Теперь вы можете тапать дважды!</p>
    </div>
  </div>
</template>

<script>
import image2xTap from '@/assets/2xtap.png';
import pack from '@/assets/pack.png';
import { useScoreStore } from "@/stores/score";
import { updateScore, updateCarrotScore } from '@/api/app';

export default {
  data() {
    return {
      products: [
        {
          title: 'Starter Pack Dude',
          description: '5k Rabby 1k Caro',
          image: pack,
        },
        {
          title: 'Starter Pack Expert',
          description: '10k Rabby 1k Caro',
          image: pack,
        },
      ],
      canDoubleTap: false,
      paymentInProgress: false,
    };
  },
  methods: {
    async buyProduct(productTitle) {
      if (this.paymentInProgress) return;
      this.paymentInProgress = true;

      const endpoint = productTitle === 'Starter Pack Expert' 
        ? 'https://rabbyinvoice.onrender.com/pack-invoice' 
        : 'https://paymen-6a1f.onrender.com/generate-invoice';

      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        const invoiceLink = data.invoiceLink;

        if (invoiceLink) {
          window.location.href = invoiceLink;
          this.checkPaymentStatus(data.paymentId, productTitle);
        } else {
          console.error('Invoice not found');
        }
      } catch (error) {
        console.error('Error while fetching invoice:', error);
      } finally {
        this.paymentInProgress = false;
      }
    },

    async checkPaymentStatus(paymentId, productTitle) {
      try {
        if (!paymentId) {
          console.error('Payment ID is not available');
          return;
        }
        const url = `https://rabbyinvoice.onrender.com/pack-invoice`;
        const response = await fetch(url);
        const data = await response.json();

        this.handleInvoiceStatus(data.status, productTitle);
      } catch (error) {
        console.error('Error while checking payment status:', error);
      }
    },

    async handleInvoiceStatus(status, productTitle) {
      const store = useScoreStore();
      
      if (status === 'paid') {
        if (productTitle === 'Starter Pack Expert') {
          store.add(10000);
          store.addCarrot(1000);
        } else if (productTitle === 'Starter Pack Dude') {
          store.add(5000);
          store.addCarrot(1000);
        }

        await updateScore(store.score);
        await updateCarrotScore(store.carrotScore);
        this.showCustomPopup('Спасибо за покупку!');
      } else {
        alert('Оплата не прошла. Попробуйте снова.');
      }
    },

    showCustomPopup(message) {
      alert(message);
    },
  },
};
</script>

<style scoped>
.product-container {
  display: flex;
  justify-content: flex-start; /* Align items to the left */
  gap: 20px;
  padding: 10px;
  position: absolute;
  top: 20px;
  left: 60%;
  transform: translateX(-50%); /* Center the container horizontally */
  z-index: 10;
  flex-wrap: wrap;
  width: 100%; /* Ensure the container spans the full width */
  max-width: 100%; /* Avoid it going beyond the screen width */
}

.product-card {
  border: 1px solid #1d1d1d;
  padding: 8px;
  width: 150px; /* Card width */
  box-sizing: border-box;
  text-align: center;
  background-color: #1d1d1d;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  color: white;
}

.product-card p {
  color: #b0b0b0;
}

.product-image {
  width: 70%;
  max-height: 80px;
  object-fit: cover;
}

button {
  background-color: #fab115;
  color: #000000;
  padding: 6px 12px;
  border: none;
  cursor: pointer;
  border-radius: 20px;
  width: auto;
  font-size: 12px;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
}

button:disabled {
  background-color: #e0e0e0;
  cursor: not-allowed;
}

.star-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}
</style>
