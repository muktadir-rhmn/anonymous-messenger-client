import React from 'react';
import { Link } from 'react-router-dom';

import requester from '../library/requester';
import eventManager from '../library/eventManager';

import './style.css';
import MessageList from './messageViewer/MessageList';
import MessageSender from './messageViewer/MessageSender';

class InitiatorMain extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: [],
        };

        this.handleNewMessage = this.handleNewMessage.bind(this);
        this.handleMessageSeen = this.handleMessageSeen.bind(this);
        eventManager.addEventListener(eventManager.eventTypes.NEW_MESSAGE, this.handleNewMessage);
        eventManager.addEventListener(eventManager.eventTypes.MESSAGE_SEEN, this.handleMessageSeen);

        this.threadID = window.localStorage.getItem("threadID");
        if(this.threadID == null) this.isSignedIn = false;
        else this.isSignedIn = true;
        this.threadID = parseInt(this.threadID);

        const path = `/threads/${this.threadID}`;
        requester.GET(path, {}).then(
            (response) =>  {
                if(response.messages.length > 0){
                    const lastMessage = response.messages[response.messages.length - 1];
                    eventManager.setLastMessageID(lastMessage.id);

                    if(this.isReceivedAndUnseen(lastMessage)) this.markAsSeen(this.threadID, lastMessage.id);
                    if(this.isSignedIn) eventManager.startPulling();
                }
                this.setState({
                    messages: response.messages
                });
            }, 
            (error) => {
                console.error("Error fetching messages");
            }
        )
    }
    render() {
        if(!this.isSignedIn) return <h1>Please <Link to="/initator/signin">Signin</Link></h1>
        return (
            <div id="initiator-main" >
                <div className="vh-100">
                    <MessageList threadID={this.threadID} messages={this.state.messages} messageListType="INITIATOR"/>
                    <MessageSender currentThreadID={this.threadID} userType="INITIATOR"/>
                </div>
            </div>
        )
    }

    markAsSeen(threadID, messageID){ //todo: unify with main
        const seeMessagePath = `/threads/${threadID}/messages/${messageID}/see-message`;
        requester.POST(seeMessagePath, {});
    }

    isReceivedAndUnseen(message) {
        const SIGNED_IN_USER = 0;
        const INITIATOR = 1;
        if(message.sender === SIGNED_IN_USER) {
            if(message.status === "unseen") return true;
            else return false;
        } else {
            return false;
        }
    }

    handleNewMessage(eventData) {
        const messages = eventData.messages;
        console.log("new messages:", messages);

        const currentThreadID = parseInt(this.threadID);

        const lastMessage = messages[messages.length - 1];
        if(messages.length > 0) eventManager.setLastMessageID(lastMessage.id);
        if(this.isReceivedAndUnseen(lastMessage)) this.markAsSeen(currentThreadID, lastMessage.id);

        
        for(let i = 0; i < messages.length; i++) {
            console.log(messages[i].threadID, currentThreadID);
            if(messages[i].threadID !== currentThreadID) continue;
            this.state.messages.push(messages[i]);
        }
        console.log("initiator state", this.state);
        this.setState({});
    }

    handleMessageSeen(eventData) {
        console.log("hanldeMessageSeen()");
        if(this.threadID !== eventData.threadID) return;
        const lastMessageID = eventData.lastMessageID;

        const currentMessages = this.state.messages;
        for(let i = currentMessages.length - 1; i >= 0; i--) {
            if(currentMessages[i].status === "seen") break;
            if(currentMessages[i].id <= lastMessageID) {
                currentMessages[i].status = "seen";
                currentMessages[i].seenAt = eventData.seenAt;
            }
        }

        this.setState({});
    }
}

export default InitiatorMain;