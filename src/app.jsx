import React, { Component } from "react";
import Alert from "./components/alert";
import CarPartEntryForm from "./components/carPartEntryForm";
import CarPartListItem from "./components/carPartListItem";

class App extends Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleNew = this.handleNew.bind(this);
    this.handleAlert = this.handleAlert.bind(this);
    this.handleEntryCompleted = this.handleEntryCompleted.bind(this);
  }
  state = {
    carPartListItems: [],
    visibleListItems: [],
    alertQueue: [],
    curCarPart: {},
    showEntryForm: false
  };

  handleDelete(id) {
    fetch("http://car-part-demo-api.azurewebsites.net/carparts/".concat(id), {
      method: "DELETE"
    }).then(response => {
      let newAlert;
      if (response.ok === true) {
        newAlert = {
          alertClass: "alert alert-success",
          alertStrongText: "Success!",
          alertText: "Car part (ID:" + id + ") successfully deleted.",
          alertSecondsInState: 0,
          displayAlert: true
        };
        this.updateMasterList();
      } else {
        newAlert = {
          alertClass: "alert alert-danger",
          alertStrongText: "Error!",
          alertText: "Failed to delete item from database.",
          alertSecondsInState: 0,
          displayAlert: true
        };
      }
      this.handleAlert(newAlert);
    });
    this.handleEntryCompleted();
  }

  handleEdit(id) {
    const selectedPart = this.state.carPartListItems.filter(
      item => item.id === id
    );
    this.setState({
      editOrNew: "edit",
      showEntryForm: true,
      curCarPart: selectedPart
    });
  }

  handleNew() {
    this.setState({
      editOrNew: "new",
      showEntryForm: true,
      curCarPart: undefined
    });
  }

  handleEntryCompleted() {
    this.updateMasterList();
  }

  handleAlert(newAlert) {
    this.setState({ alertQueue: [newAlert, ...this.state.alertQueue] });
  }

  handleQuery(e) {
    let query = "";
    query = e.target.value;
    query = query.toLowerCase();

    const visibleListItems = this.state.carPartListItems.filter(
      item =>
        item.part_name.toLowerCase().includes(query) |
        item.description.toLowerCase().includes(query) |
        item.car_manufacturer_name.toLowerCase().includes(query) |
        (item.id + "").toLowerCase().includes(query) |
        (item.part_number + "")
          .padStart(5, "0")
          .toLowerCase()
          .includes(query)
    );
    this.setState({ visibleListItems });
  }

  getAlerts() {
    if (this.state.alertQueue.length === 0) return null;
    return (
      <div>
        {this.state.alertQueue.map((alert, i) => (
          <Alert
            key={i}
            text={alert.alertText}
            strongText={alert.alertStrongText}
            class={alert.alertClass}
          />
        ))}
      </div>
    );
  }

  tick() {
    if (this.state.alertQueue.length > 0) {
      let alertQueue = this.state.alertQueue;
      alertQueue.forEach(function(alert) {
        alert.alertSecondsInState = alert.alertSecondsInState + 1;
      });
      alertQueue = alertQueue.filter(alert => alert.alertSecondsInState <= 5);
      this.setState({ alertQueue });
    }
  }

  updateMasterList() {
    fetch("http://car-part-demo-api.azurewebsites.net/carparts")
      .then(response => response.json())
      .then(data =>
        this.setState({
          carPartListItems: data,
          visibleListItems: data,
          showEntryForm: false
        })
      );
  }

  componentWillMount() {
    this.updateMasterList();
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  renderBody() {
    if (this.state.showEntryForm) {
      if (this.state.editOrNew === "edit") {
        const {
          id,
          part_name,
          part_number,
          description,
          car_manufacturer_name
        } = this.state.curCarPart[0];
        return (
          <div>
            {
              <CarPartEntryForm
                key={id}
                id={id}
                part_name={part_name}
                part_number={part_number}
                description={description}
                car_manufacturer_name={car_manufacturer_name}
                onAlert={this.handleAlert}
                editOrNew={this.state.editOrNew}
                onEntryCompleted={this.handleEntryCompleted}
              />
            }
          </div>
        );
      } else {
        return (
          <div>
            <CarPartEntryForm
              onAlert={this.handleAlert}
              editOrNew={this.state.editOrNew}
              onEntryCompleted={this.handleEntryCompleted}
            />
          </div>
        );
      }
    } else {
      return (
        <div>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Options</th>
                <th scope="col">ID</th>
                <th scope="col">Part #</th>
                <th scope="col">Part Name</th>
                <th scope="col">Description</th>
                <th scope="col">Car Manufacturer Name</th>
              </tr>
            </thead>
            <tbody>
              {this.state.visibleListItems.map(item => (
                <CarPartListItem
                  key={item.id}
                  id={item.id}
                  part_name={item.part_name}
                  part_number={item.part_number}
                  description={item.description}
                  car_manufacturer_name={item.car_manufacturer_name}
                  onDelete={this.handleDelete}
                  onEdit={this.handleEdit}
                />
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        <div className="panel panel-primary">
          <div className="panel-heading">
            <table border="0" style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td>Car Parts</td>
                  <td style={{ width: "20%" }}>
                    <input
                      type="text"
                      id="query"
                      className="form-control"
                      placeholder="search"
                      onChange={e => this.handleQuery(e)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="panel-body">
            {this.getAlerts()}
            <div>
              <button
                onClick={this.handleNew}
                className="btn btn-secondary btn-sm pull-right"
              >
                Create New
              </button>
            </div>
            {this.renderBody()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
