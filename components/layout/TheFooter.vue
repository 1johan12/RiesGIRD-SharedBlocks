<template>
    <footer id="sp-footer">
        <div class="container">
            <div class="row justify-content-center">
                <div id="sp-footer1" class="col-sm-12 col-md-12">
                    <div class="sp-column text-center">
                        <div class="sp-module">
                            <div class="sp-module-content">
                                <div class="mod-sppagebuilder sp-page-builder" data-module_id="121">
                                    <div class="page-content">
                                        <div id="section-id-1514291088187" class="sppb-section">
                                            <div class="sppb-row-overlay"></div>
                                            <div class="sppb-container-inner">
                                                <div class="sppb-row">
                                                    <div class="sppb-col-md-12" id="column-wrap-id-1514291088186">
                                                        <div id="column-id-1514291088186" class="sppb-column">
                                                            <div class="sppb-column-addons">
                                                                <div id="sppb-addon-wrapper-1514291088190"
                                                                    class="sppb-addon-wrapper">
                                                                    <div id="sppb-addon-1514291088190" class="clearfix">
                                                                        <div class="sppb-addon sppb-addon-social-media">
                                                                            <div class="social-media-text-wrap">
                                                                                <!-- Uso de Bootstrap Icons -->
                                                                                <a href="https://www.facebook.com/esandata"
                                                                                    target="_blank" title="Facebook"><i
                                                                                        class="bi bi-facebook"></i></a>
                                                                                <a href="https://www.youtube.com/user/audiovisualesuesan"
                                                                                    target="_blank" title="YouTube"><i
                                                                                        class="bi bi-youtube"></i></a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Copyright -->
                        <span class="sp-copyright">
                            © Copyright 2026 <strong style="font-weight: 900;">ESANDATA</strong>. All Rights Reserved.
                        </span>
                        <!-- Intranet Corner -->
                        <div class="intranet-corner">
                            <router-link to="/auth/sign-in" class="small staff-access hover-white text-decoration-none">
                                <i class="bi bi-shield-lock me-1"></i>Intranet
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script lang="ts">
export default {
    name: 'Footer',
};
</script>

<style scoped>
#sp-footer {
    background-color: #000000e1;
    padding: 20px 0;
    position: relative;
    /* Necesario para que la posición de la esquina funcione correctamente */
}

.sppb-addon-social-media a {
    color: #c2c2c2;
    margin-right: 15px;
    font-size: 1rem;
}

.sppb-addon-social-media a:hover {
    color: #007bff;
}

.sp-copyright {
    display: block;
    margin-top: 10px;
    font-size: 0.875rem;
    color: #ffffff;
}

.intranet-corner {
    position: absolute;
    bottom: 10px;
    /* Está en la parte inferior */
    left: 10px;
    /* Está en la parte izquierda */
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 5px 10px;
    font-size: 0.875rem;
    border-radius: 5px;
}

.intranet-corner span {
    font-weight: bold;
}
.staff-access {
    color: #ffffff !important;
    font-weight: 500; transition: color 0.3s;
    &:hover { color: #e31140 !important; }
}

/* Estilo para centrar los iconos y el contenido */
.text-center {
    text-align: center;
}
</style>
