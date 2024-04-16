import React, {useCallback, useState} from 'react'
import {useDropzone , FileWithPath} from 'react-dropzone'
import { Button } from '../ui/button';

type fileUploaderProps={
  fieldChange:(FILES:File[])=>void;
  mediaUrl:string
} 
const FileUploader = ({fieldChange,mediaUrl}:fileUploaderProps) => {
  const [fileURL, setFileURL] = useState(mediaUrl);
  const [file, setFile] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles:FileWithPath[]) => {
    setFile(acceptedFiles);
    fieldChange(acceptedFiles);
    setFileURL(URL.createObjectURL(acceptedFiles[0]))
  }, [file])

  const {getRootProps, getInputProps, isDragActive} = useDropzone(
    {
      onDrop,
      accept:{
        "image/*": [".png", ".jpeg", ".jpg"],
      }
    })

  return (
    <div {...getRootProps()} className='flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer'>
      <input {...getInputProps()} className='cursor-pointer' />
      {
        fileURL ?(
          <>
          <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
            <img src={fileURL} alt="image" className="file_uploader-img" />
          </div>
          <p className="file_uploader-label">Click or drag photo to replace</p>
        </>
        ):(
          <div className='file_uploader-box'>
            <img src='/assets/icons/file-upload.svg' width={96} height={77} alt='file-upload'  />
            <h3 className='base-medium text-light-2 mb-2 mt-6'>Drop photo here</h3>
            <p className="text-light-4 small-regular mb-6">SVG, PNG, JPG</p>
            <Button type="button" className="shad-button_dark_4">
              Select from your device
            </Button>
          </div>
        )
          
      }
    </div>
  )
}

export default FileUploader