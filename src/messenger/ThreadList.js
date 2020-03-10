import React from 'react';
import './style.css';
import Thread from './Thread';
import time from '../library/time';

class ThreadList extends React.Component {

    render() {
        const threadUIs = [];
        for(let i = 0; i < this.props.threads.length; i++) {
            const thread = this.props.threads[i];
            const threadUI = <Thread key={thread.id} isActive={this.props.currentThreadID === thread.id} threadID={thread.id} threadName={thread.name} lastMsg={thread.lastMessage} lastActive={time.millisToTime(thread.lastActiveAt)} loadThreadIntoMessageViewer={this.props.loadThreadIntoMessageViewer}/>
            threadUIs.push(threadUI);
        }
        return (
            <div id="thread-list" className="list-group">
                {threadUIs}
            </div>
        );
    }
}

export default ThreadList;