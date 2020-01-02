import React, { Component } from 'react';
import axios from 'axios';
import {
  addToLocalStorage,
  localStorageKeyExists,
  getFromLocalStorage,
  getCurrentTime,
  objIsInArray,
} from '../../scripts/utilities';
import '../../assets/css/quote.css';
import Likeheart from '../Likeheart';
import TwitterLink from './twitter';
import quotes from '../../assets/json/quotes.json';

class Quote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentQuote: {
        quote: '',
        author: '',
        id: '',
        liked: '',
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state !== nextProps.quote) {
      const currentQuote = nextProps.quote;
      this.setState({
        currentQuote,
      });
    }
  }

  checkFrequency() {
    const currentTime = getCurrentTime();
    const quoteTimeStamp = getFromLocalStorage('quoteTimeStamp');
    const timeInterval = currentTime - quoteTimeStamp;
    const { quoteFrequency } = this.props;
    let quoteFrequencyMili;
    switch (true) {
      case quoteFrequency === '2hour':
        quoteFrequencyMili = 7200000;
        break;
      case quoteFrequency === '6hour':
        quoteFrequencyMili = 21600000;
        break;
      case quoteFrequency === '12hour':
        quoteFrequencyMili = 43200000;
        break;
      default:
        quoteFrequencyMili = 21600000;
        break;
    }
    return timeInterval >= quoteFrequencyMili;
  }

  getQuote = () => {
    if (Math.random() >= 0.5) {
      const quote = quotes[Math.floor(Math.random() * quotes.length)]
      const currentQuote = {
        quote,
        author: 'Tadeu',
        id: 1,
      };
      this.setState({
        currentQuote,
      });
      return;
    }
    const URL = 'https://long-bongo.glitch.me/api.quotes/random';
    const overTime = this.checkFrequency();
    if (localStorageKeyExists('quote') && !overTime) {
      const currentQuote = getFromLocalStorage('quote');
      this.setState({
        currentQuote,
      });
      this.props.updateQuoteInfo(currentQuote);
    } else {
      axios.get(URL).then((response) => {
        const quoteId = getCurrentTime();
        const currentQuote = {
          quote: response.data.quote,
          author: response.data.author,
          id: quoteId,
          liked:
            localStorageKeyExists('quote') &&
            objIsInArray(getFromLocalStorage('arrLikedQuotes'), 'id', quoteId),
        };
        this.setState({
          currentQuote,
        });
        addToLocalStorage('quote', currentQuote);
        addToLocalStorage('quoteTimeStamp', getCurrentTime());
        this.props.updateQuoteInfo(currentQuote);
      });
    }
  };

  componentDidMount() {
    this.getQuote();
  }

  render() {
    return (
      <div className={this.props.quoteClassName}>
        <div>{this.state.currentQuote.quote}</div>
        <div className="author-container">
          <div>{this.state.currentQuote.author}</div>
          <Likeheart
            toggleLike={this.props.toggleLike.bind(this)}
            liked={this.state.currentQuote.liked}
            type="quote"
            id={this.state.currentQuote.id}
          />
          <TwitterLink
            quote={this.props.quote.quote}
            author={this.props.quote.author}
          />
        </div>
      </div>
    );
  }
}

export default Quote;
