import { Eggs } from "#/lib/helpers/egg-helper.helpers";
import { ApiError, ApiResponse } from "#/lib/structures";
import { catchAsync } from "#/lib/utils";
import { Egg } from "#/models/eggs.model";

export const createEGG = catchAsync(async (req, res) => {
  const json = req.body;
  if (json.config && json.config.files && typeof json.config.files === "string")
    json.config.files = JSON.parse(json.config.files);

  if (
    json.config &&
    json.config.startup &&
    typeof json.config.startup === "string"
  )
    json.config.startup = JSON.parse(json.config.startup);
  if (!Eggs.isValidEGG(json)) throw new ApiError(400, "Bad Request");

  try {
    const egg = await Egg.create(json);
    res
      .status(201)
      .json(new ApiResponse(201, `Egg ${json.name} has been created`, egg));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, "Server-Error"));
  }
});
