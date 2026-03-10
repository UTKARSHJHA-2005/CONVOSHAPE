import React from 'react'
import List from '../components/List'
import Detail from '../components/Detail'
import Chatbox from '../components/Chatbox'
import { Chatstore } from '../ChatStore'

export default function Chat() {

  const { chatId } = Chatstore()

  return (

    <div className="flex flex-col md:flex-row h-screen gap-3 p-2">

      {/* Left Panel */}
      <div className={`${chatId ? "hidden md:block" : "block"} md:w-[30%] lg:w-[25%]`}>
        <List />
      </div>

      {/* Middle Panel */}
      <div className={`${chatId ? "block" : "hidden md:block"} flex-1`}>
        {chatId && <Chatbox />}
      </div>

      {/* Right Panel */}
      <div className="hidden lg:block lg:w-[25%]">
        {chatId && <Detail />}
      </div>

    </div>

  )
}