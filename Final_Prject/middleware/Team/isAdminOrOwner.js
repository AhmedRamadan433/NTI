const Team = require("../../models/team.model.js");
const Workspace = require("../../models/workspace.model.js");
const AppError = require("../../utils/AppError.js");

const isAdminOrOwner = async (req, res, next) => {
  try {
    const teamId = req.params.teamId || req.params.id;
    const userId = req.user.id;

    // Get workspace id only
    const team = await Team.findById(teamId).select("workspace");

    if (!team) {
      return next(new AppError("Team not found", 404));
    }

    // Check owner OR admin in one query
    const workspace = await Workspace.exists({
      _id: team.workspace,
      $or: [
        { owner: userId },
        {
          members: {
            $elemMatch: {
              user: userId,
              role: "admin",
            },
          },
        },
      ],
    });

    if (!workspace) {
      return next(
        new AppError("Only workspace owner or admin can manage this team", 403),
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = isAdminOrOwner;
