<template>
  <div class="counter-card">
    <div class="count">{{ counter.count }}</div>
    <div class="double-count">
      <span>Çift değer:</span> {{ counter.doubleCount }}
    </div>
    
    <div class="buttons">
      <button class="btn decrement" @click="counter.decrement()">
        ➖ Azalt
      </button>
      <button class="btn reset" @click="counter.reset()">
        🔄 Sıfırla
      </button>
      <button class="btn increment" @click="counter.increment()">
        ➕ Artır
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const counter = useCounterStore()
</script>

<style scoped>
.counter-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.count {
  font-size: 5rem;
  font-weight: 600;
  color: #00d4ff;
  text-shadow: 0 0 30px rgba(0, 212, 255, 0.5);
  margin-bottom: 0.5rem;
}

.double-count {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.double-count span {
  opacity: 0.6;
}

.buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn:active {
  transform: translateY(0);
}

.increment {
  background: linear-gradient(135deg, #00b894, #00cec9);
  color: #fff;
}

.increment:hover {
  box-shadow: 0 5px 20px rgba(0, 184, 148, 0.4);
}

.decrement {
  background: linear-gradient(135deg, #e17055, #d63031);
  color: #fff;
}

.decrement:hover {
  box-shadow: 0 5px 20px rgba(214, 48, 49, 0.4);
}

.reset {
  background: linear-gradient(135deg, #636e72, #2d3436);
  color: #fff;
}

.reset:hover {
  box-shadow: 0 5px 20px rgba(45, 52, 54, 0.4);
}
</style>
