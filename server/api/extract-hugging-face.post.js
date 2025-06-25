import { Client } from "@gradio/client";

// server/api/ocr/extract-alt.post.js
// Alternative approach - if you want to send the image as raw buffer
export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event)
    
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No file uploaded'
      })
    }

    const imageFile = formData.find(item => item.name === 'image')
    
    if (!imageFile) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No image file found'
      })
    }

    const blob = new Blob([imageFile.data], { type: imageFile.type || 'image/jpeg' })
    const client = await Client.connect("nvxapp/id-ocr-service");
    const result = await client.predict("/process_and_format", { 
      image: blob, 
    });
    

    return result.data[0].extracted_data

  } catch (error) {
    console.error('OCR extraction error:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to process OCR request',
      data: {
        error: error.message || 'Unknown error occurred'
      }
    })
  }
})