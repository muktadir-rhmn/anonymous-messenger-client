import React from 'react';
import {Link} from 'react-router-dom'

import './style.css'
import TextBox from '../form/TextBox'
import PasswordBox from '../form/PasswordBox'
import Button from '../form/Button'
import formDataCollector from '../library/formDataCollector'
import requester from '../library/requester';

class Signin extends React.Component {
    constructor(props)  {
        super(props);

        this.handleSignin = this.handleSignin.bind(this);
    }
    render() {
        if(window.sessionStorage.getItem("token") !== null) {
            window.location.href = "/";
            return;
        }
        
        return (
            <div id="signinForm" className="box shadow p-3 mb-5 bg-white rounded w-25">
                <h1>Signin</h1>
                <TextBox id="email" label="Email Address"/>
                <PasswordBox id="password" label="Password"/>
                <Button onClick={this.handleSignin} label="Signin"/><br/>
                <div className="alreadySignedUp">No Account? <Link to="/signup">Signup</Link></div>
            </div>
        );
    }

    handleSignin() {
        const data =  formDataCollector.collect("signinForm");
        requester.POST("/signin", data).then(
            (response) => {
                window.sessionStorage.setItem("token", response.token);
                window.sessionStorage.setItem("userID", response.userID);
                window.sessionStorage.setItem("userName", response.userName);
                alert(response.message); 
                window.location.href = "/";
            },
            (data) => {alert(data.message);}
        )
    }
}

export default Signin;