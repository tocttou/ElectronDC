// @flow
import React, { Component } from 'react';
import Home from '../components/Home';

const net = require('net');
const client = new net.Socket();

export default class HomePage extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      userlist: [],
      publicMessages: []
    };
    this.generateKey = this.generateKey.bind(this);
  }

  componentWillMount() {

    const that = this;

    client.connect(411, 'dc.channeli.in', () => {
      client.on('data', (data) => {
        const type = data.toString().split(' ')[0];

        if (type === '$Lock') {
          const lock = data.toString().split(' ')[1];
          client.write('$Supports UserCommand|');
          client.write(`$Key ${that.generateKey(lock)}|`);
          client.write('$ValidateNick ashish_tocttou|');
          client.write('$Version 1,0091|');
          client.write('$GetNickList|');
          client.write('$MyINFO $ALL ashish_tocttou <tocttou V:0.2,M:A,H:0/1/0,S:5>$ $LAN(T3)0x31$noreply@tocttou.in$123456789000$|');
        } else {
          const allCommands = data.toString().split('|');
          for (let i of allCommands) {
            let temp = [];
            let split = i.split('$');
            try {
              temp = Object.assign([], this.state.userlist);
              if (split[1].trim() === 'NickList PtokaX') {
                for (let nick of i.split('$')) {
                  if (nick !== '' && nick !== 'NickList PtokaX') {
                    temp.push(nick);
                  }
                }
              }
            } catch (err) {
            }
            this.setState({ userlist: temp });
            try {
              if (i.trim().indexOf('<') === 0) {
                let username = i.match('<(.*?)>')[1];
                let message = i.match('>(.*)')[1];
                let temp = Object.assign([], this.state.publicMessages);
                temp.push({ from: username, text: message });
                this.setState({ publicMessages: temp });
              } else if (split[1].trim() === 'MyINFO') {
                if (this.state.userlist.indexOf(split[2].split(' ')[1].trim()) === -1) {
                  temp = Object.assign([], this.state.userlist);
                  temp.push(split[2].split(' ')[1].trim());
                  this.setState({ userlist: temp });
                }
              } else if (split[1].split(' ')[0].trim() === 'Quit') {
                temp = this.state.userlist.filter((elem) => elem !== i.split('$')[1].split(' ')[1].trim());
                this.setState({ userlist: temp });
              }
            } catch (err) {
            }
          }
        }
      });
    });
  }

  generateKey(lock) {

    const length = lock.length;
    let key = ['0'];
    const specialKeys = [0, 5, 36, 96, 124, 126];

    for (let i = 1; i < length; i++) {
      key[i] = lock[i].charCodeAt() ^ lock[i - 1].charCodeAt();
    }

    key[0] = lock[0].charCodeAt()
      ^ lock[length - 1].charCodeAt()
      ^ lock[length - 2].charCodeAt() ^ 5;

    for (let i in key) {
      key[i] = ((key[i] << 4) & 240) | ((key[i] >> 4) & 15);

      if (specialKeys.indexOf(key[i]) !== -1) {
        key[i] = `/%DCN${(`000${key[i]}`).slice(-3)}%/`;
      } else {
        key[i] = String.fromCharCode(key[i]);
      }
    }

    return key.join('');
  }


  render() {
    return (
      <Home
        activeUsers={this.state.userlist}
        publicMessages={this.state.publicMessages}
        client={client}
      />
    );
  }
}
