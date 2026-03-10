// This is the middle component of chat page. 
import React, { useEffect, useRef, useState } from "react";
// Images
import avatar from '../assets/avatar.jpg';
import emojiIcon from "../assets/emoji.png";
import addimg from "../assets/addimg.png";
import { db } from "../db"; // Firebase Database
import { Userstore } from "../usestore"; // Userstore
import { Chatstore } from "../ChatStore"; // Chatstore
import EmojiPicker from "emoji-picker-react"; // Emojis
import { arrayUnion, onSnapshot, doc, updateDoc } from "firebase/firestore"; // Firebase Firestore

export default function Chatbox() {
  const [text, setText] = useState(""); // Text input state
  const { chatId, user, isCurrentUserBlocked, isRecieverBlocked, changeBlock } = Chatstore() // Chat Management
  const [open, setOpen] = useState(false); // Emoji Picker state
  const { currentUser } = Userstore(); // Current User
  const [Chat, setChat] = useState(); // Chat state
  const endRef = useRef(null); // Scrolling
  const [image, setImage] = useState(null); // Image state
  // Smooth scrolling to the end of the chat
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [Chat]);
  // Fetch chat details
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });
    return () => unsub();
  }, [chatId]);
  const uploadImage = async (file) => {

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "chat_app");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dhszvdzft/image/upload",
      {
        method: "POST",
        body: data,
      }
    );
    const result = await res.json();
    console.log(result);

    return result.secure_url;
  };
  // Handle sending a message
  const handleSend = async () => {
    if (!text.trim() && !image) return;

    let imageUrl = null;

    try {

      if (image) {
        imageUrl = await uploadImage(image);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text: text || "",
          image: imageUrl || null,
          createdAt: new Date(),
        }),
      });

      setText("");
      setImage(null);

    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };
  // Handle emoji selection
  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
  };

  return (
    <div className="h-[600px] chatbox shadow-lg mt-[30px] text-center bg-gray-800 bg-opacity-90 rounded-xl p-6 border border-gray-500 flex flex-col">
      {/* Chat Header */}
      <div className="flex flex-row items-center justify-between mb-4">
        <img src={user?.avatar || avatar} height={30} width={50} className="rounded-full" alt="Sia Bhatia" />
        <div>
          <p className="font-bold text-white">{user?.name || "User"}</p>
          <p className="text-sm text-green-400">Hii, I am using Convo</p>
        </div>
        <div className="flex flex-row space-x-4">
        </div>
      </div>
      <hr className="border-gray-500" />
      {/* Chat Area */}
      <div className="chat-area flex-grow overflow-y-auto p-4 rounded-lg shadow-lg scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-800">
        <div className="messages">
          {Chat?.messages?.map((message, idx) => (
            <div key={idx} className={`w-[100%] mb-2 flex ${message.senderId === currentUser.id
              ? "flex-row-reverse text-right"
              : "flex-row text-left"
              }`}>
              <div className="message-bubble max-w-[70%]">
                {message.text && (
                  <p className={`p-3 rounded-lg ${message.senderId === currentUser.id
                    ? "bg-blue-600 mt-2 text-white"
                    : "bg-gray-600 text-white mt-2"
                    }`}>
                    {message.text}
                  </p>
                )}
                {message.image && (
                  <img
                    src={message.image}
                    alt="Sent"
                    className={`w-auto cursor-pointer h-auto max-w-[200px] mt-2 rounded-lg ${message.senderId === currentUser.id ? "float-right" : "float-left"
                      }`}
                  />
                )}
              </div>
            </div>
          ))}
          <div ref={endRef}></div>
        </div>
      </div>
      {/* Input Area */}
      <div className="input-area mt-4 flex flex-col space-y-2">
        {image && (
          <img
            src={URL.createObjectURL(image)}
            className="max-w-[200px] rounded"
          />
        )}
        {/* Add Image,mic,text,emoji Button */}
        <div className="flex items-center space-x-2">
          <input type="file" onChange={handleImageChange} className="hidden" id="image-upload" />
          <label htmlFor="image-upload">
            <img src={addimg} height={30} width={30} className="cursor-pointer" alt="Add Image" />
          </label>
          <input type="text" value={text} onChange={(e) => setText(e.target.value)}
            className="bg-gray-800 h-[40px] flex-grow rounded-lg focus:outline-none text-white px-4" placeholder="Type a message..."
            disabled={isCurrentUserBlocked || isRecieverBlocked} />
          <div className="relative">
            <img src={emojiIcon} height={30} width={30} className="cursor-pointer" alt="Emoji" onClick={() => setOpen((prev) => !prev)} />
            {open && (
              <div className="absolute bottom-10 right-0 z-50">
                <EmojiPicker onEmojiClick={handleEmoji} />
              </div>
            )}
          </div>
          {/* Send Button */}
          <button onClick={handleSend}
            className="bg-blue-500 text-white h-[40px] px-4 rounded-lg hover:bg-blue-600" disabled={isCurrentUserBlocked || isRecieverBlocked}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}