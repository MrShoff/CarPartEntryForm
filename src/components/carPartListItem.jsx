import React, { Component } from "react";

class CarPartListItem extends Component {
  render() {
    return (
      <React.Fragment>
        <tr>
          <td>
            <button
              type="button"
              className="btn btn-link"
              onClick={() => this.props.onEdit(this.props.id)}
            >
              Edit
            </button>
            |
            <button
              type="button"
              className="btn btn-link"
              onClick={() => this.props.onDelete(this.props.id)}
            >
              Delete
            </button>
          </td>
          <td>{this.props.id}</td>
          <td>{(this.props.part_number + "").padStart(5, "0")}</td>
          <td>{this.props.part_name}</td>
          <td>{this.props.description}</td>
          <td>{this.props.car_manufacturer_name}</td>
        </tr>
      </React.Fragment>
    );
  }
}

export default CarPartListItem;
