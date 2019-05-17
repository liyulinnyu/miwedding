import React, {Component} from 'react';
import classes from './SignupView.module.css';
import {withRouter} from 'react-router-dom';
import {signupActionHandler} from '../../actions/signupAction';
import {connect} from 'react-redux';

class SignupView extends Component {

    constructor(props) {
        super(props);
        this.emailEl = React.createRef();
        this.usernameEl = React.createRef();
        this.passwordEl = React.createRef();
        this.repasswordEl = React.createRef();
    }

    signupHandler = async (e) => {
        if (this.usernameEl.current.value.length < 3) {
            alert('username length should be bigger than 3');
            return;
        }
        if (this.passwordEl.current.value !== this.repasswordEl.current.value ||
            this.passwordEl.current.value.length < 6) {
            alert('please check your password, the length should be bigger than 6');
            return;
        }

        const emailReg = /^\S+@\S+\.\S+$/;

        if (!this.emailEl.current.value.match(emailReg)) {
            alert('invalid email');
            return;
        }

        const signal = await this.props.signupActionHandler({
            username: this.usernameEl.current.value,
            email: this.emailEl.current.value,
            password: this.passwordEl.current.value
        });
        if (signal) {
            this.props.history.push('/loginView');
        } else {
            alert('internal error, cannot signup');
        }
        
    }


    render () {

        return (
            <div className={classes.container}>
                <div className={classes.leftImg}>
                    <img src={'https://www.coolibahdowns.com.au/wp-content/uploads/2018/07/coolibah-downs-gold-coast-hinterland-wedding-venue-table-layouts6.jpg'} />
                </div>

                <div className={classes.rightContent}>
                    <div className={classes.selfLoginContainer}>
                        <input placeholder={'USERNAME'} ref={this.usernameEl} />
                        <input placeholder={'EMAIL'} ref={this.emailEl}/>
                        <input type={'password'} placeholder={'PASSWORD'} ref={this.passwordEl} />
                        <input type={'password'} placeholder={'RE-PASSWORD'} ref={this.repasswordEl} />
                        <div>
                            <span onClick={()=>{this.props.history.push('/loginView')}}>Login</span>
                        </div>
                        <button onClick={this.signupHandler}>{`GOOD TO GO!`}</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(connect(null, {signupActionHandler})(SignupView));