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
        eventManager.addEventListener(eventManager.eventTypes.NEW_MESSAGE, this.handleNewMessage);

        this.threadID = window.localStorage.getItem("threadID");
        if(this.threadID == null) this.isSignedIn = false;
        else this.isSignedIn = true;

        const path = `/threads/${this.threadID}`;
        requester.GET(path, {}).then(
            (response) =>  {
                if(response.messages.length > 0){
                    eventManager.setLastMessageID(response.messages[response.messages.length - 1].id);
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
                    <MessageSender currentThreadID={this.threadID} />
                </div>
            </div>
        )
    }

    componentDidMount() {
        if(this.isSignedIn) eventManager.startPulling();
    }

    handleNewMessage(eventData) {
        const messages = eventData.messages;
        console.log("new messages:", messages);
        if(messages.length > 0) eventManager.setLastMessageID(messages[messages.length - 1].id);
        const currentThreadID = parseInt(this.props.threadID);
        for(let i = 0; i < messages.length; i++) {
            if(messages[i].threadID !== currentThreadID) continue;
            this.state.messages.push(messages[i]);
        }
        this.setState({});
    }
}

export default InitiatorMain;