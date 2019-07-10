import React, { Component } from 'react';
import Chatkit from '@pusher/chatkit-client';
import Message from './Message';
import TypingIndicator from './TypingIndicator';

class Chat extends Component {
    constructor(props){
        super(props);
        this.state ={
            messages:[],
            currentRoom: {},
            currentUser: {},
            typingUsers: [],
            chatInput: '',
        }
        this.sendMessage = this.sendMessage.bind(this);
        this._handleKeyPress = this._handleKeyPress.bind(this);
        this.sendTypingEvent = this.sendTypingEvent.bind(this);
    }
    sendMessage() {
        if(this.state.chatInput){
            this.state.currentUser.sendMessage({
                text: this.state.chatInput,
                roomId: this.state.currentRoom.id,
            })
        }
        this.setState({ chatInput: ''})
    }

    // Send typing event
    sendTypingEvent(event) {
        this.state.currentUser
            .isTypingIn({ roomId: this.state.currentRoom.id })
            .catch(error => console.error('error', error));
        this.setState({
            chatInput: event.target.value
        });
    }

    _handleKeyPress(e){
        if (e.key === 'Enter') {
            this.sendMessage();
        }
    }
    componentDidMount() {
        const chatManager = new Chatkit.ChatManager({
            instanceLocator: 'v1:us1:119af37b-02bf-4461-8a75-f400c5616ca7',
            userId: this.props.currentUsername,
            tokenProvider: new Chatkit.TokenProvider({
                url: 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/119af37b-02bf-4461-8a75-f400c5616ca7/token',
            }),
        })
        chatManager
            .connect()
            .then(currentUser => {
                this.setState({ currentUser })
                return currentUser.subscribeToRoom({
                    roomId: '19446667',
                    messageLimit: 2,
                    hooks: {
                        onNewMessage: message => {
                            let newmessage = this.state.messages;
                            newmessage.push(<Message
                                key={
                                    this.state.messages.length
                                }
                                senderId={
                                    message.senderId
                                }
                                text={ message.text
                                }/>)

                            this.setState({messages: newmessage})
                        },
                        onUserStartedTyping: user => {
                            this.setState({
                                typingUsers: [...this.state.typingUsers, user.name],
                            })
                        },
                        onUserStoppedTyping: user => {
                            this.setState({
                                typingUsers: this.state.typingUsers.filter(
                                    username => username !== user.name
                                ),
                            })
                        },
                    },
                })
            })
            .then(currentRoom => {
                this.setState({ currentRoom })
            })
            .catch(error => console.error('error', error))
    }

    render() {
        return (
            <div className="col border border-dark">
                { this.props.currentUsername }
                <div id="chat-output">
                    { this.state.messages }
                </div>
                <input className="form-control"
                       type="text"
                       placeholder='Type message...'
                       name=""
                       value={ this.state.chatInput }
                       onChange={ this.sendTypingEvent }
                       onKeyPress={ this._handleKeyPress }/>
                <div id="btndiv">
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={ this.sendMessage } >Success</button>
                    <TypingIndicator typingUsers={this.state.typingUsers} />
                </div>
            </div>
        );
    }

}
export default Chat
