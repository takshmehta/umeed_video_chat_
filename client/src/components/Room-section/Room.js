import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import { toast, ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import "./Dashboard.css";
const Container = styled.div`
  padding: 20px;
  display: flex;
  height: 100vh;
  background: #111;
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

  return (
    <StyledVideo playsInline autoPlay ref={ref} className="bg-video-tag" />
  );
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
    socketRef.current = io("https://infinite-journey-52315.herokuapp.com/");
    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: true })
      .then((stream) => {
        stream.muted = true;
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
            peers.push({ peerID: userID, peer });
          });
          setPeers(peers);
        });

        socketRef.current.on("user joined", (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });

          setPeers([...peersRef.current]);
        });

        socketRef.current.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });

        socketRef.current.on("user left", (id) => {
          const peerObj = peersRef.current.find((p) => p.peerID === id);
          if (peerObj) {
            peerObj.peer.destroy();
          }
          const peers = peersRef.current.filter((p) => p.peerID !== id);
          peersRef.current = peers;
          setPeers(peers);
        });
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
      let videoElement = document.querySelector(".fa-video");
      videoElement.classList.remove("fa-video");
      videoElement.classList.add("fa-video-slash");
      userVideo.current.srcObject.getVideoTracks()[0].enabled = false;
    } else {
      let videoElement = document.querySelector(".fa-video-slash");
      videoElement.classList.remove("fa-video-slash");
      videoElement.classList.add("fa-video");
      userVideo.current.srcObject.getVideoTracks()[0].enabled = true;
    }
  };
  const audioToggle = () => {
    let enabled = userVideo.current.srcObject.getAudioTracks()[0].enabled;
    if (enabled) {
      let audioElement = document.querySelector(".fa-microphone");
      audioElement.classList.remove("fa-microphone");
      audioElement.classList.add("fa-microphone-slash");
      userVideo.current.srcObject.getAudioTracks()[0].enabled = false;
    } else {
      let audioElement = document.querySelector(".fa-microphone-slash");
      audioElement.classList.remove("fa-microphone-slash");
      audioElement.classList.add("fa-microphone");
      userVideo.current.srcObject.getAudioTracks()[0].enabled = true;
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast("Copied meeting link", {
      type: "success",
      autoClose: 1500,
      pauseOnHover: false,
      transition: Zoom,
    });
  };
  console.log(peers);
  return (
    <Container>
      <ToastContainer position="top-right" />

      <StyledVideo ref={userVideo} autoPlay playsInline muted />
      {peers.map((peer) => {
        return <Video key={peer.peerID} peer={peer.peer} />;
      })}
      {peers.length === 3
        ? toast("Max user limit reached!!", {
            type: "warning",
            autoClose: 3000,
            pauseOnHover: false,
            transition: Zoom,
          })
        : null}
      <div className="footer">
        <div>
          <button
            className="copyButton"
            style={{
              position: "absolute",
              bottom: "0.5",
              left: "15px",
              color: "#00b389",
              fontSize: "1.5rem",
              borderRadius: "10rem",
              marginTop: "1.5rem",
            }}
            onClick={copyLink}
          >
            <i class="fas fa-copy"></i> Copy link
          </button>
          <button
            onClick={audioToggle}
            style={{ marginLeft: "1.2rem" }}
            title="Microphone"
          >
            <i className="fas fa-microphone"></i>
          </button>
          <button title="End call">
            <a href="/">
              <i className="fas fa-phone-alt leave-icon"></i>
            </a>
          </button>
          <button
            onClick={videoToggle}
            style={{ marginLeft: "-.5rem" }}
            title="Camera"
          >
            <i className="fas fa-video"></i>
          </button>
        </div>
      </div>
    </Container>
  );
};

export default Room;
