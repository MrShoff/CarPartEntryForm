import React, { Component } from "react";

class CarPartEntryForm extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  state = {
    id: this.props.id,
    part_number: this.props.part_number,
    part_name: this.props.part_name,
    description: this.props.description,
    car_manufacturer_name: this.props.car_manufacturer_name
  };

  handleChange(e) {
    this.setState({ [e.target.id]: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();

    const {
      id,
      part_number,
      part_name,
      description,
      car_manufacturer_name
    } = this.state;

    const newPartJson = JSON.stringify({
      part_number: part_number === undefined ? 1 : part_number,
      part_name: part_name === undefined ? "" : part_name,
      description: description === undefined ? "" : description,
      car_manufacturer_name:
        car_manufacturer_name === undefined ? "" : car_manufacturer_name,
      last_updated_by: "(undefined)"
    });

    if (part_number > 99999 || part_number < 1) {
      let newAlert = {
        alertClass: "alert alert-danger",
        alertStrongText: "Error!",
        alertText: "Part number must be between 1 and 99999.",
        alertSecondsInState: 0,
        displayAlert: true
      };
      this.props.onAlert(newAlert);
      this.props.onEntryCompleted();
      return;
    }

    if (id === undefined) {
      // new
      fetch("http://car-part-demo-api.azurewebsites.net/carparts", {
        method: "POST",
        body: newPartJson,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }).then(response => {
        let newAlert;
        if (response.ok === true) {
          newAlert = {
            alertClass: "alert alert-success",
            alertStrongText: "Success!",
            alertText: "New car part successfully created.",
            alertSecondsInState: 0,
            displayAlert: true
          };
        } else {
          newAlert = {
            alertClass: "alert alert-danger",
            alertStrongText: "Error!",
            alertText: "Failed to create new car part.",
            alertSecondsInState: 0,
            displayAlert: true
          };
        }
        this.props.onAlert(newAlert);
        this.props.onEntryCompleted();
      });
    } else {
      // edit
      fetch("http://car-part-demo-api.azurewebsites.net/carparts/" + id, {
        method: "PUT",
        body: newPartJson,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }).then(response => {
        let newAlert;
        if (response.ok === true) {
          newAlert = {
            alertClass: "alert alert-success",
            alertStrongText: "Success!",
            alertText: "Car part (ID:" + id + ") successfully updated.",
            alertSecondsInState: 0,
            displayAlert: true
          };
        } else {
          newAlert = {
            alertClass: "alert alert-danger",
            alertStrongText: "Error!",
            alertText: "Failed to update part (ID:" + id + ") in database.",
            alertSecondsInState: 0,
            displayAlert: true
          };
        }
        this.props.onAlert(newAlert);
        this.props.onEntryCompleted();
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="container">
          <div className="jumbotron">
            <h2>Car Part Entry Form</h2>
            <p>Enter car part details. All fields are required.</p>
          </div>
          {this.getEntryForm()}
        </div>
      </React.Fragment>
    );
  }

  getEntryForm = () => {
    return (
      <form className="form-horizontal">
        {this.getInputFields()}
        <button
          onClick={e => this.handleSubmit(e)}
          className="btn btn-primary m2"
        >
          {this.props.editOrNew === "edit" ? "Save" : "Create"}
        </button>
        <button className="btn btn-secondary">Cancel</button>
      </form>
    );
  };

  getInputFields = () => {
    return (
      <React.Fragment>
        <div className="form-group">
          <label className="control-label col-sm-2" htmlFor="part_id">
            ID
          </label>
          <div className="col-sm-10">
            <input
              type="number"
              className="form-control"
              id="part_id"
              placeholder="<auto generated>"
              defaultValue={this.state.id}
              disabled
            />
          </div>
        </div>
        {this.generateInputField(
          "Part #",
          "number",
          "part_number",
          "ex. 00304",
          this.state.part_number
        )}
        {this.generateInputField(
          "Part Name",
          "text",
          "part_name",
          "ex. Crank Shaft",
          this.state.part_name
        )}
        {this.generateInputField(
          "Description",
          "text",
          "description",
          "describe the car part",
          this.state.description,
          "comment"
        )}
        {this.generateInputField(
          "Car Manufacturer Name",
          "text",
          "car_manufacturer_name",
          "ex. Chrysler",
          this.state.car_manufacturer_name
        )}
      </React.Fragment>
    );
  };

  generateInputField(label, type, id, placeholder, value, classExtra) {
    let classData = "form-control " + classExtra;
    return (
      <div className="form-group">
        <label className="control-label col-sm-2" htmlFor={id}>
          {label}
        </label>
        <div className="col-sm-10">
          <input
            type={type}
            className={classData}
            id={id}
            placeholder={placeholder}
            defaultValue={value}
            onChange={e => this.handleChange(e)}
          />
        </div>
      </div>
    );
  }
}

export default CarPartEntryForm;
