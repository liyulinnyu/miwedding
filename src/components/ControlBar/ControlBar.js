import React, {PureComponent} from 'react';
import classes from './ControlBar.module.css';
import countries_states_cities from '../../util/countries_states_cities';
import * as FontAwesome from 'react-icons/lib/fa';
import {withRouter} from 'react-router-dom';
import {SuccessMessage, ErrorMessage, NormalMessage} from '../../components/Message/Message';

class ControlBar extends PureComponent {

    state = {
        showFilter: false,
        country: null,
        selectedState: null,
        minPrice:null,
        maxPrice:null,
        season:null,
        filterNum: 0,
        states: [],

        // show message alert
        show_success_message: false,
        show_error_message: false,
        alert_message: ''
    }

    constructor(props) {
        super(props);
        this.searchInputEl = React.createRef();
        this.countryInputEl = React.createRef();
        this.minPriceEl = React.createRef();
        this.maxPriceEl = React.createRef();
        this.stateEl = React.createRef();
    }

    changeCountryHandler = (e) => {
        countries_states_cities.filter(item => {
            if (item.name === e.target.value) {
                let states = [];
                for (let key in item.states) {
                    states.push(key);
                }
                this.setState({
                    states: states
                });
            }
        })
    }

    showFilterHandler = () => {
        
        this.setState({
            showFilter: !this.state.showFilter
        }, () => {
            if (this.state.showFilter) {
                // open, check filter
                if (this.state.country) {
                    this.countryInputEl.current.value = this.state.country;
                }
                if (this.state.selectedState) {
                    this.stateEl.current.value = this.state.selectedState;
                }
                if (this.state.minPrice) {
                    this.minPriceEl.current.value = this.state.minPrice;
                }
                if (this.state.maxPrice) {
                    this.maxPriceEl.current.value = this.state.maxPrice;
                }
                if (this.state.season) {
                    const all_span = document.querySelectorAll(`.${classes.seasonSpan}`);
                    [...all_span].forEach((item) => {
                        if (item.innerText.indexOf(this.state.season) > -1) {
                            item.className = `${classes.seasonSpan} ${classes.activeSpan}`;
                        }
                    });
                }
            }
        });
    }

    doSearchHandler = () => {
        let query = '';
        query += this.searchInputEl.current.value.trim().length > 0 ? `content=${this.searchInputEl.current.value.trim().toLowerCase()}` : '';
        query += this.state.country ? ((query ? '&' : '')  + `country=${this.state.country}`) : '';
        query += this.state.selectedState ? ((query ? '&' : '')  + `state=${this.state.selectedState}`) : '';
        query += this.state.minPrice ? ((query ? '&' : '')  + `minPrice=${this.state.minPrice}`) : '';
        query += this.state.maxPrice ? ((query ? '&' : '')  + `maxPrice=${this.state.maxPrice}`) : '';
        query += this.state.season ? ((query ? '&' : '')  + `season=${this.state.season}`) : ''; 
        query += (query ? '&' : '')  + 'page=0';
        this.props.history.push('/searchWedding' + (query ? `?${query}` : ''));
    }

    selectSeasonHandler = (e) => {
        if (e.target.className === `${classes.seasonSpan}`) {
            const all_span = e.currentTarget.querySelectorAll(`.${classes.seasonSpan}`);
            [...all_span].forEach(item => {
                if (item === e.target) {
                    item.className = `${classes.seasonSpan} ${classes.activeSpan}`;
                    this.setState({
                        season: e.target.innerText.slice(e.target.innerText.indexOf('(')+1, e.target.innerText.indexOf(')'))
                    })
                } else {
                    item.className = `${classes.seasonSpan}`;
                }
            })
        }
    }

    applyFilterHandler = (e) => {
        const minPrice = parseInt(this.minPriceEl.current.value);
        const maxPrice = parseInt(this.maxPriceEl.current.value);
        if (minPrice && typeof minPrice !== 'number' || maxPrice && typeof maxPrice !== 'number' || minPrice && maxPrice && maxPrice < minPrice) {
            alert('wrong price setting');
            return;
        }
        let num = 0;
        if (this.countryInputEl.current.value !== 'default') {
            num++;
        }
        if (this.stateEl.current.value !== 'default') {
            num++;
        }
        if (parseInt(minPrice) >= 0) {
            num++;
        }
        if (parseInt(maxPrice) >= 0) {
            num++;
        }
        if (this.state.season) {
            num++;
        }
        this.setState({
            country: this.countryInputEl.current.value === 'default' ? null : this.countryInputEl.current.value,
            selectedState: this.stateEl.current.value === 'default' ? null : this.stateEl.current.value,
            minPrice: parseInt(minPrice) >= 0 ? parseInt(minPrice):null,
            maxPrice: parseInt(maxPrice) >= 0 ? parseInt(maxPrice):null,
            filterNum: num,
            showFilter: false
        })
    }


    clearFilterHandler = () => {
        this.setState({
            showFilter: false,
            selectedState: null,
            country: null,
            minPrice: null,
            maxPrice: null,
            season: null,
            filterNum: 0
        }, () => {
            this.setState({
                show_success_message: true,
                alert_message: 'successful clear'
            });
        })
    }


    closeMessageHandler = () => {
        this.setState({
            show_success_message: false,
            show_error_message: false
        })
    }

    render() {
        return (
            <React.Fragment>
                {this.state.show_success_message && 
                    <SuccessMessage
                        closeMessageHandler={this.closeMessageHandler}
                        message={this.state.alert_message} />
                }
                <div className={classes.container}>
                    <span onClick={this.doSearchHandler}>
                        <FontAwesome.FaSearch />
                    </span>
                    <input type='text' placeholder={"SEARCH CITY/WEDDING NAME/PRICE"} ref={this.searchInputEl} />
                    
                    <span className={classes.filterButton} onClick={this.showFilterHandler}>
                        {`Filter ${this.state.filterNum > 0 ? this.state.filterNum : ''}`}
                    </span>
                </div>

                {this.state.showFilter && <div className={classes.filterContainer}>
                    <table style={{'borderCollapse':'separate', 'borderSpacing':'0px 10px'}}>
                        <tbody>
                            <tr>
                                <td>Country:</td>
                                <td>
                                    <select onChange={this.changeCountryHandler} ref={this.countryInputEl}>
                                        <option value={'default'}>default</option>
                                        {countries_states_cities.map(item => {
                                            return (
                                                <option value={item.name} key={item.id}>{item.name}</option>
                                            )
                                        })
                                        }
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>State:</td>
                                <td>
                                    <select ref={this.stateEl}>
                                        <option>{'default'}</option>
                                            {this.state.states.map((item, index) => {
                                                return <option key={index}>{item}</option>
                                            })}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>Price:</td>
                                <td>
                                    <input type='number' placeholder={'Min'} ref={this.minPriceEl} />
                                    <span> - </span>
                                    <input type='number' placeholder={'Max'} ref={this.maxPriceEl}/>
                                </td>
                            </tr>
                            <tr>
                                <td>Season:</td>
                                <td onClick={this.selectSeasonHandler}>
                                    <label className={classes.seasonSpan}>Spring(3-5)</label>
                                    <label className={classes.seasonSpan}>Summer(6-8)</label>
                                    <label className={classes.seasonSpan}>Fall(9-11)</label>
                                    <label className={classes.seasonSpan}>Winter(12-2)</label>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <button onClick={this.clearFilterHandler}>Clear Filter</button>
                                    <button onClick={this.applyFilterHandler}>Apply</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>}
            </React.Fragment>
        )
    }
}


export default withRouter(ControlBar);