import Hapi from "@hapi/hapi";
export default (
  request: Hapi.Request<Hapi.ReqRefDefaults>,
  h: Hapi.ResponseToolkit<Hapi.ReqRefDefaults>
) => {
  const id = request.params.id;
  return h
    .response({ message: `PATCH request to /destination/${id}`, ID: id })
    .code(200);
};
