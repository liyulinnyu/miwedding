import React, {useEffect, useRef, useState} from 'react';
import {NavLink} from 'react-router-dom';
import classes from './Navigation.module.css';
import {connect} from 'react-redux';
import {logoutActionHandler} from '../../actions/logoutAction';
import {withRouter} from 'react-router-dom';
import MobileNav from './MobileNav/MobileNav';

const Navigation = (props) => {

    const logoutHander = async (e) => {
        const signal = await props.logoutActionHandler();
        if (signal) {
            localStorage.removeItem('user');
            props.history.push('/');
        } else {
            alert('cannot logout, internal error');
        }
    }

    const backToHomePage = () => {
        props.history.push('/');
    }

    const toUserViewHander = () => {
        props.history.push(`/userView?id=${props.current_user._id}`);
    }

    const container = useRef();

    const [cur_url, changeUrl] = useState('/');

    const [showMobileNav, showMobileNavHandler] = useState(false);

    const [windowWidth, windowWidthHandler] = useState(window.innerWidth);

    useEffect(() => {
        if (window) {
            if (window.location.href.indexOf('/viewWedding') > -1) {
                container.current.className = `${classes.navContainer}`;
            } else {
                container.current.className = `${classes.navContainer} ${classes.addBoxShadow}`;
            }
        }

        window.addEventListener('resize', closeMobileNavHandler, false);

        return () => {
            window.removeEventListener('resize', closeMobileNavHandler);
        }
    });

    const closeMobileNavHandler = () => {
        if (window.innerWidth !== windowWidth && showMobileNav) {
            showMobileNavHandler(false);
            windowWidthHandler(window.innerWidth);
        }
    }

    return (
        <div ref={container}>
            <nav>
                <div className={classes.title} onClick={backToHomePage}>
                    <b>
                        MI
                    </b>
                    <span>
                        -Wedding
                    </span>
                </div>
                {!props.current_user && <ul className={classes.deskNav}>
                    <li>
                        <NavLink to='/loginView' >
                            LOG IN
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/signupView' >
                            SIGN UP
                        </NavLink>
                    </li>
                </ul>}
                {props.current_user && 
                    <ul className={classes.deskNav}>
                        <li>
                            <span onClick={toUserViewHander}>{props.current_user.username}</span>
                        </li>
                        <li>
                            <span onClick={logoutHander}>LOG OUT</span>
                        </li>
                    </ul>
                }
                
            </nav>

            <div className={classes.mobileNavControl} onClick={()=>(showMobileNavHandler(!showMobileNav))}>
                
            </div>

            {showMobileNav && <div className={classes.mobileNavContainer} 
                onClick={()=>(showMobileNavHandler(!showMobileNav))}>
                <MobileNav
                    current_user={props.current_user}
                    toUserViewHander={toUserViewHander}
                    logoutHander={logoutHander}
                />
            </div>}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        current_user: state.login_data.currentUser
    }
}

export default withRouter(connect(mapStateToProps, {logoutActionHandler})(Navigation));