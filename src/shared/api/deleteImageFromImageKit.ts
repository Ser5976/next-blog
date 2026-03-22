'use server';

import ImageKit from '@imagekit/nodejs';

export async function deleteImageFromImageKit(url: string): Promise<boolean> {
  const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  });

  try {
    const urlObj = new URL(url);
    // Извлекаем ID из query-параметра 'id'
    const fileId = urlObj.searchParams.get('id');
    console.log('2. Правильный FileId для удаления:', fileId);

    if (!fileId) {
      console.error('❌ В URL отсутствует query-параметр id');
      return false;
    }
    await imagekit.files.delete(fileId);
    console.log('4. ✅ Изображение успешно удалено:', fileId);
    return true;
  } catch (error) {
    console.error('5. ❌ Ошибка при удалении:', error);
    return false;
  }
}
