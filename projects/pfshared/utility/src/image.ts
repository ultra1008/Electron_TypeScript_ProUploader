import { forEach, toArray, isPositiveNumber, normalizeDecimalNumber } from "./core";
import { fromCharCode, getStringFromCharCode } from "./string";

/**
 * Transform array buffer to Data URL.
 * @param {ArrayBuffer} arrayBuffer - The array buffer to transform.
 * @param {string} mimeType - The mime type of the Data URL.
 * @returns {string} The result Data URL.
 */
export function arrayBufferToDataURL(arrayBuffer, mimeType) {
  const chunks = [];

  // Chunk Typed Array for better performance (#435)
  const chunkSize = 8192;
  let uint8 = new Uint8Array(arrayBuffer);

  while (uint8.length > 0) {
    // XXX: Babel's `toConsumableArray` helper will throw error in IE or Safari 9
    // eslint-disable-next-line prefer-spread
    chunks.push(fromCharCode.apply(null, toArray(uint8.subarray(0, chunkSize))));
    uint8 = uint8.subarray(chunkSize);
  }

  return `data:${mimeType};base64,${btoa(chunks.join(''))}`;
}

/**
 * Transform a Blob to a Data URL.
 * @param {Blob} blob - The Blob object to transform.
 * @returns {Promise<string>} The result promise for data URL.
 */
export function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = (e) => {
      resolve((e.target as FileReader).result as string);
    }

    fileReader.readAsDataURL(blob);
  });
}

/**
 * Transform a Blob to a File.
 * @param {Blob} blob - The Blob object to transform.
 * @returns {File} The result File object.
 */
export function blobToFile(blob: Blob, fileName: string): File {
  const b: any = blob;

  // a Blob() is almost a File() - it's just missing the two properties
  // below which we will add
  b.lastModifiedDate = new Date();
  b.name = fileName;

  // cast to a File() type
  return blob as File;
}

const REGEXP_DATA_URL_HEAD = /^data:.*,/;

/**
 * Transform Data URL to array buffer.
 * @param {string} dataURL - The Data URL to transform.
 * @returns {ArrayBuffer} The result array buffer.
 */
export function dataURLToArrayBuffer(dataURL): ArrayBuffer {
  const base64 = dataURL.replace(REGEXP_DATA_URL_HEAD, '');
  const binary = atob(base64);
  const arrayBuffer = new ArrayBuffer(binary.length);
  const uint8 = new Uint8Array(arrayBuffer);

  forEach(uint8, (value, i) => {
    uint8[i] = binary.charCodeAt(i);
  });

  return arrayBuffer;
}

/**
 * Transform Data URL to Blob.
 * @param {string} dataURL - The Data URL to transform.
 * @returns {Blob} The result Blob object.
 */
export function dataURLToBlob(dataURL: string): Blob {
  const mimeType = dataURL.split(",")[0].split(":")[1].split(";")[0];
  const ab = dataURLToArrayBuffer(dataURL);
  const blob = new Blob([ab], { "type": mimeType });
  return blob;
}

/**
 * Transform Data URL to image data.
 * @param {string} dataURL - The Data URL to transform.
 * @returns {string} The result image data.
 */
export function dataURLToImageData(dataURL: string): string {
  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

/**
 * Get image dimensions from given blob.
 * @param {ArrayBuffer} arrayBuffer - The array buffer to read.
 * @returns {number} The read orientation value.
 */
export function getImageDimensionsFromBlob(blob: Blob): Promise<{ width: number, height: number }> {
  return new Promise<{ width: number, height: number }>((resolve, reject) => {
    blobToDataURL(blob).then(dataURL => {
      resolve(getImageDimensionsFromDataURL(dataURL));
    });
  });
}

/**
 * Get image dimensions from given blob.
 * @param {ArrayBuffer} arrayBuffer - The array buffer to read.
 * @returns {number} The read orientation value.
 */
export function getImageDimensionsFromDataURL(dataURL: string): Promise<{ width: number, height: number }> {
  return new Promise<{ width: number, height: number }>((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      image.onload = null;

      resolve({
        width: image.naturalWidth,
        height: image.naturalHeight
      });
    };

    image.src = dataURL;
  });
}

/**
 * Get image dimensions from given blob.
 * @param {ArrayBuffer} arrayBuffer - The array buffer to read.
 * @returns {number} The read orientation value.
 */
export function getImageDimensionsFromURL(url: string): Promise<{ width: number, height: number }> {
  return new Promise<{ width: number, height: number }>((resolve, reject) => {
    imageURLToDataURL(url).then(dataURL => {
      resolve(getImageDimensionsFromDataURL(dataURL));
    });
  });
}

/**
 * Get a canvas which drew the given image.
 * @param {HTMLImageElement} image - The image for drawing.
 * @param {Object} imageData - The image data.
 * @param {Object} canvasData - The canvas data.
 * @param {Object} options - The options.
 * @returns {HTMLCanvasElement} The result canvas.
 */
export function getSourceCanvas(
  image,
  {
    aspectRatio: imageAspectRatio,
    naturalWidth: imageNaturalWidth,
    naturalHeight: imageNaturalHeight,
    rotate = 0,
    scaleX = 1,
    scaleY = 1,
  },
  {
    aspectRatio,
    naturalWidth,
    naturalHeight,
  },
  {
    fillColor = 'transparent',
    imageSmoothingEnabled = true,
    imageSmoothingQuality = 'low',
    maxWidth = Infinity,
    maxHeight = Infinity,
    minWidth = 0,
    minHeight = 0,
  },
) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const maxSizes = getAdjustedSizes({
    aspectRatio,
    width: maxWidth,
    height: maxHeight,
  });
  const minSizes = getAdjustedSizes({
    aspectRatio,
    width: minWidth,
    height: minHeight,
  }, 'cover');
  const width = Math.min(maxSizes.width, Math.max(minSizes.width, naturalWidth));
  const height = Math.min(maxSizes.height, Math.max(minSizes.height, naturalHeight));

  // Note: should always use image's natural sizes for drawing as
  // imageData.naturalWidth === canvasData.naturalHeight when rotate % 180 === 90
  const destMaxSizes = getAdjustedSizes({
    aspectRatio: imageAspectRatio,
    width: maxWidth,
    height: maxHeight,
  });
  const destMinSizes = getAdjustedSizes({
    aspectRatio: imageAspectRatio,
    width: minWidth,
    height: minHeight,
  }, 'cover');
  const destWidth = Math.min(
    destMaxSizes.width,
    Math.max(destMinSizes.width, imageNaturalWidth),
  );
  const destHeight = Math.min(
    destMaxSizes.height,
    Math.max(destMinSizes.height, imageNaturalHeight),
  );
  const params = [
    -destWidth / 2,
    -destHeight / 2,
    destWidth,
    destHeight,
  ];

  canvas.width = normalizeDecimalNumber(width);
  canvas.height = normalizeDecimalNumber(height);
  context.fillStyle = fillColor;
  context.fillRect(0, 0, width, height);
  context.save();
  context.translate(width / 2, height / 2);
  context.rotate((rotate * Math.PI) / 180);
  context.scale(scaleX, scaleY);
  context.imageSmoothingEnabled = imageSmoothingEnabled;
  (context as any).imageSmoothingQuality = imageSmoothingQuality;
  (context as any).drawImage(image, ...params.map((value, index, array) => Math.floor(normalizeDecimalNumber(value))));

  context.restore();
  return canvas;
}

/**
 * Get the max sizes in a rectangle under the given aspect ratio.
 * @param {Object} data - The original sizes.
 * @param {string} [type='contain'] - The adjust type.
 * @returns {Object} The result sizes.
 */
export function getAdjustedSizes(
  {
    aspectRatio,
    height,
    width,
  },
  type = 'contain', // or 'cover'
) {
  const isValidWidth = isPositiveNumber(width);
  const isValidHeight = isPositiveNumber(height);

  if (isValidWidth && isValidHeight) {
    const adjustedWidth = height * aspectRatio;

    if ((type === 'contain' && adjustedWidth > width) || (type === 'cover' && adjustedWidth < width)) {
      height = width / aspectRatio;
    } else {
      width = height * aspectRatio;
    }
  } else if (isValidWidth) {
    height = width / aspectRatio;
  } else if (isValidHeight) {
    width = height * aspectRatio;
  }

  return {
    width,
    height,
  };
}

/**
 * Get the new sizes of a rectangle after rotated.
 * @param {Object} data - The original sizes.
 * @returns {Object} The result sizes.
 */
export function getRotatedSizes({ width, height, degree }) {
  degree = Math.abs(degree) % 180;

  if (degree === 90) {
    return {
      width: height,
      height: width,
    };
  }

  const arc = ((degree % 90) * Math.PI) / 180;
  const sinArc = Math.sin(arc);
  const cosArc = Math.cos(arc);
  const newWidth = (width * cosArc) + (height * sinArc);
  const newHeight = (width * sinArc) + (height * cosArc);

  return degree > 90 ? {
    width: newHeight,
    height: newWidth,
  } : {
    width: newWidth,
    height: newHeight,
  };
}

/**
 * Transform a Image to a Data URL.
 * @param {string} url - The Blob object to transform.
 * @returns {string} The data URL.
 */
export function imageToDataURL(image): string {
  const canvas = document.createElement("canvas");

  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  canvas.getContext("2d").drawImage(image, 0, 0);

  let dataURL = canvas.toDataURL("image/png");

  return dataURL;
}

/**
 * Transform a Image URL to a Data URL.
 * @param {string} url - The Blob object to transform.
 * @returns {Promise<string>} The result promise for data URL.
 */
export function imageURLToDataURL(url): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const image = new Image();

    whenImageReady(image).then(() => {
      resolve(imageToDataURL(image));
    });

    image.crossOrigin = "anonymous";
    image.src = url;
  });
}

/**
 * Get orientation value from given array buffer.
 * @param {ArrayBuffer} arrayBuffer - The array buffer to read.
 * @returns {number} The read orientation value.
 */
export function resetAndGetOrientation(arrayBuffer) {
  const dataView = new DataView(arrayBuffer);
  let orientation;

  // Ignores range error when the image does not have correct Exif information
  try {
    let littleEndian;
    let app1Start;
    let ifdStart;

    // Only handle JPEG image (start by 0xFFD8)
    if (dataView.getUint8(0) === 0xFF && dataView.getUint8(1) === 0xD8) {
      const length = dataView.byteLength;
      let offset = 2;

      while (offset + 1 < length) {
        if (dataView.getUint8(offset) === 0xFF && dataView.getUint8(offset + 1) === 0xE1) {
          app1Start = offset;
          break;
        }

        offset += 1;
      }
    }

    if (app1Start) {
      const exifIDCode = app1Start + 4;
      const tiffOffset = app1Start + 10;

      if (getStringFromCharCode(dataView, exifIDCode, 4) === 'Exif') {
        const endianness = dataView.getUint16(tiffOffset);

        littleEndian = endianness === 0x4949;

        if (littleEndian || endianness === 0x4D4D /* bigEndian */) {
          if (dataView.getUint16(tiffOffset + 2, littleEndian) === 0x002A) {
            const firstIFDOffset = dataView.getUint32(tiffOffset + 4, littleEndian);

            if (firstIFDOffset >= 0x00000008) {
              ifdStart = tiffOffset + firstIFDOffset;
            }
          }
        }
      }
    }

    if (ifdStart) {
      const length = dataView.getUint16(ifdStart, littleEndian);
      let offset;
      let i;

      for (i = 0; i < length; i += 1) {
        offset = ifdStart + (i * 12) + 2;

        if (dataView.getUint16(offset, littleEndian) === 0x0112 /* Orientation */) {
          // 8 is the offset of the current tag's value
          offset += 8;

          // Get the original orientation value
          orientation = dataView.getUint16(offset, littleEndian);

          // Override the orientation with its default value
          dataView.setUint16(offset, 1, littleEndian);
          break;
        }
      }
    }
  } catch (error) {
    orientation = 1;
  }

  return orientation;
}

/**
 * Parse Exif Orientation value.
 * @param {number} orientation - The orientation to parse.
 * @returns {Object} The parsed result.
 */
export function parseOrientation(orientation) {
  let rotate = 0;
  let scaleX = 1;
  let scaleY = 1;

  switch (orientation) {
    // Flip horizontal
    case 2:
      scaleX = -1;
      break;

    // Rotate left 180°
    case 3:
      rotate = -180;
      break;

    // Flip vertical
    case 4:
      scaleY = -1;
      break;

    // Flip vertical and rotate right 90°
    case 5:
      rotate = 90;
      scaleY = -1;
      break;

    // Rotate right 90°
    case 6:
      rotate = 90;
      break;

    // Flip horizontal and rotate right 90°
    case 7:
      rotate = 90;
      scaleX = -1;
      break;

    // Rotate left 90°
    case 8:
      rotate = -90;
      break;

    default:
  }

  return {
    rotate,
    scaleX,
    scaleY,
  };
}

/**
 * Waits for an image to become ready.
 * @param {Image|string} img - The image or id to wait for.
 * @returns {Promise<any>} Will resolve when image is ready.
 */
export function whenImageReady(img): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    if (typeof img === "string") {
      img = document.getElementById(img);
    }

    const checker = () => {
      if (isImageReady(img)) {
        resolve(img);
      } else {
        // this loop will poll it every 100ms.
        setTimeout(checker.bind(this), 100);
      }
    };

    checker();
  });
}

function isImageReady(img) {
  if (!img.complete) {
    return false;
  }
  // naturalWidth is only available when the image headers are loaded,
  if (img.naturalWidth === 0) {
    return false;
  }
  return true;
}