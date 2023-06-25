import { IconButton } from '@mui/material';
import Link from 'next/link';
import React, { useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import { FaTimes } from 'react-icons/fa';

import { isEmptyArray } from '@/lib/helper';

import { fetchConversations } from '@/database/conversation';

import ConversationItem from '@/components/chat/ConversationItem';
import Loader from '@/components/Loader';

import useAuthStore from '@/store/useAuthStore';
import useChatStore from '@/store/useChatStore';
import useSnackbarStore from '@/store/useSnackbarStore';

export default function ChatSidebar() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const { conversations, setConversations, firstLoad, setFirstLoad } =
    useChatStore();

  const { openSnackbar } = useSnackbarStore();
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  React.useEffect(() => {
    const loadConversations = async () => {
      try {
        const _conversations = await fetchConversations();
        setConversations(_conversations);
        !firstLoad && setFirstLoad(true);
      } catch (error) {
        openSnackbar('Failed to load conversations', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadConversations();

    //!TODO: listen for push updates
    // const unsubscribe = client.subscribe(
    //   `databases.${DATABASE_ID}.collections.${LISTENERS_ID}.documents.${user?.listenerID}`,
    //   (update) => {
    //     const payload: any = update.payload;
    //     if (payload.updateType === 'Message') loadConversations();

    //     //! FUTUREUPDATE - push notification
    //     // if (payload.updateType === 'Notification') {
    //     //   logger('refresh notification.. ');
    //     // }
    //   }
    // );

    // return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    if (!searchActive) return;
    const _searchResults: any[] = [];
    conversations.allIds.map((id, i) => {
      const conversation = conversations.byId[id];
      const name = conversations.byId[id]?.participant?.name;
      const searchFound = new RegExp(searchQuery, 'i').test(name);
      if (searchFound) _searchResults.push(conversation);
    });
    setSearchResults(_searchResults);
  }, [searchActive, searchQuery]);

  React.useEffect(() => {
    return () => setSearchQuery('');
  }, [searchActive]);

  return (
    <div className='flex w-1/4 flex-col border-r border-solid p-1 max-md:w-full'>
      <div className='flex'>
        <div className='text-text-secondary-default px-2 text-xl font-medium'>
          Messages
        </div>
        {!searchActive && (
          <IconButton className='ml-auto' onClick={() => setSearchActive(true)}>
            <BiSearch />
          </IconButton>
        )}
      </div>

      {searchActive && (
        <div className='mt-2 flex items-center rounded-full bg-gray-200'>
          <input
            type='text'
            className='rounded-full bg-transparent px-4 py-2 focus:outline-none'
            placeholder='Search by name'
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <IconButton
            className='ml-auto'
            onClick={() => setSearchActive(false)}
          >
            <FaTimes />
          </IconButton>
        </div>
      )}

      <div className='flex-grow overflow-y-auto pt-2'>
        {/* //TODO! empty message according to user type - user/seller */}
        {!loading && isEmptyArray(conversations.allIds) && (
          <div className='no-listings px-2'>
            <p className='font-medium'>
              Explore available listings to start a conversation.
            </p>
          </div>
        )}

        <ul className='divide-y divide-gray-300'>
          {loading && !firstLoad && <Loader />}
          {!searchActive &&
            conversations.allIds.map((id, i) => {
              const conversation = conversations.byId[id];
              return (
                <li key={i} className='hover:bg-slate-100'>
                  <Link href={`/messages/${id}`}>
                    <ConversationItem item={conversation} />
                  </Link>
                </li>
              );
            })}
          {searchActive &&
            searchResults.map((item, i) => {
              return (
                <li key={i} className='hover:bg-slate-100'>
                  <Link href={`/messages/${item?.$id}`}>
                    <ConversationItem item={item} />
                  </Link>
                </li>
              );
            })}
          {searchActive && isEmptyArray(searchResults) && (
            <div className='px-2'>
              <p className='font-medium'>No results for {searchQuery}.</p>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}
