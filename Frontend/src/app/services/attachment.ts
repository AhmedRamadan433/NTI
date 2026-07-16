import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { API_ROUTES } from "../constants/api.constants";
import { Attachment } from "../models/attachment.model";
import { ApiResponse } from "../models/api-response.model";

@Injectable({ providedIn: "root" })
export class AttachmentService {
  private http = inject(HttpClient);

  list(): Observable<ApiResponse<Attachment[]>> {
    return this.http.get<ApiResponse<Attachment[]>>(API_ROUTES.ATTACHMENT);
  }

  getById(id: string): Observable<ApiResponse<Attachment>> {
    return this.http.get<ApiResponse<Attachment>>(
      `${API_ROUTES.ATTACHMENT}/${id}`,
    );
  }

  upload(formData: FormData): Observable<ApiResponse<Attachment>> {
    return this.http.post<ApiResponse<Attachment>>(
      `${API_ROUTES.ATTACHMENT}/upload`,
      formData,
    );
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${API_ROUTES.ATTACHMENT}/${id}`,
    );
  }
}
