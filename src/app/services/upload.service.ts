import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }

  upload(file: File): Observable<any> {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'imgdoan');
    data.append('cloud_name', 'dk9ostjz4');
    return this.http.post('https://api.cloudinary.com/v1_1/dk9ostjz4/image/upload', data)
  }

}
