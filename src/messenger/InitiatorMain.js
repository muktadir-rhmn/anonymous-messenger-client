import React from 'react';

import './style.css';
import MessageListHeader from './MessageListHeader';
import MessageList from './MessageList';
import MessageSender from './MessageSender';

class InitiatorMain extends React.Component {
    render() {
        return (
            <div id="initiator-main" className="row">
                <div className="vh-100">
                    <MessageListHeader/>
                    <MessageList/>
                    <MessageSender/>
                </div>
            </div>
        );
    }
}

export default InitiatorMain;