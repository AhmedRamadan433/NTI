import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { API_ROUTES } from "../constants/api.constants";
import { Project } from "../models/project.model";
import { ApiResponse } from "../models/api-response.model";

@Injectable({ providedIn: "root" })
export class ProjectService {
  private http = inject(HttpClient);

  // Get all projects for a specific workspace
  list(workspaceId: string): Observable<ApiResponse<Project[]>> {
    return this.http.get<ApiResponse<Project[]>>(
      `${API_ROUTES.WORKSPACE}/${workspaceId}/projects`,
    );
  }

  // Get a single project by its ID
  getById(id: string): Observable<ApiResponse<Project>> {
    return this.http.get<ApiResponse<Project>>(`${API_ROUTES.PROJECT}/${id}`);
  }

  // Create a new project inside a workspace
  create(
    workspaceId: string,
    project: Partial<Project>,
  ): Observable<ApiResponse<Project>> {
    return this.http.post<ApiResponse<Project>>(
      `${API_ROUTES.WORKSPACE}/${workspaceId}/projects`,
      project,
    );
  }

  // Update an existing project using the project's ID
  update(
    id: string,
    project: Partial<Project>,
  ): Observable<ApiResponse<Project>> {
    return this.http.patch<ApiResponse<Project>>(
      `${API_ROUTES.PROJECT}/${id}`,
      project,
    ); // Changed to .patch
  }

  // Delete a project
  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${API_ROUTES.PROJECT}/${id}`);
  }
}
