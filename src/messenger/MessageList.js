import React from 'react';
import './style.css';
import ReceivedMessage from './ReceivedMessage';
import SentMessage from './SentMessage';
import eventManager from '../library/eventManager';

class MessageList extends React.Component {
    constructor(props) {
        super(props);

        this.handleNewMessage = this.handleNewMessage.bind(this);
        eventManager.addEventListener(eventManager.eventTypes.NEW_MESSAGE, this.handleNewMessage);
    }

    render() {
        console.log("rendering MessageList. props:", this.props);

        const messagesUIs = [];
        for(let i = 0; i < this.props.messages.length; i++) {
            const message = this.props.messages[i];
            
            let messageUI = this.getMessageUI(message);
            messagesUIs.push(messageUI);
        }
        return (
            <div id="messageList" >
                {messagesUIs}
            </div>
        );
    }

    

    getMessageUI(message){
        let messageType;
        const SIGNED_IN_USER = 0;
        const INITIATOR = 1;
        const MESSAGE_TYPE_SENT = 0;
        const MESSAGE_TYPE_RECEIVED = 1;
        if(this.props.messageListType === "SIGNED_IN_USER"){
            if(message.sender === SIGNED_IN_USER) messageType = MESSAGE_TYPE_SENT;
            else if(message.sender === INITIATOR) messageType = MESSAGE_TYPE_RECEIVED
            else console.error("wrong sender", message);
        } else if(this.props.messageListType === "INITIATOR"){
            if(message.sender === SIGNED_IN_USER) messageType = MESSAGE_TYPE_RECEIVED 
            else if(message.sender === INITIATOR) messageType = MESSAGE_TYPE_SENT;
            else console.error("wrong sender", message);
        } else {
            console.error("Wrong messageListType attribute:", this.props.messageListType)
        }

        let messageUI;
        if(messageType === MESSAGE_TYPE_SENT) messageUI = <SentMessage key={message.id} id={message.id} status={message.status} text={message.text} seenAt={message.seenAt} sentAt={message.sentAt}/>
        else if(messageType === MESSAGE_TYPE_RECEIVED) messageUI = <ReceivedMessage key={message.id} id={message.id} status={message.status} text={message.text} sentAt={message.sentAt} />
        return messageUI;
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.scrollToBottom();
    }

    scrollToBottom() {
        const msgViewer = document.getElementById("messageList");
        msgViewer.scrollTop = msgViewer.scrollHeight;
    }
    
    handleNewMessage(eventData) {
        const messages = eventData.messages;
        console.log("new messages:", messages);
        if(messages.length > 0) eventManager.setLastMessageID(messages[messages.length - 1].id);
        for(let i = 0; i < messages.length; i++) {
            if(messages[i].threadID !== this.props.threadID) continue;
            this.props.messages.push(messages[i]);
        }
        this.setState({});
    }
}

export default MessageList;