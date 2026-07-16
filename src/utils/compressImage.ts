const MAX_WIDTH = 1200
const MAX_HEIGHT = 1200
const JPEG_QUALITY = 0.82

export async function compressImageToDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Выберите файл изображения (JPG, PNG, WebP).')
  }

  const bitmap = await createImageBitmap(file)
  const ratio = Math.min(
    1,
    MAX_WIDTH / bitmap.width,
    MAX_HEIGHT / bitmap.height,
  )
  const width = Math.max(1, Math.round(bitmap.width * ratio))
  const height = Math.max(1, Math.round(bitmap.height * ratio))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Не удалось обработать изображение.')

  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY)
  if (dataUrl.length > 900_000) {
    throw new Error(
      'Фото слишком большое. Попробуйте другое изображение или уменьшите его размер.',
    )
  }

  return dataUrl
}
