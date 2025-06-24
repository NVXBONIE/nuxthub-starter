<template>
  <div class="container mx-auto p-6 max-w-4xl">
    <div class="space-y-6">
      <!-- Header -->
      <div class="text-center space-y-2">
        <h1 class="text-3xl font-bold tracking-tight">{{ $t('title') }}</h1>
        <p class="text-muted-foreground">
          {{ $t('subtitle') }}
        </p>
      </div>

      <!-- File Upload Card -->
      <Card>
        <CardHeader v-if="!imageUrl">
          <h2 class="text-xl font-semibold">{{ $t('upload.title') }}</h2>
          <p class="text-sm text-muted-foreground">
            {{ $t('upload.description') }}
          </p>
        </CardHeader>
        <CardContent class="space-y-4">
          <!-- File Drop Zone -->
          <div v-if="!imageUrl" class="space-y-2">
            <Label>{{ $t('upload.selectImage') }}</Label>
            <FileDropZone
              ref="fileDropZone"
              accept="image/*"
              :max-size="10 * 1024 * 1024"
              :description="$t('upload.dropzoneDescription')"
              :file-types="$t('upload.fileTypes')"
              :disabled="processing"
              @files-selected="handleFilesSelected"
            />
          </div>

          <!-- Image Preview with Remove Button -->
          <div v-if="imageUrl" class="space-y-4">
            <div class="flex items-center justify-between">
              <Label>{{ $t('upload.selectedImage') }}</Label>
              <Button 
                variant="outline" 
                size="sm" 
                @click="removeImage"
                :disabled="processing"
              >
                <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {{ $t('upload.removeImage') }}
              </Button>
            </div>
            <div class="flex justify-center">
              <img :src="imageUrl" alt="$t('upload.uploadedImageAlt')" class="w-full h-auto max-h-96 object-contain rounded-lg border">
            </div>
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
              <span>{{ $t('processing.processing') }}</span>
            </div>
            <span v-else>{{ $t('processing.extractInformation') }}</span>
          </Button>
        </CardContent>
      </Card>

      <!-- Progress Indicator -->
      <div v-if="processing" class="space-y-2">
        <div class="flex justify-between text-sm">
          <span>{{ $t('progress.processingImage') }}</span>
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
          <h2 class="text-xl font-semibold">{{ $t('extracted.title') }}</h2>
          <p class="text-sm text-muted-foreground">
            {{ $t('extracted.description') }}
          </p>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="serie">{{ $t('fields.serie') }}</Label>
              <Input
                id="serie"
                v-model="extractedData.serie"
                :placeholder="$t('fields.enterSerie')"
              />
            </div>
            <div class="space-y-2">
              <Label for="nr">{{ $t('fields.nr') }}</Label>
              <Input
                id="nr"
                v-model="extractedData.nr"
                :placeholder="$t('fields.enterNr')"
              />
            </div>
            <div class="space-y-2 md:col-span-2">
              <Label for="cnp">{{ $t('fields.cnp') }}</Label>
              <Input
                id="cnp"
                v-model="extractedData.cnp"
                :placeholder="$t('fields.enterCnp')"
              />
            </div>
            <div class="space-y-2">
              <Label for="nume">{{ $t('fields.nume') }}</Label>
              <Input
                id="nume"
                v-model="extractedData.nume"
                :placeholder="$t('fields.enterNume')"
              />
            </div>
            <div class="space-y-2">
              <Label for="prenume">{{ $t('fields.prenume') }}</Label>
              <Input
                id="prenume"
                v-model="extractedData.prenume"
                :placeholder="$t('fields.enterPrenume')"
              />
            </div>
            <div class="space-y-2">
              <Label for="cetatenie">{{ $t('fields.cetatenie') }}</Label>
              <Input
                id="cetatenie"
                v-model="extractedData.cetatenie"
                :placeholder="$t('fields.enterCetatenie')"
              />
            </div>
            <div class="space-y-2">
              <Label for="loc_nastere">{{ $t('fields.locNastere') }}</Label>
              <Input
                id="loc_nastere"
                v-model="extractedData.loc_nastere"
                :placeholder="$t('fields.enterLocNastere')"
              />
            </div>
            <div class="space-y-2 md:col-span-2">
              <Label for="domiciliu">{{ $t('fields.domiciliu') }}</Label>
              <Input
                id="domiciliu"
                v-model="extractedData.domiciliu"
                :placeholder="$t('fields.enterDomiciliu')"
              />
            </div>
            <div class="space-y-2">
              <Label for="emisa_de">{{ $t('fields.emisaDe') }}</Label>
              <Input
                id="emisa_de"
                v-model="extractedData.emisa_de"
                :placeholder="$t('fields.enterEmisaDe')"
              />
            </div>
            <div class="space-y-2">
              <Label for="valabilitate">{{ $t('fields.valabilitate') }}</Label>
              <Input
                id="valabilitate"
                v-model="extractedData.valabilitate"
                :placeholder="$t('fields.enterValabilitate')"
              />
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-2 mt-6">
            <Button variant="outline" @click="resetForm">
              {{ $t('actions.reset') }}
            </Button>
            <Button @click="saveData">
              {{ $t('actions.saveData') }}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createWorker } from 'tesseract.js';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n({ useScope: 'local' })

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
    error.value = $t('errors.fileSizeLimit')
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
    progressText.value = $t('progress.initializingOcr')
    
    // Step 1: Extract text using Tesseract OCR
    const worker = await createWorker('eng+ron+fra');
    progressValue.value = 30
    progressText.value = $t('progress.processingWithOcr')
    
    const ret = await worker.recognize(imageUrl.value);
    const ocrText = ret.data.text;
    console.log('OCR Text:', ocrText);
    await worker.terminate();

    progressValue.value = 60
    progressText.value = $t('progress.extractingStructuredData')

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
    progressText.value = $t('progress.complete')
    
    // Reset progress after a short delay
    setTimeout(() => {
      progressValue.value = 0
      progressText.value = ''
    }, 1000)
    
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : $t('errors.failedToProcess');
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
  console.log($t('actions.savingData'), extractedData.value)
  // You could show a success message or redirect to another page
}

const removeImage = () => {
  imageUrl.value = ''
  selectedFile.value = null
  extractedData.value = null
  error.value = null
  progressValue.value = 0
  progressText.value = ''
  if (fileDropZone.value) {
    fileDropZone.value.reset()
  }
}
</script>

<i18n type="json">
  {
  "ro": {
    "title": "Citire automată buletin de identitate românesc",
    "subtitle": "Încarcă o imagine a unui buletin de identitate românesc pentru a extrage informațiile automat",
    "upload": {
      "title": "Încarcă imaginea buletinului",
      "description": "Formate acceptate: JPG, PNG, GIF. Dimensiunea maximă: 10MB",
      "selectImage": "Selectează fișierul imagine",
      "dropzoneDescription": "Încarcă o imagine a unui buletin de identitate românesc",
      "fileTypes": "JPG, PNG, GIF",
      "selectedImage": "Imaginea selectată",
      "removeImage": "Elimină imaginea",
      "uploadedImageAlt": "Imagine încărcată"
    },
    "processing": {
      "processing": "Se procesează...",
      "extractInformation": "Extrage informațiile"
    },
    "progress": {
      "processingImage": "Se procesează imaginea...",
      "initializingOcr": "Se inițializează OCR...",
      "processingWithOcr": "Se procesează imaginea cu OCR...",
      "extractingStructuredData": "Se extrag datele structurate...",
      "complete": "Complet!"
    },
    "extracted": {
      "title": "Informațiile extrase",
      "description": "Revizuiește și editează informațiile extrase mai jos"
    },
    "fields": {
      "serie": "Serie",
      "nr": "NR",
      "cnp": "CNP",
      "nume": "Nume",
      "prenume": "Prenume",
      "cetatenie": "Cetățenie",
      "locNastere": "Loc naștere",
      "domiciliu": "Domiciliu",
      "emisaDe": "Emisă de",
      "valabilitate": "Valabilitate",
      "enterSerie": "Introduceți seria",
      "enterNr": "Introduceți NR",
      "enterCnp": "Introduceți CNP",
      "enterNume": "Introduceți numele",
      "enterPrenume": "Introduceți prenumele",
      "enterCetatenie": "Introduceți cetățenia",
      "enterLocNastere": "Introduceți locul de naștere",
      "enterDomiciliu": "Introduceți domiciliul",
      "enterEmisaDe": "Introduceți emitentul",
      "enterValabilitate": "Introduceți valabilitatea"
    },
    "actions": {
      "reset": "Resetează",
      "saveData": "Salvează datele",
      "savingData": "Salvare date"
    },
    "errors": {
      "fileSizeLimit": "Dimensiunea fișierului trebuie să fie mai mică de 10MB",
      "failedToProcess": "Eroare la procesarea imaginii"
    }
  },
  "en": {
    "title": "Romanian ID Card OCR",
    "subtitle": "Upload an image of a Romanian ID card to extract information automatically",
    "upload": {
      "title": "Upload ID Card Image",
      "description": "Supported formats: JPG, PNG, GIF. Maximum file size: 10MB",
      "selectImage": "Select Image File",
      "dropzoneDescription": "Upload an image of a Romanian ID card",
      "fileTypes": "JPG, PNG, GIF",
      "selectedImage": "Selected Image",
      "removeImage": "Remove Image",
      "uploadedImageAlt": "Uploaded Image"
    },
    "processing": {
      "processing": "Processing...",
      "extractInformation": "Extract Information"
    },
    "progress": {
      "processingImage": "Processing image...",
      "initializingOcr": "Initializing OCR...",
      "processingWithOcr": "Processing image with OCR...",
      "extractingStructuredData": "Extracting structured data...",
      "complete": "Complete!"
    },
    "extracted": {
      "title": "Extracted Information",
      "description": "Review and edit the extracted information below"
    },
    "fields": {
      "serie": "Serie",
      "nr": "NR",
      "cnp": "CNP",
      "nume": "Nume",
      "prenume": "Prenume",
      "cetatenie": "Citizenship",
      "locNastere": "Place of Birth",
      "domiciliu": "Domicile",
      "emisaDe": "Issued by",
      "valabilitate": "Validity",
      "enterSerie": "Enter serie",
      "enterNr": "Enter NR",
      "enterCnp": "Enter CNP",
      "enterNume": "Enter nume",
      "enterPrenume": "Enter prenume",
      "enterCetatenie": "Enter citizenship",
      "enterLocNastere": "Enter place of birth",
      "enterDomiciliu": "Enter domicile",
      "enterEmisaDe": "Enter issued by",
      "enterValabilitate": "Enter validity"
    },
    "actions": {
      "reset": "Reset",
      "saveData": "Save Data",
      "savingData": "Save Data"
    },
    "errors": {
      "fileSizeLimit": "File size must be less than 10MB",
      "failedToProcess": "Failed to process image"
    }
  }
}
</i18n>