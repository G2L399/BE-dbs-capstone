import Hapi from '@hapi/hapi';
export const welcome = (
  request: Hapi.Request<Hapi.ReqRefDefaults>,
  h: Hapi.ResponseToolkit<Hapi.ReqRefDefaults>
) => {
  return 'PATCH request to /user';
};
