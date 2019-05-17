import React, {Component} from 'react';
import classes from './LoginView.module.css';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {loginActionHandler} from '../../actions/loginAction';

class LoginView extends Component {

    constructor(props) {
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }

    loginHandler = async (e) => {
        const emailReg = /^\S+@\S+\.\S+$/;
        if (!this.emailEl.current.value.match(emailReg)) {
            alert('invalid email');
            return;
        }
        const res = await this.props.loginActionHandler({
            email: this.emailEl.current.value,
            password: this.passwordEl.current.value
        });

        if (res.signal) {
            // login
            // store to the localStorage
            res.user = {
                ...res.user,
                tokenExp: res.user.tokenExp * 1000 * 60 * 60 + (+new Date())
            }
            localStorage.setItem('user', JSON.stringify(res.user));
            console.log(this.props.history);
            this.props.history.push('/');
        } else {
            // error
            alert('wrong email or password');
        }
    }


    render () {

        return (
            <div className={classes.container}>
                <div className={classes.leftImg}>
                    <img src={'https://www.fernbrookfarms.com/wp-content/uploads/2018/07/levkuperman.comMarianneBrianWeddinguperman.comMarianneBrianWeddingBrian_Wedding_0391.jpg'} />
                </div>

                <div className={classes.rightContent}>
                    <div className={classes.otherLoginContainer}>

                    </div>
                    <div className={classes.hrLine}></div>
                    <div className={classes.selfLoginContainer}>
                        <input placeholder={'EMAIL'} ref={this.emailEl} />
                        <input type={'password'} placeholder={'PASSWORD'} ref={this.passwordEl}/>
                        <div>
                            <span>Forget password?</span>
                            <span onClick={()=>{this.props.history.push('/signupView')}}>Sign up</span>
                        </div>
                        <button onClick={this.loginHandler}>{`LET'S GO!`}</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(connect(null, {loginActionHandler})(LoginView));