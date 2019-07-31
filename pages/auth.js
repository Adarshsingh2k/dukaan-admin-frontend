import React from 'react';
import Head from "../components/head";
import Layout from "../components/layout";
import Loader from "../components/loader";
import config from "../config";
import axios from 'axios';
import cookies from 'js-cookies';
import ErrorHandler from "../helpers/ErrorHandler";

class Auth extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      errorMessage: ''
    }
  }

  componentDidMount() {
    let authCode = window.location.search.split('=')[1];
    axios.post(config.backend.token_url, {code: authCode}).then((response) => {
      if (response.data && response.data.jwtToken) {
        cookies.setItem('dukaan-token', response.data.jwtToken);
        window.location = '/';
      }
    }).catch((error) => {
      this.setState({
        loading: false,
        errorMessage: ErrorHandler.handle(error)
      });
    });
  }

  render() {
    return (
      <div>
        <Head title={"Authenticating... | Dukaan | Coding Blocks"} />
        <Layout />
        {this.state.loading &&
          <Loader />
        }
        {!this.state.loading && this.state.errorMessage.length > 0 &&
          <div className={"mt-5"}>
            <h3 align={"center"}>
              {this.state.errorMessage}<br />
              Please try logging in here by <a href="/login" className={"red"}>clicking here</a>, or contact the dev team for assistance.
            </h3>
          </div>
        }
      </div>
    )
  }

}

export default Auth;