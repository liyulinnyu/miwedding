import React from 'react';
import classes from './Loading.module.css';

const Loading = (props) => {

    return (
            
            <svg className={classes.ldsBalls} width="200px"  height="200px"  xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style={{"background": "none"}}>
            <circle cx="60.3617" cy="77.0298" r="5" fill="#e15b64">
                <animate attributeName="cx" values="80;59.270509831248425" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animate>
                <animate attributeName="cy" values="50;78.53169548885461" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animate>
                <animate attributeName="fill" values="#e15b64;#f47e60" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animate>
            </circle>
            <circle cx="27.495" cy="68.2072" r="5" fill="#f47e60">
                <animate attributeName="cx" values="59.270509831248425;25.72949016875158" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animate>
                <animate attributeName="cy" values="78.53169548885461;67.6335575687742" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animate>
                <animate attributeName="fill" values="#f47e60;#f8b26a" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animate>
            </circle>
            <circle cx="25.7295" cy="34.2228" r="5" fill="#f8b26a">
                <animate attributeName="cx" values="25.72949016875158;25.729490168751575" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animate>
                <animate attributeName="cy" values="67.6335575687742;32.366442431225806" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animate>
                <animate attributeName="fill" values="#f8b26a;#abbd81" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animate>
            </circle>
            <circle cx="57.505" cy="22.042" r="5" fill="#abbd81">
                <animate attributeName="cx" values="25.729490168751575;59.27050983124842" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animate>
                <animate attributeName="cy" values="32.366442431225806;21.46830451114539" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animate>
                <animate attributeName="fill" values="#abbd81;#849b87" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animate>
            </circle>
            <circle cx="78.9088" cy="48.4981" r="5" fill="#849b87">
                <animate attributeName="cx" values="59.27050983124842;80" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animate>
                <animate attributeName="cy" values="21.46830451114539;49.99999999999999" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animate>
                <animate attributeName="fill" values="#849b87;#e15b64" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animate>
            </circle>
            </svg>
    )
} 

export default Loading;