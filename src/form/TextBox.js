import React from 'react';
import './style.css'

class TextBox extends React.Component {
    render() {
        let description = ""
        if(this.props.description) {
            description = <small className="description">{this.props.description}</small>
        }
        return (
            <div className="form-group">
                <label htmlFor={this.props.id}>{this.props.label} {description}</label>
                <input className="form-control" type="text" id={this.props.id}/>
                <small className="errorMessage"></small>
            </div>
        )
    }
}

export default TextBox;