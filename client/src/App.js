import React, { useState, useEffect } from 'react';
import { Form, Alert, Button } from 'react-bootstrap';
import Location from './components/Location';
import Part from './components/Part';
// import mns from './mns.json';

//Warehouse ID (5898): localStorage.currentUser.warehousename

var API_DOMAIN = '/api';

if(window.location.host === 'wms.tesla.com'){
  API_DOMAIN = '';
}

var basicHeaders = {
  "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"101\", \"Google Chrome\";v=\"101\"",
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": "\"macOS\"",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "accept": "application/json, text/plain, */*",
  "accept-language": "en-US,en;q=0.9",
  "Referrer-Policy": "strict-origin-when-cross-origin"
}

var spinner = require('./images/spinner.gif');

function App() {

  const [isConnected, setIsConnected] = useState(false);
  const [partNumber, setPartNumber] = useState('');
  const [binLocation, setBinLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedField , setSelectedField] = useState('pnForm');

  const [bnHidden, setbnHidden] = useState(false);
  const [pnHidden, setPnHidden] = useState(false);

  const [partGuess, setPartGuess] = useState('');

  const [binUpdateStatus, setBinUpdateStatus] = useState({'text': '', 'variant': ''});

  var checkConnection = function(){
    setIsConnected('loading');

    if(localStorage.token === undefined){
      //definitely not logged in. Not neccesary to check.
      setIsConnected(false);
    }else{
      fetch(API_DOMAIN+'/system/v1/api/authentication/userinfo',{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${localStorage.token}`,
          ...basicHeaders
        }
      })
      .then(data => data.text())
      .then(function(data){
        data = JSON.parse(data)
        try {
          if(data['domainid'] === 1){
            setIsConnected(true);
            localStorage.currentUser = JSON.stringify(data);
          }else {
            setIsConnected(false);
          }
        } catch (error) {
          setIsConnected(false);
        }
      })
    }
  }

  useEffect(checkConnection, []);

  var handleHide = function(event, value){
    event.preventDefault();
    if(value === 'bn'){setbnHidden(!bnHidden);}else if(value === 'pn'){setPnHidden(!pnHidden);}
  }

  var handleEnter = function(event){
    if(event.key === 'Enter'){
      event.preventDefault();

      if(!bnHidden && !pnHidden){
        if(selectedField === 'pnForm'){
          document.getElementById('bnForm').select();
          document.getElementById('bnForm').focus();
          setSelectedField('bnForm');
        }else{
          document.getElementById('pnForm').select();
          document.getElementById('pnForm').focus();
          setSelectedField('pnForm');
          handleSubmit();
        }
      }else{
        if(bnHidden){
          console.log('bn hidden, only look for part')
          // bn hidden, only look for part
          // after enter, need to highlight all text
          handleSubmit();
        }
        if(pnHidden){
          console.log('pn hidden, only look for location')
          // pn hidden, only look for part
          handleSubmit();
        }
      }
    }
  }

  var handleSubmit = function(){
    setPartGuess('');
    // clear the parts boxes before each submit - not neccesary because it changes
    if(bnHidden === true && pnHidden === true){
      // do nothing
    }else{
      if(binLocation.length === 0 || partNumber.length === 0){
        // do nothing

      }else{
        if(!bnHidden && !pnHidden){
          // neither are hidden.
          // Populate both the part and location box.
          // If successful, store to local log
          var body = {
              "checkcapacity": true,
              "allowoverride": false,
              "emptyonly": false,
              "splitpallet": false,
              "allowmixpart": true,
              "warehousename": "5898",
              "partname": partNumber,
              "inventorystatusname": "Available",
              "sequence": 1,
              "zonename": "",
              "locationname": binLocation,
              "partlocationtypename": "Storage",
              "maxquantity": 5000,
              "maxcontainer": 0
          }

          setIsLoading(true)
          fetch(API_DOMAIN+'/inventory/v1/api/partlocation',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'authorization': `Bearer ${localStorage.token}`,
              ...basicHeaders
            },
            body: JSON.stringify(body)
          })
          .then(data => data.text())
          .then(function(data){
            try {
              data = JSON.parse(data);
              console.log('/partlocation data: ', data)

              if(data.success === true){
                setIsLoading(false)
                setBinUpdateStatus({
                  "text": `Successfully updated part BIN location to ${binLocation}`,"variant": "success"
                })
              }else{
                // it is possible that location already exists. Handle this
                if(data.code === "EN-005"){
                  // Already has a location, use PUT request
                  var getPartIDBody = {
                    "filters":
                    [
                        {
                            "fieldName": "warehousename",
                            "values": ['5898'],
                            "filterType": "sw",
                            "conditionName": "",
                            "realName": "warehousename"
                        },
                        {
                            "fieldName": "partname",
                            "values": [partNumber],
                            "filterType": "sw",
                            "conditionName": "",
                            "realName": "partname"
                        }
                    ],
                    "page": 0,
                    "take": 500,
                    "sort":
                    []
                }

                fetch(API_DOMAIN+`/inventory/v1/api/partlocation/search`,{
                    method: 'POST',
                    headers: {
                      'authorization': `Bearer ${localStorage.token}`,
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(getPartIDBody)
                  })
                  .then(data => data.text())
                  .then(function(data){
                    try {
                      data = JSON.parse(data)

                      if(data.Data.length !== 1){
                        setIsLoading(false)
                        setBinUpdateStatus({
                          "text": "Bin Update Failed at search stage. Result array > 1",
                          "variant": "danger"
                        })
                      }else if(data.Data.length === 1){
                        // good, we found the right part with the right ID
                        console.log('attempging to put change: ', `${API_DOMAIN}/inventory/v1/api/partlocation/id/${(data.Data[0]['id']+'')}`)
                        console.log('search data = ', data.Data[0].id+'')
                        fetch(`${API_DOMAIN}/inventory/v1/api/partlocation/id/${(data.Data[0]['id']+'')}`,{
                            method: 'GET',
                            headers: {
                              'authorization': `Bearer ${localStorage.token}`,
                              'Accept': 'application/json',
                              'Content-Type': 'application/json'
                            }
                        })
                        .then(data=> data.json())
                        .then(function(data){
                          // this data will go to the edit request
                          // example: {"id":749959,"warehouseid":1442,"partid":216953,"inventory`status`":1,"sequence":1,"zoneid":null,"locationid":447974,"stagelocationid":null,"type":1,"checkcapacity":true,"allowoverride":false,"allowmixpart":true,"emptyonly":false,"maxcontainer":0,"maxquantity":50000,"splitpallet":false,"xid":"ca7qd4pfcvmd4r1mgspg","updatedat":"2022-06-04T19:21:44Z","updatedby":"milwatson","createdat":"2022-05-26T01:07:09Z","createdby":"system","rowversion":3,"inventorystatusname":"Available","stagelocationname":null,"locationname":"S3415-B-06-02-050","partname":"1500642-00-E","warehousename":"5898","zonename":null,"partlocationtypename":"Storage","partdescription":"Y 2R 5S 40 B-COVER I/B INNER"}

                          var revisedData = data;
                          var ts = new Date;

                          revisedData.locationname = binLocation;
                          revisedData.updatedby = JSON.parse(localStorage.currentUser).sub;
                          revisedData.updatedat = ts.toISOString();

                          fetch(API_DOMAIN+`/inventory/v1/api/partlocation/id/${(''+data['id'])}`,{
                              method: 'PUT',
                              headers: {
                                'authorization': `Bearer ${localStorage.token}`,
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                              },
                              body: JSON.stringify(revisedData)
                          })
                          .then(data=>data.json())
                          .then(function(data){
                            console.log('status of BIN update over existing location: ', data)
                            if(data.success){
                              setBinUpdateStatus({"text": data.message,"variant": "success"})
                              setIsLoading(false)
                            }else{
                              setBinUpdateStatus({"text": data.message,"variant": "danger"})
                              setIsLoading(false)
                            }

                          })

                        })

                      }

                    } catch (e) {
                      setIsLoading(false)
                      setBinUpdateStatus({"text": `Caught error at part ID search stage: ${e}`,"variant": "danger"})
                    }

                  })
                }else{
                  setIsLoading(false)
                  setBinUpdateStatus({"text": `Error: Could not update Bin Location`,"variant": "danger"})
                }

            }} catch (error) {
              setBinUpdateStatus({
                "text": `Error2: ${error}`,
                "variant": "danger"
              })
            }

          })
        }
      }
    }

  }

  var partGuessCallback = function(partNum){
    setPartGuess(partNum)
  }

  var handleTabAutocomplete = function(event){
    if(event.key === 'Tab' && partGuess.length > 0 && partGuess !== partNumber ){
      event.preventDefault();
      setPartNumber(partGuess);
      setPartGuess('');
    }
  }

  var Lock = function(){
    return(
      <>
        <svg tabIndex='-1' xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-unlock" viewBox="0 0 16 16">
          <path tabIndex='-1' d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2zM3 8a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H3z"/>
        </svg>
      </>
    )
  }

  var Unlock = function(){
    return(
      <svg tabIndex='-1' xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lock" viewBox="0 0 16 16">
        <path tabIndex='-1' d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/>
      </svg>
    )
  }

  if(isConnected === true){
    return (
      <>
      <div className='app container'>
      <h2>SWIFT Location Tool</h2>
      <h4>V1.0</h4>


        <div className='row'>
            <Alert variant={binUpdateStatus.variant}>
              {binUpdateStatus.text}
            </Alert>

            <div className='col'>
            <div style={{display: (isLoading ? '': 'none')}} id='overlay'>
            <img className='spinner' src={spinner} />

            </div>

            <div className='partNumber' onKeyDown={handleTabAutocomplete}>
              <Form onKeyPress={handleEnter}>
                <Form.Group className="mb-3" controlId="pnForm">
                  <Form.Label>Part Number</Form.Label>
                  <Form.Control autoFocus={true} onClick={()=>{setSelectedField('pnForm')}} disabled={(pnHidden ? true : false)} onChange={(e)=>{setPartNumber(e.target.value)}} value={partNumber} type="text" placeholder="Enter Part Number" />

                  <Form.Text className="text-muted">
                    { (partGuess.length === 0 || partGuess === partNumber)? "":`Tab to autofill: ${partGuess}` }
                  </Form.Text>

                </Form.Group>
              </Form>
            </div>

            <div className='binLocation'>
              <Form onKeyPress={handleEnter}>
                <Form.Group className="mb-3" controlId="bnForm">
                  <Form.Label>Bin Location <a tabIndex='-1' href='#' onClick={(event)=>{handleHide(event, 'bn')}} > {!bnHidden ?  <Lock /> : <Unlock  />}</a></Form.Label>
                  <Form.Control onClick={()=>{setSelectedField('bnForm')}} disabled={(bnHidden ? true : false)} onChange={(e)=>{setBinLocation(e.target.value)}} value={binLocation} type="text" placeholder="Enter New Bin Location" />
                </Form.Group>
              </Form>
            </div>

            <Button style={bnHidden ? {'display': 'none'}: {}} disabled={partNumber.length === 0 || binLocation.length === 0 ? true : false} onClick={handleSubmit} varient='success'>Change Bin Location</Button>
            <br />
          </div>

          <div className='col'>
            <br />

            <div className='card-flex' style={{"display": "flex"}}>

              {
                partNumber === '' ? null : <Part partEntry = {partNumber} partGuessCallback = {partGuessCallback}/>
              }


            </div>

          </div>
        </div>

        <div className='row'>
        </div>
      </div>
      </>
    );
  }else if(isConnected === false){
    var handleLoginSubmit = function(event){

      if(event.key === 'Enter' || event.type === "click"){
        event.preventDefault()
        fetch(API_DOMAIN+'/system/v1/api/authentication/login',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer null`,
            ...basicHeaders
          },
          body: JSON.stringify({
            name: document.getElementsByName('username')[0].value,
            password: document.getElementsByName('password')[0].value
          })
        })
        .then(data => data.text())
        .then(function(data){
          try {
            data = JSON.parse(data);
            console.log('data = ', data);
            if(!data.token){
              setIsConnected(false)
            }else{
              checkConnection();
              setIsConnected(true)
              localStorage.token = data.token;
              localStorage.domainID = 1;
              localStorage.timezone = "America/Los_Angeles";
              localStorage.lang = "en";
              localStorage.filterConfig = [];
              localStorage.domainName = "Default";
              localStorage.locale = "en-US";
            }
          } catch (error) {
            setIsConnected('error');
          }
        })
      }
    }

    return(
      <>
      <div className='app'>
        <h3>Sign In</h3>
          <p style={{'color': 'red'}} id="login-result"></p>

          <Form onKeyPress={handleLoginSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control name='username' type="text" placeholder="Enter Tesla username" />

              <Form.Label>Password</Form.Label>
              <Form.Control name='password' type="password" placeholder="Enter Tesla password" />

              <Button onClick={handleLoginSubmit} variant='primary'>Submit</Button>

            </Form.Group>
          </Form>
        </div>
      </>
    )
  }else if(isConnected === 'loading'){
    return(
      <>
      <h3>Loading...</h3>
      </>
    )
  }else{
    return(
      <>
        <h3>Error: Could not connect to server.</h3>
      </>
    )
  }

}

export default App;

/*
How to use:
Features:
- If you leave the Bin Location blank, and submit the form the app will return the BIN of the part
- If you submit a location and part number for a part that has no location, the entered location will be created. If the part number already has a Bin location, it will be updated.

Ideas:
- [x] Autocomplete part number if it is close

Changes
[x] get login session working again
[x] tabIndex - skip the lock/unlock icons
[] Cookie for Auth
[] Add default filters
[] If locked to part, allow sequential scanning
[] Get inventory for part
[] css Tesla color scheme

Future:
[] Look into changing part suggestion API
[] Add back Location feature


00
a
*/
