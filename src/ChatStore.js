import { create } from 'zustand';
import { db } from './db';
import { doc, getDoc } from 'firebase/firestore';
import { Userstore } from './usestore'; // Make sure Userstore is imported

export const Chatstore = create((set) => ({
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isRecieverBlocked: false,
  changeChat: (chatId, user) => {
    const currentUser = Userstore.getState().currentUser;
    
    // Check if the current user is blocked by the receiver
    if (user.blocked.includes(currentUser.id)) {
      return set({
        chatId,
        user: null,
        isCurrentUserBlocked: true,
        isRecieverBlocked: false,
      });
    }
    // Check if the receiver is blocked by the current user
    else if (currentUser.blocked.includes(user.id)) {
      return set({
        chatId,
        user: null,
        isCurrentUserBlocked: false,
        isRecieverBlocked: true,
      });
    } else {
      set({
        chatId,
        user,
        isCurrentUserBlocked: false,
        isRecieverBlocked: false,
      });
    }
  },
  changeBlock: () => {
    set((state) => ({
      isRecieverBlocked: !state.isRecieverBlocked,
    }));
  },
}));
