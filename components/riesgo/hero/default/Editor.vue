<script setup lang="ts">
import { ref, watch } from 'vue'
import { formatImageUrl } from '../../../../helpers/url'

const props = defineProps<{
    modelValue: any
}>()

const emit = defineEmits([
    'update:modelValue',
    'select-image'
])

const localData = ref({
    title: props.modelValue?.title || 'Título principal',
    subtitle: props.modelValue?.subtitle || 'Subtítulo',
    backgroundImage: props.modelValue?.backgroundImage || '',
    height: props.modelValue?.height || '500px',
    waveColor: props.modelValue?.waveColor || '#ffffff'
})

watch(
    () => props.modelValue,
    (newVal) => {
        if (!newVal) return

        const incoming = JSON.stringify(newVal)
        const current = JSON.stringify(localData.value)

        if (incoming !== current) {
            localData.value = {
                ...localData.value,
                ...newVal
            }
        }
    },
    { deep: true }
)

watch(
    localData,
    (value) => {
        emit(
            'update:modelValue',
            { ...value }
        )
    },
    {
        deep: true
    }
)
</script>

<template>
    <div class="p-3">

        <div class="card mb-3 border-0 shadow-sm">
            <div class="card-body">

                <h6 class="fw-bold mb-3 text-primary">
                    Hero Default
                </h6>

                <div class="mb-3">
                    <label class="small text-muted">
                        Título
                    </label>

                    <input v-model="localData.title" type="text" class="form-control form-control-sm">
                </div>

                <div class="mb-3">
                    <label class="small text-muted">
                        Subtítulo
                    </label>

                    <textarea v-model="localData.subtitle" rows="3" class="form-control form-control-sm" />
                </div>

                <div class="mb-3">
                    <label class="small text-muted d-block mb-1">
                        Imagen de fondo
                    </label>

                    <div class="media-placeholder border rounded clickable" :style="{
                        backgroundImage: localData.backgroundImage
                            ? `url(${formatImageUrl(localData.backgroundImage, '')})`
                            : 'none'
                    }" @click="
                $emit(
                    'select-image',
                    {
                        item: localData,
                        field: 'backgroundImage'
                    }
                )
                ">
                        <i v-if="
                            !localData.backgroundImage
                        " class="las la-plus fs-2 text-muted" />
                    </div>
                    <div class="d-flex gap-1 mt-1">
                        <button type="button" class="btn btn-xs btn-outline-primary flex-grow-1" @click="$emit('select-image', { item: localData, field: 'backgroundImage' })">
                            <i class="las la-image me-1"></i>{{ localData.backgroundImage ? 'Cambiar' : 'Elegir' }}
                        </button>
                        <button v-if="localData.backgroundImage" type="button" class="btn btn-xs btn-outline-danger" @click="localData.backgroundImage = ''">
                            <i class="las la-times"></i>
                        </button>
                    </div>
                </div>

                <div class="mb-3">
                    <label class="small text-muted">
                        Altura
                    </label>

                    <input v-model="localData.height" type="text" class="form-control form-control-sm"
                        placeholder="500px">
                </div>
                
                <div class="mb-3">
                    <label class="form-label fw-bold">Color de la Ola</label>
                    <div class="input-group">
                        <input 
                        v-model="localData.waveColor" 
                        type="text" 
                        class="form-control" 
                        placeholder="#ffffff"
                        maxlength="7"
                        >
                        
                        <div class="input-group-text p-1 bg-white">
                        <input 
                            v-model="localData.waveColor" 
                            type="color" 
                            class="form-control form-control-color border-0 m-0 p-0" 
                            style="width: 38px; height: 100%; min-height: 30px; cursor: pointer;"
                            title="Elegir color en el selector"
                        >
                        </div>
                    </div>
                    </div>
                <!-- <div>
                    <label class="small text-muted">
                        Color de ola
                    </label>

                    <input v-model="localData.waveColor" type="color" class="form-control form-control-color" value="#F2F7FF">
                </div> -->

            </div>
        </div>

    </div>
</template>

<style scoped>
.media-placeholder {
    height: 120px;

    background-color: #eee;
    background-size: cover;
    background-position: center;

    display: grid;
    place-items: center;

    cursor: pointer;

    border: 2px dashed #ccc;
}

.clickable {
    cursor: pointer;
}
</style>