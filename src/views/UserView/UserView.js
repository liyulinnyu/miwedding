import React, {Component} from 'react';
import classes from './UserView.module.css';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {
    getUserDataActionHander,
    changeUserImageActionHandler,
    getSavedWeddingActionHandler,
    deleteSingleWeddingActionHandler
} from '../../actions/userAction';

import Loading from '../../components/Loading/Loading';

class UserView extends Component {
    state = {
        user: null,
        theSameUser : false,
        currentWeddingArray: [],
        showMineWedding: true
    }

    constructor(props) {
        super(props);
        this.imageInputEl = React.createRef();
        this.imageEl = React.createRef();
        this.userWeddingContainerEl = React.createRef(); 
        this.mineEl = React.createRef();
        this.bookmarkEl = React.createRef();
    }

    componentDidMount() {
        this.initialUserDataHander();
    }

    initialUserDataHander = async () => {
        const userId = window.location.search.split('=')[1];
        const res = await this.props.getUserDataActionHander({userId: userId});

        if (res.signal) {
            this.setState({
                user: res.user,
                theSameUser: this.props.current_user && this.props.current_user._id === userId ? true : false,
                currentWeddingArray: res.user.createdWedding
            })
        } else {
            alert('error');
        }
    }


    toWeddingViewHandler = async (weddingId, e) => {
        if (e.target.className === `${classes.deleteButton}`) {
            // delete the created wedding, cannot delete saved wedding
            const res = await this.props.deleteSingleWeddingActionHandler({
                            userId: this.state.user._id,
                            weddingId: weddingId
                        });
            if (res.signal) {
                alert('success');
                this.setState({
                    user: {
                        ...this.state.user,
                        createdWedding: res.createdWedding
                    },
                    currentWeddingArray: res.createdWedding
                })
            } else {
                alert('error');
            }
            return;
        } 
        // to weddingView
        this.props.history.push(`/viewWedding?id=${weddingId}`);
        return;
    }

    changeImageHandler = () => {
        this.imageInputEl.current.click();
    }

    uploadImageHander = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async (e) => {
            const res = await this.props.changeUserImageActionHandler({
                userId: this.state.user._id,
                image: e.target.result
            });
            if (res.signal) {
                this.setState({
                    user: {
                        ...this.state.user,
                        image: res.image
                    }
                });
            } else {
                alert('error');
            }
        }
    }

    switchWeddingContainerHander = async (e) => {
        if (e.target !== this.mineEl.current &&
            e.target !== this.bookmarkEl.current) {
            return;
        }

        const all_span = e.currentTarget.querySelectorAll('span');
        [...all_span].forEach(item => {
            item.className = item === e.target ? `${classes.active}` : ''; 
        })

        let wedding_array = null;
        let user = {...this.state.user};
        let showMineWedding = true;

        if (e.target === this.mineEl.current) {
            wedding_array = user.createdWedding;
        } else if (e.target === this.bookmarkEl.current) {
                // get from api
            const res = await this.props.getSavedWeddingActionHandler({userId: user._id});
            if (res.signal) {
                user.savedWedding = res.savedWedding;
                wedding_array = res.savedWedding;
            }
            else {alert('error')}
            
            showMineWedding = false;
        }

        this.setState({
            user: user,
            currentWeddingArray: wedding_array,
            showMineWedding: showMineWedding
        })
    }


    renderWeddingHander = (weddings) => {
        return (
            weddings.map((item, index) => (
                <div key={index} 
                    className={classes.singleWeddingContainer} 
                    onClick={this.toWeddingViewHandler.bind(this, item._id)}>
                    <div>
                        <img src={item.backgroundImg} />
                        {this.state.theSameUser && this.state.showMineWedding &&
                            <span title={'Delete'} className={classes.deleteButton}></span>}
                    </div>
                    <div>
                        <span>{item.weddingTitle}</span>
                    </div>
                </div>
            ))
        )
    }


    render() {
        return (
            <React.Fragment>
            {!this.state.user && 
                <div className={classes.contentLoading}>
                    <Loading />
                </div>}
            {this.state.user && <div className={classes.container}>
                <div className={classes.header}>
                    <div>
                        <div className={classes.userImageContainer}>
                            <img src={this.state.user.image} 
                                title={'Change Image'}
                                ref={this.imageEl}
                                onClick={this.state.theSameUser ? this.changeImageHandler : null}  />
                            <input type={'file'} 
                                ref={this.imageInputEl}
                                onChange={this.uploadImageHander} />
                        </div>
                        <div>
                            <div className={classes.userInfoContainer}>
                                <span>{this.state.user.username}</span>
                                {this.state.theSameUser && <span className={classes.passwordContainer}>{'Change Password?'}</span>}
                            </div>
                            <div className={classes.userWeddingContainer} 
                                ref={this.userWeddingContainerEl}
                                onClick={this.switchWeddingContainerHander}>
                                <span className={classes.active} 
                                    ref={this.mineEl}>{'Mine'}</span>
                                <span ref={this.bookmarkEl}>{'BookMark'}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classes.content}>
                    <div className={classes.ownWeddingContainer}>
                        {this.state.currentWeddingArray && 
                            this.state.currentWeddingArray.length > 0 ?
                            this.renderWeddingHander(this.state.currentWeddingArray).map(item => item)
                            : <div>NO WEDDINGS YET!</div>}

                    </div>
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
    getUserDataActionHander,
    changeUserImageActionHandler,
    getSavedWeddingActionHandler,
    deleteSingleWeddingActionHandler
})(UserView));