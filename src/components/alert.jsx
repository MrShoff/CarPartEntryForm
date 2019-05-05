import React, { Component } from "react";

class Alert extends Component {
  render() {
    return (
      <div className={this.props.class}>
        <strong>{this.props.strongText}</strong> {this.props.text}
      </div>
    );
  }
}

export default Alert;
