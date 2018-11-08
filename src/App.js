import React, { Component } from 'react';
import sanitizeHtml from 'sanitize-html';
import ReactHtmlParser, { convertNodeToElement } from 'react-html-parser';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      content: '',
      source: '',
      tweetLink: '',
      isLoaded: false,
      error: null
    }
    this.fetchQuote = this.fetchQuote.bind(this);
  }
  componentDidMount() {
    console.log('Did mount');
    this.fetchQuote();
  }
  getTweetLink(cont, title) {
    const cleanContent = sanitizeHtml(cont);
    const textOnly = cleanContent.replace(/(<([^>]+)>)/gi, "").trim();
    return "https://twitter.com/intent/tweet?hashtags=quotes&text=" + encodeURIComponent(`"${textOnly}"\n${title}`);
  }
  fetchQuote() {
    this.setState({isLoaded: false})
    const proxyURL = "https://cors-anywhere.herokuapp.com/https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1";
    const url = "https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1";
    // fetch needs no-cache set for this api
    fetch(proxyURL, {cache: "no-cache"})
      .then(res => res.json())
      .then(
        /* destructor the array, to get to the object inside */
        ([result]) => {
          // console.log(result);
          // The value of the property "custom_meta" is an object "result.custom_meta.Source"
          // it is not always available, this sets the default value to an empty object so we don't get a reference error
          const {title, content, custom_meta: { Source: source } = {} } = result;
          const tweetLink = this.getTweetLink(content, title);
          // console.log('state before setState', this.state);
          this.setState({
            title,
            content,
            source,
            tweetLink,
            isLoaded: true
          }, () => {
            // console.log('state after setState', this.state);
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }
  render() {
    const { title, content, tweetLink, source, isLoaded, error } = this.state;
    return (
      <div id="quote-box" className="App">
      {error &&
        <div className="error">Something went wrong</div>
      }

      {!isLoaded &&
        <div className="loading">Loading...</div>
      }

      {isLoaded &&
        <div>
          <h1 className="author" id="author">{title}</h1>
          <div className="quote">{ReactHtmlParser(content)}</div>
  
          {source &&
          <div className="source">Source: {ReactHtmlParser(source, {
            transform: function (node,index) {
              if (node.type === 'tag' && node.name === 'a') {
                node.attribs.target = '_blank';
                node.attribs.rel = 'noopener noreferrer';
                return convertNodeToElement(node, index);
              }
          }})}
          </div>
          }
          {/* <div className="button-container">
            <button className="button button--get-quote" onClick={this.fetchQuote}>Get New Quote</button>
            <a className="button button--tweet-quote" href={tweetLink} target="_blank" rel="noopener noreferrer">Tweet Quote</a>
          </div> */}
        </div>
      }
        <div className="button-container">
          <button className="button button--get-quote" onClick={this.fetchQuote}>Get New Quote</button>
          <a className="button button--tweet-quote" href={tweetLink} target="_blank" rel="noopener noreferrer">Tweet Quote</a>
        </div>
      </div>
    );
  }
}

export default App;
