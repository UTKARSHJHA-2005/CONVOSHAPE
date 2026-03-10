// This is the middle component of chat page. 
import React, { useEffect, useRef, useState } from "react";
// Images
import avatar from '../assets/avatar.jpg';
import phone from "../assets/phone-call.png";
import video from "../assets/video.png";
import mic from "../assets/mic.png";
import emojiIcon from "../assets/emoji.png";
import addimg from "../assets/addimg.png";
import CallPage from "./CallPage";
import { db } from "../db"; // Firebase Database
import { Userstore } from "../usestore"; // Userstore
import { Chatstore } from "../ChatStore"; // Chatstore
import EmojiPicker from "emoji-picker-react"; // Emojis
import { arrayUnion, onSnapshot, doc, updateDoc } from "firebase/firestore"; // Firebase Firestore
// Google server for internet connection
const servers = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302"],
    },
  ],
};

export default function Chatbox() {
  const [text, setText] = useState(""); // Text input state
  const [imageBase64, setImageBase64] = useState(null);  // Image state
  const { chatId, user, isCurrentUserBlocked, isRecieverBlocked, changeBlock } = Chatstore() // Chat Management
  const [open, setOpen] = useState(false); // Emoji Picker state
  const { currentUser } = Userstore(); // Current User
  const [Chat, setChat] = useState(); // Chat state
  const endRef = useRef(null); // Scrolling
  const localVideoRef = useRef(null); // Video local
  const remoteVideoRef = useRef(null); // Video
  const pcRef = useRef(null);  // Laptop 
  const [callType, setCallType] = useState(null); // Call type
  const localStreamRef = useRef(null); // Streaming
  const ringtone = new Audio("/ringtone.mp3");

  const playRingtone = () => {
    ringtone.loop = true;
    ringtone.play();
  };

  const stopRingtone = () => {
    ringtone.pause();
    ringtone.currentTime = 0;
  };
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
  // Handle sending a message
  const handleSend = async () => {
    if (!text.trim() && !imageBase64) return;
    try {
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          imageBase64,
          createdAt: new Date(),
        }),
      });
      setText("");
      setImageBase64(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  // Call
  const startCall = async (type) => {
    await setDoc(doc(db, "calls", chatId), {
      callerId: currentUser.id,
      receiverId: user.id,
      type: type,
      status: "calling",
      createdAt: new Date(),
    });
  };
  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  // Accept Call
  const acceptCall = async () => {
    stopRingtone();
    await updateDoc(doc(db, "calls", chatId), {
      status: "accepted",
    });
    setCallType(incomingCall.type);
    setIncomingCall(null);
  };
  // Reject Call
  const rejectCall = async () => {
    stopRingtone();
    await updateDoc(doc(db, "calls", chatId), {
      status: "rejected",
    });
    setIncomingCall(null);
  };
  // Handle emoji selection
  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
  };
  // Incoming Calls
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "calls", chatId), (docSnap) => {
      const data = docSnap.data();

      if (
        data &&
        data.receiverId === currentUser.id &&
        data.status === "calling"
      ) {
        setIncomingCall(data);
        playRingtone();
      }
    });

    return () => unsub();
  }, [chatId]);
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "calls", chatId), (snap) => {
      const data = snap.data();

      if (data?.status === "accepted") {
        setCallType(data.type);
      }
    });

    return () => unsub();
  }, []);

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
          <img
            src={phone}
            height={40}
            width={40}
            className="cursor-pointer"
            title="Voice Call"
            alt="Phone Call"
            onClick={() => setCallType("voice")}
          />

          <img
            src={video}
            height={40}
            width={40}
            className="cursor-pointer"
            title="Video Call"
            alt="Video Call"
            onClick={() => setCallType("video")}
          />
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
                {message.imageBase64 && (
                  <img src={message.imageBase64} alt="Sent"
                    className={`w-auto cursor-pointer h-auto max-w-[200px] mt-2 rounded-lg ${message.senderId === currentUser.id ? "float-right" : "float-left"
                      }`} />
                )}
              </div>
            </div>
          ))}
          <div ref={endRef}></div>
        </div>
      </div>
      {/* Input Area */}
      <div className="input-area mt-4 flex flex-col space-y-2">
        {imageBase64 && (
          <div className="image-preview p-2 border border-gray-700 rounded-lg flex justify-between items-center">
            <img src={imageBase64} alt="Preview" className="max-w-[200px] max-h-[200px] rounded-lg" />
            <button onClick={() => setImageBase64(null)} className="text-red-500 font-bold">
              Cancel
            </button>
          </div>
        )}
        {/* Add Image,mic,text,emoji Button */}
        <div className="flex items-center space-x-2">
          <input type="file" onChange={handleImageChange} className="hidden" id="image-upload" />
          <label htmlFor="image-upload">
            <img src={addimg} height={30} width={30} className="cursor-pointer" alt="Add Image" />
          </label>
          <img src={mic} height={30} width={30} className="cursor-pointer" alt="Microphone" />
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
      {incomingCall && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg text-center">

            <p className="text-white text-lg mb-4">
              Incoming {incomingCall.type} call
            </p>

            <div className="flex space-x-4">

              <button
                onClick={acceptCall}
                className="bg-green-500 px-4 py-2 rounded"
              >
                Accept
              </button>

              <button
                onClick={rejectCall}
                className="bg-red-500 px-4 py-2 rounded"
              >
                Reject
              </button>

            </div>
          </div>
        </div>
      )}
      {callType && (
        <CallPage
          type={callType}
          onEnd={() => setCallType(null)}
        />
      )}
    </div>
  );
}