import React from 'react'
import List from '../components/list'
import Detail from '../components/detail'
import Chatbox from '../components/Chatbox'
import { Chatstore } from '../ChatStore'

export default function Chat() {
  const {chatId}= Chatstore()
  return (
    <div className=' flex flex-row'>
      <List/>
      {chatId &&< Chatbox/>}
      {chatId &&<Detail/>}
    </div>
  )
}
