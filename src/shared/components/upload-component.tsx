'use client';

import { useRef, useState } from 'react';
import { ImageKitInvalidRequestError, upload } from '@imagekit/next';

export const UploadComponent = () => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const authenticator = async () => {
    const response = await fetch('/api/upload-auth');

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Auth failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // Проверяем, что все поля есть
    if (!data.publicKey || !data.signature || !data.token || !data.expire) {
      console.error('Incomplete auth data:', data);
      throw new Error('Incomplete authentication data');
    }

    return data;
  };

  const handleUpload = async () => {
    setError(null);

    const fileInput = fileInputRef.current;
    if (!fileInput?.files?.length) {
      setError('Please select a file');
      return;
    }

    const file = fileInput.files[0];

    try {
      const authParams = await authenticator();
      console.log('Got auth params:', authParams);

      const uploadResponse = await upload({
        expire: authParams.expire,
        token: authParams.token,
        signature: authParams.signature,
        publicKey: authParams.publicKey,
        file,
        fileName: file.name,
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
      });

      console.log('Upload success:', uploadResponse);
      setProgress(0);
    } catch (error) {
      console.error('Upload failed:', error);
      setError(error instanceof Error ? error.message : 'Upload failed');

      if (error instanceof ImageKitInvalidRequestError) {
        console.error('Invalid request details:', error.message);
      }
    }
  };

  return (
    <div>
      <input type="file" ref={fileInputRef} accept="image/*" />
      <button onClick={handleUpload} disabled={progress > 0 && progress < 100}>
        Upload
      </button>
      {progress > 0 && (
        <div>
          Progress: <progress value={progress} max={100} />
        </div>
      )}
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
    </div>
  );
};
