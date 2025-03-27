import { create } from 'zustand'; // Zustand State Management
import { Userstore } from './usestore'; // Make sure Userstore is imported

export const Chatstore = create((set) => ({
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isRecieverBlocked: false,
  changeChat: (chatId, user) => {
    const currentUser = Userstore.getState().currentUser;
    // Validate if `blocked` arrays exist
    const userBlocked = Array.isArray(user?.blocked) ? user.blocked : [];
    const currentUserBlocked = Array.isArray(currentUser?.blocked) ? currentUser.blocked : [];
    // Check if the current user is blocked by the receiver
    if (userBlocked.includes(currentUser.id)) {
      return set({
        chatId,
        user: null,
        isCurrentUserBlocked: true,
        isRecieverBlocked: false,
      });
    }
    // Check if the receiver is blocked by the current user
    else if (currentUserBlocked.includes(user.id)) {
      return set({
        chatId,
        user: null,
        isCurrentUserBlocked: false,
        isRecieverBlocked: true,
      });
    } else { // If not blocked,then accept the message
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
