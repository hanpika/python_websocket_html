import asyncio
import websockets
import json

Users = {}


async def chat(websocket):#聊天主模块
    global Users#全局变量，用来存储连接的前端

    async for message in websocket:
        data = json.loads(message)#发来的字符串转json
        if data["type"] == "open":#初次连接
            Users.update({websocket: {"img": data["img"], "name": data["name"], "epithet": data["epithet"]}})#想字典里存储{websocket连接:{"头像":"","名字":"","称号":""}}
            you = {#返回的数据
                "type": "open"
            }
            await websocket.send(json.dumps(you))#将连接成功的提示返回回去

        if data["type"] == "send":#客户端发送聊天信息
            user = Users[websocket]#获取此客户端信息
            senddata = {#要转发给其他人的json
                "type": "send",#类型
                "img": user["img"],#此用户头像
                "name": user["name"],#此用户名称
                "epithet": user["epithet"],#此用户称号
                "text": data["text"]#此用户发的文字
            }
            for key in Users.keys():#例遍在线的人的websocket
                await asyncio.wait([key.send(json.dumps(senddata))])#逐一转发

        if data["type"] == "close":#当有用户退出时
            del Users[websocket]#将他从users中删除，下次转发将不会再发给他，否则会报错


async def main():#入口
    async with websockets.serve(chat, "127.0.0.1", 5418):
        await asyncio.Future()

#asyncio.run(main())