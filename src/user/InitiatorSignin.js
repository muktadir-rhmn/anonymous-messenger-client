import React from 'react';

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
        return (
            <div id="initiatorSigninForm" className="box shadow p-3 mb-5 bg-white rounded w-25">
                <h1>Initiator Signin</h1>
                <TextBox id="threadID" label="Thread ID"/>
                <PasswordBox id="secretKey" label="Secret Key"/>
                <Button onClick={this.handleSignin} label="Signin"/><br/>
            </div>
        );
    }

    handleSignin() {
        const data =  formDataCollector.collect("initiatorSigninForm");
        requester.POST("/initiator/signin", data).then(
            (response) => {
                window.localStorage.setItem("token", response.token);
                window.localStorage.setItem("initiatorName", response.initiatorName);
                window.localStorage.setItem("threadID", response.threadID);
                alert(response.message); 
            },
            (data) => {alert(data.message);}
        )
    }
}

export default Signin;