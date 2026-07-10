<template>
  <div class="decoration-line d-flex">
    <div class="line-grey flex-grow-1"></div>
    <div class="line-white"></div>
    <div class="line-red"></div>
  </div>
</template>

<style scoped lang="scss">
$esan-red: #e31140;

.decoration-line {
  height: 4px;
  width: 100%;
  
  .line-grey { background-color: #4a4a4a; width: 33.33%; }
  .line-white { background-color: #ffffff; width: 33.33%; }
  .line-red { background-color: $esan-red; width: 33.34%; }
}

@media (max-width: 768px) {
  .decoration-line {
    .line-white, .line-red { width: 50%; }
    .line-grey { display: none; }
  }
}
</style>