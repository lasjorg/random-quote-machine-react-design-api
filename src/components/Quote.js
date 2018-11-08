import React from 'react';
import ReactHtmlParser from 'react-html-parser';

const Quote = props => {
  return (
    <React.Fragment>
      <h1 className="author" id="author">
        {props.title}
      </h1>
      <div className="quote">{ReactHtmlParser(props.content)}</div>
    </React.Fragment>
  );
};

export default Quote;
