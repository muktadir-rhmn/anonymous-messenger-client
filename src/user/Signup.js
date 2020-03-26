import React from 'react';
import {Link} from 'react-router-dom'

import './style.css'
import TextBox from '../form/TextBox'
import PasswordBox from '../form/PasswordBox'
import Button from '../form/Button'
import formDataCollector from '../library/formDataCollector'
import requester from '../library/requester';

class Signup extends React.Component {
    constructor(props) {
        super(props);

        this.handleSignup = this.handleSignup.bind(this);
    }
    render() {
        if(window.localStorage.getItem("token") !== null) {
            window.location.href = "/";
            return;
        }

        return (
            <div id="signupForm" className="box shadow p-3 mb-5 bg-white rounded w-25">
                <h1>Signup</h1>
                <TextBox id="name" label="Name"/>
                <TextBox id="email" label="Email Address"/>
                <PasswordBox id="password" label="Password" description="At least 8 character long"/>
                <Button onClick={this.handleSignup} label="Signup"/><br/>
                <div className="alreadySignedUp">Already have an account? <Link to="/signin">Signin</Link></div>
            </div>
        );
    }

    handleSignup() {
        const data = formDataCollector.collect("signupForm");
        requester.POST("/signup", data).then(
            (response) => {
                console.log(response); 
                alert("Signup successful");
                window.location.href = "/signin";
            },
            (error) => {
                console.error(error); 
                alert("Failed to signup");
            }
        )
    }
}

export default Signup;