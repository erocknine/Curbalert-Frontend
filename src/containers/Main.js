import React, { useState } from 'react';
import Map from '../components/map'
import Dashboard from '../components/dashboard'
import Active from '../components/active'

import {
  Redirect
} from "react-router-dom";

export default function Main({ user, currentLat, currentLong, items, dashboard, address, onSortEnd, addToDashboard, removeFromDashboard, handleClaim, handleAvail, handleSearchActive, searchActive, fetchLocation, checkDistance, fetchDirections, polyline, route, routeId, plotMarker, plot }) {

  const [dash, setDash] = useState(false)
  return (
    <main className="main-container">
      {user === "pending" && <Redirect to="/login"/>}
        <Map 
        currentLat={currentLat} 
        currentLong={currentLong} 
        items={items}
        address={address}
        addToDashboard={addToDashboard}
        fetchLocation={fetchLocation}
        checkDistance={checkDistance}
        polyline={polyline}
        route={route}
        plot={plot}
        />
      <section className="items-section">
        <div className="header">
          <h2 className={dash ? "header-text-large":"header-text"} onClick={() => setDash(true)}>Dashboard</h2>
          <h2 className={dash ? "header-text":"header-text-large"} onClick={() => setDash(false)}>Active Items</h2>
        </div>
        <div className="items-section-content">
          {dash ? 
            <Dashboard 
              user={user} 
              currentLat={currentLat} 
              currentLong={currentLong} 
              dashboard={dashboard} 
              onSortEnd={onSortEnd} 
              removeFromDashboard={removeFromDashboard} 
              handleClaim={handleClaim} 
              fetchLocation={fetchLocation} 
              checkDistance={checkDistance} 
              fetchDirections={fetchDirections} 
              route={route} routeId={routeId} 
              plotMarker={plotMarker}
            />:
            <Active 
              user={user} 
              items={items} 
              addToDashboard={addToDashboard} 
              handleClaim={handleClaim} 
              handleAvail={handleAvail} 
              handleSearchActive={handleSearchActive} 
              searchActive={searchActive} 
              fetchLocation={fetchLocation} 
              checkDistance={checkDistance} 
              plotMarker={plotMarker}
            />
          }
        </div>
      </section>
    </main>
  )
}