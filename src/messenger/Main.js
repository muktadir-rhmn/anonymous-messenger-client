import React from 'react';
import { IoIosCopy } from "react-icons/io";

import requester from '../library/requester';
import eventManager from '../library/eventManager';

import './style.css';
import ThreadList from './threadLister/ThreadList';
import MessageListHeader from './messageViewer/MessageListHeader';
import MessageList from './messageViewer/MessageList';
import MessageSender from './messageViewer/MessageSender';
import { Link } from 'react-router-dom';

class Main extends React.Component {
    constructor(props) {
        super(props);

        //currentThread = the thread shown in the messageViewer
        this.state = {
            currentThread: {
                id: null,
                name: "",
                messages: [],
            },
            threads: [],
        };

        this.userName = window.sessionStorage.getItem("userName");
        this.userID = window.sessionStorage.getItem("userID");
        this.initiationURL = `http://localhost.com:3000/initiate/${this.userID}`;

        if(this.userName == null) {
            this.isSignedIn = false;
            return;
        } else {
            this.isSignedIn = true;
        }

        this.loadThreadIntoMessageViewer = this.loadThreadIntoMessageViewer.bind(this);
        this.handleNewMessage = this.handleNewMessage.bind(this);
        this.handleMessageSeen = this.handleMessageSeen.bind(this);
        eventManager.addEventListener(eventManager.eventTypes.NEW_MESSAGE, this.handleNewMessage);
        eventManager.addEventListener(eventManager.eventTypes.MESSAGE_SEEN, this.handleMessageSeen);

        requester.GET("/threads").then(
            (response) => {
                const latestThread = response.threads[0];
                this.loadThreadIntoMessageViewer(latestThread.id, latestThread.name);
                this.setState({
                    threads: response.threads,
                })
            },
            (error) => {
                console.error("Error fetching thread list");
            }
        )
    }

    render() {
        if(!this.isSignedIn) return <h1>Please <Link to="/signin">Sign in</Link></h1>

        return (
            <div id="messenger-main" className="row">
                <div className="col-md-3">
                    <div className="vh-100">
                        <h1>{this.userName}</h1>
                        <p id="newThreadURL"> <a href={this.initiationURL}>{this.initiationURL}</a> <IoIosCopy/></p>
                        <ThreadList currentThreadID={this.state.currentThread.id} threads={this.state.threads} loadThreadIntoMessageViewer={this.loadThreadIntoMessageViewer}/>
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="vh-100">
                        <MessageListHeader threadName={this.state.currentThread.name}/>
                        <MessageList threadID={this.state.currentThread.id} messages={this.state.currentThread.messages} messageListType="SIGNED_IN_USER"/>
                        <MessageSender currentThreadID={this.state.currentThread.id} userType="SIGNED_IN"/>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
    }

    fetchMessages(threadID, threadName) {
        console.log("fetching messages of threadID", threadID);
        if(threadID === null) return;

        const getMessagePath = `/threads/${threadID}`;
        requester.GET(getMessagePath, {}).then(
            (response) =>  {
                if(response.messages.length > 0){
                    const lastMessage = response.messages[response.messages.length - 1];
                    eventManager.setLastMessageID(lastMessage.id);

                    if(this.isReceivedAndUnseen(lastMessage)) this.markAsSeen(threadID, lastMessage.id);
                    if(this.isSignedIn) eventManager.startPulling();
                }
                this.setState({
                    currentThread: {
                        id: threadID,
                        name: threadName,
                        messages: response.messages,
                    },
                });
            }, 
            (error) => {
                console.error("Error fetching messages");
            }
        )
    }

    markAsSeen(threadID, messageID){
        const seeMessagePath = `/threads/${threadID}/messages/${messageID}/see-message`;
        requester.POST(seeMessagePath, {});
    }

    isReceivedAndUnseen(message) {
        const SIGNED_IN_USER = 0;
        const INITIATOR = 1;
        if(message.sender === INITIATOR) {
            if(message.status === "unseen") return true;
            else return false;
        } else {
            return false;
        }
    }

    loadThreadIntoMessageViewer(threadID, threadName) {
        this.fetchMessages(threadID, threadName);
    }
    
    handleNewMessage(eventData) {
        const messages = eventData.messages;
        console.log("new messages:", messages);

        const lastMessage = messages[messages.length - 1];
        if(messages.length > 0) eventManager.setLastMessageID(lastMessage.id);
        if(this.isReceivedAndUnseen(lastMessage)) this.markAsSeen(this.state.currentThread.id, lastMessage.id);

        for(let i = 0; i < messages.length; i++) {
            if(messages[i].threadID !== this.state.currentThread.id) continue;
            this.state.currentThread.messages.push(messages[i]);
        }
        this.setState({});
    }

    handleMessageSeen(eventData) {
        if(this.state.currentThread.id !== eventData.threadID) return;
        const lastMessageID = eventData.lastMessageID;

        const currentMessages = this.state.currentThread.messages;
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

export default Main;