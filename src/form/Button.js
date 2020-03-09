import React from 'react';
import './style.css'

class Button extends React.Component {
    render() {
        return (
            <div className="form-group">
                <button className="btn btn-outline-success btn-block" onClick={this.props.onClick}>{this.props.label}</button>
            </div>
        )
    }
}

export default Button;