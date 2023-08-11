import React from 'react'
import { auth } from './Firebase'
import { ChatEngine } from 'react-chat-engine'
import { useSelector } from 'react-redux'

export default function ChatView() {
    const roleFromRedux = useSelector((state) => state.role)
    const CHAT_PUBLIC_KEY = process.env.REACT_APP_CHATENGINE_CHAT_PUBLIC_KEY;
    const GLOBAL_USER_SECRET = process.env.REACT_APP_CHATENGINE_GLOBAL_USER_SECRET;

    if (auth.currentUser != null && roleFromRedux != "") {
        const user = auth.currentUser.email

        return (
            <ChatEngine
                publicKey={CHAT_PUBLIC_KEY}
                userName={user}
                userSecret={GLOBAL_USER_SECRET}
                height='85vh'
            />
        )
    } else {
        return (<p>Did not found user data, try to refresh page</p>)
    }
}







