import React from 'react';
import ReactHtmlParser, { convertNodeToElement } from 'react-html-parser';

const Source = props => {
  return (
    <div className="source">
      Source:{' '}
      {ReactHtmlParser(props.source, {
        transform: function(node, index) {
          if (node.type === 'tag' && node.name === 'a') {
            node.attribs.target = '_blank';
            node.attribs.rel = 'noopener noreferrer';
            return convertNodeToElement(node, index);
          }
        }
      })}
    </div>
  );
};

export default Source;
