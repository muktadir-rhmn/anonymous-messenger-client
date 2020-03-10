import React from 'react';
import '../style.css';

class SentMessage extends React.Component {
    render() {
        let seenAtUI;
        if(this.props.status === "unseen") seenAtUI = "";
        else if(this.props.status === "delivered") seenAtUI = <b>Delivered</b>
        else if(this.props.status === "seen") seenAtUI = <small>Seen at <b>{this.props.seenAt}</b></small>

        return (
            <div className="sent-message">
                <div className="message-body" title={this.props.sentAt}>
                    {this.props.text}
                </div>
                {seenAtUI}
            </div>
        );
    }
}

export default SentMessage;