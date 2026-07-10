<template>
  <div class="d-flex align-items-center gap-3 ms-auto me-2 order-lg-last">
    
    <div class="vertical-divider"></div>

    <a href="#" class="btn-cta-premium shadow-sm d-flex align-items-center justify-content-center">
      <span>INSCRÍBETE</span>
    </a>

  </div>
</template>

<style scoped lang="scss">
@use "sass:color";
$esan-color: #c40d36;

.vertical-divider {
    width: 1px;
    height: 25px;
    background-color: #e0e0e0;
}

.btn-cta-premium {
    background: linear-gradient(135deg, $esan-color 0%, color.adjust($esan-color, $lightness: -10%) 100%);
    color: white;
    font-weight: 700;
    text-decoration: none;
    border-radius: 50px;
    transition: all 0.3s ease;
    white-space: nowrap;
    
    
    font-size: 0.85rem;
    padding: 10px 24px;
    height: auto;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(196, 13, 54, 0.4);
    }

    
    @media (max-width: 576px) {
        width: auto;
        height: 35px;
        padding: 6px 14px;
        font-size: 0.75rem;
    }
}

/* --- PARCHE DE EMERGENCIA (992px - 1100px) --- */
@media (min-width: 992px) and (max-width: 1100px) {
    .btn-cta-premium {
        padding: 8px 15px; 
        font-size: 0.75rem;
    }
}
</style>