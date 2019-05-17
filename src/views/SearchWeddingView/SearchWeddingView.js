import React, {Component} from 'react';
import classes from './SearchWeddingView.module.css';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import ControlBar from '../../components/ControlBar/ControlBar';
import GeoMap from '../../components/Geo/GeoMap';
import {getSearchedWeddingActionHandler} from '../../actions/weddingAction';
import ReactPaginate from 'react-paginate';
import Loading from '../../components/Loading/Loading';

class SearchWeddingView extends Component {

    state={
        weddings: [],
        totalNum: 0,
        cities_data: [],
        show_animation: false
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // get data
        this.getWeddingDataHandler(window.location.search);
    }

    /*
    shouldComponentUpdate(nextProps, nextState) {
        console.log(nextProps);
        console.log(this.props);
    }*/

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.location.search !== this.props.location.search) {
            //update data
            this.getWeddingDataHandler(this.props.location.search);
        }
    }

    getWeddingDataHandler = async (args) => {
        // show loading animation
        this.setState({
            show_animation: true
        });
        // get data
        const params = args.slice(1).split('&');
        let req = {};
        params.forEach(item => {
            const key = item.split('=')[0];
            const value = item.split('=')[1];
            req[key]= value && value.replace(/%20/g, ' ');
        });

        const res = await this.props.getSearchedWeddingActionHandler(req);
        if (res.signal) {

            const map = {};
            res.weddings.forEach(item => {
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
                        'likes': item.likeUsers.length,
                        'dislikes': item.dislikeUsers.length,
                        'price': item.price,
                        'country': item.country
                    };
                }
            });

            const arr = [];

            for (let key in map) {
                arr.push(map[key]);
            }


            this.setState({
                weddings: res.weddings,
                totalNum: res.totalNum,
                cities_data: arr,
                show_animation: false
            })
        } else {
            // just no weddings
            this.setState({
                weddings: [],
                show_animation: false
            })
        }
    }

    toWeddingViewHandler = (weddingId) => {
        // to weddingView
        this.props.history.push(`/viewWedding?id=${weddingId}`);
        return;
    }

    showWeddingContentHandler = (weddings) => {
        return weddings.map((item, index) => (
            <div className={classes.singleWeddingContainer} 
                key={index}
                onClick={this.toWeddingViewHandler.bind(this, item._id)}>
                    <div>
                        <img src={item.backgroundImg} />
                    </div>
                    <div>
                        <span>{item.weddingTitle}</span>
                    </div>
            </div>
        ))
    }

    pageChangeHander = (data) => {
        if (window.location.search.indexOf('page') === -1) {
            this.props.history.push(`/searchWedding` + (window.location.search ? `${window.location.search}&` : '?') + `page=${data.selected}`);
            return;
        }
        const arr = window.location.search.slice(1).split('&');
        
        arr = arr.map(item => {
            if (item.split('=')[0] === 'page') {
                return `${item.split('=')[0]}=${data.selected}`;
            }
            return item;
        })
        this.props.history.push(`/searchWedding?` + arr.join('&'));
    }

    render() {
        return (
            <div className={classes.container}>
                {this.state.show_animation && <div className={classes.geoAnimation}>
                    <Loading />
                </div>}
                <GeoMap cities_data={this.state.cities_data}/>
                <ControlBar />
                <div className={classes.content}>
                    <span>{`Result: ${this.state.weddings.length}`}</span>

                    <div className={classes.weddingContainer}>
                        {this.state.weddings.length > 0 &&
                            this.showWeddingContentHandler(this.state.weddings).map(item => item)
                        }
                        {!this.state.weddings.length > 0 && !this.state.show_animation 
                            && <div>
                                <span>No result</span>
                            </div>}
                        {this.state.show_animation &&
                            <div className={classes.contentAnimation}>
                                <Loading />
                            </div>}

                    </div>

                    {this.state.weddings.length > 0 && 
                        <div className={classes.paginateContainer}>
                            <ReactPaginate
                                
                                previousLabel={'previous'}
                                nextLabel={'next'}
                                breakLabel={'...'}
                                breakClassName={'break-me'}
                                pageCount={Math.ceil(this.state.totalNum / 10)}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={this.pageChangeHander}
                                containerClassName={'pagination'}
                                subContainerClassName={'pages pagination'}
                                activeClassName={'active'}
                            />
                    </div>}
                </div>
            </div>
            
        )
    }
}

export default withRouter(connect(null, {
    getSearchedWeddingActionHandler
})(SearchWeddingView));