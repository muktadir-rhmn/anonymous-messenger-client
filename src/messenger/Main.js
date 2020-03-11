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
            currentThreadID: null, 
            currentThreadName: "", 
            messages: [], 
            threads: [],
        };

        this.userName = window.localStorage.getItem("userName");
        this.userID = window.localStorage.getItem("userID");
        this.initiationURL = `http://localhost:3000.com/initiate/${this.userID}`;

        if(this.userName == null) this.isSignedIn = false;
        else this.isSignedIn = true;

        this.loadThreadIntoMessageViewer = this.loadThreadIntoMessageViewer.bind(this);
        this.handleNewMessage = this.handleNewMessage.bind(this);
        eventManager.addEventListener(eventManager.eventTypes.NEW_MESSAGE, this.handleNewMessage);

        requester.GET("/threads").then(
            (response) => {
                const latestThread = response.threads[0];
                this.loadThreadIntoMessageViewer(latestThread.id, latestThread.name);
                this.setState({
                    threads: response.threads,
                })
            },
            (error) => {
                console.error("Error");
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
                        <ThreadList currentThreadID={this.state.currentThreadID} threads={this.state.threads} loadThreadIntoMessageViewer={this.loadThreadIntoMessageViewer}/>
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="vh-100">
                        <MessageListHeader threadName={this.state.currentThreadName}/>
                        <MessageList threadID={this.state.currentThreadID} messages={this.state.messages} messageListType="SIGNED_IN_USER"/>
                        <MessageSender currentThreadID={this.state.currentThreadID} />
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        if(this.isSignedIn) eventManager.startPulling();
    }

    fetchMessages(threadID, threadName) {
        console.log("fetching messages of threadID", threadID);
        if(threadID === null) return;

        const path = `/threads/${threadID}`;
        requester.GET(path, {}).then(
            (response) =>  {
                if(response.messages.length > 0){
                    eventManager.setLastMessageID(response.messages[response.messages.length - 1].id);
                }
                this.setState({
                    currentThreadID: threadID, 
                    currentThreadName: threadName,
                    messages: response.messages
                });
            }, 
            (error) => {
                console.error("Error fetching messages");
            }
        )
    }

    loadThreadIntoMessageViewer(threadID, threadName) {
        this.fetchMessages(threadID, threadName);
    }
    
    handleNewMessage(eventData) {
        const messages = eventData.messages;
        console.log("new messages:", messages);
        if(messages.length > 0) eventManager.setLastMessageID(messages[messages.length - 1].id);
        for(let i = 0; i < messages.length; i++) {
            if(messages[i].threadID !== this.state.currentThreadID) continue;
            this.state.messages.push(messages[i]);
        }
        this.setState({});
    }
}

export default Main;