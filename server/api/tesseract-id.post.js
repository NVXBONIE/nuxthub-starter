export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { text } = body
    
    if (!text) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No text provided in request body'
      })
    }

    const prompt = `Te rog să extragi următoarele câmpuri din textul de mai jos, care provine dintr-un OCR aplicat pe o carte de identitate românească. Textul poate conține erori, dar încearcă să identifici corect:

- CNP
- Nume (de familie)
- Prenume
- Serie (2 litere + 6 cifre)
- Cetățenie
- Loc naștere
- Domiciliu
- Emisă de (instituția emitentă)
- Valabilitate (de la - până la)
---
Returneaza un json cu urmatoarele chei: [
    "serie",
    "nr",
    "cnp",
    "nume",
    "prenume",
    "cetatenie",
    "loc_nastere",
    "domiciliu",
    "emisa_de",
    "valabilitate"
]
---
Textul OCR: ${text}`

    const response = await hubAI().run('@hf/mistral/mistral-7b-instruct-v0.2', {
      prompt,
      max_tokens: 512
    })

    console.log('response', response)
    
    // Try to parse JSON from response
    let extractedData
    try {
      const jsonMatch = response.response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('Failed to parse JSON from response:', parseError)
      // Fallback: create empty structure
      extractedData = {
        serie: "",
        nr: "",
        cnp: "",
        nume: "",
        prenume: "",
        cetatenie: "",
        loc_nastere: "",
        domiciliu: "",
        emisa_de: "",
        valabilitate: ""
      }
    }

    return extractedData
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to process text'
    })
  }
})