import Hapi from '@hapi/hapi';

export default (
  request: Hapi.Request<Hapi.ReqRefDefaults>,
  h: Hapi.ResponseToolkit<Hapi.ReqRefDefaults>
) => {
  return 'DELETE request to /destination';
};
