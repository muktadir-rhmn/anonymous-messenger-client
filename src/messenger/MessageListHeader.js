import React from 'react';
import './style.css';

class MessageViewerHeader extends React.Component {
    render() {
        return (
            <div>
                <h1>{this.props.threadName}</h1>
            </div>
        );
    }
}

export default MessageViewerHeader;