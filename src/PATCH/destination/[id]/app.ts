import Hapi from "@hapi/hapi";
import Joi from "joi"; // Import Joi
export default (
  request: Hapi.Request<Hapi.ReqRefDefaults>,
  h: Hapi.ResponseToolkit<Hapi.ReqRefDefaults>
) => {
  const id = request.params.id;
  return h
    .response({ message: `PATCH request to /destination/${id}`, ID: id })
    .code(200);
};
export const options: Hapi.RouteOptions<Hapi.ReqRefDefaults> = {
  tags: ["api"],
  description: "A PATCH endpoint for the destination",
  notes: "Returns a message indicating the endpoint is reached",
  validate: {
    params: Joi.object({
      id: Joi.string().required().description("The ID of the destination"),
    }),
  },
  response: {
    schema: Joi.object({
      message: Joi.string().required(),
      ID: Joi.string().required(),
    }),
  },
};
