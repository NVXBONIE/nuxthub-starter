<template>
    <div class="container mx-auto p-6 max-w-2xl">
      <h1 class="text-2xl font-bold mb-6">Romanian ID Card OCR</h1>
      
      <!-- File Upload -->
      <div class="mb-6">
        <label class="block text-sm font-medium mb-2">
          Upload ID Card Image
        </label>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          @change="handleFileUpload"
          class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <button
          v-if="selectedFile"
          @click="processImage"
          :disabled="processing"
          class="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {{ processing ? 'Processing...' : 'Extract Information' }}
        </button>
      </div>
  
      <!-- Error Display -->
      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ error }}
      </div>
  
      <!-- Extracted Information Form -->
      <div v-if="extractedData" class="bg-gray-50 p-6 rounded-lg">
        <h2 class="text-xl font-semibold mb-4">Extracted Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Serie</label>
            <input
              v-model="extractedData.serie"
              type="text"
              class="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">NR</label>
            <input
              v-model="extractedData.nr"
              type="text"
              class="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium mb-1">CNP</label>
            <input
              v-model="extractedData.cnp"
              type="text"
              class="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Nume</label>
            <input
              v-model="extractedData.nume"
              type="text"
              class="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Prenume</label>
            <input
              v-model="extractedData.prenume"
              type="text"
              class="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Cetățenie</label>
            <input
              v-model="extractedData.cetatenie"
              type="text"
              class="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Loc Naștere</label>
            <input
              v-model="extractedData.loc_nastere"
              type="text"
              class="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium mb-1">Domiciliu</label>
            <input
              v-model="extractedData.domiciliu"
              type="text"
              class="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Emisă de</label>
            <input
              v-model="extractedData.emisa_de"
              type="text"
              class="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Valabilitate</label>
            <input
              v-model="extractedData.valabilitate"
              type="text"
              class="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  interface ExtractedData {
    serie: string
    nr: string
    cnp: string
    nume: string
    prenume: string
    cetatenie: string
    loc_nastere: string
    domiciliu: string
    emisa_de: string
    valabilitate: string
  }
  
  const selectedFile = ref<File | null>(null)
  const processing = ref(false)
  const error = ref<string | null>(null)
  const extractedData = ref<ExtractedData | null>(null)
  const fileInput = ref<HTMLInputElement>()
  
  const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) {
      selectedFile.value = file
      error.value = null
      extractedData.value = null
    }
  }
  
  const processImage = async () => {
    if (!selectedFile.value) return
  
    processing.value = true
    error.value = null
  
    try {
      const formData = new FormData()
      formData.append('image', selectedFile.value)
  
      const response = await $fetch<ExtractedData>('/api/ocr-id', {
        method: 'POST',
        body: formData
      })
  
      extractedData.value = response
    } catch (err: any) {
      error.value = err?.data?.message || 'Failed to process image'
    } finally {
      processing.value = false
    }
  }
  </script>