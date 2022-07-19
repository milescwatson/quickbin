import React, { useState, useRef, useEffect } from 'react';
import { Form, Alert, Accordion, Button, Card } from 'react-bootstrap';
import mns from '../mns.json';

/*
- [] change findpart to basic API
*/
var API_DOMAIN = '/api';
if(window.location.host === 'wms.tesla.com'){
  API_DOMAIN = '';
}

var Part = function(props){
    /*
    PROPS:
    - partEntry
    */

   const [binLocation, setBinLocation] = useState(null); // or none, for no Bin location
   const [partDescription, setPartDescription] = useState(null);
   const [partNumber, setPartNumber] = useState(null);
   const [inventory, setInventory] = useState(null);
   const [numGuesses, setNumGuesses] = useState(null);
   const [mnsDetails, setMNSDetails] = useState({});
  
   var Log = function(){
    // if(partNumber.length >0){
      var handleSubmit = function(){
        var submit = {
          quantity: document.getElementById('logInput').value,
          partNumber: props.partEntry
        }

        fetch('/log',{
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'             
          },
          body: JSON.stringify(submit)
         })
         
      }

      return(
          <>
          QTY: <input type="text" id="logInput" />
          <br />
          <button type="button" className="btn btn-dark" onClick={handleSubmit} >Submit</button>
        </>
      )
    // }

   }

   var MNSReport = function(){
    return(
      <>
        {Object.keys(mnsDetails).length > 0 ?  <Alert variant='danger'><b>MNS Details:</b>{Object.keys(mnsDetails).map(function(key){return <><p>{key}: {mnsDetails[key]}</p></>})}</Alert> : ""}
        {/* {mnsDetails.map(function(value){
          return(<p>{value}</p>)
        })} */}
      </>
    )
   }

   var getInventory = function(partNumber, callback){
     // https://wms.tesla.com/inventory/v1/api/inventoryreport/search
     var body = {
         "filters":
         [
             {
                 "fieldName": "partname",
                 "values": [partNumber],
                 "filterType": "cn",
                 "conditionName": "",
                 "realName": "partname"
             },
             {
                 "fieldName": "warehousename",
                 "values": ['5898'],
                 "filterType": "sw",
                 "conditionName": "",
                 "realName": "warehousename"
             }
         ],
         "page": 0,
         "take": 500,
         "sort":
         []
     }
     fetch(API_DOMAIN+`/inventory/v1/api/inventoryreport/search`,{
         method: 'POST',
         headers: {
           'authorization': `Bearer ${localStorage.token}`,
           'Accept': 'application/json',
           'Content-Type': 'application/json'
         },
         body: JSON.stringify(body)
       })
       .then(data => data.text())
       .then(function(data){
          console.log(partNumber,'inventory response from server = ', data);
         data = JSON.parse(data);

          callback('error: data.results === null', data.Data[0]['quantity'])

          if(data.Data[0].length === 0){
            // inventory is 0. A part CAN have a location and 0 inventory.
            callback('0 inventory', null)
          }else{
            if(data.Data.length === 1){
              callback(null, data.Data[0]['quantity'])
            }
          }
       })
   }

  var refreshData = function(){
    console.log('Parts refresh data')
    if(props.partEntry.length === 0){
       return
     }else{
         // text was entered. Find the part

         // fetch(`/findpart/${props.partEntry}`,{
         //     method: 'GET',
         //     headers: {
         //       'Accept': 'application/json',
         //       'Content-Type': 'application/json'
         //     }
         //   })
         var body = {
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
                   "values": [props.partEntry],
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

       setTimeout(function () {

        fetch(API_DOMAIN+`/inventory/v1/api/partlocation/search`,{
           method: 'POST',
           headers: {
             'authorization': `Bearer ${localStorage.token}`,
             'Accept': 'application/json',
             'Content-Type': 'application/json'
           },
           body: JSON.stringify(body)
         })
         .then(data => data.text())
         .then(function(data){
           try {
             data = JSON.parse(data);
             console.log('response from server = ', data);
             if(data.results === null){
               // if null, there has been an error
               //setError(true)
               //setErrorMessage('null response')
               console.log('error: data.results === null')
             }else{
               if(data.Data.length === 0){
                 // no Bin location
                 setBinLocation(null)
                 setPartNumber('');
                 setPartDescription('');
                //  setMNSDetails({})

                 props.partGuessCallback('')
               }else{
                   console.log('data = ', data["Data"])
                   var foundMNS = false;
                   for(var iter in mns){
                    if(mns[iter]["Part Number"] === props.partEntry){
                      console.log('found mns', mns[iter])
                      foundMNS = true;
                      setMNSDetails(mns[iter])
                    }
                   }
                   if(foundMNS === false){
                    setMNSDetails({})
                   }

                   if((data.Data.length === 1 || props.partEntry.length >= 7) && data.Data.length > 0){
                       props.partGuessCallback(data.Data[0]['partname'])

                       getInventory(data.Data[0]['partname'], function(error, result){
                         setInventory(result);
                         // if nothing comes up in partlocation, use this result to populate PN and description
                         // Show error for "No Bin Location"
                       })
                       setBinLocation(data.Data[0]['locationname']);
                       setPartNumber(data.Data[0]['partname']);
                       setPartDescription(data.Data[0]['partdescription']);

                       console.log('current mns = ', mnsDetails['Part Number'] !== partNumber)
                   }else{

                       props.partGuessCallback('')
                   }
               }
             }

           } catch (error) {
               console.log('error catched: ', error)
           //   setPartData({...partData, location: null, errorMessage: error});
           }
         })
       }, 100);
  }}
  useEffect(refreshData, [props.partEntry])

    return(
      <>
      <div>
          <Card>
          <Card.Header>Part</Card.Header>
          <Card.Body>
              <Card.Title>{(partNumber === null || partNumber === '') ? "No Matches Found" : partNumber}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{(partDescription === null) ? "" : partDescription}</Card.Subtitle>
              <Card.Text>
                {(binLocation === '' || binLocation=== null) ? "" : (<><b>Location: </b> {binLocation}</>) }
                <br />
                {(inventory === '' || inventory === null) ? "" : (<><b>Inventory: </b> {inventory}</>) }
              </Card.Text>
              <MNSReport />
              <Log />
          </Card.Body>
          </Card>
      </div>
      </>
    )

}

export default Part;

// if there is already data.length of 0, we can search part number
// [] handle no location
// [] Only pop up if there is 1 possible
