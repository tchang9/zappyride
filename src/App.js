import React, { Component} from 'react';
import './App.css';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import v4 from 'uuid'
import { Card, Button, CardTitle, Form, FormGroup, Label, Input } from 'reactstrap';

var myIcon = L.icon({
  iconUrl: process.env.REACT_APP_PIN_IMAGE,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
});

class App extends Component{

  state = {
    location: {
      lat: 47.6061,
      lng: -122.3321,
    },
    stations: [],
    zoom: 13,
    address: {
      street: "",
      city: "",
      postalCode: ""
    }
  }

  filterStationData = (data) => {
    return data.map(station => {
      return {
        latitude: station.latitude,
        longitude: station.longitude,
        station_name: station.station_name,
        street_address: station.street_address
      }
    })
  }

  renderStations = () => {
    return this.state.stations.map(station => {
      return (
        <Marker 
          key = { v4() }
          position={[station.latitude, station.longitude]}
          icon = {myIcon}>
          <Popup>
            {station.station_name} <br /> {station.street_address}
          </Popup>
        </Marker>
      )
    })
  }

  handleChange = (e) => {
    this.setState({
        address: {...this.state.address, [e.target.name]: e.target.value}
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const address = this.state.address.street + this.state.address.city + this.state.address.postalCode
    const formattedAddress = address.replace(/ /g, "%20")

    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${formattedAddress}%20WA&no_annotations=1&countrycode=us&key=${process.env.REACT_APP_OPENCAGE_API_KEY}&limit=1&language=en&proximity=47.6061,-122.3321&pretty=1`)
    .then(res => res.json())
    .then(res => {
      this.setState({
        location: res.results[0].geometry
      })
    })
  }

  componentDidMount() {
    fetch(`https://developer.nrel.gov/api/alt-fuel-stations/v1.json?fuel_type=ELEC&state=WA&api_key=${process.env.REACT_APP_NREL_API_KEY}&format=JSON`)
    .then(res => res.json())
    .then(res => {
      this.setState({
        stations: [...this.filterStationData(res.fuel_stations)]
      })
    })
  }

  render() {
    const position = [this.state.location.lat, this.state.location.lng]
    return (
      <div className="map">
        <Map className="map" center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {this.state.stations ? this.renderStations() : null}
        </Map>
        <Card style={{position: "absolute"}} body className="message-form">
          <CardTitle>Electric Stations in Washington</CardTitle>
            <Form onSubmit={this.handleSubmit}>
              <FormGroup>
                <Label for="street">Street</Label>
                <Input
                  onChange={this.handleChange}
                  type="text"
                  name="street"
                  value={this.state.address.street}
                  placeholder="Enter Street Name" />
              </FormGroup>
              <FormGroup>
                <Label for="city">City</Label>
                <Input
                  onChange={this.handleChange}
                  type="text"
                  name="city"
                  value={this.state.address.city}
                  placeholder="Enter a City" />
              </FormGroup>
              <FormGroup>
                <Label for="postalCode">Postal Code</Label>
                <Input
                  onChange={this.handleChange}
                  type="number"
                  name="postalCode"
                  value={this.state.address.postalCode}
                  placeholder="Enter a Postal Code" />
              </FormGroup>
              <Button type="submit" color="info">Send</Button>
            </Form> 
        </Card>
      </div>
    );
  }
  
}

export default App;
