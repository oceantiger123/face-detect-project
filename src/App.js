import React, { Component } from "react";
import "./App.css";
import ImageSearchForm from "./Components/ImageSearchForm/ImageSearchForm";
import FaceDetect from "./Components/FaceDetect/FaceDetect";
import Clarifai from "clarifai";
import AttendentCalendar from "./Components/calendar";
//import Members from "./Components/member/member";

const app = new Clarifai.App({ apiKey: "bbcb6e3cd926404da5e1207117fbec31" });

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      box: {},
    };
  }
  //This function calculates the FaceDetect location of the image
  calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
      console.log('face', data)
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };
  //To show the face-detect box on the state values:
  displayFaceBox = (box) => {
    this.setState({ box: box });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  // execute a function when submitting with onSubmit
  onSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    app.models
      //Using Face_Detect_model from Clarifai
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then((response) => 
       this.displayFaceBox(this.calculateFaceLocation(response))
      
        
      )
      .catch((err) => console.log(err));
  };
  render() {
    return (
      <div className="App">
        <h2>Face Detect</h2>
        <h3>place an image url in the box </h3>
        <ImageSearchForm
          onInputChange={this.onInputChange}
          onSubmit={this.onSubmit}
        />
        <FaceDetect box={this.state.box} imageUrl={this.state.imageUrl} />
        <h3>Hall7 Member Attendent Calendar</h3>
        <AttendentCalendar />
      </div>
    );
  }
}


export default App;
