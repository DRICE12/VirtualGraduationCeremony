const socket = io.connect(window.location.origin);
const video = document.querySelector("video#teacher-cam");

var user_table = {}
let tassel_list = []

// Media contrains
const constraints = {
    video: { facingMode: "user" }
    // Uncomment to enable audio
    // audio: true,
};

navigator.mediaDevices
    .getUserMedia(constraints)
    .then(stream => {
        video.srcObject = stream;
        //socket.emit("broadcaster");
    })
    .catch(error => console.error(error));

init(socket)

window.onunload = window.onbeforeunload = () => {
    socket.close();
    close_peer_connection();
}

$(document).ready(() => {
    socket.on("update_user_table", (data) => {
        for (const [key, info] of Object.entries(data)) {
            var block = $(`<span class="div-present"></span>`).attr('id', 'present-' + key);
            if (info["state"] !== undefined && info["state"] == "online")
                block.append($(`<img src="/img/student_online.png">`))
            else
                block.append($(`<img src="/img/student_offline.png">`))
            block.append($(`<p>${info.name}</p>`))
            $("#present-container").append(block)
        }
        user_table = data;
    })

    socket.on("update_tassel_list", (data) => {
        /*tassel_list = data;*/
        draw_timeline('#TimelineContainer', user_table, data);
    })

    /*socket.on('update-tassel', (count)=>{
        console.log('get tassel')
        draw_timeline('#TimelineContainer', user_table, tassel_list.slice(count));
    })*/
})


 