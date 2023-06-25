import { useState } from 'react';

import api from '@/lib/api';

interface IUseFileUploader {
  onSuccess: (keys: string[] | null) => void;
  mykeys: string[];
  setMyKeys: (str: string[]) => void;
}

function useFileUploader({ onSuccess, mykeys, setMyKeys }: IUseFileUploader) {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const [uploadedFileIDs, setUploadedFileIDs] = useState<string[]>([]);

  const upload = async (files: File[]) => {
    setIsLoading(true);
    try {
      const newUploadedIDs: string[] = [...(uploadedFileIDs ?? [])];
      for await (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await api.post('/files/upload', formData);
        const fileID = uploadRes.data?._id;
        setUploadedFileIDs((keys) => [...keys, fileID]);
        newUploadedIDs.push(fileID);
      }
      onSuccess(newUploadedIDs);
    } catch (error: any) {
      setUploadError(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { uploadedFileIDs, isLoading, uploadError, upload };
}

export default useFileUploader;
