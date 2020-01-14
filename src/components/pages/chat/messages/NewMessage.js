import React, {Component} from 'react';
import {connect} from "react-redux";
import { Input, Button } from 'antd/lib/index';
import {addMessage} from "../../../../store/messages/actions";
const { TextArea } = Input;
class NewMessage extends Component{

    state = {
        newMessage: '',
    };

    handleInputChange = e => {
        this.setState({newMessage: e.target.value});
    };

    handleSubmit = () => {
        let message = {
            content: this.state.newMessage,
            user: this.props.user
        };
        this.props.addMessage(message);
        this.setState({newMessage: ''});
    };

    render() {
        const {newMessage} = this.state;
        return (
            <React.Fragment>
                <TextArea className="mt-2" rows={4} onChange={ this.handleInputChange } value={newMessage}/>
                <Button onClick={ this.handleSubmit }>Add message</Button>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.auth.user,
    messages: state.messages,
});
export default connect(mapStateToProps, {addMessage})(NewMessage);