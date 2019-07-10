import React, { Component } from 'react';

class Message extends Component{
    render () {
        console.log(this.props.text);
        return (
            <div>
                { this.props.senderId }: { this.props.text }
            </div>
        );
    }
};
export default Message;
