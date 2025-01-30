import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs, setDoc, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../db";
import search from "../assets/search.jpg";
import avatar from "../assets/avatar.jpg";
import { Userstore } from "../usestore";

export const Adduser = ({ updateChats }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const currentUser = Userstore((state) => state.currentUser);
  const auth = getAuth();

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("name", "==", searchTerm.trim()));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        setUser({ id: querySnapshot.docs[0].id, ...userData });
      } else {
        alert("User not found");
        setUser(null);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  const handleAddUser = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        alert("You must be logged in to add a user.");
        return;
      }

      const userChatRef = collection(db, "addedusers");
      const chatId = currentUser.uid > user.id ? `${currentUser.uid}_${user.id}` : `${user.id}_${currentUser.uid}`;
      const chatRef = doc(db, "chats", chatId);
      const currentUserChatRef = doc(userChatRef, currentUser.uid);
      const otherUserChatRef = doc(userChatRef, user.id);
      const chatSnapshot = await getDoc(chatRef);
      if (!chatSnapshot.exists()) {
        await setDoc(chatRef, { messages: [], lastMessage: null, createdAt: new Date().toISOString() });
      }

      const currentUserChatSnapshot = await getDoc(currentUserChatRef);
      if (!currentUserChatSnapshot.exists()) {
        await setDoc(currentUserChatRef, { chats: [{ chatId, lastMessage: "", receiverId: user.id, updatedAt: Date.now() }] });
      } else {
        await updateDoc(currentUserChatRef, { chats: arrayUnion({ chatId, lastMessage: "", receiverId: user.id, updatedAt: Date.now() }) });
      }

      const otherUserChatSnapshot = await getDoc(otherUserChatRef);
      if (!otherUserChatSnapshot.exists()) {
        await setDoc(otherUserChatRef, { chats: [{ chatId, lastMessage: "", receiverId: currentUser.uid, updatedAt: Date.now() }] });
      } else {
        await updateDoc(otherUserChatRef, { chats: arrayUnion({ chatId, lastMessage: "", receiverId: currentUser.uid, updatedAt: Date.now() }) });
      }
      alert("Chat successfully created or updated!");
      const newChat = { id: chatId, user: user, lastMessage: "", receiverId: user.id };
      updateChats((prevChats) => {
        const updatedChats = [newChat, ...prevChats];
        localStorage.setItem("chats", JSON.stringify(updatedChats)); 
        return updatedChats;
      });
    } catch (err) {
      console.error("Error creating chat:", err);
      alert("Error creating chat.");
    }
  };
  return (
    <div>
      {isVisible && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="shadow-lg mt-[70px] text-center bg-gray-900 bg-opacity-80 rounded-md p-6 border border-gray-500">
            <p
              className="text-white font-extrabold cursor-pointer"
              onClick={handleClose}
            >
              X
            </p>
            <form className="flex flex-row mt-5" onSubmit={handleSearch}>
              <input
                type="text"
                name="name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[300px] focus:outline-none rounded-lg"
                placeholder="Search by Name..."
              />
              <button type="submit">
                <img
                  src={search}
                  className="cursor-pointer"
                  height={30}
                  width={30}
                  alt="search"
                />
              </button>
            </form>
            {user && (
              <div className="flex flex-row mt-4">
                <div className="flex flex-row">
                  <img
                    src={user.avatar || avatar}
                    height={50}
                    width={50}
                    className="rounded-full"
                    alt="user-avatar"
                  />
                  <h3 className="text-white mt-3 ml-2">{user.name}</h3>
                </div>
                <button
                  type="button"
                  onClick={handleAddUser}
                  className="ml-24 bg-green-500 text-white rounded-lg px-4 py-2"
                >
                  Add to Chat
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};                                          