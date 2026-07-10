<template>
  <div class="code-rain-wrapper" aria-hidden="true">
    <div 
      v-for="n in 25" 
      :key="n" 
      class="code-token"
      :style="getRandomStyles(n)"
    >
      {{ tokens[n % tokens.length] }}
    </div>
  </div>
</template>

<script setup lang="ts">

const tokens = ['{ }', '01', '</>', 'if()', '=>', 'git', 'sudo', '[]', '&&', '1010' ];

const getRandomStyles = (index: number) => {
  const left = Math.floor(Math.random() * 100);
  const duration = 5 + Math.random() * 10; 
  const delay = Math.random() * -15;
  const size = 0.9 + Math.random() * 1.2;
  const opacity = 0.1 + Math.random() * 0.4; 

  return {
    left: `${left}%`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
    fontSize: `${size}rem`,
    opacity: opacity
  };
};
</script>

<style scoped>
.code-rain-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;

  background: #ffffff;
}

.code-token {
  position: absolute;
  top: -10%;
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.5); /* Verde Matrix clásico */
  text-shadow: 0 0 5px rgba(45, 46, 45, 0.137);
  user-select: none;
  animation: data-fall linear infinite;
}

@keyframes data-fall {
  0% {
    top: -10%;
    transform: translateX(0) scale(1);
  }
  20% {
    transform: translateX(-10px) scale(1.1);
  }
  40% {
    transform: translateX(10px) scale(0.9);
  }
  100% {
    top: 110%;
    transform: translateX(0) scale(1);
  }
}
</style>