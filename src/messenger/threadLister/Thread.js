import React from 'react';
import '../style.css';

class Thread extends React.Component {
    constructor(props) {
        super(props);

        this.handleClickOnListItem = this.handleClickOnListItem.bind(this);
    }

    render() {
        return (
            <div id={"threadListItem-" + this.props.threadID} onClick={this.handleClickOnListItem}  className={`thread-list-item list-group-item list-group-item-action ${this.props.isActive ? "active": ""}`}>
                <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{this.props.threadName}</h5>
                <small>{this.props.lastActive}</small>
                </div>
                <p className="mb-1">{this.props.lastMsg}</p>
            </div>
        );
    }

    handleClickOnListItem(event) {
        const threadID = parseInt(this.props.threadID);
        const threadName = this.props.threadName;

        this.loadThread(threadID, threadName);
        event.stopPropagation();
    }

    loadThread(threadID, threadName) {
        console.log("Showing thread", threadID, threadName);
        
        this.props.loadThreadIntoMessageViewer(threadID, threadName);
    }

}

export default Thread;