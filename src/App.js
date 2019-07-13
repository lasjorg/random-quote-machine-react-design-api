import React, { Component } from 'react';
import sanitizeHtml from 'sanitize-html';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import LoadingError from './components/LoadingError';
import Quote from './components/Quote';
import Source from './components/Source';
import Buttons from './components/Buttons';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      content: '',
      source: '',
      tweetLink: '',
      didMount: false,
      isLoaded: false,
      error: null
    };
    this.fetchQuote = this.fetchQuote.bind(this);
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ didMount: true });
    }, 0);
    this.fetchQuote();
  }
  getTweetLink(cont, title) {
    const cleanContent = sanitizeHtml(cont);
    const textOnly = cleanContent.replace(/(<([^>]+)>)/gi, '').trim();
    return (
      'https://twitter.com/intent/tweet?hashtags=quotes&text=' +
      encodeURIComponent(`"${textOnly}"\n${title}`)
    );
  }
  fetchQuote() {
    nprogress.start();

    this.setState({ isLoaded: false });

    const apiBaseURL_proxy =
      'https://cors-anywhere.herokuapp.com/https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1';
    const apiBaseURL =
      'https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1';

    let apiURL;
    if (process.env.NODE_ENV === 'development') {
      apiURL = apiBaseURL_proxy + '?' + Math.round(new Date().getTime() / 1000);
    } else if (process.env.NODE_ENV === 'production') {
      apiURL = apiBaseURL + '?' + Math.round(new Date().getTime() / 1000);
    }

    // fetch needs no-cache set for this api
    fetch(apiURL, { cache: 'no-cache' })
      .then(res => res.json())
      .then(
        /* destructor the array, to get to the object inside */
        ([result]) => {
          // The value of the property "custom_meta" is an object "result.custom_meta.Source"
          // it is not always available, this sets the default value to an empty object so we don't get a reference error
          const {
            title,
            content,
            custom_meta: { Source: source } = {}
          } = result;
          const tweetLink = this.getTweetLink(content, title);

          this.setState(
            {
              title,
              content,
              source,
              tweetLink,
              isLoaded: true
            },
            () => {
              nprogress.done();
            }
          );
        },
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }
  render() {
    const {
      title,
      content,
      tweetLink,
      source,
      isLoaded,
      error,
      didMount
    } = this.state;
    return (
      <div id="quote-box" className={`App ${didMount && 'visible'}`}>
        {error && <LoadingError />}
        <Quote title={title} content={content} />
        {source && <Source source={source} />}
        <Buttons
          onClick={this.fetchQuote}
          disabled={!isLoaded}
          href={tweetLink}
        />
      </div>
    );
  }
}

export default App;
