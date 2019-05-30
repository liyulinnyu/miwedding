import React from 'react';
import {NavLink} from 'react-router-dom';
import classes from './MobileNav.module.css';

const MobileNav = (props) => {
    return (
        <ul>
            {!props.current_user && <ul className={classes.ul}>
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
                    <ul className={classes.ul}>
                        <li>
                            <span onClick={props.toUserViewHander}>{props.current_user.username}</span>
                        </li>
                        <li>
                            <span onClick={props.logoutHander}>LOG OUT</span>
                        </li>
                    </ul>
                }
        </ul>
    )
}

export default MobileNav;