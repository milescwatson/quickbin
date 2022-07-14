import React, { useState, useRef, useEffect } from 'react';
import { Form, Alert, Accordion, Button, Card } from 'react-bootstrap';

var API_DOMAIN = '/api';
if(window.location.host === 'wms.tesla.com'){
  API_DOMAIN = '';
}

// var Location = function(props){
//   /*
//   Props
//   - locationEntry
//   */

//     if(props.locationEntry.length === 0){
//         return
//       }else{
//         //text was entered, find the part
//         return(
//           <>
//             <div>
//             <Card>
//               <Card.Header>Location</Card.Header>
//               <Card.Body>
//                 <Card.Title>{props.locationName}</Card.Title>
//                 <Card.Text>
//                   <b>Parts at this location: </b>
//                   {props.parts.map(function(value){
//                     return <p>{value}</p>
//                   })}
//                 </Card.Text>
  
//               </Card.Body>
//             </Card>
//             </div>
//           </>
//         )
//       }
// }

// export default Location;

var Location = function(props){
  /*
  Props
  - locationEntry
  */

    if(props.locationEntry.length === 0){
        return
      }else{
        //text was entered, find the part
        return(
          <>
            <div>
            <Card>
              <Card.Header>Location</Card.Header>
              <Card.Body>
                <Card.Title>B-02-05-050</Card.Title>
                <Card.Text>
                  <b>Parts at this location: </b>
                  <p>1108210-00-A</p>
                </Card.Text>
  
              </Card.Body>
            </Card>
            </div>
          </>
        )
      }
}

export default Location;