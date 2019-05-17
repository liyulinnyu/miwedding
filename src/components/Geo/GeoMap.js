import React, { Component } from "react"
import ReactDOM from "react-dom";
import classes from './GeoMap.module.css';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Markers,
  Marker,
} from "react-simple-maps";

import { scaleLinear } from "d3-scale"
import { Motion, spring } from "react-motion"

import world_counries_data from '../../util/world_data';
/*import cities_data from '../../util/cities_data';*/
import test_cities from 'cities.json';
import {withRouter} from 'react-router-dom';
import * as FontAwesomeIo from 'react-icons/lib/io';

class GeoMap extends Component {
    state = {
        center: [0,20],
        zoom: 1,
        showCityInfoContainer: false,
        current_city_name: '',
        current_city_num: '',
        current_city_likes: '',
        current_city_dislikes: '',
        current_city_price: ''
    }

    constructor(props) {
        super(props)
        this.cityInfoContainerEl = React.createRef();
    }

    handleZoomIn = () => {
        this.setState({
          zoom: this.state.zoom * 2,
        })
    }

    handleZoomOut = () => {
        if (this.state.zoom === 1) {
            return;
        }
        this.setState({
          zoom: this.state.zoom / 2,
        }, () => {
            if (this.state.zoom === 1) {
                this.setState({
                    center: [0,20]
                })
            }
        })
    }
      
    handleCityClick = (city, cor, e) => {
        if (this.state.zoom >= 2) {
            this.props.history.push(`/searchWedding?country=${city.country}&state=${city.name}&page=0`);
            return;
        } 
        this.setState({
          zoom: 2,
          center: city.coordinates
        })
    }

    mouseEnterCityHandler = (city, e) => {
        if (this.state.zoom >= 2) {
            e.target.style.cursor = 'pointer';
        } 
        const top = e.target.getBoundingClientRect().top + document.documentElement.scrollTop;
        const left = e.target.getBoundingClientRect().left + document.documentElement.scrollLeft;
        

        this.setState({
            showCityInfoContainer: true,
            current_city_name: city.name,
            current_city_num: city.num,
            current_city_likes: city.likes,
            current_city_dislikes:city.dislikes,
            current_city_price: city.price
        }, () => {
            this.cityInfoContainerEl.current.style.top = top - 80 + 'px'; // minus the navigation height
            this.cityInfoContainerEl.current.style.left = left + 'px';
        })
    }

    mouseLeaveCityHandler = (city, e) => {
        this.setState({
            showCityInfoContainer: false
        })
    } 
    handleReset = () => {
        this.setState({
          center: [0,20],
          zoom: 1,
        })
    }

    render() {
        /*
        const kunming = test_cities.filter((item) => {
            if (item.name === 'Kunming') {
                return item;
            }
        });
        cities_data.push({
            'name': kunming[0].name,
            "coordinates": [parseFloat(kunming[0].lng), parseFloat(kunming[0].lat)],
            "population": 17712000 
        });
        console.log(kunming[0]);
        */

        const cities_data = this.props.cities_data;

        return(
        <div>
            {this.state.showCityInfoContainer && 
            <div 
                className={classes.cityInfoContainer}
                ref={this.cityInfoContainerEl}>
                <div><FontAwesomeIo.IoIosEye /><p>{this.state.current_city_name}</p></div>
                <span><FontAwesomeIo.IoEgg style={{'color':'blue'}}/><p>{this.state.current_city_num}</p></span>
                <span><FontAwesomeIo.IoSocialUsd style={{'color':'goldenrod'}} /><p>{this.state.current_city_price}</p></span>
                <span><FontAwesomeIo.IoHeart style={{'color':'#cf5a5f'}} /><p>{this.state.current_city_likes}</p></span>
                <span><FontAwesomeIo.IoHeartBroken style={{'color':'gray'}} /><p>{this.state.current_city_dislikes}</p></span>
            </div>}
            <Motion
                defaultStyle={{
                    zoom: 1,
                    x: 0,
                    y: 20,
                }}
                style={{
                    zoom: spring(this.state.zoom, {stiffness: 210, damping: 20}),
                    x: spring(this.state.center[0], {stiffness: 210, damping: 20}),
                    y: spring(this.state.center[1], {stiffness: 210, damping: 20}),
                }}
            >
            {({zoom,x,y}) => (
                <ComposableMap 
                    width={1000}
                    height={250}
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                    projectionConfig={{
                        scale: 200,
                        xOffset: 0,
                        yOffset: -20,
                        rotation: [0,0,0],
                        precision: 0.0001,
                    }} >
                {/*disablePanning*/}
                <ZoomableGroup center={[x,y]} zoom={zoom}>
                <Geographies geography={ world_counries_data }>
                    {(geographies, projection) => geographies.map(geography => (
                    <Geography
                        key={ geography.id }
                        geography={ geography }
                        projection={ projection }
                        style={{
                            default: {
                            fill: "#ECEFF1",
                            stroke: "#607D8B",
                            strokeWidth: 0.25,
                            outline: "none",
                            },
                            hover: {
                            fill: "#CFD8DC",
                            stroke: "#607D8B",
                            strokeWidth: 0.25,
                            outline: "none",
                            },
                            pressed: {
                            fill: "#FF5722",
                            stroke: "#607D8B",
                            strokeWidth: 0.25,
                            outline: "none",
                            },
                        }}
                        />
                    ))}
                </Geographies>
                <Markers>
                    {/*fill: rgba(255,87,34,0.8) stroke="#607D8B"*/}
                    {
                        cities_data.map((city, i) => (
                        <Marker key={i} marker={city} 
                            onClick={this.handleCityClick}
                            onMouseEnter={this.mouseEnterCityHandler}
                            onMouseLeave={this.mouseLeaveCityHandler}>
                            <circle
                            cx={0}
                            cy={0}
                            r={6}
                            fill="rgb(207,90,95)"
                            stroke="rgb(207,90,95)"
                            strokeWidth="1"
                            outline="none"
                            />
                        </Marker>
                        ))
                    }
                    </Markers>
                </ZoomableGroup>
                </ComposableMap>
            )}
            </Motion>
            
            <div className={classes.buttonContainer}>
                <button onClick={this.handleZoomIn}>
                    { "+" }
                </button>
                <button onClick={this.handleZoomOut}>
                    { "-" }
                </button>
                <button onClick={this.handleReset}>
                    { "R" }
                </button>
            </div>
            
        </div>
        )
    }
}

export default withRouter(GeoMap);