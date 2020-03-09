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
        this.state = {threadIDOfMessageList: null};

        this.loadThreadIntoMessageViewer = this.loadThreadIntoMessageViewer.bind(this);
    }

    render() {
        return (
            <div id="messenger-main" className="row">
                <div className="col-md-3">
                    <div className="vh-100">
                        <h1>Muktadir</h1>
                        <p id="newThreadURL">http://test.com/muktadir <IoIosCopy/></p>
                        <ThreadList loadThreadIntoMessageViewer={this.loadThreadIntoMessageViewer}/>
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="vh-100">
                        <MessageListHeader/>
                        <MessageList threadID={this.state.threadIDOfMessageList} messageListType="SIGNED_IN_USER"/>
                        <MessageSender/>
                    </div>
                </div>
            </div>
        );
    }

    loadThreadIntoMessageViewer(threadID) {
        this.setState({threadIDOfMessageList: threadID});
    }
}

export default Main;