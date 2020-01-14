import React, {Component} from 'react';
import {connect} from "react-redux";
import {getMessages} from "../../../../store/messages/actions";
import {axiosController} from "../../../../utils/axiosController";
import Message from "./Message";

class Messages extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: this.props.messages.all || []
        };
    }
    componentDidMount() {
        if (axiosController.isGetToken() && this.state.messages.length === 0) {
            this.props.getMessages().then((result) => {
                if (result.data.messages) {
                    this.setState({messages: result.data.messages})
                }
            });
        }
    }
    render() {
        return (
            <React.Fragment>
                {this.props.messages.all.map(
                    (message) => {
                        return <Message key={message._id} message={message}/>
                    }
                )}
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    messages: state.messages
});
export default connect(mapStateToProps, {getMessages})(Messages);