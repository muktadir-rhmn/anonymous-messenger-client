import React from 'react';
import { useParams } from 'react-router-dom';

import './style.css';
import MessageList from './MessageList';
import MessageSender from './MessageSender';

function InitiatorMain (props){
    let {threadID} = useParams();
    return (
        <div id="initiator-main" className="row">
            <div className="vh-100">
                <MessageList threadID={threadID} messageListType="INITIATOR"/>
                <MessageSender currentThreadID={threadID}/>
            </div>
        </div>
    );
}

export default InitiatorMain;