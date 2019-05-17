import React, {Component} from 'react';
import classes from './Comment.module.css';
import * as FontAwesome_io from 'react-icons/lib/io';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {
    createWeddingCommentsActionHandler,
    doCommentLikeActionHandler,
    doCommentDislikeActionHandler,
    deleteCommentActionHandler
} from '../../actions/commentAction';
import {SuccessMessage, ErrorMessage, NormalMessage} from '../../components/Message/Message';

class Comment extends Component {

    state = {
        hot_comments: [],
        new_comments: [],
        other_comments: [],
        // show message alert
        show_success_message: false,
        show_error_message: false,
        alert_message: ''
    }

    constructor(props) {
        super(props);
        this.myCommentEditorEl = React.createRef();
    }


    componentDidMount() {
        let hot_comments = [];
        let all_comments = this.props.comments;
        all_comments = all_comments.map(item => {
            item.show_dup_comment = false;
            return item;
        });

        for (let i = 0; i < all_comments.length; i++) {
            if (all_comments[i].likeUsers.length >= 5) {
                hot_comments.push(all_comments[i]);
                all_comments.splice(i, 1);
                i--;
            }
            if (hot_comments.length > 5) {
                break;
            }
        }
        all_comments.sort((n1, n2) => (n2.date - n1.date));
        this.setState({
            hot_comments: hot_comments,
            new_comments: all_comments.splice(0, 5),
            other_comments: all_comments
        });
    }


    checkEmptyContentHandler = (e) => {
        if (!this.myCommentEditorEl.current.innerHTML) {
            /*empty, add section element*/
            this.myCommentEditorEl.current.innerHTML = `<section><p data-placeholder='Comment here...'></p></section>`;
        }
    }

    doDupCommentHander = (comment, e) => {
        comment.show_dup_comment = !comment.show_dup_comment;
        this.updateSingleComment(comment);
    }

    showMoreCommentsHandler = (e) => {
        let new_comments = this.state.new_comments;
        let other_comments = this.state.other_comments;
        new_comments = [
            ...new_comments,
            ...other_comments.slice(0, 5)
        ];
        
        other_comments.splice(0, 5);
        this.setState({
            new_comments: new_comments,
            other_comments: other_comments
        });
    }


    createNewCommentHandler = async (comment, e) => {
        if (!this.props.current_user) {
            this.props.history.push('/loginView');
            return;
        }

        let args = null;
        let node = comment && e.target.parentNode.previousElementSibling;

        if (!comment) {
            // new comment
            args = {
                weddingId: this.props.weddingId,
                content: this.myCommentEditorEl.current.innerText,
                creator: this.props.current_user._id,
                respondent: this.props.creator
            }
        } else {
            // reply
            args = {
                weddingId: this.props.weddingId,
                content: node.innerText,
                creator: this.props.current_user._id,
                respondent: comment.creator._id
            }
        }

        if (args.content.trim() === '') {
            this.setState({
                show_error_message: true,
                alert_message: 'cannot use empty content'
            });
            return;
        }

        const res = await this.props.createWeddingCommentsActionHandler(args);

        if (res.signal) {
            let new_comments = this.state.new_comments;
            res.comment.show_dup_comment = false;
            new_comments.unshift(res.comment);
            // close
            if (!comment) {
                this.myCommentEditorEl.current.innerHTML = `<section><p data-placeholder='Comment here...'></p></section>`;
            } else {
                comment.show_dup_comment = false;
                this.updateSingleComment(comment);
            }
            
            // add new comment to the state
            this.setState({
                new_comments: new_comments,
                show_success_message: true,
                alert_message: 'success'
            });
        } else {
            this.setState({
                show_error_message: true,
                alert_message: 'error'
            });
            return;
        }
    }

    /*update single comment*/
    updateSingleComment = (comment) => {
        const hot_comments = this.state.hot_comments.map(item => {
            if (item._id === comment._id) {
                return comment;
            }
            return item;
        });
        const new_comments = this.state.new_comments.map(item => {
            if (item._id === comment._id) {
                return comment;
            }
            return item;
        });

        this.setState({
            hot_comments: hot_comments,
            new_comments: new_comments
        });
    }


    doDislikeHander = async (comment, e) => {
        if (!this.props.current_user) {
            this.props.history.push('/loginView');
            return;
        }
        if (comment.dislikeUsers.some(item => item._id === this.props.current_user._id)) {
            await this.setState({
                show_error_message: true,
                alert_message: 'cannot do it twice'
            });
            return;
        }
        const res = await this.props.doCommentDislikeActionHandler({
            commentId: comment._id, 
            userId: this.props.current_user._id
        });
        if (res.signal) {
            comment.dislikeUsers = res.dislikeUsers;
            this.updateSingleComment(comment);
            this.setState({
                show_success_message: true,
                alert_message: 'success'
            });
        } else {
            this.setState({
                show_error_message: true,
                alert_message: 'error'
            });
            return;
        }
    }

    doLikeHander = async (comment, e) => {
        if (!this.props.current_user) {
            this.props.history.push('/loginView');
            return;
        }
        if (comment.likeUsers.some(item => item._id === this.props.current_user._id)) {
            await this.setState({
                show_error_message: true,
                alert_message: 'cannot do it twice'
            });
            return;
        }
        const res = await this.props.doCommentLikeActionHandler({
            commentId: comment._id, 
            userId: this.props.current_user._id
        });
        if (res.signal) {
            comment.likeUsers = res.likeUsers;
            this.updateSingleComment(comment);
            this.setState({
                show_success_message: true,
                alert_message: 'success'
            });
        } else {
            console.log('error');
            this.setState({
                show_error_message: true,
                alert_message: 'error'
            });
            return;
        }
    }


    deleteCommentHandler = async (comment, e) => {
        const res = await this.props.deleteCommentActionHandler({commentId: comment._id});
        if (res.signal) {
            // success
            let hot_comments = this.state.hot_comments;
            let new_comments = this.state.new_comments;
            let other_comments = this.state.other_comments;

            hot_comments = hot_comments.filter(item => {
                if (item._id === comment._id) {
                    return false;
                }
                return true;
            });
            new_comments = new_comments.filter(item => {
                if (item._id === comment._id) {
                    return false;
                }
                return true;
            });
            // if remove from new_comments, just add one from other_comments
            if (new_comments.length < this.state.new_comments.length && other_comments.length > 0) {
                new_comments.push(other_comments.shift());
            }
        
            this.setState({
                hot_comments: hot_comments,
                new_comments: new_comments,
                other_comments: other_comments,
                show_success_message: true,
                alert_message: 'success'
            });
        } else {
            console.log('error');
            this.setState({
                show_error_message: true,
                alert_message: 'error'
            })
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


    getCommentContent = (comments) => {
        
        return comments.map((item, index) => (
            
                            
                <div key={index}>
                    {this.props.current_user && 
                        this.props.creator === this.props.current_user._id && 
                        <span className={classes.deleteCommentButton} 
                            title={'delete the comment'}
                            onClick={this.deleteCommentHandler.bind(this, item)}></span>}
                    <div className={classes.commentInfo}>
                        
                        <div className={classes.commentors}>
                            <img src={item.creator.image}
                                onClick={this.toUserInfoViewHandler.bind(this, item.creator._id)} />
                            <span 
                                onClick={this.toUserInfoViewHandler.bind(this, item.creator._id)}
                            >{item.creator.username}{item.creator._id === this.props.creator?' (Author)' :''}</span>
                            {item.creator._id !== item.respondent._id && <span>{'REPLY'}</span>}
                            {item.creator._id !== item.respondent._id &&<span
                                onClick={this.toUserInfoViewHandler.bind(this, item.respondent._id)}
                            >{item.respondent.username}</span>}
                        </div>
                        <div className={classes.commentSide}>
                            <span 
                                onClick={this.doDislikeHander.bind(this, item)}
                                className={
                                    this.props.current_user &&
                                    item.dislikeUsers.some(item => item._id === this.props.current_user._id) ? 
                                    classes.spanColor: classes.spanNoColor}    
                            ><FontAwesome_io.IoHeartBroken /></span>
                            <span>{item.dislikeUsers.length}</span>
                            <span 
                                onClick={this.doLikeHander.bind(this, item)}
                                className={
                                    this.props.current_user &&
                                    item.likeUsers.some(item => item._id === this.props.current_user._id) ? 
                                    classes.spanColor: classes.spanNoColor}
                            ><FontAwesome_io.IoHeart /></span>
                            <span>{item.likeUsers.length}</span>
                            <span onClick={this.doDupCommentHander.bind(this, item)}>
                                <FontAwesome_io.IoChatboxWorking />
                            </span>
                        </div>
                    </div>

                    <div className={classes.commentContent}>
                        <span>{item.content}</span>
                    </div>

                    <div className={classes.commentDate}>
                        <span>{new Date(parseInt(item.date)).toDateString()}</span>
                    </div>

                    {item.show_dup_comment && 
                        <div className={classes.dupComment}>
                            <div 
                                contentEditable={"true"} 
                                onDragStart={(e)=>{e.preventDefault();window.getSelection().removeAllRanges();return false;}}
                                draggable={false}
                                suppressContentEditableWarning={true}
                            >
                                <section >
                                    <p data-placeholder={'Comment here...'}></p>
                                </section>
                            </div>

                            <div>
                                <button onClick={this.createNewCommentHandler.bind(this, item)}>
                                    {'Publish'}
                                </button>
                            </div>
                        </div>
                    }
                </div>
            )
        )
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
            <div className={classes.container}>
                
                <div>
                    <span>{'Response'}</span>
                    <div className={classes.myResponseContainer}>
                        <div className={classes.myProfile}>
                            {!this.props.current_user && <span>{'Guest'}</span>}
                            {this.props.current_user && <img src={this.props.current_user.image} />}
                            {this.props.current_user && <span>{this.props.current_user.username}</span>}
                            <button onClick={this.createNewCommentHandler.bind(this, '')}>
                                {'Publish'}
                            </button>
                        </div>

                        <div 
                            className={classes.myCommentEditor}
                            contentEditable={"true"} 
                            onDragStart={(e)=>{e.preventDefault();window.getSelection().removeAllRanges();return false;}}
                            draggable={false}
                            suppressContentEditableWarning={true}
                            onKeyUp={this.checkEmptyContentHandler}
                            ref={this.myCommentEditorEl}
                        >
                            <section >
                                <p data-placeholder={'Comment here...'}></p>
                            </section>
                        </div>
                    </div>

                    {this.state.hot_comments.length > 0 &&
                        <span className={classes.hotResponseTitle}>{'HOT REPLYS'}</span>}
                    
                    {this.state.hot_comments.length > 0 &&
                        <div className={classes.hotResponseContainer}>
                            {this.getCommentContent(this.state.hot_comments).map(item => item)}
                        </div>
                    }

                    {this.state.new_comments.length > 0 && 
                        <span className={classes.newResponseTitle}>{'NEW REPLYS'}</span>}
                    {this.state.new_comments.length > 0 && 
                        <div className={classes.newResponseContainer}>
                            {this.getCommentContent(this.state.new_comments).map(item => item)}
                        </div>
                    }
                    
                    {this.state.other_comments.length > 0 && 
                        <button className={classes.showMoreCommentsButton} 
                            onClick={this.showMoreCommentsHandler}>{'Show More Comments'}</button>
                    }
                </div>
            </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        current_user: state.login_data.currentUser
    }
}

export default withRouter(
    connect(mapStateToProps, {
        createWeddingCommentsActionHandler,
        doCommentLikeActionHandler,
        doCommentDislikeActionHandler,
        deleteCommentActionHandler
    })(Comment));