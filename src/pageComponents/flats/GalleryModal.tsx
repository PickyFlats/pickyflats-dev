import { Dialog, IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useState } from 'react';
import { CgClose } from 'react-icons/cg';

import { withCDNURL } from '@/lib/url';

import { Bathrooms } from '@/pageComponents/flats/Bathrooms';
import { Kitchen } from '@/pageComponents/flats/Kitchen';
import { Others } from '@/pageComponents/flats/Others';
import { Rooms } from '@/pageComponents/flats/Rooms';

interface Iprop {
  src: string;
  totalImgs: number;
}
export const GalleryModal = (props: Iprop) => {
  const { src, totalImgs } = props;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('one');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <div>
      <div
        className='relative inset-0 h-[150px] w-[150px] cursor-pointer bg-black   text-center md:h-[200px] md:w-[250px] '
        onClick={() => setOpen(true)}
      >
        <img
          src={withCDNURL(`/files/${src}`)}
          className=' brightness-10 h-full w-full object-cover filter '
          alt='cover'
        />
        <div className='absolute left-0 top-0 flex h-full w-full flex-col justify-center rounded bg-black bg-opacity-10 align-middle'>
          <h3 className=' text-center font-bold text-white underline'>
            +{totalImgs} More Photos
          </h3>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth='xl'
      >
        <div className=' h-[90vh] w-full p-5'>
          <div className='w-full'>
            <div className='flex flex-row-reverse'>
              <IconButton onClick={() => setOpen(false)}>
                <CgClose />
              </IconButton>{' '}
            </div>
          </div>

          <section>
            <Box sx={{ width: '100%' }}>
              <Tabs
                value={value}
                onChange={handleChange}
                textColor='primary'
                indicatorColor='secondary'
                aria-label='secondary tabs example'
                variant='scrollable'
                allowScrollButtonsMobile
              >
                <Tab value='one' label='Rooms' />
                <Tab value='two' label='Kitchen' />
                <Tab value='three' label='Bathrooms' />
                <Tab value='four' label='Others' />
              </Tabs>
            </Box>

            <div className='h-auto w-full px-5'>
              {value == 'one' && (
                <div>
                  <Rooms />
                </div>
              )}
              {value == 'two' && (
                <div>
                  <Kitchen />
                </div>
              )}

              {value == 'three' && (
                <div>
                  <Bathrooms />
                </div>
              )}

              {value == 'four' && (
                <div>
                  <Others />
                </div>
              )}
            </div>
          </section>
        </div>
      </Dialog>
    </div>
  );
};
