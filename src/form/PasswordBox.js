import React from 'react';
import './style.css'

class PasswordBox extends React.Component {
    render() {
        let description = ""
        if(this.props.description) {
            description = <small className="description">{this.props.description}</small>
        }

        return (
            <div className="form-group">
                <label htmlFor={this.props.id}>{this.props.label} {description}</label>
                <input className="form-control" type="password" id={this.props.id}/>
                <small className="errorMessage"></small>
            </div>
        )
    }
}

export default PasswordBox;