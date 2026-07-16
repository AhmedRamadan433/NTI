import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { API_ROUTES } from "../constants/api.constants";
import { Sprint } from "../models/sprint.model";
import { ApiResponse } from "../models/api-response.model";

@Injectable({ providedIn: "root" })
export class SprintService {
  private http = inject(HttpClient);

  list(projectId: string): Observable<ApiResponse<Sprint[]>> {
    return this.http.get<ApiResponse<Sprint[]>>(
      `${API_ROUTES.PROJECT}/${projectId}/sprints`,
    );
  }

  getById(id: string): Observable<ApiResponse<Sprint>> {
    return this.http.get<ApiResponse<Sprint>>(`${API_ROUTES.SPRINT}/${id}`);
  }

  create(
    projectId: string,
    sprint: Partial<Sprint>,
  ): Observable<ApiResponse<Sprint>> {
    return this.http.post<ApiResponse<Sprint>>(
      `${API_ROUTES.PROJECT}/${projectId}/sprints`,
      sprint,
    );
  }

  // Changed to .patch
  update(id: string, sprint: Partial<Sprint>): Observable<ApiResponse<Sprint>> {
    return this.http.patch<ApiResponse<Sprint>>(
      `${API_ROUTES.SPRINT}/${id}`,
      sprint,
    );
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${API_ROUTES.SPRINT}/${id}`);
  }
}
