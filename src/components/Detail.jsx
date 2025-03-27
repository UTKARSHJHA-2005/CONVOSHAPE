// This is the right component of chat page in which the details of chat is given.
import React, { useState, useEffect } from "react";
// Images
import avatar from '../assets/avatar.jpg';
import addgrp from "../assets/addgroup.png";
import mute from "../assets/mute.png";
import block from "../assets/block.png";
import { Chatstore } from "../ChatStore"; // Chatstore
import { Userstore } from "../usestore"; // Userstore
import { doc, getDoc, setDoc, arrayRemove, arrayUnion, updateDoc } from "firebase/firestore"; // Firebase Firestore
import { db } from "../db";  // Firebase Database

export default function Detail() {
  const { chatId, user, isRecieverBlocked, changeBlock } = Chatstore(); // Chat Management
  const { currentUser } = Userstore(); // User Management
  const [images, setImages] = useState([]); // State to store sent images

  // Storing the messages in chats collection in db if chat id and user id is present.
  useEffect(() => {
    if (user?.id && chatId) {
      const fetchChat = async () => {
        const chatDocRef = doc(db, "chats", chatId);
        const chatSnap = await getDoc(chatDocRef);
        const chatData = chatSnap.data();
        if (chatData) {
          const sentImages = chatData.messages
            .filter((msg) => msg.imageBase64) // Filter messages with images
            .map((msg) => msg.imageBase64);  // Extract image URLs
          setImages(sentImages);
        }
      };
      fetchChat();
    }
  }, [chatId, user?.id]);

  // Blocking the chat user by removing the user from user collection in db.
  const handleBlock = async () => {
    if (!user) return;
    const userDocRef = doc(db, "user", currentUser.id);
    try {
      const docSnap = await getDoc(userDocRef);
      if (!docSnap.exists()) {
        await setDoc(userDocRef, { blocked: [] });
      }
      await updateDoc(userDocRef, {
        blocked: isRecieverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  return (
    <div className="shadow-lg mt-[30px] text-center bg-gray-800 bg-opacity-90 rounded-xl p-6 border border-gray-500">
      {/* User Details */}
      <div className="flex flex-col items-center">
        <img src={user?.avatar || avatar} height={50} width={50} className="rounded-full" alt="User Avatar" />
        <div className="text-center mt-2">
          <p className="font-bold text-white">{user?.name || "User"}</p>
        </div>
      </div>
      {/* Chat Details: Addgroup, mute, block */}
      <div className="flex justify-center space-x-4 mt-4">
        <img src={addgrp} height={40} width={60} className="hover:bg-white p-2 cursor-pointer rounded-full" alt="Add to Group" />
        <img src={mute} height={40} width={60} className="hover:bg-white p-2 cursor-pointer rounded-full" alt="Mute" />
        <button onClick={handleBlock} className="flex items-center space-x-2">
          <img src={block} height={40} width={60} className={`hover:${isRecieverBlocked ? "bg-red-700" : "bg-white"} p-2 cursor-pointer rounded-full`} alt="Block" />
          <span className="text-white">{isRecieverBlocked ? "Unblock" : "Block"}</span>
        </button>
      </div>
      <hr className="my-2 border-gray-500" />
      {/* Sent Images */}
      <div>
        <div className="flex flex-row">
          <p className="text-white font-bold mb-2 text-left">Media:</p>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3">
          {images.length > 0 ? (
            images.map((img, idx) => (
              <img key={idx} src={img} alt={`Sent image ${idx}`} className="w-full h-auto rounded-lg" />
            ))
          ) : (
            <p className="text-white text-center">No media available</p>
          )}
        </div>
      </div>
      {/* Privacy & Help Button */}
      <button className="h-[40px] mt-6 w-full bg-gray-600 text-white hover:bg-black rounded-md">Privacy & Help</button>
    </div>
  );
}