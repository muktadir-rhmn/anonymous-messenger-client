import React from 'react';
import { IoIosCopy } from "react-icons/io";

import './style.css';
import ThreadList from './ThreadList';
import MessageListHeader from './MessageListHeader';
import MessageList from './MessageList';
import MessageSender from './MessageSender';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {currentThreadID: null, currentThreadName: ""};

        this.userName = window.localStorage.getItem("userName");
        this.userID = window.localStorage.getItem("userID");
        this.initiationURL = `http://localhost:3000.com/initiate/${this.userID}`;

        this.loadThreadIntoMessageViewer = this.loadThreadIntoMessageViewer.bind(this);
    }

    render() {
        return (
            <div id="messenger-main" className="row">
                <div className="col-md-3">
                    <div className="vh-100">
                        <h1>{this.userName}</h1>
                        <p id="newThreadURL"> <a href={this.initiationURL}>{this.initiationURL}</a> <IoIosCopy/></p>
                        <ThreadList loadThreadIntoMessageViewer={this.loadThreadIntoMessageViewer}/>
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="vh-100">
                        <MessageListHeader threadName={this.state.currentThreadName}/>
                        <MessageList threadID={this.state.currentThreadID} messageListType="SIGNED_IN_USER"/>
                        <MessageSender/>
                    </div>
                </div>
            </div>
        );
    }

    loadThreadIntoMessageViewer(threadID, threadName) {
        this.setState({currentThreadID: threadID, currentThreadName: threadName});
    }
}

export default Main;