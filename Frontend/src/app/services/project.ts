import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiResponse } from "../models/api-response.model";
import { Project } from "../models/project.model";
import { API_ROUTES, API_BASE_URL } from "../constants/api.constants";

export interface CreateProjectRequest {
  projectName: string;
  projectDescription: string;
  projectStatus: "Not Started" | "In Progress" | "Completed";
  projectPriority: "Low" | "Medium" | "High";
  projectEndDate?: string;
}

export type UpdateProjectRequest = Partial<CreateProjectRequest>;

@Injectable({
  providedIn: "root",
})
export class ProjectService {
  private http = inject(HttpClient);
  private projectsUrl = `${API_BASE_URL}/projects`;

  list(workspaceId: string): Observable<ApiResponse<Project[]>> {
    return this.http.get<ApiResponse<Project[]>>(
      `${API_ROUTES.WORKSPACE}/${workspaceId}/projects`,
    );
  }

  getById(id: string): Observable<ApiResponse<Project>> {
    return this.http.get<ApiResponse<Project>>(`${this.projectsUrl}/${id}`);
  }

  create(
    workspaceId: string,
    data: CreateProjectRequest | Partial<Project>,
  ): Observable<ApiResponse<Project>> {
    return this.http.post<ApiResponse<Project>>(
      `${API_ROUTES.WORKSPACE}/${workspaceId}/projects`,
      data,
    );
  }

  update(
    id: string,
    data: UpdateProjectRequest | Partial<Project>,
  ): Observable<ApiResponse<Project>> {
    return this.http.patch<ApiResponse<Project>>(
      `${this.projectsUrl}/${id}`,
      data,
    );
  }

  delete(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.projectsUrl}/${id}`);
  }
}
