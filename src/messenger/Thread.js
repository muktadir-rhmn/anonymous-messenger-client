import React from 'react';
import './style.css';

class Thread extends React.Component {
    constructor(props) {
        super(props);

        this.handleClickOnListItem = this.handleClickOnListItem.bind(this);
    }

    render() {
        return (
            <div onClick={this.handleClickOnListItem}  className="list-group-item list-group-item-action">
                <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{this.props.title}</h5>
                <small>{this.props.lastActive}</small>
                </div>
                <p className="mb-1">{this.props.lastMsg}</p>
            </div>
        );
    }

    handleClickOnListItem(event) {
        const threadID = parseInt(this.props.threadID);

        this.loadThread(threadID);
        this.updateActiveHighlighting();
        event.stopPropagation();
    }

    loadThread(threadID) {
        console.log("Showing thread", threadID);
        
        this.props.loadThreadIntoMessageViewer(threadID)
    }
}

export default Thread;