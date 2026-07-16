import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { API_ROUTES } from "../constants/api.constants";
import { Task } from "../models/task.model";
import { ApiResponse } from "../models/api-response.model";

@Injectable({ providedIn: "root" })
export class TaskService {
  private http = inject(HttpClient);

  list(projectId: string): Observable<ApiResponse<Task[]>> {
    return this.http.get<ApiResponse<Task[]>>(
      `${API_ROUTES.PROJECT}/${projectId}/task`,
    );
  }

  getById(id: string): Observable<ApiResponse<Task>> {
    return this.http.get<ApiResponse<Task>>(`${API_ROUTES.TASK}/${id}`);
  }

  create(
    projectId: string,
    task: Partial<Task>,
  ): Observable<ApiResponse<Task>> {
    return this.http.post<ApiResponse<Task>>(
      `${API_ROUTES.PROJECT}/${projectId}/task`,
      task,
    );
  }

  // Changed to .patch
  update(id: string, task: Partial<Task>): Observable<ApiResponse<Task>> {
    return this.http.patch<ApiResponse<Task>>(`${API_ROUTES.TASK}/${id}`, task);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${API_ROUTES.TASK}/${id}`);
  }
}
