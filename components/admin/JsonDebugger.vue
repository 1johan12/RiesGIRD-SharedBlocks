<template>
  <div class="fixed bottom-4 right-4 w-96 max-h-[500px] overflow-auto bg-gray-900 text-green-400 p-4 rounded-lg shadow-2xl border border-green-700 font-mono text-xs z-50 opacity-90 hover:opacity-100 transition">
    <div class="flex justify-between mb-2 border-b border-green-800 pb-1">
      <span class="font-bold">📡 SIMULACIÓN DE DATOS</span>
      <span class="animate-pulse">● Live</span>
    </div>
    <pre>{{ JSON.stringify(data, null, 2) }}</pre>
  </div>
</template>

<script setup>
defineProps(['data'])
</script>