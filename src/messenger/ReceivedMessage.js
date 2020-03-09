import React from 'react';
import './style.css';

class ReceivedMessage extends React.Component {
    render() {
        return (
            <div className="received-message">
                <div className="message-body">
                    {this.props.text}
                </div>
                <small>Sent At <b>{this.props.sentAt}</b></small>
            </div>
        );
    }
}

export default ReceivedMessage;