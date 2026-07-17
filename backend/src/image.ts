import jpeg from 'jpeg-js'

interface RawImage {
  width: number
  height: number
  data: Uint8Array
}

function decodeJpeg(buffer: Uint8Array): RawImage {
  const raw = jpeg.decode(buffer, { useTArray: true, formatAsRGBA: true })
  return { width: raw.width, height: raw.height, data: raw.data }
}

function encodeJpeg(img: RawImage, quality = 85): Uint8Array {
  const buf = Buffer.from(img.data)
  const encoded = jpeg.encode({ width: img.width, height: img.height, data: buf }, quality)
  return new Uint8Array(encoded.data)
}

function centerCrop(img: RawImage, targetRatio: number): RawImage {
  const srcRatio = img.width / img.height
  let cropW = img.width
  let cropH = img.height

  if (srcRatio > targetRatio) {
    cropW = Math.round(img.height * targetRatio)
  } else {
    cropH = Math.round(img.width / targetRatio)
  }

  const offsetX = Math.round((img.width - cropW) / 2)
  const offsetY = Math.round((img.height - cropH) / 2)

  const data = new Uint8Array(cropW * cropH * 4)
  for (let y = 0; y < cropH; y++) {
    const srcStart = ((y + offsetY) * img.width + offsetX) * 4
    const dstStart = y * cropW * 4
    data.set(img.data.subarray(srcStart, srcStart + cropW * 4), dstStart)
  }
  return { width: cropW, height: cropH, data }
}

function bilinearResize(img: RawImage, targetW: number, targetH: number): RawImage {
  const data = new Uint8Array(targetW * targetH * 4)
  const xRatio = (img.width - 1) / Math.max(targetW - 1, 1)
  const yRatio = (img.height - 1) / Math.max(targetH - 1, 1)

  for (let y = 0; y < targetH; y++) {
    const srcY = y * yRatio
    const yFloor = Math.floor(srcY)
    const yCeil = Math.min(yFloor + 1, img.height - 1)
    const yFrac = srcY - yFloor

    for (let x = 0; x < targetW; x++) {
      const srcX = x * xRatio
      const xFloor = Math.floor(srcX)
      const xCeil = Math.min(xFloor + 1, img.width - 1)
      const xFrac = srcX - xFloor

      const dstIdx = (y * targetW + x) * 4
      for (let c = 0; c < 4; c++) {
        const tl = img.data[(yFloor * img.width + xFloor) * 4 + c]
        const tr = img.data[(yFloor * img.width + xCeil) * 4 + c]
        const bl = img.data[(yCeil * img.width + xFloor) * 4 + c]
        const br = img.data[(yCeil * img.width + xCeil) * 4 + c]
        const top = tl + (tr - tl) * xFrac
        const bottom = bl + (br - bl) * xFrac
        data[dstIdx + c] = Math.round(top + (bottom - top) * yFrac)
      }
    }
  }
  return { width: targetW, height: targetH, data }
}

function parseHexColor(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ]
}

function applyBackground(img: RawImage, bgHex: string): RawImage {
  const [bgR, bgG, bgB] = parseHexColor(bgHex)
  const data = new Uint8Array(img.data)

  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3] / 255
    data[i] = Math.round(data[i] * alpha + bgR * (1 - alpha))
    data[i + 1] = Math.round(data[i + 1] * alpha + bgG * (1 - alpha))
    data[i + 2] = Math.round(data[i + 2] * alpha + bgB * (1 - alpha))
    data[i + 3] = 255
  }
  return { width: img.width, height: img.height, data }
}

export function processImage(
  buffer: Uint8Array,
  _mimeType: string,
  targetW: number,
  targetH: number,
  bgColor: string,
): Uint8Array {
  let img = decodeJpeg(buffer)
  const targetRatio = targetW / targetH
  img = centerCrop(img, targetRatio)
  img = bilinearResize(img, targetW, targetH)
  img = applyBackground(img, bgColor)
  return encodeJpeg(img)
}
