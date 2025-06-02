import React, { useState } from 'react';
import Modal from 'react-modal';
import { useDropzone } from 'react-dropzone';
import { Icon } from '@iconify/react';
import { Button } from '@/components/ui/button';
import { useTranslate } from '@/config/useTranslation';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

// Modal.setAppElement("#root"); // Set app root for accessibility

export default function ImportFileModal({ title }: any) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const { t } = useTranslate();

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const onDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });


  const [File , setFile ] = useState({ name : "" , value: ""  })
  
  const handleFile = (e:any) =>{
    const file = e.target.files[0];
    setFile({ value : file ,  name : file.name})
    // setValue(keyData ,  file )
  }


  return (
    <div>
      <Button onClick={openModal} color='secondary' variant='outline'>
        <Icon icon='lets-icons:import' className='h-5 w-5' /> {title}
      </Button>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel='Import File Modal' className='modal-content' overlayClassName='modal-overlay'>
        <h2 className='text-xl font-semibold'>{title}</h2>

        <Label  className='w-full cursor-pointer hover:bg-gray-50 duration-300 border-dashed border-2 border-gray-400 p-8 text-center rounded-md mt-4'>
              <div className='flex items-center justify-center my-[20px] '>  <svg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='lucide lucide-arrow-up-to-line'>    <path d='M5 3h14' />    <path d='m18 13-6-6-6 6' />    <path d='M12 7v14' />  </svg></div>
              <p className='text-gray-600'> {t('importGUI.Drop or select file')} </p>
              <p className='text-gray-500'> {t('importGUI.Drop files here or click')} <span className='text-blue-600'> {t('importGUI.browse')} </span> {t('importGUI.through your machine')} </p>
              <Input type="file" onChange={handleFile} className="hidden" />
        </Label>

        <div className='flex justify-between mt-6'>

        <Label className="w-full" >
          <div>
            <Button className={` !rounded-[4px]`}  asChild color="info" variant="outline">
              <div className={` flex items-center gap-[10px] cursor-pointer ${File.name && "!bg-black !text-white "} `} > 
                <span className="" > { `${File.name?.slice(0,15) ||  t("Choose File") } ` } </span> 
                <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' stroke-linecap='round' strokeLinejoin='round' className='lucide lucide-download'>    <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />    <polyline points='7 10 12 15 17 10' />    <line x1='12' x2='12' y1='15' y2='3' />  </svg>
              </div>
            </Button>
          </div>
          <Input type="file" onChange={handleFile} className="hidden" />
        </Label>


          {/* <Button
            className='flex gap-[5px] items-center '
            onClick={() => {
              console.log('Imported files:', files);
              closeModal();
            }}
            color='primary'>
            <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' stroke-linecap='round' strokeLinejoin='round' className='lucide lucide-download'>
              <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
              <polyline points='7 10 12 15 17 10' />
              <line x1='12' x2='12' y1='15' y2='3' />
            </svg>
            {t('importGUI.Import File')}
          </Button> */}

          <Button
            onClick={() => {
              console.log('Download sample');
            }}
            color='primary'
            className='flex gap-[5px] items-center '
            variant='outline'>
            <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' stroke-linecap='round' strokeLinejoin='round' className='lucide lucide-download'>
              <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
              <polyline points='7 10 12 15 17 10' />
              <line x1='12' x2='12' y1='15' y2='3' />
            </svg>
            {t('importGUI.Download Sample')}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
