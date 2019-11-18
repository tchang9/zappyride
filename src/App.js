import React, { Component} from 'react';
import './App.css';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import v4 from 'uuid'
import { Card, Button, CardTitle, Form, FormGroup, Label, Input } from 'reactstrap';

var myIcon = L.icon({
  iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=',
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
          {this.renderStations()}
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
