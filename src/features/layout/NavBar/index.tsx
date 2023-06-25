/* eslint-disable @next/next/no-img-element */
import {
  Button,
  ClickAwayListener,
  Divider,
  IconButton,
  MenuItem,
  MenuList,
  Popper,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { CgMenuRightAlt } from 'react-icons/cg';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoPersonCircle } from 'react-icons/io5';

import { PROFILES_BUCKET, storage } from '@/lib/client-old';

import useAuthStore from '@/store/useAuthStore';
import useDrawerStore from '@/store/useDrawerStore';

const topSideControlMenuPages = [
  '/dashboard',
  '/my-flats',
  '/saved-lists',
  '/tour-requests',
  '/activity',
  '/messages',
  '/messages/[conversationId]',
  '/bookings',
  '/profile',
];

export const NavBar = () => {
  const { user } = useAuthStore();
  const [sideControlMenu, setSideControlMenu] = useState(false);
  const { pathname } = useRouter();
  const {
    isOpen: isSidebarOpen,
    open: openSidebar,
    close: closeSidebar,
  } = useDrawerStore();
  const { isAuthenticated, logout } = useAuthStore();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  const toggleSidebar = isSidebarOpen ? closeSidebar : openSidebar;

  useEffect(() => {
    setSideControlMenu(topSideControlMenuPages.includes(pathname));
  }, [pathname]);

  const accountAnchorRef = useRef<HTMLDivElement>(null);

  const userAvatar = isAuthenticated
    ? storage.getFilePreview(PROFILES_BUCKET, user!.profilePicture)
    : null;

  const isHomePage = pathname === '/';

  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <div className='flex h-[50px] w-full border-b border-solid bg-white px-5 shadow-sm md:h-[70px]'>
        {sideControlMenu && (
          <div className='my-auto mr-1'>
            <IconButton onClick={toggleSidebar}>
              <GiHamburgerMenu />
            </IconButton>
          </div>
        )}
        <div>
          <Link href='/'>
            <div className='relative h-full  w-[150px] object-scale-down md:w-[200px]'>
              <Image src='/logo.svg' alt='logo' fill />
            </div>
          </Link>
        </div>
        <div className='flex-grow'></div>
        <div className='flex h-full flex-shrink justify-center  gap-5 align-middle  '>
          {!isAuthenticated && (
            <>
              <div className='hidden h-full flex-col justify-center align-middle md:flex'>
                <Link href='/auth/login'>
                  <span className=' text-[16px] font-semibold'>Log In</span>
                </Link>
              </div>
              <div className='hidden h-full flex-col justify-center  align-middle md:flex'>
                <Link href='/auth/register'>
                  <Button
                    variant='contained'
                    className='text-[16px] font-semibold capitalize'
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            </>
          )}

          {/* //  */}
          {/* {!isHomePage && isAuthenticated && (
            <div className='flex h-full items-center justify-center space-x-2'>
              <NotificationsPopover />
              <MessagesPopover />
            </div>
          )} */}

          <div className='relative box-border flex h-full  flex-col justify-center align-middle'>
            <div
              className='hover:bg-secondary-light flex cursor-pointer rounded-full border bg-slate-100 p-1 text-[21px] shadow-sm md:p-2 md:text-[25px] '
              onClick={handleOpen}
              ref={accountAnchorRef}
            >
              <CgMenuRightAlt />
              {isAuthenticated && (
                <div className='my-auto px-2 text-base'>
                  Hi,
                  <span className='text-primary-main pl-1 font-medium'>
                    {isMediumScreen
                      ? user?.firstName
                      : `${user?.firstName} ${user?.lastName}`}
                  </span>
                </div>
              )}
              {user?.profilePicture ? (
                <img
                  src={userAvatar?.href}
                  alt='Avatar'
                  className='inline-flex h-6 w-6 items-center justify-center rounded-full'
                />
              ) : (
                <IoPersonCircle />
              )}
            </div>
            <div className='z-50  bg-slate-300'>
              <Popper
                anchorEl={accountAnchorRef.current}
                open={open}
                style={{
                  minWidth: '150px',
                }}
                disablePortal
                className='z-[200] rounded-md bg-white shadow-md'
                placement='bottom-end'
              >
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    id='composition-menu'
                    aria-labelledby='composition-button'
                  >
                    <div className='py-2'>
                      {/* !TODO:  */}
                      {/* <Link
                        href='/my-flats?newListing=true'
                        onClick={handleClose}
                      > */}
                      <Link href='/my-flats' onClick={handleClose}>
                        <MenuItem>List Flat/Apartment</MenuItem>
                      </Link>
                    </div>

                    {isAuthenticated && (
                      <>
                        <Divider />
                        <div className='py-2'>
                          <Link href='/bookings' onClick={handleClose}>
                            <MenuItem>My Bookings</MenuItem>
                          </Link>
                          <Link href='/saved-lists' onClick={handleClose}>
                            <MenuItem>Saved Lists</MenuItem>
                          </Link>
                          <Link href='/profile' onClick={handleClose}>
                            <MenuItem>Account</MenuItem>
                          </Link>
                          <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </div>
                      </>
                    )}
                  </MenuList>
                </ClickAwayListener>
              </Popper>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
