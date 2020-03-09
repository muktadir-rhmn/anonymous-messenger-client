import React from 'react';
import './style.css';

class MessageSender extends React.Component {
    constructor(props) {
        super(props);

        // event handler binding
        this.keyDownHandler = this.keyDownHandler.bind(this);
    }

    render() {
        return (
            <div>
                <textarea id="msgToSend" onKeyDown={this.keyDownHandler} className="form-control" rows="2"></textarea>
            </div>
        );
    }

    keyDownHandler(event) {
        if(event.key !== "Enter") return;

        event.preventDefault(); //to prevent showing enter in the textArea

        const textArea = event.target;
        const message = textArea.value;
        textArea.value = "";

        this.sendMessage(message);
    }

    sendMessage(message) {
        console.log(message);
        
    }
}

export default MessageSender;