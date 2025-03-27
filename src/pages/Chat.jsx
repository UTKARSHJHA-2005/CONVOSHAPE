// This is the chat page where user chats with other user.
import React from 'react'
// Componenets 
import List from '../components/List'
import Detail from '../components/detail'
import Chatbox from '../components/Chatbox'
import { Chatstore } from '../ChatStore' // Chat Zustand Management

export default function Chat() {
  const {chatId}= Chatstore() // Chat Management
  return (
    <div className=' flex flex-row'>
      <List/>
      {chatId &&< Chatbox/>}
      {chatId &&<Detail/>}
    </div>
  )
}
