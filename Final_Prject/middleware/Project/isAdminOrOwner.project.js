const Project = require("../../models/project.model.js");
const Workspace = require("../../models/workspace.model.js");
const AppError = require("../../utils/AppError.js");

const isAdminOrOwnerForProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    // Get workspace id only
    const project = await Project.findById(id).select("workspace");
    if (!project) {
      return next(new AppError("Project not found", 404));
    }

    // Check owner OR admin in one query
    const workspace = await Workspace.exists({
      _id: project.workspace,
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
        new AppError(
          "Only workspace owner or admin can manage this project",
          403,
        ),
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = isAdminOrOwnerForProject;
