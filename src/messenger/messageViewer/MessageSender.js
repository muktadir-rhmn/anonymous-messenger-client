import React from 'react';

import requester from '../../library/requester';

import '../style.css';
import eventManager from '../../library/eventManager';

class MessageSender extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isSenderTyping: false,
        }

        this.sentTypingLittleAgo = false;

        this.handleTyping = this.handleTyping.bind(this);
        eventManager.addEventListener(eventManager.eventTypes.TYPING, this.handleTyping);
        // event handler binding
        this.keyDownHandler = this.keyDownHandler.bind(this);
    }

    render() {
        let typingUI = "";
        if(this.state.isSenderTyping === true) typingUI = <p className="typing">Sender Typing...</p>
        return (
            <div>
                {typingUI}
                <textarea id="msgToSend" onKeyDown={this.keyDownHandler} className="form-control" rows="2"></textarea>
            </div>
        );
    }

    keyDownHandler(event) {
        if(event.key === "Enter") {
            event.preventDefault(); //to prevent showing enter in the textArea

            const textArea = event.target;
            const message = textArea.value;
            textArea.value = "";

            this.sendMessage(message);
        } else {
            if(this.sentTypingLittleAgo) return;
            this.sentTypingLittleAgo = true;

            const typingPath = `/threads/${this.props.currentThreadID}/typing`;
            requester.POST(typingPath, {});

            setTimeout(()=> this.sentTypingLittleAgo = false, 5000);
        }
    }

    handleTyping(eventData) {
        if(eventData.typingUserType === this.props.userType) return;

        this.setState({isSenderTyping: true});
        setTimeout(() => this.setState({isSenderTyping: false}), 5000);
    }

    sendMessage(message) {
        console.log("Sending message:", message);

        const currentThreadID = this.props.currentThreadID;
        const path = `/threads/${currentThreadID}/new-message`;
        requester.POST(path, {text: message}).then(
            (response) => {
                console.log(response.message);
            }, 
            (error) => {
                console.error("Error sending message");
            }
        )
    }
}

export default MessageSender;