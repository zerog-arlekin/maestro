import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';

import { ZoomMtg } from '@zoomus/websdk';

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();
// loads language files, also passes any error messages to the ui
ZoomMtg.i18n.load('en-US');
ZoomMtg.i18n.reload('en-US');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  // setup your signature endpoint here: https://github.com/zoom/meetingsdk-sample-signature-node.js
  signatureEndpoint = 'https://sapphire-maestro-zoom.herokuapp.com';
  apiKey = 'iuxd0UZ4QcSXaAfRS7fnNA';
  meetingNumber = '9289684478';
  role = 0;
  leaveUrl = 'http://localhost:4200';
  userName = 'Anatolii';
  passWord = 'WVdGbTlLYk0vR1FTQTloWmljSU5RQT09';
  // pass in the registrant's token if your meeting or webinar requires registration. More info here:
  // Meetings: https://marketplace.zoom.us/docs/sdk/native-sdks/web/build/meetings/join#join-registered
  // Webinars: https://marketplace.zoom.us/docs/sdk/native-sdks/web/build/webinars/join#join-registered-webinar
  private zoomElement: HTMLElement;

  constructor(public httpClient: HttpClient, @Inject(DOCUMENT) document) {

  }

  ngOnInit(): any {
    this.zoomElement = document.getElementById('zmmtg-root');
  }

  getSignature(): any {
    this.httpClient.post(this.signatureEndpoint, {
      meetingNumber: this.meetingNumber,
      role: this.role
    }).toPromise().then((data: any) => {
      if (data.signature) {
        console.log(data.signature);
        this.startMeeting(data.signature);
      } else {
        console.log(data);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  startMeeting(signature): any {
    this.zoomElement.style.display = 'block';

    ZoomMtg.init({
      leaveUrl: this.leaveUrl,
      disableInvite: true,
      disableCallOut: true,
      disableRecord: true,
      isSupportChat: false,
      videoHeader: false,
      screenShare: false,
      videoDrag: false,
      success: (initSuccess) => {
        console.log(initSuccess);
        ZoomMtg.join({
          signature,
          meetingNumber: this.meetingNumber,
          userName: this.userName,
          apiKey: this.apiKey,
          passWord: this.passWord,
          success: (joinSuccess) => {
            console.log(joinSuccess);
          },
          error: (error) => {
            console.log(error);
          }
        });
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
