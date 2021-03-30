import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import './Dashboard.css'

const Container = styled.div`
  padding: 20px;
  display: flex;
  height: 100vh;
  background:#000;
  margin: auto;
  flex-wrap: wrap;
`;

const StyledVideo = styled.video`
  height: 40%;
  width: 50%;
 
`;

const Video = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return <StyledVideo playsInline autoPlay ref={ref} className="bg-video-tag" />;
};

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2,
};

const Room = (props) => {
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const roomID = props.match.params.roomID;

  useEffect(() => {
    socketRef.current = io.connect("/");
    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        socketRef.current.emit("join room", roomID);
        socketRef.current.on("all users", (users) => {
          const peers = [];
          users.forEach((userID) => {
            const peer = createPeer(userID, socketRef.current.id, stream);
            peersRef.current.push({
              peerID: userID,
              peer,
            });
            peers.push({peerID:userID,peer});
          });
          setPeers(peers);
        });

        socketRef.current.on("user joined", (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });
         
          setPeers( [ ...peersRef.current ]); 
          
        });

        socketRef.current.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });

        socketRef.current.on("user left",id=>{
          const peerObj=peersRef.current.find(p=> p.peerID===id);
          if(peerObj){
              peerObj.peer.destroy();
          }
          const peers=peersRef.current.filter(p=> p.peerID!==id);
          peersRef.current=peers;
          setPeers(peers);
          })

      });
  }, []);

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }
  const videoToggle = () => {

    let enabled = userVideo.current.srcObject.getVideoTracks()[0].enabled;
    
    if (enabled) {
      userVideo.current.srcObject.getVideoTracks()[0].enabled = false;
    } else {
      userVideo.current.srcObject.getVideoTracks()[0].enabled = true;
    }
  };
  const audioToggle = () =>{
    let enabled = userVideo.current.srcObject.getAudioTracks()[0].enabled;
    console.log(enabled);
    if (enabled) {
      userVideo.current.srcObject.getAudioTracks()[0].enabled = false;
    } else {
      userVideo.current.srcObject.getAudioTracks()[0].enabled = true;
    }
  };
  console.log(peers);
  return (
    <Container>
      <StyledVideo  ref={userVideo} autoPlay playsInline  />
      {peers.map((peer) => {
        return <Video key={peer.peerID} peer={peer.peer}  />;
      })}
      <div className='footer'>
        <div>
        <button onClick={audioToggle}>
          mute
        </button>
        <button onClick={videoToggle}>
          camera off
        </button>
        <a href='/'>
          logout
        </a>
        </div>
      </div>
    </Container>
  );
};

export default Room;
