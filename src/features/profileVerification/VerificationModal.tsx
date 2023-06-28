import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import ReactSelect from '@/features/HookForm/ReactSelect';

interface VerificationFormData {
  accountType: string;
  documentType: string;
  documentUpload: FileList;
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

export default function VerificationRequestModal() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerificationFormData>();

  const onSubmit = (data: VerificationFormData) => {
    console.log(data); // Perform your submission logic here
    // onClose(); // Close the modal after form submission
  };
  return (
    <div className='w-full max-w-lg max-md:w-[300px]'>
      <div className='modal-container'>
        <h2 className=' text-primary-main text-2xl font-semibold'>
          Request for Verification
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ReactSelect
            control={control}
            name='accountType'
            label=''
            placeholder=''
            options={[{ label: 'a', value: 'a' }]}
          />
          <FormControl fullWidth margin='normal'>
            <InputLabel>Account Type</InputLabel>
            <Controller
              name='accountType'
              control={control}
              rules={{ required: 'Account Type is required' }}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                >
                  <MenuItem value='landlord'>Landlord</MenuItem>
                  <MenuItem value='agency'>Agency</MenuItem>
                </Select>
              )}
            />
            {errors.accountType && (
              <FormHelperText>{errors.accountType.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth margin='normal'>
            <InputLabel>Document Type</InputLabel>
            <Controller
              name='documentType'
              control={control}
              rules={{ required: 'Document Type is required' }}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                >
                  <MenuItem value='id'>ID</MenuItem>
                  <MenuItem value='passport'>Passport</MenuItem>
                  <MenuItem value='license'>Real Estate License</MenuItem>
                </Select>
              )}
            />
            {errors.documentType && (
              <FormHelperText>{errors.documentType.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth margin='normal'>
            <InputLabel>Document Upload</InputLabel>
            <Controller
              name='documentUpload'
              control={control}
              rules={{ required: 'Document Upload is required' }}
              render={({ field }) => (
                <input
                  type='file'
                  onChange={(e) => field.onChange(e.target.files!)}
                  multiple
                />
              )}
            />
            {errors.documentUpload && (
              <FormHelperText>{errors.documentUpload.message}</FormHelperText>
            )}
          </FormControl>

          <Button variant='contained' color='primary' type='submit'>
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}
