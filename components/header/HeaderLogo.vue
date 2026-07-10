<template>
  <a class="navbar-brand py-2 p-0 me-2" href="#">
    <img src="@/assets/images/LogoSolitario.png" alt="ESAN Mobile" class="d-block d-xl-none" height="45">
    <img src="@/assets/images/LogoHorizontal.png" alt="ESAN Desktop" class="d-none d-xl-block" height="50">
  </a>
</template>

<style scoped lang="scss">
/* --- PARCHE DE EMERGENCIA (992px - 1100px) --- */
@media (min-width: 992px) and (max-width: 1100px) {
    
    img {
        height: 40px !important;
    }
}
</style>