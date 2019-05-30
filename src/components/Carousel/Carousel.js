import React, {Component} from 'react';
import classes from './Carousel.module.css';
import * as FontAwesome from 'react-icons/lib/fa';
import {Debounce, Throttle} from 'react-throttle';
import {connect} from 'react-redux';
import {getRecommendedWeddingActionHandler} from '../../actions/weddingAction';
import {withRouter} from 'react-router-dom';
import Loading from '../Loading/Loading';

class Carousel extends Component {

    state = {
        data: null,
        leftHideBlockNum:0,
        rightHideBlockNum:0
    }

    constructor(props) {
        super(props);
        this.doingAni = false;
    }
    
    componentDidMount() {
        this.getRecommendedWedding();
    }

    getRecommendedWedding = async () => {
        const res = await this.props.getRecommendedWeddingActionHandler();
        if (res.signal) {
            
            this.setState({
                data: res.weddings
            }, () => {
                window && window.addEventListener('resize', this.resetCarousel, false);
                this.resetCarousel();
            });
            
        } else {
            console.log('err');
        }
    }

    componentWillUnmount() {
        window && window.removeEventListener('resize', this.resetCarousel);
    }

    resetCarousel = (e) => {
        let container = document.querySelector(`.${classes.blockContainer}`);
        let rightHideBlockNum = 0;
        // 850, 610, 500
        if (window.matchMedia("(min-width: 1101px)").matches) {
            
            // set here!!!!
            rightHideBlockNum = this.state.data.length - 4;
            container.style.marginLeft = 'calc(10vw * 0.05 + 100px * 0.05 - 100vw * 0.05 + 2px)';
        } else if (window.matchMedia("(max-width: 1100px) and (min-width: 851px)").matches) {
            rightHideBlockNum = this.state.data.length - 3;
            container.style.marginLeft = 'calc(10vw * 0.03 + 100px * 0.03 - 100vw * 0.03 + 2px)';
        } else if (window.matchMedia("(max-width: 850px) and (min-width: 611px)").matches) {
            rightHideBlockNum = this.state.data.length - 2;
            container.style.marginLeft = 'calc(10vw * 0.05 + 100px * 0.05 - 100vw * 0.05 + 2px)';
        } else if (window.matchMedia("(max-width: 610px) and (min-width: 501px)").matches) {
            rightHideBlockNum = this.state.data.length - 1;
            container.style.marginLeft = 'calc(10vw * 0.2 + 100px * 0.2 - 100vw * 0.2 + 2px)';
        } else if (window.matchMedia("(max-width: 500px)").matches) {
            rightHideBlockNum = this.state.data.length - 1;
            container.style.marginLeft = 'calc(10vw * 0.1 + 100px * 0.1 - 100vw * 0.1 + 2px)';
        }
        
        this.setState({
            rightHideBlockNum: rightHideBlockNum,
            leftHideBlockNum: 0
        });
    }

    leftArrowButtonHandler = (e) => {
        if (this.state.rightHideBlockNum === 0 || this.doingAni === true) {
            return;
        }

        this.doingAni = true;
        let container = document.querySelector(`.${classes.blockContainer}`);
        let block = document.querySelector(`.${classes.blockContent}`);
        const container_margin_left = parseFloat(window.getComputedStyle(container).marginLeft);
        const block_width = parseFloat(window.getComputedStyle(block).width);
        const block_margin_left = parseFloat(window.getComputedStyle(block).marginLeft);
        
        let that = this;
        container.style.marginLeft = container_margin_left + 'px';


        let animation = setInterval(function(container) {
            if (parseFloat(window.getComputedStyle(container).marginLeft) <= container_margin_left - block_margin_left - block_width + 2) {
                clearInterval(animation);
                this.doingAni = false;
                return;
            }

            container.style.marginLeft = parseFloat(window.getComputedStyle(container).marginLeft) + (block_margin_left - block_width)/50 + 'px';
        }.bind(that, container), 0);

        this.setState({
            leftHideBlockNum: this.state.leftHideBlockNum + 1,
            rightHideBlockNum: this.state.rightHideBlockNum - 1
        });
        container = null;
    };

    rightArrowButtonHandler = (e) => {
        if (this.state.leftHideBlockNum === 0 || this.doingAni === true) {
            return;
        }
        
        this.doingAni = true;
        let container = document.querySelector(`.${classes.blockContainer}`);
        let block = document.querySelector(`.${classes.blockContent}`);
        const container_margin_left = parseFloat(window.getComputedStyle(container).marginLeft);
        const block_width = parseFloat(window.getComputedStyle(block).width);
        const block_margin_left = parseFloat(window.getComputedStyle(block).marginLeft);
        
        let that = this;
        container.style.marginLeft = container_margin_left + 'px';


        let animation = setInterval(function(container) {
            if (parseFloat(window.getComputedStyle(container).marginLeft) >= container_margin_left + block_margin_left + block_width - 2) {
                clearInterval(animation);
                this.doingAni = false;
                return;
            }

            container.style.marginLeft = parseFloat(window.getComputedStyle(container).marginLeft) - (block_margin_left - block_width)/50 + 'px';
        }.bind(that, container), 0);


        this.setState({
            leftHideBlockNum: this.state.leftHideBlockNum - 1,
            rightHideBlockNum: this.state.rightHideBlockNum + 1
        });
        container = null;
    }


    toWeddingViewHandler = (weddingId) => {
        this.props.history.push(`/viewWedding?id=${weddingId}`);
    }

    render() {
        return (
            <div className={classes.container}>
                {!this.state.data && <div className={classes.carLoading}>
                            <Loading />
                        </div>}
                <span className={`${classes.leftArrow} ${classes.arrowControl}`}>
                        <p onClick={this.leftArrowButtonHandler}>{'<'}</p>
                
                </span>
                <div className={classes.content}>

                    <div className={classes.blockContainer}>
                        
                        {this.state.data && this.state.data.map((item, index) => (

                            <div className={classes.blockContent} 
                                onClick={this.toWeddingViewHandler.bind(this, item._id)}
                                key={index}>
                                <div className={classes.blockImg}>
                                    <img src={item.backgroundImg} />
                                </div>
                                <div className={classes.blockPrice}>
                                    <FontAwesome.FaMoney style={{
                                        'marginTop': '-4px',
                                        'color': '#cf5a5f',
                                        'width': '30px',
                                        'height':'30px',
                                        'marginRight':'20px'
                                    }} />{`$${item.price}`}
                                </div>
                                <div className={classes.blockDes}>
                                    <span>
                                        {item.weddingTitle}
                                    </span>
                                    <span>
                                        <FontAwesome.FaStar style={{
                                            'color':'goldenrod'
                                        }} />
                                        <FontAwesome.FaStar style={{
                                            'color':'goldenrod'
                                        }} />
                                        <FontAwesome.FaStar style={{
                                            'color':'goldenrod'
                                        }} />
                                        <FontAwesome.FaStar style={{
                                            'color':'goldenrod'
                                        }} />
                                        <FontAwesome.FaStar style={{
                                            'color':'goldenrod'
                                        }} />
                                    </span>
                                    <span>
                                        <FontAwesome.FaMapMarker style={{
                                            'marginRight':'10px',
                                            'marginTop':'-3px'
                                        }} />
                                        {`${item.state}, ${item.city}, ${item.country}`}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <span className={`${classes.rightArrow} ${classes.arrowControl}`}>
                        <p onClick={this.rightArrowButtonHandler}>{'>'}</p>
                    
                </span>
            </div>
        )
    }
}


export default withRouter(connect(null, {
    getRecommendedWeddingActionHandler
})(Carousel));