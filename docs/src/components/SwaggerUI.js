import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import "swagger-ui-react/swagger-ui.css";
import spec from '../../static/swagger.json';

function CustomSwaggerUI() {
  return <SwaggerUI spec={spec} />;
}

export default CustomSwaggerUI;