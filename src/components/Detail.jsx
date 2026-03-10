// This is the right component of chat page in which the details of chat is given.
import React, { useState, useEffect } from "react";
// Images
import avatar from '../assets/avatar.jpg';
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
            ?.filter((msg) => msg.image) // check image url
            .map((msg) => msg.image);   // get image url

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
      <hr className="my-2 border-gray-500" />
      {/* Sent Images */}
      <div className="mt-4 w-full">

        <div className="flex justify-between items-center mb-2">
          <p className="text-white font-semibold text-left">Media</p>
          <span className="text-gray-400 text-sm">{images.length}</span>
        </div>

        <div className="max-h-[220px] overflow-y-auto pr-1">

          {images.length > 0 ? (

            <div className="grid grid-cols-3 gap-2">

              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative group overflow-hidden rounded-lg"
                >

                  <img
                    src={img}
                    alt="media"
                    className="w-full h-[80px] object-cover cursor-pointer transition-transform duration-300 group-hover:scale-110"
                  />

                </div>
              ))}

            </div>

          ) : (
            <p className="text-gray-400 text-sm text-center mt-4">
              No media shared
            </p>
          )}

        </div>

      </div>
    </div>
  );
}