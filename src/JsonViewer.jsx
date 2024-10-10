import React from 'react';
import ReactJson from 'react-json-view';

const JsonViewer = ({ jsonString }) => {
  let jsonObject;
  try {
    jsonObject = JSON.parse(jsonString);
  } catch (error) {
    return <div>Error: El string no es un JSON válido.</div>;
  }

  return (
    <ReactJson
      src={jsonObject}
      theme="bright:inverted"
      iconStyle="square"
      collapsed={false}
      enableClipboard={true}
      indentWidth={2}
      displayDataTypes={false}
      displayObjectSize={false}
    />
  );
};

export default JsonViewer;