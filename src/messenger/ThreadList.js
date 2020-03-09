import React from 'react';
import './style.css';
import Thread from './Thread';
import time from '../library/time';
import requester from '../library/requester';

class ThreadList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {threads: []};

        requester.GET("/threads").then(
            (response) => {
                this.setState({
                    threads: response.threads,
                })
            },
            (error) => {
                console.error("Error");
            }
        )
    }

    render() {
        const threadUIs = [];
        console.log("state", this.state);
        for(let i = 0; i < this.state.threads.length; i++) {
            const thread = this.state.threads[i];
            const threadUI = <Thread key={thread.id} threadID={thread.id} threadName={thread.name} lastMsg={thread.lastMessage} lastActive={time.millisToTime(thread.lastActiveAt)} loadThreadIntoMessageViewer={this.props.loadThreadIntoMessageViewer}/>
            threadUIs.push(threadUI);
        }
        return (
            <div id="thread-list" className="list-group">
                {threadUIs}
                <Thread threadID="2" title="Muktadir" lastMsg="bye" lastActive="2 days ago"/>
            </div>
        );
    }
}

export default ThreadList;