export default defineEventHandler(async (event) => {
  try {
    const form = await readMultipartFormData(event)
    const file = form?.find(f => f.name === 'image')
    
    if (!file) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No image file provided'
      })
    }

//     const prompt = `You are an expert OCR system. Extract ONLY the text information from this Romanian ID card (carte de identitate). 

// Look for these specific fields and return them in JSON format:
// {
//   "serie": "series letters/numbers",
//   "nr": "ID number", 
//   "cnp": "13-digit personal code",
//   "nume": "family name/surname",
//   "prenume": "first name/given name",  
//   "cetatenie": "citizenship",
//   "loc_nastere": "place of birth",
//   "domiciliu": "address/domicile",
//   "emisa_de": "issued by authority",
//   "valabilitate": "validity date"
// }

// Focus on text accuracy. If you cannot read a field clearly, leave it empty. Return ONLY the JSON object, no other text.`
    const prompt = `You are an expert OCR system. Extract all the text in the provided image`

    const response = await hubAI().run('@cf/unum/uform-gen2-qwen-500m', {
      image: Array.from(file.data),
      prompt,
      max_tokens: 512
    })

    console.log('response', response)
    return response

    // // Try to parse JSON from response
    // let extractedData
    // try {
    //   const jsonMatch = response.response.match(/\{[\s\S]*\}/)
    //   if (jsonMatch) {
    //     extractedData = JSON.parse(jsonMatch[0])
    //   } else {
    //     throw new Error('No JSON found in response')
    //   }
    // } catch (parseError) {
    //   // Fallback: create empty structure
    //   extractedData = {
    //     serie: "",
    //     nr: "",
    //     cnp: "",
    //     nume: "",
    //     prenume: "",
    //     cetatenie: "",
    //     loc_nastere: "",
    //     domiciliu: "",
    //     emisa_de: "",
    //     valabilitate: ""
    //   }
    // }

    // return extractedData
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to process image'
    })
  }
})