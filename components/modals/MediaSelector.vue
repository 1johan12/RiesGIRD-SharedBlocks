<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import HttpClient from "@/helpers/http-client";
import Swal from "sweetalert2";
import { useAuthStore } from "@/stores/auth"; 


interface MediaFolder {
  id: number;
  name: string;
  parent_id: number | null;
}

interface MediaItem {
  id: number;
  url: string;
  filename: string;
  mime_type: string;
  size: number;
}


const props = defineProps<{
  academicUnitId?: number | null; 
  collection?: string; 
}>();

const emit = defineEmits<{
  (e: 'select', payload: { id: number, url: string }): void;
  (e: 'close'): void;
}>();


const authStore = useAuthStore();


const effectiveUnitId = computed(() => {
  return props.academicUnitId || authStore.academicUnitId || 1;
});


const folders = ref<MediaFolder[]>([]);
const files = ref<MediaItem[]>([]);
const loading = ref(false);
const uploading = ref(false);
const searchQuery = ref('');
const fileInput = ref<HTMLInputElement | null>(null);


const currentFolderId = ref<number | null>(null);
const parentFolderId = ref<number | null>(null);
const breadcrumbPath = ref<{id: number, name: string}[]>([]);


const formatImageUrl = (url: string | null | undefined): string => {
  if (!url) return 'https://placehold.co/600x400?text=Sin+Imagen';
  if (url.startsWith('http') && !url.includes('/storage/')) return url;

  let cleanPath = url;
  if (url.includes('storage/')) {
    cleanPath = url.split('storage/').pop() || ''; 
  }

  const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || ''; 
  cleanPath = cleanPath.replace('public/', "").replace(/^\/+/, "").replace(/\/+/g, "/"); 
  return `${baseUrl}/storage/${cleanPath}`;
};


const loadMedia = async () => {
  loading.value = true;
  try {
    
    const url = currentFolderId.value 
        ? `media-manager/${effectiveUnitId.value}?folder_id=${currentFolderId.value}`
        : `media-manager/${effectiveUnitId.value}`;
        
    const { data } = await HttpClient.get(url);
    folders.value = data.folders || [];
    files.value = data.files || [];
    parentFolderId.value = data.parent_id || null;
  } catch (error) {
    console.error("Error cargando medios:", error);
    Swal.fire("Error", "No se pudo cargar la galería", "error");
  } finally {
    loading.value = false;
  }
};

const handleUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    Swal.fire("Archivo muy grande", "El peso máximo permitido es de 5MB", "warning");
    if (fileInput.value) fileInput.value.value = '';
    return;
  }

  uploading.value = true;
  const formData = new FormData();  
  formData.append('academic_unit_id', String(effectiveUnitId.value));
  formData.append('files[]', file); 
  
  if (currentFolderId.value) {
      formData.append('folder_id', String(currentFolderId.value));
  }
  if (props.collection) {
    formData.append('collection', props.collection);
  }

  try {
    await HttpClient.post('media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    searchQuery.value = ''; 
    await loadMedia(); 
  } catch (e) {
    Swal.fire("Error", "No se pudo subir el archivo", "error");
  } finally {
    uploading.value = false;
    if (fileInput.value) fileInput.value.value = ''; 
  }
};


const openFolder = (folder: MediaFolder) => {
    currentFolderId.value = folder.id;
    breadcrumbPath.value.push({id: folder.id, name: folder.name});
    loadMedia();
};

const goUp = () => {
    currentFolderId.value = parentFolderId.value;
    breadcrumbPath.value.pop();
    loadMedia();
};

const createFolder = async () => {
    console.log("▶️ INICIANDO: Abriendo modal de SweetAlert...");
    
    const { value: name } = await Swal.fire({
        title: 'Nueva Carpeta',
        input: 'text',
        inputPlaceholder: 'Nombre de la carpeta',
        showCancelButton: true,
        confirmButtonText: 'Crear',
        cancelButtonText: 'Cancelar',
        didOpen: () => {
            const container = Swal.getContainer();
            if (container) container.style.zIndex = "3000"; 
        }
    });

    console.log("⏸️ Swal cerrado. Valor recibido (name):", name);

    if (name) {
        try {
            console.log("⏳ ENVIANDO a Laravel el nombre:", name);
            console.log("Datos enviados:", {
                academic_unit_id: effectiveUnitId.value,
                parent_id: currentFolderId.value,
                name: name
            });

            
            const response = await HttpClient.post('media-folders', {
                academic_unit_id: effectiveUnitId.value,
                parent_id: currentFolderId.value,
                name: name
            });

            console.log("✅ RESPUESTA DE LARAVEL RECIBIDA:", response);

            
            searchQuery.value = '';

            
            console.log("🔄 Ejecutando loadMedia()...");
            await loadMedia();
            console.log("✅ loadMedia() terminó correctamente.");

            
            console.log("🎉 Mostrando Toast de éxito...");
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Carpeta creada con éxito',
                showConfirmButton: false,
                timer: 2000,
                didOpen: (toast) => { 
                    toast.style.zIndex = "3500"; 
                }
            });

        } catch (e: any) {
            console.error("❌ ERROR ATRAPADO EN EL CATCH:", e);
            console.error("Detalle del error de Axios:", e.response?.data || e.message);
            
            Swal.fire({
                title: 'Error',
                text: 'Revisa la consola (F12) para ver el error exacto',
                icon: 'error',
                didOpen: () => {
                   const container = Swal.getContainer();
                   if (container) container.style.zIndex = "3000";
                }
            });
        }
    } else {
        console.log("⏹️ Creación cancelada o nombre vacío.");
    }
};


const filteredFiles = computed(() => {
  if (!searchQuery.value) return files.value;
  const query = searchQuery.value.toLowerCase();
  return files.value.filter(item => item.filename.toLowerCase().includes(query));
});

const filteredFolders = computed(() => {
  if (!searchQuery.value) return folders.value;
  const query = searchQuery.value.toLowerCase();
  return folders.value.filter(item => item.name.toLowerCase().includes(query));
});

onMounted(loadMedia);
</script>

<template>
  <div class="modal fade show d-block" style="background: rgba(0,0,0,0.85); z-index: 1070;">
    <div class="modal-dialog modal-xl modal-dialog-scrollable shadow-lg">
      <div class="modal-content border-0 rounded-3 overflow-hidden">
        
        <div class="modal-header bg-dark text-white border-0 py-3 d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center">
            <i class="las la-photo-video fs-2 me-3 text-warning"></i>
            <div>
              <h5 class="modal-title fw-bold mb-0 lh-1">Biblioteca de Medios</h5>
              <small class="text-white-50">
                <span style="cursor:pointer" @click="currentFolderId = null; breadcrumbPath = []; loadMedia()">Inicio</span> 
                <span v-for="crumb in breadcrumbPath" :key="crumb.id">
                    / {{ crumb.name }}
                </span>
              </small>
            </div>
          </div>
          
          <div class="d-flex gap-2 align-items-center">
            <button class="btn btn-outline-light btn-sm d-flex align-items-center" @click="createFolder" :disabled="uploading">
              <i class="las la-folder-plus fs-5 me-1"></i> Carpeta
            </button>
            <button class="btn btn-primary btn-sm px-3 fw-bold shadow-sm d-flex align-items-center" @click="fileInput?.click()" :disabled="uploading || !props.academicUnitId">
              <span v-if="uploading" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="las la-cloud-upload-alt fs-5 me-1"></i> 
              {{ uploading ? 'Subiendo...' : 'Subir Archivo' }}
            </button>
            <button type="button" class="btn-close btn-close-white ms-2" aria-label="Close" @click="$emit('close')"></button>
          </div>
          <input type="file" ref="fileInput" class="d-none" @change="handleUpload" accept="image/*,application/pdf">
        </div>

        <div class="modal-body bg-light p-4">
          <div v-if="!props.academicUnitId" class="alert alert-warning text-center">
              Debes seleccionar una Unidad Académica antes de abrir la biblioteca.
          </div>

          <div v-else>
              <div class="row mb-4 justify-content-between align-items-center">
                <div class="col-md-6 col-lg-4 d-flex">
                  <button v-if="currentFolderId" class="btn btn-sm btn-secondary me-2" @click="goUp">
                      <i class="las la-arrow-left"></i> Atrás
                  </button>
                  <div class="input-group shadow-sm bg-white rounded flex-grow-1">
                    <span class="input-group-text bg-transparent border-0"><i class="las la-search text-muted"></i></span>
                    <input v-model="searchQuery" type="text" class="form-control border-0 ps-0 focus-ring-none" placeholder="Buscar...">
                  </div>
                </div>
                <div class="col-auto text-muted small fw-medium mt-2 mt-md-0">
                  {{ filteredFolders.length }} carpetas, {{ filteredFiles.length }} archivos
                </div>
              </div>

              <div v-if="loading" class="text-center py-5">
                <div class="spinner-grow text-primary" role="status"></div>
                <p class="mt-3 text-muted fw-bold">Sincronizando carpeta...</p>
              </div>

              <div v-else class="row g-3">
                
                <div v-for="folder in filteredFolders" :key="'f-'+folder.id" class="col-xl-2 col-lg-3 col-md-4 col-6">
                    <div class="card h-100 folder-card border-0 shadow-sm" @click="openFolder(folder)" :title="folder.name">
                        <div class="card-body text-center p-3">
                            <i class="las la-folder text-warning display-4"></i>
                            <div class="text-truncate fw-bold mt-2 small text-dark">{{ folder.name }}</div>
                        </div>
                    </div>
                </div>

                <div v-for="item in filteredFiles" :key="'m-'+item.id" class="col-xl-2 col-lg-3 col-md-4 col-6">
                  <div class="card h-100 media-card border-0 shadow-sm" @click="$emit('select', { id: item.id, url: formatImageUrl(item.url) })" :title="item.filename">
                    
                    <div class="img-container bg-white d-flex align-items-center justify-content-center border-bottom rounded-top" style="height: 140px; position: relative;">
                      <span v-if="item.mime_type.includes('webp')" class="badge bg-info position-absolute top-0 start-0 m-2" style="font-size: 0.65rem;">WEBP</span>

                      <div v-if="item.mime_type === 'application/pdf'" class="text-danger d-flex flex-column align-items-center">
                        <i class="las la-file-pdf display-3"></i>
                        <span class="badge bg-danger mt-1">PDF</span>
                      </div>
                      
                      <img v-else-if="item.mime_type.includes('image')"
                        :src="formatImageUrl(item.url)" 
                        class="img-fluid object-fit-contain h-100 w-100 p-2"
                        @error="(e: any) => e.target.src = 'https://placehold.co/200x200?text=Error'"
                        alt="media"
                      >
                      
                      <i v-else class="las la-file-alt display-3 text-secondary"></i>
                    </div>

                    <div class="card-footer bg-white border-0 p-2 text-center rounded-bottom">
                      <small class="text-muted d-block text-truncate fw-medium" style="font-size: 0.75rem;">
                        {{ item.filename }}
                      </small>
                    </div>

                  </div>
                </div>

              </div>

              <div v-if="!loading && filteredFiles.length === 0 && filteredFolders.length === 0" class="text-center py-5 bg-white rounded shadow-sm border border-dashed mt-3">
                <i class="las la-folder-open display-1 text-light"></i>
                <h4 class="mt-3 fw-bold text-dark">Carpeta vacía</h4>
                <p class="text-muted">No hay archivos en esta ubicación.</p>
                <button v-if="!searchQuery" class="btn btn-outline-primary mt-2" @click="fileInput?.click()">
                  <i class="las la-plus me-1"></i> Subir archivo
                </button>
              </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.border-dashed { border-style: dashed !important; border-width: 2px !important; border-color: #dee2e6 !important; }
.focus-ring-none:focus { box-shadow: none !important; outline: none !important; }

.folder-card, .media-card {
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border: 2px solid transparent !important;
  background-color: #f8f9fa;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important;
    border-color: #0d6efd !important; 
    
    .card-footer small, .text-dark {
      color: #0d6efd !important;
    }
  }
}
.swal2-container {
    z-index: 2100 !important; /* Valor muy alto para ganar a cualquier modal manual */
}
</style>