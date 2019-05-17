import React, {Component} from 'react';
import classes from './WeddingView.module.css';
import '../CreateWeddingView/CreateWeddingView.module.css';

import {connect} from 'react-redux';
import {
    getSingleWeddingActionHandler,
    doWeddingLikeActionHandler,
    doWeddingDislikeActionHandler,
    doWeddingSaveActionHandler,
    removeWeddingLikeActionHandler,
    removeWeddingDislikeActionHandler,
    removeWeddingSaveActionHandler
} from '../../actions/weddingAction';
import {withRouter} from 'react-router-dom';
import Comment from '../../components/Comment/Comment';
import * as FontAwesome_io from 'react-icons/lib/io';
import Loading from '../../components/Loading/Loading';
import {SuccessMessage, ErrorMessage, NormalMessage} from '../../components/Message/Message';

class WeddingView extends Component {

    state = {
        wedding: null,
        showWeddingOpContainer: false,
        isCreator: false,
        // show message alert
        show_success_message: false,
        show_error_message: false
    }

    constructor(props) {
        super(props);
        this.customContentEl = React.createRef();
        this.weddingContainerEl = React.createRef();
        this.weddingOpContainerEl = React.createRef();
    }

    initialWeddingHandler = async () => {
        const weddingId = window.location.search.split('=')[1];
        const wedding = await this.props.getSingleWeddingActionHandler(weddingId);
        
        this.setState({
            wedding: wedding,
            isCreator: this.props.current_user ? wedding.creatorId._id === this.props.current_user._id : false
        }, () => {
            this.customContentEl.current.innerHTML = this.state.wedding.customContent;
        });
    }

    componentDidMount() {
        this.initialWeddingHandler();
        window.addEventListener('scroll', this.checkContainerPositionHander, false);
        window.addEventListener('resize', this.checkContainerPositionHander, false);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.checkContainerPositionHander);
        window.removeEventListener('resize', this.checkContainerPositionHander);
    }


    checkContainerPositionHander = () => {
        if (window && this.weddingContainerEl.current) {
            const container = this.weddingContainerEl.current;
            const height = window.innerHeight;
            if (container.getBoundingClientRect().top < height*1/3 &&
                container.getBoundingClientRect().bottom > height ) {
                this.setState({
                    showWeddingOpContainer: true
                }, () => {
                    this.weddingOpContainerEl.current.style.left = container.getBoundingClientRect().left + 10 + 'px';
                });
            } else {
                this.setState({
                    showWeddingOpContainer: false
                });
            }
        }
        
    }

    toUpdateViewHandler = () => {
        if (this.state.wedding.creatorId._id === this.props.current_user._id) {
            // go to update view
            this.props.history.push(`/updateWedding?id=${this.state.wedding._id}`);
        }
    }

    doWeddingLikeHander = async () => {
        if (!this.props.current_user) {
            this.props.history.push('/loginView');
            return;
        }
        const args = {
            weddingId: this.state.wedding._id,
            userId: this.props.current_user._id
        };
        let res = null;
        if (this.state.wedding.likeUsers.some(item => item._id === this.props.current_user._id)) {
            res = await this.props.removeWeddingLikeActionHandler(args);
        } else {
            res = await this.props.doWeddingLikeActionHandler(args);
        }
        if (res.signal) {
            this.setState({
                wedding: {
                    ...this.state.wedding,
                    likeUsers: res.likeUsers,
                },
                show_success_message: true
            });
        } else {
            console.log('error');
            this.setState({
                show_error_message: true
            });
        }
    }

    doWeddingDislikeHander = async () => {
        if (!this.props.current_user) {
            this.props.history.push('/loginView');
            return;
        }
        const args = {
            weddingId: this.state.wedding._id,
            userId: this.props.current_user._id
        };
        let res = null;
        if (this.state.wedding.dislikeUsers.some(item => item._id === this.props.current_user._id)) {
            res = await this.props.removeWeddingDislikeActionHandler(args);
        } else {
            res = await this.props.doWeddingDislikeActionHandler(args);
        }
        if (res.signal) {
            this.setState({
                wedding: {
                    ...this.state.wedding,
                    dislikeUsers: res.dislikeUsers
                },
                show_success_message: true
            });
        } else {
            console.log('error');
            this.setState({
                show_error_message: true
            });
        }
    }

    doWeddingSaveHander = async () => {
        if (!this.props.current_user) {
            this.props.history.push('/loginView');
            return;
        }
        const args = {
            weddingId: this.state.wedding._id,
            userId: this.props.current_user._id
        };
        let res = null;
        if (this.state.wedding.saveUsers.some(item => item._id === this.props.current_user._id)) {
            res = await this.props.removeWeddingSaveActionHandler(args);
        } else {
            res = await this.props.doWeddingSaveActionHandler(args);
        }
        if (res.signal) {
            this.setState({
                wedding: {
                    ...this.state.wedding,
                    saveUsers: res.saveUsers
                },
                show_success_message: true
            });
        } else {
            console.log('error');
            this.setState({
                show_error_message: true
            });
        }
    }

    toUserInfoViewHandler = (id) => {
        this.props.history.push(`/userView?id=${id}`);
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
                    message={'success'} />
            }
            {this.state.show_error_message && 
                <ErrorMessage
                    closeMessageHandler={this.closeMessageHandler}
                    message={'error'} />
            }
            {!this.state.wedding && 
            <div className={classes.contentLoading}>
                <Loading />
            </div>}
            {this.state.wedding && 
                    <div className={classes.backgroundImgContainer}>
                        <img src={this.state.wedding.backgroundImg} />
                    </div>}
            {this.state.showWeddingOpContainer && this.state.wedding && 
                <ul className={classes.weddingOpContainer}
                    ref={this.weddingOpContainerEl}>
                    <li className={
                        this.props.current_user && this.state.wedding.likeUsers.some(item => item._id === this.props.current_user._id) ? 
                            classes.svgLikeColor : classes.svgNoLikeColor
                    } title={'Like'} 
                        onClick={this.doWeddingLikeHander}>
                        <FontAwesome_io.IoHeart  /></li>
                    <li><span>{this.state.wedding.likeUsers.length}</span></li>
                    <li className={
                        this.props.current_user && this.state.wedding.dislikeUsers.some(item => item._id === this.props.current_user._id) ? 
                            classes.svgDislikeColor : classes.svgNoDislikeColor} 
                        title={'Dislike'}
                        onClick={this.doWeddingDislikeHander}>
                            <FontAwesome_io.IoHeartBroken /></li>
                    <li><span>{this.state.wedding.dislikeUsers.length}</span></li>
                    <li className={
                        this.props.current_user && this.state.wedding.saveUsers.some(item => item._id === this.props.current_user._id) ? 
                            classes.svgSaveColor : classes.svgNoSaveColor} 
                        title={'Bookmark'}
                        onClick={this.doWeddingSaveHander}>
                            <FontAwesome_io.IoAndroidStarOutline /></li>
                    <li><span>{this.state.wedding.saveUsers.length}</span></li>
                    {this.state.isCreator &&
                        <li className={classes.svgNoColor} title={'Modify'}
                            onClick={this.toUpdateViewHandler}><FontAwesome_io.IoIosCompose /></li>
                    }
                </ul>}
            {this.state.wedding && <div className={classes.container}>
                    <div className={classes.mainContent} ref={this.weddingContainerEl}>
                        <div className={classes.header}>
                            <span>
                                {this.state.wedding.weddingTitle}
                            </span>
                        </div>

                        <div className={classes.creatorInfoContent}>
                            <img 
                                src={this.state.wedding.creatorId.image}
                                onClick={this.toUserInfoViewHandler.bind(this, this.state.wedding.creatorId._id)} />
                            <div>
                                <span className={classes.creatorName}
                                 onClick={this.toUserInfoViewHandler.bind(this, this.state.wedding.creatorId._id)}>
                                    {this.state.wedding.creatorId.username}
                                </span>
                                <span className={classes.uploadDate}>
                                    {new Date(parseInt(this.state.wedding.date)).toDateString()}
                                </span>
                            </div>
                        </div>

                        <div className={classes.weddingBasicContent}>
                            <table>
                                <thead>
                                    <tr>
                                        <td colSpan='3'>PLACE</td>
                                        <td>DATE</td>
                                        <td>PRICE</td>
                                        <td>TYPE</td>
                                        <td>DESIGNER</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{this.state.wedding.country}</td>
                                        <td>{this.state.wedding.state}</td>
                                        <td>{this.state.wedding.city}</td>
                                        <td>{new Date(parseInt(this.state.wedding.weddingDate)).toDateString()}</td>
                                        <td>{this.state.wedding.price}</td>
                                        <td>{this.state.wedding.weddingType}</td>
                                        <td>{this.state.wedding.designer}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className={classes.weddingCustomContent} ref={this.customContentEl}>

                        </div>
                        

                        
                    </div>
            </div>}

            {this.state.wedding && <ul className={classes.weddingOpSecondContainer}>
                    <li className={
                        this.props.current_user && this.state.wedding.likeUsers.some(item => item._id === this.props.current_user._id) ? 
                        classes.svgLikeColor : classes.svgNoLikeColor
                    }   title={'Like'}
                        onClick={this.doWeddingLikeHander}><FontAwesome_io.IoHeart /></li>
                    <li><span>{this.state.wedding.likeUsers.length}</span></li>
                    <li className={
                        this.props.current_user && this.state.wedding.dislikeUsers.some(item => item._id === this.props.current_user._id) ? 
                            classes.svgDislikeColor : classes.svgNoDislikeColor} 
                        title={'Dislike'}
                        onClick={this.doWeddingDislikeHander}>
                            <FontAwesome_io.IoHeartBroken /></li>
                    <li><span>{this.state.wedding.dislikeUsers.length}</span></li>
                    <li className={
                        this.props.current_user && this.state.wedding.saveUsers.some(item => item._id === this.props.current_user._id) ? 
                        classes.svgSaveColor : classes.svgNoSaveColor} 
                        title={'Bookmark'}
                        onClick={this.doWeddingSaveHander}>
                        <FontAwesome_io.IoAndroidStarOutline /></li>
                    <li><span>{this.state.wedding.saveUsers.length}</span></li>
                    {this.state.isCreator && <li className={classes.svgNoColor} title={'Modify'}
                        onClick={this.toUpdateViewHandler}><FontAwesome_io.IoIosCompose /></li>}
                </ul>}
            
            {this.state.wedding && 
                <div className={classes.commentContainer}>
                    <Comment 
                        creator={this.state.wedding.creatorId._id}
                        weddingId={this.state.wedding._id} 
                        comments={this.state.wedding.comments} />
                </div>
            }
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
    doWeddingLikeActionHandler,
    doWeddingDislikeActionHandler,
    doWeddingSaveActionHandler,
    removeWeddingLikeActionHandler,
    removeWeddingDislikeActionHandler,
    removeWeddingSaveActionHandler
})(WeddingView));