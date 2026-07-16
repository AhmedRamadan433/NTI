import { Routes } from "@angular/router";
import { APP_ROUTES } from "./constants/app-routes.constants";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./layouts/main-layout/main-layout").then((m) => m.MainLayout),
    children: [
      { path: "", redirectTo: APP_ROUTES.WORKSPACES, pathMatch: "full" },

      // Workspaces
      {
        path: APP_ROUTES.WORKSPACES,
        loadComponent: () =>
          import("./pages/workspaces/workspace-list/workspace-list").then(
            (m) => m.WorkspaceList,
          ),
      },
      {
        path: `${APP_ROUTES.WORKSPACES}/create`,
        loadComponent: () =>
          import("./pages/workspaces/create-workspace/create-workspace").then(
            (m) => m.CreateWorkspace,
          ),
      },
      {
        path: `${APP_ROUTES.WORKSPACES}/:workspaceId`,
        loadComponent: () =>
          import("./pages/workspaces/workspace-details/workspace-details").then(
            (m) => m.WorkspaceDetails,
          ),
        children: [
          { path: "", redirectTo: "projects", pathMatch: "full" },

          // Projects
          {
            path: "projects",
            loadComponent: () =>
              import("./pages/projects/project-list/project-list").then(
                (m) => m.ProjectListComponent,
              ),
          },
          {
            path: "projects/create", // Must be before :projectId
            loadComponent: () =>
              import("./pages/projects/create-project/create-project").then(
                (m) => m.CreateProject,
              ),
          },
          {
            path: "projects/:projectId",
            loadComponent: () =>
              import("./pages/projects/project-details/project-details").then(
                (m) => m.ProjectDetails,
              ),
          },
          {
            path: "projects/:projectId/edit",
            loadComponent: () =>
              import("./pages/projects/edit-project/edit-project").then(
                (m) => m.EditProject,
              ),
          },

          // Sprints
          {
            path: "projects/:projectId/sprints",
            loadComponent: () =>
              import("./pages/sprints/sprint-list/sprint-list").then(
                (m) => m.SprintList,
              ),
          },
          {
            path: "projects/:projectId/sprints/create",
            loadComponent: () =>
              import("./pages/sprints/sprint-create/sprint-create").then(
                (m) => m.SprintCreate,
              ),
          },
          {
            path: "projects/:projectId/sprints/:sprintId",
            loadComponent: () =>
              import("./pages/sprints/sprint-details/sprint-details").then(
                (m) => m.SprintDetails,
              ),
          },
          {
            path: "projects/:projectId/sprints/:sprintId/edit",
            loadComponent: () =>
              import("./pages/sprints/sprint-edit/sprint-edit").then(
                (m) => m.SprintEdit,
              ),
          },

          // Tasks
          {
            path: "projects/:projectId/tasks",
            loadComponent: () =>
              import("./pages/tasks/task-list/task-list").then(
                (m) => m.TaskListComponent,
              ),
          },
          {
            path: "projects/:projectId/tasks/create",
            loadComponent: () =>
              import("./pages/tasks/task-create/task-create").then(
                (m) => m.TaskCreate,
              ),
          },
          {
            path: "projects/:projectId/tasks/:taskId",
            loadComponent: () =>
              import("./pages/tasks/task-details/task-details").then(
                (m) => m.TaskDetails,
              ),
          },
          {
            path: "projects/:projectId/tasks/:taskId/edit",
            loadComponent: () =>
              import("./pages/tasks/task-edit/task-edit").then(
                (m) => m.TaskEdit,
              ),
          },
        ],
      },
      {
        path: `${APP_ROUTES.WORKSPACES}/:workspaceId/edit`,
        loadComponent: () =>
          import("./pages/workspaces/edit-workspace/edit-workspace").then(
            (m) => m.EditWorkspace,
          ),
      },
      {
        path: `${APP_ROUTES.WORKSPACES}/:workspaceId/delete`,
        loadComponent: () =>
          import("./pages/workspaces/delete-workspace/delete-workspace").then(
            (m) => m.DeleteWorkspace,
          ),
      },

      // Standalone routes
      {
        path: APP_ROUTES.TEAMS,
        loadComponent: () =>
          import("./pages/teams/team-list/team-list").then((m) => m.TeamList),
      },
      {
        path: APP_ROUTES.ATTACHMENTS,
        loadComponent: () =>
          import("./pages/attachments/attachment-list/attachment-list").then(
            (m) => m.AttachmentList,
          ),
      },
      {
        path: `${APP_ROUTES.ATTACHMENTS}/upload`,
        loadComponent: () =>
          import("./pages/attachments/attachment-upload/attachment-upload").then(
            (m) => m.AttachmentUpload,
          ),
      },
      {
        path: `${APP_ROUTES.ATTACHMENTS}/:id`,
        loadComponent: () =>
          import("./pages/attachments/attachment-details/attachment-details").then(
            (m) => m.AttachmentDetails,
          ),
      },
      {
        path: APP_ROUTES.SETTINGS,
        loadComponent: () =>
          import("./pages/settings/settings/settings").then((m) => m.Settings),
      },
      {
        path: APP_ROUTES.PROFILE,
        loadComponent: () =>
          import("./pages/profile/profile/profile").then((m) => m.Profile),
      },
    ],
  },
  {
    path: "",
    loadComponent: () =>
      import("./layouts/auth-layout/auth-layout").then((m) => m.AuthLayout),
    children: [
      {
        path: APP_ROUTES.LOGIN,
        loadComponent: () =>
          import("./pages/auth/login/login").then((m) => m.Login),
      },
      {
        path: APP_ROUTES.REGISTER,
        loadComponent: () =>
          import("./pages/auth/register/register").then((m) => m.Register),
      },
    ],
  },
  {
    path: "**",
    loadComponent: () =>
      import("./pages/not-found/not-found").then((m) => m.NotFound),
  },
];
