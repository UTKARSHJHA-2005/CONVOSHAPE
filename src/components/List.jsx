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
  const [isProfilePageVisible, setIsProfilePageVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [about, setabout] = useState('Hii, I am using Convo')
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState("");
  const [value, setValue] = useState('');
  const [newName, setNewName] = useState("");
  const [newAvatar, setNewAvatar] = useState(null);
  const [isAddUserVisible, setIsAddUserVisible] = useState(false);
  const { currentUser } = Userstore();
  const [dob, setDob] = useState("");
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
    const storedName = localStorage.getItem("userName");
    const storedAvatar = localStorage.getItem("userAvatar");

    if (storedName) {
      setNewName(storedName);
    }
    if (storedAvatar) {
      setNewAvatar(storedAvatar);
    }
  }, []);

  const handleSelect = async (chat) => {
    console.log("Selected Chat Object:", chat);
    if (!chat || !chat.id) {
      console.error("Invalid chat object:", chat);
      return;
    }
    const chatUser = chat?.user;
    if (!chatUser) {
      console.error("Invalid user object in chat:", chat);
      return;
    }
    try {
      const updatedChats = chats.map((item) =>
        item.chatId === chat.id ? { ...item, isSeen: true } : item
      );
      const userchatref = doc(db, "userchats", currentUser.id);
      await updateDoc(userchatref, { chats: updatedChats });

      setChats(updatedChats);
      changeChat(chat.id, chatUser);
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

  const validChats = chats.filter((c) => c?.user && c?.user?.name);

  const handleProfileClick = () => {
    setIsProfilePageVisible(true);
  };

  const handleCloseProfilePage = () => {
    setIsProfilePageVisible(false);
  };

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAvatar(URL.createObjectURL(file));
    }
  };
  const handleDobChange = (e) => {
    setDob(e.target.value);
  };
  const handleSaveProfile = () => {
    if (newName) {
      localStorage.setItem("userName", newName);
    }
    if (newAvatar) {
      localStorage.setItem("userAvatar", newAvatar);
    }
    if (currentUser) {
      const userRef = doc(db, "users", currentUser.id);
      updateDoc(userRef, {
        name: newName || currentUser.name,
        avatar: newAvatar || currentUser.avatar
      });
    }
    handleCloseProfilePage();
  };

  return (
    <div className="shadow-lg mt-[30px] text-center bg-gray-900 bg-opacity-80 rounded-xl p-4 border border-gray-500">
      {isProfilePageVisible ? (
        <div className="profile-settings p-4">
          <button onClick={handleCloseProfilePage} className="close-btn text-white bg-red-500 px-4 py-2 rounded-md">
            Close Profile Settings
          </button>
          <h2 className="text-white mt-4">Profile Settings</h2>
          <div className="flex flex-col items-center mt-4">
            <div className="flex flex-row">
              <img
                src={newAvatar || currentUser.avatar || avatar}
                height={100}
                width={100}
                className="rounded-full"
                alt="Profile"
              />
              <label htmlFor="avatar-upload" className="cursor-pointer">
                <img
                  src={edit}
                  height={30}
                  width={30}
                  alt="Edit Avatar"
                  className="rounded-md h-[35px] w-[30px] mt-12"
                />
              </label>
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
            </div>
            <div className="mt-4">
              <p className="text-white">🧑Name:</p>
              <input
                type="text"
                placeholder="Update Name"
                value={newName || currentUser.name || ""}
                onChange={handleNameChange}
                className="p-2 rounded-md" />
              <br />
              <p className="text-white">📅Date Of Birth:</p>
              <input type="date" className="h-[30px] mt-2 rounded-lg w-[200px] ml-3" value={dob} onChange={handleDobChange} />
              <br />
              <p className="text-white">☏Phone:</p>
              <div className="space-y-2 flex flex-row">
                <PhoneInput
                  international
                  defaultCountry="IN"
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  className="phone-input mt-3 bg-white mr-1 rounded-md w-[40px] h-[27px]" />
                <input
                  type="text"
                  className="h-[30px] rounded-md w-[180px]"
                  value={phoneNumber || ''}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Phone number"
                />
              </div>
              <p className="text-white">🛈About:</p>
              <textarea type="text" className="h-auto w-[230px] rounded-md resize-none min-h-[30px]" value={about} onChange={setabout} />
            </div>
            <button
              onClick={handleSaveProfile}
              className="mt-5 text-white bg-green-500 px-4 py-2 rounded-md">
              Save Profile
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-row items-center justify-between mb-5">
            <div className="flex items-center cursor-pointer" onClick={handleProfileClick}>
              <img
                src={newAvatar || currentUser.avatar || avatar}
                height={50}
                width={50}
                className="rounded-full"
                alt="dp"
              />
              <h2 className="text-center text-white ml-4">{newName || currentUser.name || "Guest"}</h2>
            </div>
            <img
              src={logout}
              onClick={() => auth.signOut().catch((err) => console.error("Logout Error:", err))}
              height={60}
              width={60}
              className="cursor-pointer rounded-3xl hover:bg-white"
              alt="logout"
            />
          </div>
          <div className="flex flex-row items-center mb-5">
            <img src={search} height={35} width={35} alt="searchbox rounded-md" />
            <input
              type="text"
              className="h-[30px] w-[250px] focus:outline-none p-2 rounded-md"
              placeholder="Search chats..."
              onChange={(e) => setInput(e.target.value)}
            />
            <img
              src={plus}
              height={30}
              width={30}
              onClick={toggleAddUser}
              className="cursor-pointer ml-3"
              alt="add user"
            />
          </div>
          {isAddUserVisible && <Adduser updateChats={updateChats} />}
          <div className="mt-5">
            {chats.length > 0 ? (
              chats.map((chat, index) =>
                chat?.user ? (
                  <div
                    key={index}
                    className="flex items-center cursor-pointer justify-between bg-gray-800 p-4 rounded-md mb-4"
                    onClick={() => handleSelect(chat)}
                  >
                    <div className="flex items-center">
                      <img
                        src={chat.user.avatar || avatar}
                        height={40}
                        width={40}
                        className="rounded-full"
                        alt="user"
                      />
                      <h3 className="text-white ml-4">{chat.user.name}</h3>
                    </div>
                    <p className="text-white">{chat?.lastMessage}</p>
                  </div>
                ) : null
              )
            ) : (
              <p className="text-white">No chats available</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
