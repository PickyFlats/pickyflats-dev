import InputBase from '@mui/material/InputBase';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { MdOutlineTune } from 'react-icons/md';

import { searchListingsByQuery } from '@/database/listings';

import useListingsStore from '@/store/useListingsStore';

import FlatTypeSelectorOptions from '@/features/home/FlatTypeSelectorOptions';

import FilterModal from '../Filter';

export const Header = () => {
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { minPrice, maxPrice, purpose, bedrooms, bathrooms, kitchen } =
    useListingsStore();

  const { query, setQuery, setListings } = useListingsStore();

  const router = useRouter();
  const handleSearch = (KeyCode: string) => {
    if (KeyCode == 'Enter') {
      router.push(
        `/?query=${searchTerm}&min=${minPrice}&max=${maxPrice}&purpose=${purpose}&bedRoom=${bedrooms}&bathRoom=${bathrooms}&kitchen=${kitchen}`
      );
    }
  };

  useEffect(() => {
    //call search api here if possible with pagination/ through intersection observer
    const query = router.query.query ?? undefined;
    const minPrice = router.query.min ?? undefined;
    const maxPrice = router.query.max ?? undefined;
    const purpose = router.query.purpose ?? undefined;
    const bedRoom = router.query.bedRoom ?? undefined;
    const bathRoom = router.query.bathRoom ?? undefined;
    const kitchen = router.query.kitchen ?? undefined;

    console.log('router.query? ', router.query);
    // setQuery(router.query)
    // console.log(
    //   'queries',
    //   query,
    //   minPrice,
    //   maxPrice,
    //   purpose,
    //   bedRoom,
    //   bathRoom,
    //   kitchen
    // );
    const searchByQuery = async () => {
      const searchResults = await searchListingsByQuery(router.query);
      setListings(searchResults);
    };
    searchByQuery();
  }, [router.query]);
  // comment
  return (
    <div className=' flex h-[85vh] w-full flex-col text-center'>
      <div className=' flex flex-grow flex-col justify-center align-middle'></div>
      <div className='h-[100px] flex-shrink'>
        <div className=' m-auto flex h-[50px] w-[80%] gap-2 md:w-[50%] '>
          {/* <form className=' m-auto flex h-[50px] w-[80%] gap-2 md:w-[50%] '> */}
          <InputBase
            type='text'
            placeholder='Search Your dream home'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startAdornment={
              <FiSearch className='text-primary-main mx-3 cursor-pointer text-[25px] ' />
            }
            onKeyDown={(e) => handleSearch(e.key)}
            className='hover:border-primary-main h-[50px] w-full  rounded-[25px] border-[2px] text-[18px] text-white '
          />
          {/* </form> */}
          <div
            className=' flex cursor-pointer items-center rounded-2xl border-2 border-white px-2 py-1'
            onClick={() => setOpenModal(true)}
          >
            <p className='text-white'>Filter</p>
            <MdOutlineTune className='cursor-pointer text-[25px] text-white' />
          </div>
        </div>
      </div>
      <div className='min-h-[80px] flex-shrink pb-4'>
        <FlatTypeSelectorOptions />
      </div>
      <FilterModal isOpen={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
};
