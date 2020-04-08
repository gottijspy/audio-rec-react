import React, { Component } from "react";
import "./Record.css";
import MicRecorder from "mic-recorder-to-mp3";
import microphone from "../microbe.png";
const axios = require("axios");

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

class Record extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRecording: false,
      audioFile: null,
      blobURL: "",
      isBlocked: false,
      isUploading: false,
      uploadProgress: {},
      uploadSuccessMessage: "",
    };
  }

  start = () => {
    if (this.state.isBlocked) {
      console.log("Permission Denied");
    } else {
      Mp3Recorder.start()
        .then(() => {
          this.setState({
            uploadSuccessMessage: "",
            blobURL: "",
            isRecording: true,
          });
        })
        .catch((e) => console.error(e));
    }
  };

  stop = () => {
    Mp3Recorder.stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const blobURL = URL.createObjectURL(blob);
        this.setState({ audioFile: blob, blobURL, isRecording: false });
      })
      .catch((e) => console.log(e));
  };

  uploadFile = () => {
    const file = this.state.audioFile;
    if (file != null) {
      const formData = new FormData();
      formData.append("coughAudio", file, "cough.mp3");

      axios
        .post("http://localhost:8000/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) =>
          this.setState({ uploadSuccessMessage: res.data.message })
        )
        .catch((err) => console.log("error: ", err));
    }
  };

  componentDidMount() {
    navigator.getUserMedia(
      { audio: true },
      () => {
        console.log("Permission Granted");
        this.setState({ isBlocked: false });
      },
      () => {
        console.log("Permission Denied");
        this.setState({ isBlocked: true });
      }
    );
  }

  pulsate() {
    this.setState({ pulse: !this.state.pulse }, () => {
      if (this.state.pulse) {
        this.start();
      } else {
        this.stop();
      }
    });
  }

  render() {
    let btn_class = this.state.pulse ? "pulse pulse-active" : "pulse";

    return (
      <div className="Record">
        <h1 className="title">Record your cough!</h1>
        <h1 className="redHeader">
          {this.state.isRecording
            ? "recording..."
            : "tap on microbe to record..."}
        </h1>
        <button onClick={this.pulsate.bind(this)} className={btn_class}>
          <img src={microphone} className="App-logo" alt="logo" />
        </button>
        <audio src={this.state.blobURL} controls="controls" />
        <br />
        <br />
        <button
          disabled={this.state.audioFile === null || this.state.isUploading}
          onClick={this.uploadFile.bind(this)}
        >
          Upload
        </button>
        <h1 className="greenHeader">{this.state.uploadSuccessMessage}</h1>
      </div>
    );
  }
}

export default Record;
