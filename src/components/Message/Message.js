import React, {useEffect} from 'react';
import classes from './Message.module.css';



export const SuccessMessage = (props) => {
    
    useEffect(() => {
        setTimeout(props.closeMessageHandler, 1500);
    });
    
    return (
        <div className={classes.messageContainer}>
            <span className={classes.successMessage}>
                {props.message}</span>
        </div>
    )
}

export const ErrorMessage = (props) => {
    useEffect(() => {
        setTimeout(props.closeMessageHandler, 1500);
    });
    
    return (
        <div className={classes.messageContainer}>
            <span className={classes.errorMessage}>
                {props.message}</span>
        </div>
    )
} 

export const NormalMessage = (props) => {
    useEffect(() => {
        setTimeout(props.closeMessageHandler, 1500);
    });
    
    return (
        <div className={classes.messageContainer}>
            <span className={classes.normalMessage}>
                {props.message}</span>
        </div>
    )
}