import Hapi from "@hapi/hapi";
export default (
  request: Hapi.Request<Hapi.ReqRefDefaults>,
  h: Hapi.ResponseToolkit<Hapi.ReqRefDefaults>
) => {
  return "POST request to /destination";
};
