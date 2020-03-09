import React from 'react';
import './style.css';

class SentMessage extends React.Component {
    render() {
        return (
            <div className="sent-message">
                <div className="message-body">
                    {this.props.text}
                </div>
                <small>Seen at <b>{this.props.seenAt}</b></small>
            </div>
        );
    }
}

export default SentMessage;