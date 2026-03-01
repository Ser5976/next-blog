import { NextResponse } from 'next/server';
import { getUploadAuthParams } from '@imagekit/next/server';

export async function GET() {
  console.log('PRIVATE_KEY exists:', !!process.env.PRIVATE_KEY);
  console.log(
    'NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY exists:',
    !!process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
  );
  // Проверяем наличие переменных окружения
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY as string;
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string;

  if (!privateKey || !publicKey) {
    console.error('Missing required environment variables');
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }
  try {
    const { token, expire, signature } = getUploadAuthParams({
      privateKey,
      publicKey,
    });

    const response = {
      token,
      expire,
      signature,
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    };

    console.log('API Response:', response);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in upload-auth:', error);
    return NextResponse.json({ error: 'Auth failed' }, { status: 500 });
  }
}
