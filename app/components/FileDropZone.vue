<template>
  <div
    ref="dropZone"
    class="relative border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 transition-colors duration-200 ease-in-out"
    :class="{
      'border-primary bg-primary/5': isDragOver,
      'hover:border-primary/50 hover:bg-muted/50': !isDragOver && !disabled
    }"
    @dragenter.prevent="handleDragEnter"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
    @click="handleClick"
  >
    <input
      ref="fileInput"
      type="file"
      :accept="accept"
      :multiple="multiple"
      class="hidden"
      @change="handleFileSelect"
    >
    
    <div class="flex flex-col items-center justify-center space-y-4 text-center">
      <!-- Icon -->
      <div class="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <svg
          class="h-6 w-6 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      </div>
      
      <!-- Text Content -->
      <div class="space-y-2">
        <p class="text-lg font-medium">
          {{ isDragOver ? 'Drop files here' : 'Drag and drop files here' }}
        </p>
        <p class="text-sm text-muted-foreground">
          {{ description || `Click to browse or drag and drop files here` }}
        </p>
        <p v-if="fileTypes" class="text-xs text-muted-foreground">
          Supported formats: {{ fileTypes }}
        </p>
        <p v-if="maxSize" class="text-xs text-muted-foreground">
          Maximum file size: {{ formatFileSize(maxSize) }}
        </p>
      </div>
      
      <!-- Browse Button -->
      <Button
        type="button"
        variant="outline"
        size="sm"
        :disabled="disabled"
        class="mt-2"
      >
        Browse Files
      </Button>
    </div>
    
    <!-- Overlay for disabled state -->
    <div
      v-if="disabled"
      class="absolute inset-0 bg-background/80 rounded-lg flex items-center justify-center"
    >
      <p class="text-sm text-muted-foreground">Upload disabled</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  accept?: string
  multiple?: boolean
  maxSize?: number // in bytes
  description?: string
  fileTypes?: string
  disabled?: boolean
}

interface Emits {
  (e: 'files-selected', files: File[]): void
  (e: 'drag-enter' | 'drag-leave' | 'drag-over' | 'drop'): void
}

const props = withDefaults(defineProps<Props>(), {
  accept: '*',
  multiple: false,
  disabled: false
})

const emit = defineEmits<Emits>()

const dropZone = ref<HTMLDivElement>()
const fileInput = ref<HTMLInputElement>()
const isDragOver = ref(false)

const handleDragEnter = (_event: DragEvent) => {
  if (props.disabled) return
  isDragOver.value = true
  emit('drag-enter')
}

const handleDragOver = (event: DragEvent) => {
  if (props.disabled) return
  event.preventDefault()
  emit('drag-over')
}

const handleDragLeave = (event: DragEvent) => {
  if (props.disabled) return
  // Only set to false if we're leaving the drop zone entirely
  if (!dropZone.value?.contains(event.relatedTarget as Node)) {
    isDragOver.value = false
    emit('drag-leave')
  }
}

const handleDrop = (event: DragEvent) => {
  if (props.disabled) return
  isDragOver.value = false
  emit('drop')
  
  const files = Array.from(event.dataTransfer?.files || [])
  processFiles(files)
}

const handleClick = () => {
  if (props.disabled) return
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  processFiles(files)
  
  // Reset input value to allow selecting the same file again
  target.value = ''
}

const processFiles = (files: File[]) => {
  if (files.length === 0) return
  
  // Filter files by accept type if specified
  let filteredFiles = files
  if (props.accept && props.accept !== '*') {
    const acceptTypes = props.accept.split(',').map(type => type.trim())
    filteredFiles = files.filter(file => {
      return acceptTypes.some(type => {
        if (type.startsWith('.')) {
          // File extension
          return file.name.toLowerCase().endsWith(type.toLowerCase())
        } else if (type.includes('*')) {
          // MIME type with wildcard
          const baseType = type.split('*')[0]
          return file.type.startsWith(baseType)
        } else {
          // Exact MIME type
          return file.type === type
        }
      })
    })
  }
  
  // Filter by file size if maxSize is specified
  if (props.maxSize) {
    filteredFiles = filteredFiles.filter(file => file.size <= props.maxSize!)
  }
  
  // Limit to single file if multiple is false
  if (!props.multiple && filteredFiles.length > 1) {
    filteredFiles = [filteredFiles[0]]
  }
  
  if (filteredFiles.length > 0) {
    emit('files-selected', filteredFiles)
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Expose methods for external use
defineExpose({
  reset: () => {
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
})
</script> 