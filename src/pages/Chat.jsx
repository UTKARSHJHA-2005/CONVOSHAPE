import React from 'react'
import List from '../components/List'
import Detail from '../components/Detail'
import Chatbox from '../components/Chatbox'
import { Chatstore } from '../ChatStore'

export default function Chat() {

  const { chatId } = Chatstore()

  return (

    <div className="flex flex-col lg:flex-row gap-3 p-2 min-h-screen">

      {/* Left Panel */}
      <div className="w-full lg:w-[25%]">
        <List />
      </div>

      {/* Middle Panel */}
      <div className="w-full lg:flex-1">
        {chatId && <Chatbox />}
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-[25%]">
        {chatId && <Detail />}
      </div>

    </div>

  )
}