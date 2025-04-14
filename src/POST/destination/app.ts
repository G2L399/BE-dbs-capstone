import Hapi from '@hapi/hapi';
export default (
  request: Hapi.Request<Hapi.ReqRefDefaults>,
  h: Hapi.ResponseToolkit<Hapi.ReqRefDefaults>
) => {
  const auth = request.auth.credentials;
  console.log(auth);

  return 'POST request to /destination';
};
export const options: Hapi.RouteOptions = {
  auth: 'jwt'
};
