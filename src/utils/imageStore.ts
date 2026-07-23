import { get, set } from 'idb-keyval';

const IMAGE_PREFIX = 'crop_image_';

export const saveCropImage = async (cropCode: string, file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = reader.result as string;
        await set(IMAGE_PREFIX + cropCode, base64String);
        resolve(base64String);
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const getCropImage = async (cropCode: string): Promise<string | null> => {
  try {
    const data = await get(IMAGE_PREFIX + cropCode);
    return data as string || null;
  } catch (e) {
    console.error("Error fetching crop image from IDB:", e);
    return null;
  }
};
