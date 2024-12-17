import React, { useState } from "react";
import avatar2 from "../assets/avatar2.jpg";
import avatar from '../assets/avatar.jpg'
import addgrp from "../assets/addgroup.png";
import mute from "../assets/mute.png";
import block from "../assets/block.png";
import photo1 from "../assets/photo1.jpg";
import photo2 from "../assets/photo2.webp";
import photo3 from "../assets/photo3.jpg";
import photo4 from "../assets/photo4.jpg";
import pdf from "../assets/pdf.png";
import docx from "../assets/docx.png";
import download from "../assets/download.png";
import { Chatstore } from "../ChatStore";
import { Userstore } from "../usestore";
import { doc, getDoc, setDoc, arrayRemove, arrayUnion, updateDoc } from "firebase/firestore";
import { db } from "../db"; // Ensure your Firestore config is correctly imported

export default function Detail() {
  const { chatId, user, isCurrentUserBlocked, isRecieverBlocked, changeBlock } = Chatstore();
  const { currentUser } = Userstore();
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
      <div className="flex flex-col items-center">
        <img
          src={user?.avatar || avatar}
          height={50}
          width={50}
          className="rounded-full"
          alt="User Avatar"
        />
        <div className="text-center mt-2">
          <p className="font-bold text-white">{user?.name || "User"}</p>
        </div>
      </div>
      <div className="flex justify-center space-x-4 mt-4">
        <img
          src={addgrp}
          height={40}
          width={60}
          className="hover:bg-gray-700 p-2 cursor-pointer rounded-full"
          alt="Add to Group"
        />
        <img
          src={mute}
          height={40}
          width={60}
          className="hover:bg-gray-700 p-2 cursor-pointer rounded-full"
          alt="Mute"
        />
        <button onClick={handleBlock} className="flex items-center space-x-2">
          <img
            src={block}
            height={40}
            width={60}
            className={`hover:${isRecieverBlocked ? "bg-red-700" : "bg-gray-700"} p-2 cursor-pointer rounded-full`}
            alt="Block"
          />
          <span className="text-white">
            {isCurrentUserBlocked
              ? "You are Blocked!"
              : isRecieverBlocked
                ? "Unblock"
                : "Block"}
          </span>
        </button>
      </div>
      <hr className="my-2 border-gray-500" />
      <div>
        <div className="flex flex-row">
          <p className="text-white font-bold mb-2 text-left">Media:</p>
          {/* <p className="text-blue-400 text-[14px] ml-[135px] hover:text-blue-700 cursor-pointer">Show All</p> */}
        </div>
        {/* <div className="grid grid-cols-2 gap-2">
          {[photo1, photo2, photo3, photo4].map((photo, idx) => (
            <div
              key={idx}
              className="relative group h-[80px] w-[100px] rounded-md overflow-hidden">
              <img src={photo} className="h-full w-full object-cover" alt={`Media ${idx + 1}`} />
              <a
                href={photo}
                download
                className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <img src={download} alt="Download" className="h-6 w-6" />
              </a>
            </div>
          ))}
        </div> */}
      </div>
      <div className="mt-3">
        <div className="flex flex-row">
          <p className="text-white font-bold mb-2 text-left">Files:</p>
          {/* <p className="text-blue-400 text-[15px] ml-[142px] cursor-pointer hover:text-blue-700">Show All</p> */}
        </div>
        {/* <div className="space-y-2 flex flex-row">
          {[{ icon: pdf, name: "File1" }, { icon: docx, name: "File2" }].map((file, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <img src={file.icon} className="h-8 w-8" alt={`${file.name} Icon`} />
              <p className="text-white">{file.name}</p>
              <a
                href={download}
                download
                className="hover:bg-gray-700 p-2 rounded-md">
                <img src={download} className="h-6 w-6" alt="Download" />
              </a>
            </div>
          ))}
        </div> */}
      </div>
      <button className="h-[40px] mt-6 w-full bg-gray-600 text-white hover:bg-black rounded-md">
        Privacy & Help
      </button>
    </div>
  );
}
