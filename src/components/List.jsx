import React, { useState, useEffect } from "react";
import { Userstore } from "../usestore";
import avatar from "../assets/avatar.jpg";
import logout from "../assets/log-out.png";
import 'react-phone-number-input/style.css';
import edit from "../assets/edit.png";
import { Chatstore } from "../ChatStore";
import { Adduser } from "../pages/NewUser";
import { updateDoc, doc } from "firebase/firestore";
import { db, auth } from "../db";
import PhoneInput from 'react-phone-number-input';
import search from "../assets/search.jpg";
import plus from "../assets/plus.jpg";

export default function List() {
  const [isAddUserVisible, setIsAddUserVisible] = useState(false);
  const [NewName, setNewName] = useState();
  const [Input, setInput] = useState("");
  const [Avatar, setNewAvatar] = useState();
  const [chats, setChats] = useState([]); 
  const { currentUser } = Userstore();
  const { chatId, changeChat } = Chatstore();

  useEffect(() => {
    const savedChats = localStorage.getItem("chats");
    if (savedChats && typeof savedChats === 'string' && savedChats !== "undefined") {
      try {
        setChats(JSON.parse(savedChats));
      } catch (error) {
        console.error("Error parsing chats from localStorage:", error);
        localStorage.removeItem("chats");
        setChats([]);
      }
    } else {
      setChats([]);
    }
    const filtered = chats.filter((chat) => chat.chatId !== chatId);
    setChats(filtered);
  }, []);

  const handleSelect = async (chat) => {
    if (!chat || !chat.id) return;
    try {
      const updatedChats = chats.map((item) =>
        item.chatId === chat.id ? { ...item, isSeen: true } : item
      );
      const userchatref = doc(db, "userchats", currentUser.id);
      await updateDoc(userchatref, { chats: updatedChats });
      setChats(updatedChats);
      changeChat(chat.id, chat.user);
    } catch (e) {
      console.error("Error updating chat:", e);
    }
  };

  const updateChats = (newChats) => {
    setChats(newChats);
    localStorage.setItem("chats", JSON.stringify(newChats));
  };

  const toggleAddUser = () => {
    setIsAddUserVisible((prev) => !prev);
  };
  const filteredChats = chats.filter(chat =>
    chat?.user?.name?.toLowerCase().includes(Input.toLowerCase())
  );
  return (
    <div className="shadow-lg mt-[30px] text-center bg-gray-900 bg-opacity-80 rounded-xl p-4 border border-gray-500">
      <div className="flex flex-row items-center justify-between mb-5">
        <div className="flex items-center">
          <img src={avatar} height={50} width={50} className="rounded-full" alt="dp" />
          <h2 className="text-center text-white ml-4">
            {currentUser.name || "Guest"}
          </h2>
        </div>
        <img
          src={logout}
          onClick={() => auth.signOut().catch((err) => console.error("Logout Error:", err))}
          height={60}
          width={60}
          className="cursor-pointer rounded-3xl hover:bg-white "
          alt="logout"/>
      </div>
      <div className="flex flex-row items-center mb-5">
        <img src={search} height={35} width={35} alt="search" />
        <input
          type="text"
          value={Input}
          onChange={(e) => setInput(e.target.value)}
          className="h-[30px] w-[250px] focus:outline-none p-2 rounded-md"
          placeholder="Search chats..."/>
        <img
          src={plus}
          height={30}
          width={30}
          onClick={toggleAddUser}
          className="cursor-pointer ml-3"
          alt="add user"/>
      </div>
      {isAddUserVisible && <Adduser updateChats={updateChats} />}
      <div className="mt-5">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat, index) => (
            chat?.user ? (  
              <div
                key={index}
                className="flex items-center cursor-pointer justify-between bg-gray-800 p-4 rounded-md mb-4"
                onClick={() => handleSelect(chat)}>
                <div className="flex items-center">
                  <img
                    src={chat.user.avatar || avatar}
                    height={40}
                    width={40}
                    className="rounded-full"
                    alt="user"/>
                  <h3 className="text-white ml-4">{chat.user.name}</h3>
                </div>
                <p className="text-white">{chat?.lastMessage}</p>
              </div>
            ) : null
          ))
        ) : (
          <p className="text-white">No chats available</p>
        )}
      </div>
    </div>
  );
}