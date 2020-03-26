import React from 'react';
import './style.css';

import TextBox from '../form/TextBox'
import PasswordBox from '../form/PasswordBox'
import Button from '../form/Button'
import formDataCollector from '../library/formDataCollector'
import reqeuster from '../library/requester';
import { useParams } from 'react-router-dom';

function ThreadInitiator (props){
    let {userID} = useParams();
    return (
        <div id="initiatorForm" className="box shadow p-3 mb-5 bg-white rounded w-25">
            <h1>Initiate New Thread</h1>
            <TextBox id="threadName" label="Thread Name"/>
            <TextBox id="initiatorName" label="Initiator PseudoName"/>
            <PasswordBox id="secretKey" label="Secret Key"/>
            <Button onClick={()=>handleCreate()} label="Create"/>
        </div>
    );
    
    function handleCreate() {
        const data = formDataCollector.collect("initiatorForm");
        data.userID = parseInt(userID);
        reqeuster.POST("/threads/create", data).then(
            (response) => {
                alert("Thread creation successful");
                window.location.href = `/initiator/signin`;
            }, 
            (response) => {
                alert("Failed to create thread.");
            })
    }
}

export default ThreadInitiator;