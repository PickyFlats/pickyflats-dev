import { Divider, IconButton } from '@mui/material';
import { useForm } from 'react-hook-form';
import { FaMapMarker, FaStreetView } from 'react-icons/fa';
import { GrMapLocation } from 'react-icons/gr';
import { MdAttachEmail, MdPhone } from 'react-icons/md';

import { IcontactAndLocation } from '@/store/flatStore';
import { useFlatStore } from '@/store/flatStore';

import { AddLocationModal } from '@/features/my-flats/Modal/addLocationModal';

const ContactAndLocation = () => {
  const {
    handleSubmit,
    control,

    formState: { errors, isDirty },
  } = useForm<IcontactAndLocation>({
    defaultValues: {
      sellerContact: '',
    },
  });

  const { contactAndLocation, flatMapLocation } = useFlatStore();

  return (
    <>
      <div className=' mt-9 flex w-full  justify-center'>
        <AddLocationModal />
      </div>
      <div className=' m-auto mt-9 grid w-[80%]  justify-center gap-5 text-center md:grid-cols-2'>
        <div className='mt-5 pl-5  pr-5 md:pl-11'>
          <h2 className=' text-primary-main text-left text-lg font-semibold'>
            Your Contact Information
          </h2>
          <div className='w-full text-left'>
            {contactAndLocation.sellerCountry && (
              <div className='flex '>
                <IconButton>
                  <GrMapLocation className='' color='primary' />
                </IconButton>
                <span className='relative top-[10px] text-base font-semibold capitalize text-black opacity-80 '>
                  {contactAndLocation.sellerCity +
                    ',' +
                    contactAndLocation.sellerCountry}
                </span>
              </div>
            )}
            <Divider />
            {contactAndLocation.sellerEmail && (
              <div className='flex'>
                <IconButton>
                  <MdAttachEmail />
                </IconButton>
                <span className='relative top-[10px] text-base font-semibold text-black opacity-80  '>
                  {contactAndLocation.sellerEmail}
                </span>
              </div>
            )}
            <Divider />

            {contactAndLocation.sellerContact && (
              <div className='flex'>
                <IconButton className=' '>
                  <MdPhone className='' />
                </IconButton>
                <span className='relative top-[10px] text-base font-semibold capitalize text-black opacity-80 '>
                  {contactAndLocation.sellerContact}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className='mt-5  pl-5 pr-5 md:pl-11'>
          <h2 className=' text-primary-main text-left text-lg font-semibold'>
            Flat Location Information
          </h2>
          <div className='w-full text-left'>
            {contactAndLocation.flatCountry && (
              <div className='flex flex-wrap '>
                <IconButton>
                  <GrMapLocation className='' color='primary' />
                </IconButton>
                <span className='relative top-[10px] text-base font-semibold capitalize text-black opacity-80 '>
                  {contactAndLocation.flatCity +
                    ',' +
                    contactAndLocation.flatCountry}
                </span>
              </div>
            )}
            <Divider />
            {contactAndLocation.flatStreet1 && (
              <div className='flex'>
                <IconButton>
                  <FaStreetView />
                </IconButton>
                <span className='relative top-[10px] text-base font-semibold capitalize text-black opacity-80  '>
                  {contactAndLocation.flatStreet1}
                </span>
              </div>
            )}
            <Divider />

            {contactAndLocation.flatStreet2 && (
              <div className='flex'>
                <IconButton>
                  <FaStreetView />
                </IconButton>
                <span className='relative top-[10px] text-base font-semibold capitalize text-black opacity-80 '>
                  {contactAndLocation.flatStreet2}
                </span>
              </div>
            )}
            <Divider />
            {
              <div className='my-3 flex items-center'>
                <IconButton className=' '>
                  <FaMapMarker className='text-sm' />
                </IconButton>
                <span className='relative text-base font-semibold capitalize text-black opacity-80 '>
                  {/* {contactAndLocation.flatGeo?.join(',')} */}
                  {String(flatMapLocation)}
                </span>
              </div>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactAndLocation;
