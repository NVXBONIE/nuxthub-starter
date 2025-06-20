<template>
  <div class="container mx-auto p-6 max-w-4xl">
    <div class="space-y-6">
      <!-- Header -->
      <div class="text-center space-y-2">
        <h1 class="text-3xl font-bold tracking-tight">Romanian ID Card OCR</h1>
        <p class="text-muted-foreground">
          Upload an image of a Romanian ID card to extract information automatically
        </p>
      </div>

      <!-- File Upload Card -->
      <Card>
        <CardHeader>
          <h2 class="text-xl font-semibold">Upload ID Card Image</h2>
          <p class="text-sm text-muted-foreground">
            Supported formats: JPG, PNG, GIF. Maximum file size: 10MB
          </p>
        </CardHeader>
        <CardContent class="space-y-4">
          <!-- File Drop Zone -->
          <div class="space-y-2">
            <Label>Select Image File</Label>
            <FileDropZone
              ref="fileDropZone"
              accept="image/*"
              :max-size="10 * 1024 * 1024"
              description="Upload an image of a Romanian ID card"
              file-types="JPG, PNG, GIF"
              :disabled="processing"
              @files-selected="handleFilesSelected"
            />
          </div>

          <div v-if="imageUrl" class="flex justify-center">
            <img :src="imageUrl" alt="Uploaded Image" class="w-full h-auto">
          </div>

          <!-- Process Button -->
          <Button
            v-if="selectedFile"
            :disabled="processing"
            class="w-full"
            @click="processImage"
          >
            <div v-if="processing" class="flex items-center space-x-2">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              <span>Processing...</span>
            </div>
            <span v-else>Extract Information</span>
          </Button>
        </CardContent>
      </Card>

      <!-- Progress Indicator -->
      <div v-if="processing" class="space-y-2">
        <div class="flex justify-between text-sm">
          <span>Processing image...</span>
          <span>{{ progressText }}</span>
        </div>
        <Progress :model-value="progressValue" />
      </div>

      <!-- Error Display -->
      <Alert v-if="error" variant="destructive">
        <div class="flex items-center space-x-2">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ error }}</span>
        </div>
      </Alert>

      <!-- Extracted Information Card -->
      <Card v-if="extractedData">
        <CardHeader>
          <h2 class="text-xl font-semibold">Extracted Information</h2>
          <p class="text-sm text-muted-foreground">
            Review and edit the extracted information below
          </p>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="serie">Serie</Label>
              <Input
                id="serie"
                v-model="extractedData.serie"
                placeholder="Enter serie"
              />
            </div>
            <div class="space-y-2">
              <Label for="nr">NR</Label>
              <Input
                id="nr"
                v-model="extractedData.nr"
                placeholder="Enter NR"
              />
            </div>
            <div class="space-y-2 md:col-span-2">
              <Label for="cnp">CNP</Label>
              <Input
                id="cnp"
                v-model="extractedData.cnp"
                placeholder="Enter CNP"
              />
            </div>
            <div class="space-y-2">
              <Label for="nume">Nume</Label>
              <Input
                id="nume"
                v-model="extractedData.nume"
                placeholder="Enter nume"
              />
            </div>
            <div class="space-y-2">
              <Label for="prenume">Prenume</Label>
              <Input
                id="prenume"
                v-model="extractedData.prenume"
                placeholder="Enter prenume"
              />
            </div>
            <div class="space-y-2">
              <Label for="cetatenie">Cetățenie</Label>
              <Input
                id="cetatenie"
                v-model="extractedData.cetatenie"
                placeholder="Enter cetățenie"
              />
            </div>
            <div class="space-y-2">
              <Label for="loc_nastere">Loc Naștere</Label>
              <Input
                id="loc_nastere"
                v-model="extractedData.loc_nastere"
                placeholder="Enter loc naștere"
              />
            </div>
            <div class="space-y-2 md:col-span-2">
              <Label for="domiciliu">Domiciliu</Label>
              <Input
                id="domiciliu"
                v-model="extractedData.domiciliu"
                placeholder="Enter domiciliu"
              />
            </div>
            <div class="space-y-2">
              <Label for="emisa_de">Emisă de</Label>
              <Input
                id="emisa_de"
                v-model="extractedData.emisa_de"
                placeholder="Enter emisă de"
              />
            </div>
            <div class="space-y-2">
              <Label for="valabilitate">Valabilitate</Label>
              <Input
                id="valabilitate"
                v-model="extractedData.valabilitate"
                placeholder="Enter valabilitate"
              />
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-2 mt-6">
            <Button variant="outline" @click="resetForm">
              Reset
            </Button>
            <Button @click="saveData">
              Save Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createWorker } from 'tesseract.js';

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
const fileDropZone = ref()
const imageUrl = ref<string>('')
const progressValue = ref(0)
const progressText = ref('')

const handleFilesSelected = (files: File[]) => {
  if (files.length === 0) return
  
  const file = files[0]
  // Check file size (10MB limit)
  if (file.size > 10 * 1024 * 1024) {
    error.value = 'File size must be less than 10MB'
    return
  }
  
  imageUrl.value = URL.createObjectURL(file);
  selectedFile.value = file
  error.value = null
  extractedData.value = null
  progressValue.value = 0
}

const processImage = async () => {
  if (!selectedFile.value) return

  try {
    processing.value = true
    error.value = null
    progressValue.value = 10
    progressText.value = 'Initializing OCR...'
    
    // Step 1: Extract text using Tesseract OCR
    const worker = await createWorker('eng+ron+fra');
    progressValue.value = 30
    progressText.value = 'Processing image with OCR...'
    
    const ret = await worker.recognize(imageUrl.value);
    const ocrText = ret.data.text;
    console.log('OCR Text:', ocrText);
    await worker.terminate();

    progressValue.value = 60
    progressText.value = 'Extracting structured data...'

    // Step 2: Send OCR text to API for structured extraction
    const response = await $fetch('/api/tesseract-id', {
      method: 'POST',
      body: {
        text: ocrText
      }
    });

    console.log('API Response:', response);
    extractedData.value = response;
    
    progressValue.value = 100
    progressText.value = 'Complete!'
    
    // Reset progress after a short delay
    setTimeout(() => {
      progressValue.value = 0
      progressText.value = ''
    }, 1000)
    
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to process image';
    error.value = errorMessage;
    console.error('Processing error:', err);
    progressValue.value = 0
    progressText.value = ''
  } finally {
    processing.value = false
  }
}

const resetForm = () => {
  extractedData.value = null
  selectedFile.value = null
  imageUrl.value = ''
  if (fileDropZone.value) {
    fileDropZone.value.reset()
  }
  error.value = null
  progressValue.value = 0
  progressText.value = ''
}

const saveData = () => {
  // Here you can implement saving the data to your backend
  console.log('Saving data:', extractedData.value)
  // You could show a success message or redirect to another page
}
</script>