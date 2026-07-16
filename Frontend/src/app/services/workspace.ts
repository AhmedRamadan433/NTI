import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { API_ROUTES } from "../constants/api.constants";
import { Workspace } from "../models/workspace.model";
import { ApiResponse } from "../models/api-response.model";

@Injectable({ providedIn: "root" })
export class WorkspaceService {
  private http = inject(HttpClient);

  list(): Observable<ApiResponse<Workspace[]>> {
    return this.http.get<ApiResponse<Workspace[]>>(API_ROUTES.WORKSPACE);
  }

  getById(id: string): Observable<ApiResponse<Workspace>> {
    return this.http.get<ApiResponse<Workspace>>(
      `${API_ROUTES.WORKSPACE}/${id}`,
    );
  }

  create(workspace: Partial<Workspace>): Observable<ApiResponse<Workspace>> {
    return this.http.post<ApiResponse<Workspace>>(
      API_ROUTES.WORKSPACE,
      workspace,
    );
  }

  // Make sure this is .patch as well!
  update(
    id: string,
    workspace: Partial<Workspace>,
  ): Observable<ApiResponse<Workspace>> {
    return this.http.patch<ApiResponse<Workspace>>(
      `${API_ROUTES.WORKSPACE}/${id}`,
      workspace,
    );
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${API_ROUTES.WORKSPACE}/${id}`);
  }
}
