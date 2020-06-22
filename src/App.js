import React, { Component } from "react";
import "./styles.css";
import PubSub from "pubsub-js";

export default class App extends Component {
  constructor() {
    super();
    this.state = { show: true };
  }

  render() {
    return (
      <div className="App">
        <button onClick={() => this.setState(state => ({ show: !state.show }))}>
          {this.state.show ? "Hide panel" : "Show panel"}
        </button>
        <Toggler />
        {this.state.show && <Panel initialColor="blue" />}
      </div>
    );
  }
}

class Toggler extends React.Component {
  render() {
    return (
      <div>
        <button type="button" onClick={() => PubSub.publish("TOGGLE")}>
          Toggle red/blue
        </button>
        <button type="button" onClick={() => PubSub.publish("SET PINK")}>
          Set pink
        </button>

        <button type="button" onClick={() => PubSub.publish("SET YELLOW")}>
          Set yellow
        </button>
      </div>
    );
  }
}

class Panel extends React.Component {
  constructor(props) {
    super();
    this.state = {
      color: props.initialColor
    };
    this.subscriptions = []
  }

  componentDidMount() {
    this.subscriptions = [
      PubSub.subscribe("SET YELLOW", () => this.setState({ color: "yellow" })),
      PubSub.subscribe("SET PINK", () => this.setState({ color: "pink" })),
      PubSub.subscribe("TOGGLE", () => {
        console.log(`Toggling from ${this.state.color}`);
        this.setState(({ color }) => ({
          color: color === "red" ? this.props.initialColor : "red"
        }));
      })
    ];
  }

  UNSAFE_componentWillMount = () => 
  this.subscriptions.forEach(PubSub.unsubscribe)
    

  render() {
    return (
      <div
        style={{ width: 100, height: 100, backgroundColor: this.state.color }}
      />
    );
  }
}
