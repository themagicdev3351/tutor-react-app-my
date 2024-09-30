import React from 'react'

import { useEffect } from 'react';
import { useDyteClient, DyteProvider, useDyteSelector } from '@dytesdk/react-web-core';
import { DyteMeeting } from '@dytesdk/react-ui-kit';

import { useDyteMeeting } from '@dytesdk/react-web-core';
import { useNavigate } from 'react-router-dom';

const MeetingUI = () => {
  
    const [meeting, initMeeting] = useDyteClient();



  useEffect(() => {
    initMeeting({
      authToken: localStorage.getItem("meetingToken"),
      defaults: {
        audio: false,
        video: false,
      },
    });
  }, []);

  return (
    <DyteProvider value={meeting}>
      <MyMeetingUI />
    </DyteProvider>
  );


  
}

export default MeetingUI

const MyMeetingUI = () => {

const navigate = useNavigate();
  const roomState = useDyteSelector((m) => m.self.roomState);

  console.log(roomState);

  if (roomState === 'left' || roomState === 'ended') {

    setTimeout(() => {
      navigate('/meetings');
    }, 3000);

  }

  
    const { meeting } = useDyteMeeting();

    return (
        <div style={{height:'100vh'}}>
    <DyteMeeting mode="fill" meeting={meeting} showSetupScreen={false}  />
    </div>
    );
    
    
    
    

}