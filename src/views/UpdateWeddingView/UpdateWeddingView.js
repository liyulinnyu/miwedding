import React, {Component} from 'react';
import {connect} from 'react-redux';
import classes from '../CreateWeddingView/CreateWeddingView.module.css';
import countries_states_cities from '../../util/countries_states_cities';
import DropzoneComponent from 'react-dropzone-component';
import * as FontAwesome_Fa from 'react-icons/lib/fa';
import * as FontAwesome_md from 'react-icons/lib/md';
import PreviewWedding from '../../components/PreviewWedding/PreviewWedding';

import {withRouter} from 'react-router-dom';
import {
    getSingleWeddingActionHandler,
    updateWeddingActionHandler
} from '../../actions/weddingAction';
import country_iso from '../../util/country_iso';
import test_cities from 'cities.json';
import {SuccessMessage, ErrorMessage, NormalMessage} from '../../components/Message/Message';

class UpdateWeddingView extends Component {

    state = {
        states_cities: null,
        states: [],
        cities: [],

        backgroundImg: null,

        basicInfo: {},
        showPreviewPage: false,
        closePreviewAni: false,

        showControlContent: false,
        showLinkEditor: false,
        
        wedding: null,

        // show message alert
        show_success_message: false,
        show_error_message: false,
        alert_message: ''
    }


    constructor(props) {
        super(props);
        this.customContentEl = React.createRef();
        this.controlButtonEl = React.createRef();
        this.fileEl = React.createRef();

        this.boldButtonEl = React.createRef();
        this.sizeButtonEl = React.createRef();
        this.italicButtonEl = React.createRef();
        this.alignLeftButtonEl = React.createRef();
        this.alignCenterButtonEl = React.createRef();
        this.alignRightButtonEl = React.createRef();

        this.linkContentTextEl = React.createRef();
        this.linkContentLinkEl = React.createRef();

        this.previewButtonEl = React.createRef();

        this.weddingTitleEl = React.createRef();

        this.countryEl = React.createRef();
        this.stateEl = React.createRef();
        this.cityEl = React.createRef();
        this.dateEl = React.createRef();
        this.priceEl = React.createRef();
        this.typeEl = React.createRef();
        this.designerEl = React.createRef();

        this.backgroundImgEl = React.createRef();

        this.current_p = 0;

        this.color = '#fff';
        this.backgroundColor = '#cf5a5f';
    }


    initialWeddingHandler = async () => {
        const weddingId = window.location.search.split('=')[1];

        const wedding = await this.props.getSingleWeddingActionHandler(weddingId);

        // check if legal user
        if (!wedding || !this.props.current_user || wedding.creatorId._id !== this.props.current_user._id) {
            this.props.history.push('/');
            return;
        }
        
        await this.setState({
            wedding: wedding,
            backgroundImg: wedding.backgroundImg
        })

        await this.changeCountryDetail(this.state.wedding.country);
        this.stateEl.current.value = this.state.wedding.state;
        await this.changeStatesDetail(this.state.wedding.state);
        this.cityEl.current.value = this.state.wedding.city;

        const time = new Date(parseInt(this.state.wedding.weddingDate));
        const date = (time.getDate() + 1 > 9) ? (time.getDate() + 1 + '') : ('0' + (time.getDate() + 1));
        const month = (time.getMonth() + 1 > 9) ? (time.getMonth() + 1 + '') : ('0' + (time.getMonth() + 1));
        const year = time.getFullYear();
        this.dateEl.current.value = `${year}-${month}-${date}`;

        this.customContentEl.current.innerHTML = this.state.wedding.customContent ||
                `<section >
                    <p data-placeholder={'Content'}></p>
                </section>`;

        this.updateControlButtonPosition();
    }

    componentDidMount() {
        this.initialWeddingHandler();
    }


    changeCountryHandler = (e) => {
        this.changeCountryDetail(e.target.value);
    }

    changeCountryDetail = (value) => {
        countries_states_cities.filter(item => {
            if (item.name === value) {
                let states = [];
                for (let key in item.states) {
                    states.push(key);
                }
                this.setState({
                    states: states,
                    states_cities: item.states,
                    cities: []
                });
            }
        })
    }

    changeStatesHandler = (e) => {
        this.changeStatesDetail(e.target.value);
    }

    changeStatesDetail = (value) => {
        for (let key in this.state.states_cities) {
            if (key === value) {
                this.setState({
                    cities: this.state.states_cities[key]
                });
            }
        }
    }


    showControlContentHandler = (e) => {
        let button = document.querySelector(`.${classes.controlButtonContainer} > div:first-child`);
        if (!this.state.showControlContent && !this.state.showLinkEditor) {
            button.className = `${classes.controlButtonGoAni}`;
        } else {
            button.className = `${classes.controlButtonBackAni}`;
        }

        if (this.state.showLinkEditor) {
            // now user is editing, just need to close the editing
            this.setState({
                showLinkEditor: false
            });
        } else {
            this.setState({
                showControlContent: !this.state.showControlContent,
                showLinkEditor: false
            }, () => {
                if (this.state.showControlContent) {
                    this.setContentButtonsColor();
                }
            });
        }
    }

    setContentButtonsColor = () => {
        const all_p = this.customContentEl.current.querySelectorAll('p');
        [...all_p].forEach((item, index) => {
            if (index === this.current_p) {
                const arr = item.className.split(' ');
                
                if (arr.indexOf(`${classes.textBold}`) > -1) {
                    this.boldButtonEl.current.style.backgroundColor = this.backgroundColor;
                    this.boldButtonEl.current.style.color = this.color;
                }
                if (arr.indexOf(`${classes.textItalic}`) > -1) {
                    this.italicButtonEl.current.style.backgroundColor = this.backgroundColor;
                    this.italicButtonEl.current.style.color = this.color;
                }
                if (arr.indexOf(`${classes.textSize}`) > -1) {
                    this.sizeButtonEl.current.style.backgroundColor = this.backgroundColor;
                    this.sizeButtonEl.current.style.color = this.color;
                }
                if (arr.indexOf(`${classes.alignLeft}`) > -1) {
                    this.alignLeftButtonEl.current.style.backgroundColor = this.backgroundColor;
                    this.alignLeftButtonEl.current.style.color = this.color;
                }
                if (arr.indexOf(`${classes.alignCenter}`) > -1) {
                    this.alignCenterButtonEl.current.style.backgroundColor = this.backgroundColor;
                    this.alignCenterButtonEl.current.style.color = this.color;
                }
                if (arr.indexOf(`${classes.alignRight}`) > -1) {
                    this.alignRightButtonEl.current.style.backgroundColor = this.backgroundColor;
                    this.alignRightButtonEl.current.style.color = this.color;
                }
            }
        });
    }

    checkEmptyContentHandler = (e) => {
        if (!this.customContentEl.current.innerHTML) {
            /*empty, add section element*/
            this.customContentEl.current.innerHTML = `<section><p data-placeholder='Content'></p></section>`;
        }
    }


    showControlButtonHandler = (e) => {
        if (e.target.tagName === 'P') {
            
            let current_index = -1;
            const all_p = this.customContentEl.current.querySelectorAll('p');
            [...all_p].forEach((item, index) => {
                if (item === e.target) {
                    current_index = index;
                }
            });

            // different P
            const current_top = e.target.getBoundingClientRect().top + document.documentElement.scrollTop;

            if (this.current_p !== current_index || 
                parseInt(this.controlButtonEl.current.style.top) !== parseInt(current_top - 110)) {
                this.current_p = current_index;

                if (this.state.showControlContent || this.state.showLinkEditor) {
                    this.controlButtonEl.current.querySelector('div:first-child').click();
                }
                
                this.controlButtonEl.current.style.top = current_top - 110 + 'px';
            } else {
                // same P, do nothing
                return;
            }
        }
    }


    updateControlButtonPosition = () => {
        const first_p = this.customContentEl.current.querySelectorAll('p')[0];
        const current_top = first_p.getBoundingClientRect().top + document.documentElement.scrollTop;
        this.controlButtonEl.current.style.top = current_top - 110 + 'px';
    }

    createNewSectionHandler = (e) => {
        const all_p = this.customContentEl.current.querySelectorAll('p');
        [...all_p].forEach((item, index) => {
            if (index === this.current_p) {
                // create new section after the parent node;
                const parent = item.parentNode;
                const section = document.createElement('Section');
                const p = document.createElement('p');
                p.setAttribute('data-placeholder', 'New-Section');
                section.appendChild(p);

                parent.parentNode.insertBefore(section, parent.nextElementSibling || null);
                if (this.state.showControlContent) {
                    this.controlButtonEl.current.querySelector('div:first-child').click();
                }
            }
        });
    }


    fakeFileHandler = (e) => {
        this.fileEl.current.click();
        //this.controlButtonEl.current.querySelector('div:first-child').click();
    }
    
    realFileHandler = (e) => {

        const div_container = document.createElement('div');
        div_container.className = `${classes.imgContainer}`;

        [...e.target.files].forEach((file, index) => {
            /*
            if (file.size < Math.pow(1024, 2)) {
                return;
            }
            */
            const name = file.name;
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                const src = e.target.result;
                const img = new Image();
                img.src = src;
                img.onload = (e) => {
                    div_container.appendChild(img);
                }
            }
        });

        const all_p = this.customContentEl.current.querySelectorAll('p');
        [...all_p].forEach((item, index) => {
            if (index === this.current_p) {
                // add the img to the P
                const parent = item.parentNode;
                let next = item.nextElementSibling;
                while (next && next.tagName === 'DIV') {
                    next = next.nextElementSibling;
                }
        
                parent.insertBefore(div_container, next || null);
            }
        });

        if (this.state.showControlContent) {
            this.controlButtonEl.current.querySelector('div:first-child').click();
        }
    }


    setAlignDirHandler = (dir_class) => {
        const all_p = this.customContentEl.current.querySelectorAll('p');
        [...all_p].forEach((item, index) => {
            if (index === this.current_p) {
                // add the img to the P
                let arr = item.className.split(' ');

                // already have, then remove, 
                if (arr.indexOf(dir_class) > -1) {
                    arr = arr.filter(ele => ele !== dir_class);
                } else {

                    // align button
                    if ([`${classes.alignLeft}`, `${classes.alignCenter}`, `${classes.alignRight}`].indexOf(dir_class) > -1) {
                        // remove all three classes, then align one
                        arr = arr.filter(ele => ele !== `${classes.alignLeft}` && ele !== `${classes.alignCenter}` && ele !== `${classes.alignRight}`);
                    } 
                    arr.push(dir_class);
                }
                
                item.className = arr.join(' ');
                if (this.state.showControlContent) {
                    this.controlButtonEl.current.querySelector('div:first-child').click();
                }
            }
        });
    }


    showLinkEditorHandler = (e) => {
        this.setState({
            showControlContent: false,
            showLinkEditor: true
        });
    }


    setLinkToContentHandler = (e) => {
        const text = this.linkContentTextEl.current.value;
        const link = this.linkContentLinkEl.current.value;

        const all_p = this.customContentEl.current.querySelectorAll('p');
        [...all_p].forEach((item, index) => {
            if (index === this.current_p) {
                const a_ele = document.createElement('a');
                a_ele.href = link;
                a_ele.innerHTML = text;
                a_ele.title = link;
                a_ele.target = '_blank';
                item.appendChild(a_ele);

                this.controlButtonEl.current.querySelector('div:first-child').click();
            }
        });
    }


    clickPreviewButtonHandler = (e) => {
        
        this.previewButtonEl.current.className = `${classes.previewButton} ${classes.dragPreviewString}`;

        if (!this.state.showPreviewPage) {
            this.setState({
                showPreviewPage: true,
                basicInfo: {
                    weddingTitle: this.weddingTitleEl.current.innerText,
                    backgroundImg: this.state.backgroundImg,
                    country: this.countryEl.current.value,
                    state: this.stateEl.current.value,
                    city: this.cityEl.current.value,
                    date: this.dateEl.current.value,
                    price: this.priceEl.current.value,
                    type: this.typeEl.current.value,
                    designer: this.designerEl.current.value
                }
            });
            setTimeout(() => {
                this.previewButtonEl.current.className = `${classes.previewButton}`;
            }, 1000);
        } else {
            this.setState({
                closePreviewAni: true
            });          
            setTimeout(() => {
                this.setState({
                    showPreviewPage: false,
                    closePreviewAni: false
                 });
                this.previewButtonEl.current.className = `${classes.previewButton}`;
            }, 1500);
        }
        
    }

    mapAddressToCoordinateHander = (args) => {
        let country = null;
        country_iso.forEach((item) => {
            if (item['Name'] === args.country) {
                country = item['Code'];
            }
        });
        
        
        const address = test_cities.filter((item) => {
            if (item.country === country && item.name === args.city) {
                return item;
            }
        });
        
        if (!address) {
            // not found
            return ['', ''];
        }
        return [parseFloat(address[0].lng) + '', parseFloat(address[0].lat) + ''];
    }

    updateWeddingHandler = async (e) => {
        const [long, lati] = this.mapAddressToCoordinateHander({
            country: this.countryEl.current.value,
            state: this.stateEl.current.value,
            city: this.cityEl.current.value
        }); 
        const args = {
            _id: this.state.wedding._id,
            weddingTitle: this.weddingTitleEl.current.innerText,
            backgroundImg: this.state.backgroundImg,
            country: this.countryEl.current.value,
            state: this.stateEl.current.value,
            city: this.cityEl.current.value,
            price: this.priceEl.current.value || '0',
            weddingDate: this.dateEl.current.value || '',
            weddingType: this.typeEl.current.value,
            designer: this.designerEl.current.value || '',
            customContent: this.customContentEl.current.innerHTML + '',
            long: long,
            lati: lati
        }
        
        const res = await this.props.updateWeddingActionHandler(args);
        if (res.signal) {
            // success
            this.setState({
                show_success_message: true,
                alert_message: 'success'
            }, () => {
                setTimeout(()=>(this.props.history.push(`/viewWedding?id=${this.state.wedding._id}`)), 2000);
            })
        } else {
            // failure
            this.setState({
                show_error_message: true,
                alert_message: 'error, cannot update'
            })
        }
        
    } 


    uploadBackgroundImgHander = (e) => {
        this.backgroundImgEl.current.click();
    }

    backgroundImgFileHander = (e) => {
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = (e) => {
            this.setState({
                backgroundImg: e.target.result
            }, () => {
                // update control button position
                this.updateControlButtonPosition();
                // remove from this.backgroundImgEl
                this.backgroundImgEl.current.value = null;
            });
        }
    }

    removeBackgroundImgHandler = (e) => {
        this.setState({
            backgroundImg: null
        }, () => {
            // update control button position
            this.updateControlButtonPosition();
        });
    }

    closeMessageHandler = () => {
        /*
        this.setState({
            show_success_message: false,
            show_error_message: false
        })*/
    }

    render() {
        return (
            <React.Fragment>
            {this.state.show_success_message && 
                <SuccessMessage
                    closeMessageHandler={this.closeMessageHandler}
                    message={this.state.alert_message} />
            }
            {this.state.show_error_message && 
                <ErrorMessage
                    closeMessageHandler={this.closeMessageHandler}
                    message={this.state.alert_message} />
            }
            {this.state.showPreviewPage && <PreviewWedding
                basicInfo={this.state.basicInfo}
                customInfo={this.customContentEl.current.innerHTML}
                closePreviewAni={this.state.closePreviewAni}
            />}
            <div 
                ref={this.previewButtonEl}
                onClick={this.clickPreviewButtonHandler}
                className={classes.previewButton}>
                {'PRE'}
            </div>
            {this.state.wedding && <div className={classes.container}>
                
                <div 
                    className={classes.title}
                    contentEditable={"true"} 
                    onDragStart={(e)=>{e.preventDefault();window.getSelection().removeAllRanges();return false;}}
                    draggable={false}
                    suppressContentEditableWarning={true}
                    data-placeholder={'Wedding Title'}
                    ref={this.weddingTitleEl}
                >
                    {this.state.wedding.weddingTitle}
                </div>

                <div className={classes.detailContent}>
                    <table>
                    <thead>
                            <tr>
                                <td colSpan='3'>{'PLACE'}</td>
                                <td>DATE</td>
                                <td>PRICE($)</td>
                                <td>TYPE</td>
                                <td>DESIGNER</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className={classes.selectTd}>
                                    <select 
                                        onChange={this.changeCountryHandler} 
                                        ref={this.countryEl}
                                        defaultValue={this.state.wedding.country}
                                        >
                                        <option>{'Country'}</option>
                                        {countries_states_cities.map((item, index) => {
                                            return <option key={index}>{item.name}</option>
                                        })}
                                    </select>
                                </td>
                                <td className={classes.selectTd}>
                                    <select 
                                        onChange={this.changeStatesHandler} 
                                        ref={this.stateEl}
                                        >
                                        <option>{'State'}</option>
                                            {this.state.states.map((item, index) => {
                                                return <option key={index} 
                                                   >
                                                    {item}</option>
                                            })}
                                    </select>
                                </td>
                                <td className={classes.selectTd}>
                                    <select ref={this.cityEl}
                                        defaultValue={this.state.wedding.city}
                                        >
                                        <option>{'City'}</option>
                                        {this.state.cities.map((item, index) => {
                                            return <option key={index}>
                                                {item}</option>
                                        })}
                                    </select>
                                </td>
                                <td>
                                    <input type='date' ref={this.dateEl} />
                                </td>
                                <td>
                                    <input type='text' 
                                        placeholder={'0'} 
                                        ref={this.priceEl} 
                                        defaultValue={this.state.wedding.price} />
                                </td>
                                <td>
                                    <select ref={this.typeEl} defaultValue={this.state.wedding.weddingType}>
                                        <option>{'Traditional'}</option>
                                    </select>
                                </td>
                                <td>
                                    <input type='text' 
                                        placeholder={'NAME'} 
                                        ref={this.designerEl}
                                        defaultValue={this.state.wedding.designer} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div className={classes.backgroundImgContainer}>
                    {this.state.backgroundImg &&
                        <div>
                            <span onClick={this.removeBackgroundImgHandler}></span> 
                            <img src={this.state.backgroundImg} />
                        </div>
                    }
                    <input type='file' ref={this.backgroundImgEl} onChange={this.backgroundImgFileHander} />
                    <button onClick={this.uploadBackgroundImgHander}>{'UPLOAD BACKGROUND IMAGE'}</button>
                </div>

                <div 
                    className={classes.customContent} 
                    contentEditable={"true"} 
                    onDragStart={(e)=>{e.preventDefault();window.getSelection().removeAllRanges();return false;}}
                    onKeyUp={this.checkEmptyContentHandler}
                    draggable={false}
                    ref={this.customContentEl}
                    suppressContentEditableWarning={true}
                    onMouseOver={this.showControlButtonHandler}
                >
                    
                </div>
                
                <button className={classes.confirmCreate} onClick={this.updateWeddingHandler}>
                    {'UPDATE'}
                </button>
                
                <div className={classes.controlButtonContainer} ref={this.controlButtonEl}>
                    <div onClick={this.showControlContentHandler}>
                        <FontAwesome_Fa.FaPlus />
                    </div>

                    {this.state.showControlContent && <div>
                        <span onClick={this.createNewSectionHandler}>
                            <FontAwesome_md.MdPlaylistAdd  />
                        </span>
                        <span onClick={this.fakeFileHandler}>
                            <FontAwesome_Fa.FaImage />
                            <input 
                                type={'file'} 
                                multiple={true}
                                ref={this.fileEl}
                                onChange={this.realFileHandler}
                                className={classes.fileInput}
                                accept={'image/*'}
                             />
                        </span>
                        <span onClick={this.showLinkEditorHandler}>
                            <FontAwesome_Fa.FaChain />
                        </span>
                        <span 
                            onClick={() => (this.setAlignDirHandler(`${classes.textBold}`))}
                            ref={this.boldButtonEl}>
                            <FontAwesome_md.MdFormatBold />
                        </span>
                        <span 
                            onClick={() => (this.setAlignDirHandler(`${classes.textSize}`))}
                            ref={this.sizeButtonEl}>
                            <FontAwesome_md.MdFormatSize />
                        </span>
                        <span 
                            ref={this.italicButtonEl}
                            onClick={() => (this.setAlignDirHandler(`${classes.textItalic}`))}>
                            <FontAwesome_md.MdFormatItalic />
                        </span>
                        <span
                            ref={this.alignLeftButtonEl} 
                            onClick={() => (this.setAlignDirHandler(`${classes.alignLeft}`))}>
                            <FontAwesome_md.MdFormatAlignLeft />
                        </span>
                        <span
                            ref={this.alignCenterButtonEl} 
                            onClick={() => (this.setAlignDirHandler(`${classes.alignCenter}`))}>
                            <FontAwesome_md.MdFormatAlignCenter />
                        </span>
                        <span
                            ref={this.alignRightButtonEl} 
                            onClick={() => (this.setAlignDirHandler(`${classes.alignRight}`))}>
                            <FontAwesome_md.MdFormatAlignRight />
                        </span>
                    </div>}


                    {this.state.showLinkEditor &&
                        <div className={classes.linkEditor}>
                            <input type={'text'} placeholder={'Text'} ref={this.linkContentTextEl} />
                            <input type={'text'} placeholder={'Link to...?'} ref={this.linkContentLinkEl} />
                            <span 
                                className={classes.confirmClickButton}
                                onClick={this.setLinkToContentHandler}
                            >
                                <FontAwesome_md.MdCheck />
                            </span>
                    </div>}
                </div>
                    
            </div>}
            
        </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        current_user: state.login_data.currentUser

    }
}

export default withRouter(connect(mapStateToProps, {
    getSingleWeddingActionHandler,
    updateWeddingActionHandler
})(UpdateWeddingView));