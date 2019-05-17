import React, {PureComponent} from 'react';
import classes from './PreviewWedding.module.css';
import '../../views/CreateWeddingView/CreateWeddingView.module.css';
import {connect} from 'react-redux';

class PreviewWedding extends PureComponent {

    constructor(props) {
        super(props);
        this.customContentEl = React.createRef();
    }


    componentDidMount() {
        this.customContentEl.current.innerHTML = this.props.customInfo;

    }
        
    render() {

        const basicInfo = this.props.basicInfo;
        const customInfo = this.props.customInfo;
        
        if (this.props.closePreviewAni) {
            document.querySelector(`.${classes.container}`).className = `${classes.container} ${classes.closePreviewAni}`;
            document.querySelector(`.${classes.backgroundContainer}`).className = `${classes.backgroundContainer} ${classes.closeBackgroundAni}`;
        }
        return (
            <React.Fragment>
            <div className={classes.backgroundContainer}>
            </div>
            <div className={classes.container} ref={this.containerEl}>
                <div className={classes.decor}>
                    <span><b>MI</b>-Wedding Preview</span>
                </div>
                <div className={classes.backgroundImgContainer}>
                    <img src={basicInfo.backgroundImg} />
                </div>
                <div className={classes.mainContent}>
                    <div className={classes.header}>
                        <span>
                            {basicInfo.weddingTitle}
                        </span>
                    </div>

                    <div className={classes.creatorInfoContent}>
                        <img src={this.props.current_user.image}/>
                        <div>
                            <span className={classes.creatorName}>
                                {this.props.current_user.username}
                            </span>
                            <span className={classes.uploadDate}>
                                {new Date().toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    {/*
                    <div className={classes.companyInfoContent}>
                        <img />
                        <div>
                            <span className={classes.companyName}>

                            </span>
                            <span className={classes.uploadDate}>

                            </span>
                        </div>
                    </div>
                    */}


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
                                    <td>{basicInfo.country}</td>
                                    <td>{basicInfo.state}</td>
                                    <td>{basicInfo.city}</td>
                                    <td>{basicInfo.date}</td>
                                    <td>{basicInfo.price}</td>
                                    <td>{basicInfo.type}</td>
                                    <td>{basicInfo.designer}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className={classes.weddingCustomContent} ref={this.customContentEl}>

                    </div>
                    

                    
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

export default connect(mapStateToProps)(PreviewWedding);