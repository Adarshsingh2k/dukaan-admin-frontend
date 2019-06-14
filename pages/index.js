import React from "react";
import Link from "next/link";
import Head from "../components/Head";
import Layout from "../components/Layout";
import CompleteOrders from "../components/CompleteOrder";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      completeTab: true,
      incompleteTab: false
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  toggleCompleteTab = () => {
    this.setState(prevstate => ({
      completeTab: true,
      incompleteTab: false
    }));
  };

  toggleIncompleteTab = () => {
    this.setState(prevstate => ({
      completeTab: false,
      incompleteTab: true
    }));
  };

  render() {
    const completeTab = this.state.completeTab;
    let orders;

    if (completeTab) {
      orders = <CompleteOrders />;
    } else {
      orders = <div>No Incomplete Orders Found.</div>;
    }

    return (
      <div>
        <Head title="Coding Blocks | Dukaan" />
        <Layout />

        {/* Search User */}
        <div className="container mt-5">
          <div className="row">
            <div className="col-md-12 col-12">
              <div style={{ display: "flex" }}>
                <input
                  name="email"
                  required
                  id="email"
                  type="email"
                  className="input-text mb-2"
                  placeholder="Enter email"
                  onChange={this.handleChange}
                />
                <button
                  id="search"
                  className="button-solid ml-4 mb-1"
                  style={{ fontSize: "1.3rem" }}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
          {/* Form 2  */}
          <div className=" mt-4">
            <div className="row w-100">
              <div className="col-md-4 col-12">
                <div className="border-card br-20 bg-light-grey mb-5">
                  <h5>User Details</h5>
                  <div
                    style={{
                      alignItems: "center"
                    }}
                  >
                    <p className="red">Username : Tathagat2006</p>

                    <p>Name : Tathagat Thapliyal</p>

                    <p>Email : tathagat.thapliyal@gmail.com</p>

                    <p>Mobile : +91-7503681329</p>

                    <p>Wallet Amount : ₹ 2320</p>

                    <div>
                      <button className="button-solid">Make New Payment</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-8 col-12">
                <div className="border-card br-20 bg-light-grey mb-5">
                  <div className="tab-nav-underline mb-5">
                    <div
                      className={this.state.completeTab ? "tab active" : "tab"}
                      onClick={this.toggleCompleteTab}
                    >
                      Complete Orders
                    </div>
                    <div
                      className={
                        this.state.incompleteTab ? "tab active" : "tab"
                      }
                      onClick={this.toggleIncompleteTab}
                    >
                      Incomplete Orders
                    </div>
                  </div>
                  {orders}
                </div>
              </div>
            </div>
          </div>

          {/* Order history card */}
        </div>
      </div>
    );
  }
}

export default Home;
