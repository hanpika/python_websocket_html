//以下代码除console.log以外，其他代码随意修改都可能出现bug
var socket
function dl() {//当输入完初始信息后调用此函数连接服务器
    socket = new WebSocket("ws://127.0.0.1:5418")
    socket.addEventListener("open", function (event) {//第一次连接
        senddata = {
            "type": "open",
            "img": "img/a.JPG",//头像（可自行修改）
            "name": document.getElementById("name").value,//名字
            "epithet": document.getElementById("epithet").value//称号
        }
        fasong(senddata)//发送初始化信息
        document.getElementById("dldiv").remove()//删掉初始化的按钮及输入框，防止出现问题
    })

    socket.addEventListener("message", function (event) {//当收到服务器信息或转发时
        var data = JSON.parse(event.data)//字符串转json
        console.log(data)
    })

    socket.addEventListener("close", function (event) {
        console.log("close")
    })

    socket.addEventListener("error", function (event) {
        console.log("server error")
    })
}

function fasong(json) {//发送至服务器
    var data = JSON.stringify(json)//json转字符串
    socket.send(data)//发送
}

onbeforeunload = function () {//当刷新或关闭网页时向服务器发送退出信息
    fasong({"type":"close","text":"bye"})
}

function send() {//发送聊天文字
    senddata = {
        "type": "send",
        "text": document.getElementById('fasong').value
    }
    fasong(senddata)
}