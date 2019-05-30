import React, {PureComponent} from 'react';
import GeoMap from '../../components/Geo/GeoMap';
import classes from './MainView.module.css';
import ControlBar from '../../components/ControlBar/ControlBar';
import Carousel from '../../components/Carousel/Carousel';

import * as FontAwesome from 'react-icons/lib/md';
import {withRouter} from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import {connect} from 'react-redux';
import Loading from '../../components/Loading/Loading';

import {getWeddingCitiesDataActionHandler} from '../../actions/weddingAction';

class MainView extends PureComponent {

    state = {
        cities_data: []
    }

    componentDidMount() {
        this.initialCitiesDataHandler();
    }

    initialCitiesDataHandler = async () => {
        const res = await this.props.getWeddingCitiesDataActionHandler();
        if (res.signal) {
            const map = {};

            res.weddings.forEach(item => {
                if (item.long && item.long.length > 0) {
                    if (map[item.city] !== undefined) {
                        let point = map[item.city];
    
                        map[item.city].price = (point.price * point.num + item.price)/(point.num + 1); 
                        map[item.city].likes += item.likeUsers.length;
                        map[item.city].dislikes += item.dislikeUsers.length
                        map[item.city].num += 1;
                    } else {
                        map[item.city] = {
                            'name': item.city,
                            'coordinates': [parseFloat(item.long), parseFloat(item.lati)],
                            'num': 1,
                            'state': item.state,
                            'likes': item.likeUsers.length,
                            'dislikes': item.dislikeUsers.length,
                            'price': item.price,
                            'country' : item.country
                        };
                    }
                }
                
            });

            const arr = [];

            for (let key in map) {
                arr.push(map[key]);
            }

            this.setState({
                cities_data: arr 
            })
        } else {
            console.log('error');
        }
    }

    createWeddingHandler = (e) => {
        if (this.props.current_user) {
            this.props.history.push('/create-wedding');
        } else {
            this.props.history.push('/loginView');
        }
    }


    

    render() {
        return (
            <div className={classes.container}>
                
                {this.state.cities_data.length === 0 && <div className={classes.geoLoading}>
                    <Loading />
                </div>}
                <GeoMap cities_data={this.state.cities_data} />
                <ControlBar />

                <div className={classes.textContainer}>
                    <span>
                        {`What's your wedding idea?`}
                    </span>
                    <button onClick={this.createWeddingHandler}>
                        {'SHARE MY IDEA'}
                    </button>
                </div>


                <div className={classes.placeContainer}>
                    <div className={classes.placeLeftDiv}>
                        <div>
                            <img src="/images/nywedding.jpg" />
                            <span onClick={() => {this.props.history.push('/searchWedding?country=United States&state=New York&page=0')}}>NEW YORK</span>
                        </div>
                        <div>
                            <img src="/images/hawaiiwedding.jpg" />
                            <span onClick={()=>{this.props.history.push('/searchWedding?country=United%20States&state=Hawaii&page=0')}}>HAWAII</span>
                        </div>
                        <div>
                            <img src="/images/barcelonawedding.jpg" />
                            <span onClick={()=>{this.props.history.push('/searchWedding?country=Spain&state=Barcelona&page=0')}}>BARCELONA</span>
                        </div>
                        <div>
                            <img src="/images/londonwedding.jpg" />
                            <span onClick={()=>{this.props.history.push('/searchWedding?country=United%20Kingdom&state=London&page=0')}}>LONDON</span>
                        </div>
                        <div>
                            <img src="/images/pariswedding.jpg" />
                            <span onClick={()=>{this.props.history.push('/searchWedding?country=France&state=Paris&page=0')}}>PARIS</span>
                        </div>
                        <div>
                            <img src="/images/irelandwedding.jpg" />
                            <span onClick={()=>{this.props.history.push('/searchWedding?country=Ireland&state=Dublin&page=0')}}>IRELAND</span>
                        </div>
                    </div>
                    {/*
                    <div className={classes.placeRightDiv}>
                        <span>
                            <p>{'Find Weddings In Your City'}</p>
                        </span>
                    </div>
                        */}
                </div>

                <div className={classes.carouselContainer}>
                    <Carousel />
                </div>
                <div className={classes.findMoreButtonForCarouse}>
                    <button onClick={()=>{this.props.history.push('/searchWedding?page=0')}}>{'FIND MORE AWESOME DESIGN'}</button>
                </div>


                <div className={classes.plainContainer}>
                    <div>
                        <div>
                            <span>
                            <FontAwesome.MdPerson style={{
                                    'width' :'90%',
                                    'height':'90%'
                                }} />
                            </span>
                        </div>
                        <div>
                            <span>
                            <FontAwesome.MdPeople style={{
                                    'width' :'100%',
                                    'height':'100%'
                                }} />
                            </span>
                        </div>
                        <div>
                            <span>
                                <FontAwesome.MdTimeline style={{
                                    'width' :'100%',
                                    'height':'100%'
                                }} />
                            </span>
                        </div>
                    </div>
                </div>
                
                <Footer />
                
                
                
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        current_user: state.login_data.currentUser

    }
}

export default withRouter(connect(mapStateToProps, {
    getWeddingCitiesDataActionHandler
})(MainView));