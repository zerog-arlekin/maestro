window.addEventListener('DOMContentLoaded', function (event) {
    console.log('DOM fully loaded and parsed');
    websdkready();
});

function websdkready() {
    var testTool = window.testTool;
    console.log("checkSystemRequirements");
    console.log(JSON.stringify(ZoomMtg.checkSystemRequirements()));

    // it's option if you want to change the WebSDK dependency link resources. setZoomJSLib must be run at first
    // if (!china) ZoomMtg.setZoomJSLib('https://source.zoom.us/2.0.1/lib', '/av'); // CDN version default
    // else ZoomMtg.setZoomJSLib('https://jssdk.zoomus.cn/2.0.1/lib', '/av'); // china cdn option
    // ZoomMtg.setZoomJSLib('http://localhost:9999/node_modules/@zoomus/websdk/dist/lib', '/av'); // Local version default, Angular Project change to use cdn version
    ZoomMtg.preLoadWasm(); // pre download wasm file to save time.

    var API_KEY = "cO0ZMLWLssQtk0kCs9oElZ1mI0NnCSbL6zSc";
    /**
     * NEVER PUT YOUR ACTUAL API SECRET IN CLIENT SIDE CODE, THIS IS JUST FOR QUICK PROTOTYPING
     * The below generateSignature should be done server side as not to expose your api secret in public
     * You can find an eaxmple in here: https://marketplace.zoom.us/docs/sdk/native-sdks/web/essential/signature
     */
    var signatureEndpoint = "http://localhost:4000/";

    // click join meeting button
    document
        .getElementById("join_meeting")
        .addEventListener("click", function (e) {
            e.preventDefault();
            var meetingConfig = testTool.getMeetingConfig();
            if (!meetingConfig.name) {
                alert("Meeting username is empty");
                return false;
            }
            
            var signature = fetch(signatureEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  meetingNumber: meetingConfig.mn,
                  role: meetingConfig.role
                })
              }).then(res => res.json())
              .then(response => {
                    meetingConfig.signature = response.signature;
                    meetingConfig.apiKey = API_KEY;
                    var joinUrl = "/maestro/meeting.html?" + testTool.serialize(meetingConfig);
                    window.open(joinUrl, "_self");
                }).catch(error => {
                console.error(error)
              })
        });
}
