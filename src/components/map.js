import React, { useState } from 'react';
import { Map, Marker, Popup, TileLayer, Polyline } from 'react-leaflet'
import { Icon } from 'semantic-ui-react'
import UIfx from 'uifx';
import Sound from '../sounds/switch-click.mp3'
import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';

const switchClick = new UIfx(Sound);

const DirectionSteps = ({ steps }) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="more-details" onClick={() => setOpen(!open)}>
      <Icon name={open ? 'caret down':'caret right'}/>
      <span>More Details</span>
        {open && <div className="direction-details">
          {steps.map(step => {
            return <p><Icon name="angle double right"/>{step.html_instructions.replace(/(<([^>]+)>)/ig,"")} (<strong>{step.distance.text}</strong>)</p>
          })}
        </div>}
    </div>
  )
}

export default class MapContainer extends React.Component {
  state = {
    zoom: 15,
    large: false,
  }

  setLarge = () => {
    this.setState({
      ...this.state,
      large: !this.state.large
    })
  }

  renderStepMarkers = (route, pinStep) => {
    const steps = route.legs[0].steps
    console.log(steps)

    return steps.map((step, index) => {
        return (
        <Marker icon={pinStep} key={index} position={Object.values(step.start_location)}>
          <Popup>
          <div className="popup">
            <div className="step-distance-duration">
              <span>Distance: {step.distance.text}  </span>
              <span>Duration: {step.duration.text}</span>
            </div>
            <span className="instructions">{step.html_instructions.replace(/(<([^>]+)>)/ig,"")}</span>
              {"transit_details" in step && 
                <div className="transit-details">
                  <img src={step.transit_details.line.icon} alt={step.transit_details.line.name}/>
                  <p>From <strong>{step.transit_details.departure_stop.name}</strong>, take {step.transit_details.line.name} to <strong>{step.transit_details.arrival_stop.name}</strong></p>
                </div>
              }
              {"steps" in step && <DirectionSteps steps={step.steps}/>}
          </div>
          </Popup>
        </Marker>
        )
      })
  }

  render() {
    const { currentLat, currentLong, items, street, city, state, zip, addToDashboard, polyline, route } = this.props
    const position = [currentLat, currentLong]

    const pinU = renderToStaticMarkup(<i id="user" class="fas fa-map-pin"></i>)
    const pinI = renderToStaticMarkup(<i id="item" class="fas fa-map-pin"></i>)
    const step = renderToStaticMarkup(<i id="step" class="fas fa-map-marker-alt"></i>)
    const pinUser = divIcon({ html: pinU });
    const pinItem = divIcon({ html: pinI });
    const pinStep = divIcon({ html: step });

    return (

      <div className="map-container">
        <Map className="map" center={position} zoom={this.state.zoom} 
        style={{display: "inline-block", margin:"0px 1.2rem 0 .5rem", height: "87.5vh", width: "57vw", border:"2px solid gray", borderRadius: "10px", zIndex:"0"}}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <Marker icon={pinUser} position={position}>
            <Popup>
              <div className="popup">
                <h4>{street}, {city}, {state} {zip}</h4>
                <span>You are Here!</span>
              </div>
            </Popup>
          </Marker>

          {Object.keys(route).length > 0 && this.renderStepMarkers(route, pinStep)}

          {polyline.length > 0 &&
            <Polyline positions={polyline}/>
          }

          {items.length > 0 &&
            items.map(item => {
              return <Marker key={item.id} icon={pinItem} id={item.id} position={[item.latitude, item.longitude]}>
                <Popup>
                  <div className="popup">
                    <div className="popup-name">
                      <Icon className="popup" name="add square" onClick={() => {addToDashboard(item);switchClick.play()}}/>
                      <h3>{item.name}</h3>
                    </div>
                    <p className="posted-by">Posted: <span className="username"><strong>{item.users[0].username}</strong></span> <Icon name="star"/>{item.users[0].rating}</p>
                    <div className="image-container">
                      <img className={this.state.large ? "popup-image-large":"popup-image"} src={item.image_url} alt={item.name} onClick={() => this.setLarge()}/>
                    </div>
                    <p>{item.date} <strong>{item.time}</strong></p>
                    <div className="card-details">
                      <div className="card-left">
                        <span>{item.street_address}, {item.city_address}, {item.state_address} {item.zip_address}</span>
                      </div>
                      <div className="card-right">
                        <span>{item.quality}</span>
                        <span>{item.category}</span>
                      </div>
                    </div>
                    <span className="comment">{item.comment}</span>
                    <p className="posted-by">Claimed: {item.claimed ? "Yes":"No"}</p>
                  </div>
                </Popup>
              </Marker>
            })
          }
        </Map>
      </div>
    )
  }
}