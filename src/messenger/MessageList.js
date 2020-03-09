import React from 'react';
import './style.css';
import ReceivedMessage from './ReceivedMessage';
import SentMessage from './SentMessage';
import requester from '../library/requester';

class MessageList extends React.Component {
    constructor(props) {
        super(props);

        this.sentRequest = false;

        this.state = {messages: []};
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
                <ReceivedMessage text="first Message" sentAt="5pm"/>
                <SentMessage text="first Message" seenAt="5pm"/>
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
        let messageUI;
        const SIGNED_IN_USER = 0;
        const INITIATOR = 1;
        if(this.props.messageListType === "SIGNED_IN_USER"){
            if(message.sender === SIGNED_IN_USER) messageUI = <SentMessage id={message.id} text={message.text} sentAt={message.seenAt} />
            else if(message.sender === INITIATOR) messageUI = <ReceivedMessage id={message.id} text={message.text} seenAt={message.sentAt} />
            else console.error("wrong sender", message);
        } else if(this.props.messageListType === "INITIATOR"){
            if(message.sender === SIGNED_IN_USER) messageUI = <ReceivedMessage id={message.id} text={message.text} sentAt={message.seenAt} />
            else if(message.sender === INITIATOR) messageUI = <SentMessage id={message.id} text={message.text} seenAt={message.sentAt} />
            else console.error("wrong sender", message);
        } else {
            console.error("Wrong messageListType attribute:", this.props.messageListType)
        }
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
    
}

export default MessageList;