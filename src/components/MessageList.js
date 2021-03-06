import React, { Component } from 'react';

class MessagesList extends Component {
    render() {
         return (
             <div className="list-group">

                 {this.props.messages.map((message, key) => (
                     <div className="list-group-item py-0" key={ key }>
                         <p>
                             <kbd>{message.senderId}:</kbd>{' '} {message.text}
                         </p>
                     </div>
                   ))}

             </div>
        )
    }
}

export default MessagesList
