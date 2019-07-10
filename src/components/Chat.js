import React, { Component } from 'react';
import Chatkit from '@pusher/chatkit-client';
import TypingIndicator from './TypingIndicator';
import MessageList from './MessageList';

class Chat extends Component {
    constructor(props){
        super(props);
        this.state ={
            messages:[],
            currentRoom: {},
            currentUser: {},
            typingUsers: [],
            chatInput: '',
        };
        this.sendMessage = this.sendMessage.bind(this);
        this._handleKeyPress = this._handleKeyPress.bind(this);
        this.sendTypingEvent = this.sendTypingEvent.bind(this);
    }

    sendMessage() {
        if(this.state.chatInput){
            this.state.currentUser.sendMessage({
                text: this.state.chatInput,
                roomId: this.state.currentRoom.id,
            });
        }
        this.setState({ chatInput: '' });
    }

    // Send typing event
    sendTypingEvent(event) {
        this.state.currentUser
            .isTypingIn({ roomId: this.state.currentRoom.id })
            // eslint-disable-next-line no-console
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
        });
        chatManager
            .connect()
            .then(currentUser => {
                this.setState({ currentUser });
                return currentUser.subscribeToRoom({
                    roomId: '19447057',
                    messageLimit: 100,
                    hooks: {
                        onMessage: message => {
                          this.setState({
                                messages: [ ...this.state.messages, message ],
                              });
                        },
                        onUserStartedTyping: user => {
                            this.setState({
                                typingUsers: [ ...this.state.typingUsers, user.name ],
                            });
                        },
                        onUserStoppedTyping: user => {
                            this.setState({
                                typingUsers: this.state.typingUsers.filter(
                                    username => username !== user.name
                                ),
                            });
                        },
                    }
                })
            })
            .then(currentRoom => {
                this.setState({ currentRoom });
            })
            // eslint-disable-next-line no-console
            .catch(error => console.error('error', error))
    }

    render() {
        return (
            <div className="col-5 border border-dark rounded">
                <h4>{ this.props.currentUsername }</h4>

                <MessageList messages={ this.state.messages } />

                <div className="row align-items-end mb-3 mt-4">
                    <div className="col-8">
                        <input className="form-control input-lg border border-primary"
                           type="text"
                           placeholder='Type message...'
                           name=""
                           value={ this.state.chatInput }
                           onChange={ this.sendTypingEvent }
                           onKeyPress={ this._handleKeyPress }/>
                    </div>
                    <div>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={ this.sendMessage } >Send Message</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <TypingIndicator typingUsers={ this.state.typingUsers } />
                    </div>
                </div>
            </div>
        );
    }

}
export default Chat
