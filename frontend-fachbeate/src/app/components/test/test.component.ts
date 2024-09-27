import { Component } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { log } from '../../services/logger.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { MultipleFileUploadRequest } from '../../models/multiple-file-upload-request';
import { FileUploadRequest } from '../../models/file-upload-request';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {

  allGroups: string[] = ["geschaeftsleitung", "abteilungsleitung", "front-office", "fachberater", "vertreter", "creator", "other"]
  groups: string[] = [];
  subject: string = "This is the Subject"
  message: string = "This is an Testmail"
  adress: string = ""


  fileList: NzUploadFile[] = [];
  fileUpload: MultipleFileUploadRequest = {files: []}

  constructor(private http: HttpService){}



  beforeUpload = (file: NzUploadFile): boolean => {
    return true;
  };

  handleChange(info: { fileList: NzUploadFile[] }): void {
    this.fileList = info.fileList;
    this.fileUpload = this.convertFileListToBase64()

  }

  post(){
    if(this.fileList.length !== 0){
      this.http.postFiles(this.fileUpload, "test_" + "1").subscribe();
    }
  }

  convertFileListToBase64(){
    var multipleFileUpload: MultipleFileUploadRequest = {files: []};

    this.fileList.forEach((file) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const base64Data = (fileReader.result as string).split(',')[1]; // Entferne den Base64-Header
        
        var tmpFile: FileUploadRequest = {fileContent: base64Data, fileName: file.name}
        multipleFileUpload.files!.push(tmpFile);
      };
      fileReader.readAsDataURL(file.originFileObj as File); // Konvertiere Datei zu base64
    });

    return multipleFileUpload;
  }



  //----------
  sendMail(){
    console.log(typeof this.groups)
    this.http.sendMail(this.groups, undefined!, this.message, this.subject).subscribe();
  }

  sendToAdress(){
    this.http.sendToAdress(this.adress, this.message, this.subject).subscribe();
  }

}
