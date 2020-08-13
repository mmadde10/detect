import React from 'react';
import './App.css';

export default class Form extends React.Component {

    constructor(props) {
      super(props);
      this.state ={
        file: null,
        isPerson: null
      }
      this.onChange = this.onChange.bind(this)
      this.onClickHandler = this.onClickHandler.bind(this)
      this.parseResponse = this.parseResponse.bind(this)
    }
    onChange(e) {
      this.setState({file:e.target.files[0]})
    }

    //takes in categories object from response, loops throught to find if any 
    //contain people_, if they do set state.isPerson to true, else set it to false
    parseResponse(categories){
        categories.forEach(item => {
            if(item.name.includes("people_")){
                this.setState({isPerson:true})
        }
        else{
            this.setState({isPerson:false})
        }
    
    });
    }

    //When a photo is added, create form data with photo in it, create azure computer vision request, if we get a response, parse to json , 
    // then send to response.categories to parseResponse, else throw error
     onClickHandler = (event) => {
        event.preventDefault()
        const data = new FormData() 
        data.append('file', this.state.file)
        let key = process.env.COMPUTER_VISION_SUBSCRIPTION_KEY;
        let endpoint =  process.env.COMPUTER_VISION_ENDPOINT;
        var uriBase = endpoint + "vision/v3.0";
        let url = uriBase + "/analyze?visualFeatures=Categories&language=en"
        if (!key) { 
            throw new Error('Set your environment variables for your subscription key and endpoint.'); 
        }

        var myHeaders = new Headers();
        myHeaders.append("Ocp-Apim-Subscription-Key", key);

        var formdata = new FormData();
        formdata.append("file", this.state.file);

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
        };

        fetch(url, requestOptions)
        .then(response => response.json())
        .then(result => this.parseResponse(result.categories))
        .catch(error => console.log('error', error));
    }

  
    render() {
        let statement
        if (this.state.isPerson) {
            statement = <h3>Contains people!</h3>;
        }
        else if (this.state.isPerson === false){
            statement = <h3>No People!</h3>;
        }
        else{
            statement = <h3> </h3>;
        } 
      return (
        <div>
            <form>
                <h1>Does you photo contain people?</h1>
                <h1>Upload a Photo</h1>
                <input type="file" onChange={this.onChange}  accept="image/*"/>
                <button type="submit" onClick={this.onClickHandler}>Upload</button>
            </form>
            {statement}
        </div>
     )
    }
  }