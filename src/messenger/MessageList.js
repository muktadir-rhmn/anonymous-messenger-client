import React from 'react';
import './style.css';
import ReceivedMessage from './ReceivedMessage';
import SentMessage from './SentMessage';
import requester from '../library/requester';
import eventManager from '../library/eventManager';

class MessageList extends React.Component {
    constructor(props) {
        super(props);

        this.sentRequest = false;

        this.state = {messages: []};

        this.handleNewMessage = this.handleNewMessage.bind(this);
        eventManager.addEventListener(eventManager.eventTypes.NEW_MESSAGE, this.handleNewMessage);
    }

    render() {
        console.log("rendering MessageList. props:", this.props);
        
        if(!this.sentRequest) this.fetchMessages();
        else this.sentRequest = false;

        const messagesUIs = [];
        for(let i = 0; i < this.state.messages.length; i++) {
            const message = this.state.messages[i];
            
            let messageUI = this.getMessageUI(message);
            messagesUIs.push(messageUI);
        }
        return (
            <div id="messageList" >
                {messagesUIs}
            </div>
        );
    }

    fetchMessages() {
        console.log("fetching messages of threadID", this.props.threadID);
        if(this.props.threadID === null) return;

        this.sentRequest = true;
        const path = `/threads/${this.props.threadID}`;
        requester.GET(path, {}).then(
            (response) =>  {
                this.setState({messages: response.messages});
            }, 
            (error) => {
                console.error("Error fetching messages");
            }
        )
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
        else if(messageType === MESSAGE_TYPE_RECEIVED) messageUI = <ReceivedMessage key={message.id} id={message.id} status={message.status} text={message.text} sentAt={message.seenAt} />
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
        for(let i = 0; i < messages.length; i++) {
            if(messages[i].threadID !== this.props.threadID) continue;
            this.state.messages.push(messages[i]);
        }
        this.setState({});
    }
}

export default MessageList;