import React from 'react';
import { IoIosCopy } from "react-icons/io";

import './style.css';
import ThreadList from './ThreadList';
import MessageListHeader from './MessageListHeader';
import MessageList from './MessageList';
import requester from '../library/requester';
import eventManager from '../library/eventManager';
import MessageSender from './MessageSender';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {currentThreadID: null, currentThreadName: "", messages: [], threads: []};

        this.userName = window.localStorage.getItem("userName");
        this.userID = window.localStorage.getItem("userID");
        this.initiationURL = `http://localhost:3000.com/initiate/${this.userID}`;

        this.loadThreadIntoMessageViewer = this.loadThreadIntoMessageViewer.bind(this);

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
}

export default Main;