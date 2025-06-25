<template>
  <Card v-if="extractedData">
    <CardHeader>
      <h2 class="text-xl font-semibold">{{ $t('extracted.title') }}</h2>
      <p class="text-sm text-muted-foreground">
        {{ $t('extracted.description') }}
      </p>
    </CardHeader>
    <CardContent>
      <Form :validation-schema="validationSchema" @submit="onSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField v-slot="{ componentField }" name="serie">
            <FormItem>
              <FormLabel>{{ $t('fields.serie') }}</FormLabel>
              <FormControl>
                <Input 
                  v-bind="componentField"
                  :model-value="localData.serie"
                  :placeholder="$t('fields.enterSerie')"
                  @update:model-value="updateField('serie', $event)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          
          <FormField v-slot="{ componentField }" name="nr">
            <FormItem>
              <FormLabel>{{ $t('fields.nr') }}</FormLabel>
              <FormControl>
                <Input 
                  v-bind="componentField"
                  :model-value="localData.nr"
                  :placeholder="$t('fields.enterNr')"
                  @update:model-value="updateField('nr', $event)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          
          <FormField v-slot="{ componentField }" name="cnp" class="md:col-span-2">
            <FormItem>
              <FormLabel>{{ $t('fields.cnp') }}</FormLabel>
              <FormControl>
                <Input 
                  v-bind="componentField"
                  :model-value="localData.cnp"
                  :placeholder="$t('fields.enterCnp')"
                  @update:model-value="updateField('cnp', $event)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          
          <FormField v-slot="{ componentField }" name="nume">
            <FormItem>
              <FormLabel>{{ $t('fields.nume') }}</FormLabel>
              <FormControl>
                <Input 
                  v-bind="componentField"
                  :model-value="localData.nume"
                  :placeholder="$t('fields.enterNume')"
                  @update:model-value="updateField('nume', $event)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          
          <FormField v-slot="{ componentField }" name="prenume">
            <FormItem>
              <FormLabel>{{ $t('fields.prenume') }}</FormLabel>
              <FormControl>
                <Input 
                  v-bind="componentField"
                  :model-value="localData.prenume"
                  :placeholder="$t('fields.enterPrenume')"
                  @update:model-value="updateField('prenume', $event)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          
          <FormField v-slot="{ componentField }" name="cetatenie">
            <FormItem>
              <FormLabel>{{ $t('fields.cetatenie') }}</FormLabel>
              <FormControl>
                <Input 
                  v-bind="componentField"
                  :model-value="localData.cetatenie"
                  :placeholder="$t('fields.enterCetatenie')"
                  @update:model-value="updateField('cetatenie', $event)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          
          <FormField v-slot="{ componentField }" name="loc_nastere">
            <FormItem>
              <FormLabel>{{ $t('fields.locNastere') }}</FormLabel>
              <FormControl>
                <Input 
                  v-bind="componentField"
                  :model-value="localData.loc_nastere"
                  :placeholder="$t('fields.enterLocNastere')"
                  @update:model-value="updateField('loc_nastere', $event)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          
          <FormField v-slot="{ componentField }" name="domiciliu" class="md:col-span-2">
            <FormItem>
              <FormLabel>{{ $t('fields.domiciliu') }}</FormLabel>
              <FormControl>
                <Input 
                  v-bind="componentField"
                  :model-value="localData.domiciliu"
                  :placeholder="$t('fields.enterDomiciliu')"
                  @update:model-value="updateField('domiciliu', $event)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          
          <FormField v-slot="{ componentField }" name="emisa_de">
            <FormItem>
              <FormLabel>{{ $t('fields.emisaDe') }}</FormLabel>
              <FormControl>
                <Input 
                  v-bind="componentField"
                  :model-value="localData.emisa_de"
                  :placeholder="$t('fields.enterEmisaDe')"
                  @update:model-value="updateField('emisa_de', $event)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          
          <FormField v-slot="{ componentField }" name="valabilitate">
            <FormItem>
              <FormLabel>{{ $t('fields.valabilitate') }}</FormLabel>
              <FormControl>
                <Input 
                  v-bind="componentField"
                  :model-value="localData.valabilitate"
                  :placeholder="$t('fields.enterValabilitate')"
                  @update:model-value="updateField('valabilitate', $event)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-2 mt-6">
          <Button type="button" variant="outline" @click="$emit('reset')">
            {{ $t('actions.reset') }}
          </Button>
          <Button type="submit">
            {{ $t('actions.saveData') }}
          </Button>
        </div>
      </Form>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed, watch } from 'vue';
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

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

interface Props {
  extractedData: ExtractedData | null
}

interface Emits {
  (e: 'reset'): void
  (e: 'save' | 'update:extractedData', data: ExtractedData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Zod validation schema
const validationSchema = toTypedSchema(z.object({
  serie: z.string()
    .length(2, $t('validation.serie.length')),
  nr: z.string()
    .min(1, $t('validation.nr.required'))
    .max(20, $t('validation.nr.maxLength')),
  cnp: z.string()
    .min(1, $t('validation.cnp.required'))
    .regex(/^\d{13}$/, $t('validation.cnp.format')),
  nume: z.string()
    .min(1, $t('validation.nume.required'))
    .min(2, $t('validation.nume.minLength'))
    .max(50, $t('validation.nume.maxLength'))
    .regex(/^[a-zA-ZăâîșțĂÂÎȘȚ\s-']+$/, $t('validation.nume.format')),
  prenume: z.string()
    .min(1, $t('validation.prenume.required'))
    .min(2, $t('validation.prenume.minLength'))
    .max(50, $t('validation.prenume.maxLength'))
    .regex(/^[a-zA-ZăâîșțĂÂÎȘȚ\s-']+$/, $t('validation.prenume.format')),
  cetatenie: z.string()
    .min(1, $t('validation.cetatenie.required'))
    .max(50, $t('validation.cetatenie.maxLength')),
  loc_nastere: z.string()
    .min(1, $t('validation.locNastere.required'))
    .max(100, $t('validation.locNastere.maxLength')),
  domiciliu: z.string()
    .min(1, $t('validation.domiciliu.required'))
    .max(200, $t('validation.domiciliu.maxLength')),
  emisa_de: z.string()
    .min(1, $t('validation.emisaDe.required'))
    .max(100, $t('validation.emisaDe.maxLength')),
  valabilitate: z.string()
    .min(1, $t('validation.valabilitate.required'))
    .max(50, $t('validation.valabilitate.maxLength'))
}))

// Create form instance to access validation methods
const { validate } = useForm({
  validationSchema
})

// Watch for changes in extractedData prop and trigger validation
watch(() => props.extractedData, (newData) => {
  if (newData) {
    // Trigger validation when props change
    validate()
  }
}, { immediate: true })

// Create a local copy of the data to avoid prop mutation
const localData = computed(() => {
  if (!props.extractedData) {
    return {
      serie: '',
      nr: '',
      cnp: '',
      nume: '',
      prenume: '',
      cetatenie: '',
      loc_nastere: '',
      domiciliu: '',
      emisa_de: '',
      valabilitate: ''
    }
  }
  return { ...props.extractedData }
})

const updateField = (field: keyof ExtractedData, value: string) => {
  if (props.extractedData) {
    const updatedData = { ...props.extractedData, [field]: value }
    emit('update:extractedData', updatedData)
  }
}

const onSubmit = (values: ExtractedData) => {
  emit('save', values)
}
</script>

<i18n type="json">
{
  "ro": {
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
      "saveData": "Salvează datele"
    },
    "validation": {
      "serie": {
        "length": "Seria trebuie să conțină fix 2 caractere"
      },
      "nr": {
        "required": "NR este obligatoriu",
        "maxLength": "NR nu poate avea mai mult de 20 de caractere"
      },
      "cnp": {
        "required": "CNP este obligatoriu",
        "format": "CNP trebuie să fie exact 13 cifre"
      },
      "nume": {
        "required": "Numele este obligatoriu",
        "minLength": "Numele trebuie să aibă cel puțin 2 caractere",
        "maxLength": "Numele nu poate avea mai mult de 50 de caractere",
        "format": "Numele poate conține doar litere, spații, cratime și apostrofuri"
      },
      "prenume": {
        "required": "Prenumele este obligatoriu",
        "minLength": "Prenumele trebuie să aibă cel puțin 2 caractere",
        "maxLength": "Prenumele nu poate avea mai mult de 50 de caractere",
        "format": "Prenumele poate conține doar litere, spații, cratime și apostrofuri"
      },
      "cetatenie": {
        "required": "Cetățenia este obligatorie",
        "maxLength": "Cetățenia nu poate avea mai mult de 50 de caractere"
      },
      "locNastere": {
        "required": "Locul de naștere este obligatoriu",
        "maxLength": "Locul de naștere nu poate avea mai mult de 100 de caractere"
      },
      "domiciliu": {
        "required": "Domiciliul este obligatoriu",
        "maxLength": "Domiciliul nu poate avea mai mult de 200 de caractere"
      },
      "emisaDe": {
        "required": "Emitentul este obligatoriu",
        "maxLength": "Emitentul nu poate avea mai mult de 100 de caractere"
      },
      "valabilitate": {
        "required": "Valabilitatea este obligatorie",
        "maxLength": "Valabilitatea nu poate avea mai mult de 50 de caractere"
      }
    }
  },
  "en": {
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
      "saveData": "Save Data"
    },
    "validation": {
      "serie": {
        "length": "Serie must contain exactly 2 characters"
      },
      "nr": {
        "required": "NR is required",
        "maxLength": "NR must be at most 20 characters"
      },
      "cnp": {
        "required": "CNP is required",
        "format": "CNP must be exactly 13 digits"
      },
      "nume": {
        "required": "Nume is required",
        "minLength": "Nume must be at least 2 characters",
        "maxLength": "Nume must be at most 50 characters",
        "format": "Nume can only contain letters, spaces, hyphens and apostrophes"
      },
      "prenume": {
        "required": "Prenume is required",
        "minLength": "Prenume must be at least 2 characters",
        "maxLength": "Prenume must be at most 50 characters",
        "format": "Prenume can only contain letters, spaces, hyphens and apostrophes"
      },
      "cetatenie": {
        "required": "Citizenship is required",
        "maxLength": "Citizenship must be at most 50 characters"
      },
      "locNastere": {
        "required": "Place of birth is required",
        "maxLength": "Place of birth must be at most 100 characters"
      },
      "domiciliu": {
        "required": "Domicile is required",
        "maxLength": "Domicile must be at most 200 characters"
      },
      "emisaDe": {
        "required": "Issued by is required",
        "maxLength": "Issued by must be at most 100 characters"
      },
      "valabilitate": {
        "required": "Validity is required",
        "maxLength": "Validity must be at most 50 characters"
      }
    }
  }
}
</i18n> 