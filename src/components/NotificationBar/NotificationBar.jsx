import React from 'react';
import Container from '../Container/Container';
import testLocalStorage from '../../utilities/test-local-storage';
import './NotificationBar.scss';

const version = '3';
const localStorageIsEnabled = testLocalStorage() !== false;

const barDismissed = () => {
  if (localStorageIsEnabled) {
    return localStorage.getItem('notification-dismissed') === version;
  }
  return false;
};

class MessageBar extends React.Component {
  render() {
    return (
      <div className="notification-bar">
        <Container className="notification-bar__inner">
          <p>
            Webpack 5 has been officially released. Read our <a href="/blog/2020-10-10-webpack-5-release/">announcement</a>. Not ready yet? Read <a href="https://v4.webpack.js.org/">webpack 4 documentation here</a>.
          </p>
          {localStorageIsEnabled ? (
            <button
              aria-label="Dismiss"
              className="notification-bar__close icon-cross"
              onClick={this.close.bind(this)}
            />
          ) : null}
        </Container>
      </div>
    );
  }

  /**
   * Update the notification-dismissed state
   *
   * @param {object} e - Click event
   */
  close(e) {
    localStorage.setItem('notification-dismissed', version);
    this.props.onClose();
  }
}

export default class NotificationBar extends React.Component {
  constructor(props) {
    super(props);
    this.onClose = this.onClose.bind(this);
    this.state = {
      dismissed: barDismissed()
    };
    if (!this.state.dismissed && typeof document !== 'undefined') {
      document.body.classList.add('notification-bar-visible');
    }
  }

  onClose() {
    this.setState(state => {
      if (!state.dismissed && typeof document !== 'undefined') {
        document.body.classList.remove('notification-bar-visible');
      }
      return {
        dismissed: !state.dismissed
      };
    });
  }

  render() {
    const { dismissed } = this.state;

    return <React.Fragment>{!dismissed ? <MessageBar onClose={this.onClose} /> : null}</React.Fragment>;
  }
}
