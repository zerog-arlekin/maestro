window.addEventListener('DOMContentLoaded', function (event) {
    console.log('DOM fully loaded and parsed');
    websdkready();
});

function websdkready() {
    var testTool = window.testTool;
    // get meeting args from url
    var tmpArgs = testTool.parseQuery();
    var meetingConfig = {
        apiKey: tmpArgs.apiKey,
        meetingNumber: tmpArgs.mn,
        userName: (function () {
            if (tmpArgs.name) {
                try {
                    return testTool.b64DecodeUnicode(tmpArgs.name);
                } catch (e) {
                    return tmpArgs.name;
                }
            }
        })(),
        passWord: tmpArgs.pwd,
        leaveUrl: "/maestro/index.html",
        role: parseInt(tmpArgs.role, 10),
        userEmail: tmpArgs.email,
        lang: tmpArgs.lang,
        signature: tmpArgs.signature || "",
        china: tmpArgs.china === "1",
    };

    console.log(JSON.stringify(ZoomMtg.checkSystemRequirements()));

    // it's option if you want to change the WebSDK dependency link resources. setZoomJSLib must be run at first
    // ZoomMtg.setZoomJSLib("https://source.zoom.us/2.0.1/lib", "/av"); // CDN version defaul
    if (meetingConfig.china)
        ZoomMtg.setZoomJSLib("https://jssdk.zoomus.cn/2.9.7/lib", "/av"); // china cdn option
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareJssdk();

    function beginJoin(signature) {
        // ZoomMtg.init({
        //     leaveUrl: meetingConfig.leaveUrl,
        //     webEndpoint: meetingConfig.webEndpoint,
        //     disableCORP: !window.crossOriginIsolated, // default true
        //     disablePreview: true,
        //     isSupportChat: false,
        //     screenShare: false,
        //     showPureSharingContent: false,
        //     success: function () {
        //         console.log(meetingConfig);
        //         console.log("signature", signature);
        //         ZoomMtg.i18n.load(meetingConfig.lang);
        //         ZoomMtg.i18n.reload(meetingConfig.lang);
        //         ZoomMtg.join({
        //             meetingNumber: meetingConfig.meetingNumber,
        //             userName: meetingConfig.userName,
        //             signature: signature,
        //             apiKey: meetingConfig.apiKey,
        //             userEmail: meetingConfig.userEmail,
        //             passWord: meetingConfig.passWord,
        //             success: function (res) {
        //                 console.log('res: ', res);
        //                 console.log("join meeting success");
        //                 console.log("get attendeelist");
        //                 ZoomMtg.getAttendeeslist({});
        //                 ZoomMtg.getCurrentUser({
        //                     success: function (res) {
        //                         console.log("OPAPAsuccess getCurrentUser", res.result.currentUser);
        //                         res.result.currentUser.video = true;
        //                     },
        //                 });
        //             },
        //             error: function (res) {
        //                 console.log(res);
        //             },
        //         });
        //     },
        //     error: function (res) {
        //         console.log(res);
        //     },
        // });

        ZoomMtg.init({
            leaveUrl: meetingConfig.leaveUrl,
            disableJoinAudio: true,
            disablePreview: true,
            success: (success) => {
              console.log(success)
              ZoomMtg.join({
                signature: signature,
                meetingNumber: meetingConfig.meetingNumber,
                userName: meetingConfig.userName,
                sdkKey: meetingConfig.apiKey,
                userEmail: meetingConfig.userEmail,
                passWord: meetingConfig.passWord,
                tk: '',
                success: (success) => {
                  console.log(success)
                },
                error: (error) => {
                  console.log(error)
                }
              })
      
            },
            error: (error) => {
              console.log('error: ', error)
            }
          })

        ZoomMtg.inMeetingServiceListener('onUserJoin', function (data) {
            console.log('inMeetingServiceListener onUserJoin', data);
        });

        ZoomMtg.inMeetingServiceListener('onUserLeave', function (data) {
            console.log('inMeetingServiceListener onUserLeave', data);
        });

        ZoomMtg.inMeetingServiceListener('onUserIsInWaitingRoom', function (data) {
            console.log('inMeetingServiceListener onUserIsInWaitingRoom', data);
        });

        ZoomMtg.inMeetingServiceListener('onMeetingStatus', function (data) {
            console.log('inMeetingServiceListener onMeetingStatus', data);
        });
    }

    beginJoin(meetingConfig.signature);
};
