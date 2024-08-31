<template>
  <div class="tool">
    <div class="topTool">
      <RouterLink class="backHome" to="/">返回首页</RouterLink>
      <div class="toolBigName">{{ localTool.name }}</div>
      <div class="toolName">{{ localTool.more }}</div>
    </div>

    <div class="toolInput">
      <textarea v-model="inputText" class="inputText" placeholder="请输入"></textarea>
      <div class="inputBox">
        <div class="sendOption" @click="sendChat" :style="divStyle"> 连续对话 </div>

        <div class="sendInput" @click="sendMessage(inputText)">生成<p class="sendCount" v-if="!isVip">({{ count }})</p>
        </div>
      </div>
    </div>
    <div class="toolOutput" v-if="aiMessages.content">
      <div class="outputBox">
        <div class="copyOutput" @click="copyToClipboard">复制全部</div>
        <MdPreview class="outputText" v-model="aiMessages.content" />
        <p class="charCount">字符数量: {{ charCount }}</p>
        <p class="charCount">内容由AI生成，请注意甄别</p>
      </div>

    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';

export default {
  components: {
    // MdEditor,
    MdPreview,
  },

  data() {
    return {
      // API配置
      // API_KEY: 'sk-b25aa5538da243bb8d60f704f9941a8b',
      // ENDPOINT: 'https://api.deepseek.com/v1/chat/completions',
      // MODEL_NAME: 'deepseek-chat',

      // API配置2
      API_KEY: 'sk-cknwcfvxfuaemvbgfpcjhececitxulqcjbderqufacsdlrqh',
      ENDPOINT: 'https://api.siliconflow.cn/v1/chat/completions',
      MODEL_NAME: 'Qwen/Qwen2-7B-Instruct',


      // 历史消息，存储用户和AI的对话记录
      allMessages: [{ role: 'system', content: '' }],
      // allMessages: [],
      // 显示内容，存储AI的回复
      aiMessages: [],

      // 等待状态，防止用户重复发送请求
      waiting: false,

      inputText: '',//用户输入内容
      localTool: '',// 定义一个本地变量来存储 Vuex 的值
      prompt: '', //提示词
      //生成次数
      count: '10',
      isVip: false, // 展示VIP效果
      sendOption: false, //连续对话是否开启
    };
  },
  watch: {
    '$store.state.tool'(newTool) {
      // 监听 Vuex 中 prompt 的变化，更新本地变量的值
      this.localTool = newTool;
    }
  },
  computed: {
    //统计字符数
    charCount() {
      return this.aiMessages.content.length;
    },
    divStyle() {
      return {
        backgroundColor: this.sendOption ? '#87ceea' : 'white',
        color: this.sendOption ? 'white' : 'black',
      };
    }

  },
  methods: {
    //复制全部
    async copyToClipboard() {
      try {
        await navigator.clipboard.writeText(this.aiMessages.content);
        this.openSuccess('复制成功！')
      } catch (err) {
        console.error('无法复制文本：', err);
      }
    },
    //弹出成功消息
    openSuccess(text) {
      this.$message({
        message: text,
        type: 'success',
      });
    },
    //弹出失败消息
    openError(text) {
      this.$message.error(text);
    },
    //弹出警告消息
    openWarning(text) {
      this.$message({
        message: text,
        type: 'warning',
      });
    },

    // 与API通信的异步生成器函数
    async * getGPT(input) {
      // 发送POST请求到指定的API端点
      const response = await fetch(this.ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}` // 使用提供的API密钥进行授权
        },
        body: JSON.stringify({
          model: this.MODEL_NAME, // 指定使用的模型名称
          stream: true, // 启用流式传输
          messages: input // 输入的消息内容
        })
      });

      // 检查响应是否成功
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`); // 抛出HTTP错误
      }

      // 获取响应体的读取器
      const reader = response.body.getReader();
      let decoder = new TextDecoder(); // 创建文本解码器
      let resultData = ''; // 初始化结果数据字符串

      // 持续读取响应体数据
      while (true) {
        const { done, value } = await reader.read(); // 读取数据块
        if (done) break; // 如果读取完成，退出循环
        resultData += decoder.decode(value); // 将数据块解码并添加到结果数据字符串中

        // 处理结果数据字符串中的消息
        while (resultData.includes('\n')) {
          const messageIndex = resultData.indexOf('\n'); // 找到第一个换行符的位置
          const message = resultData.slice(0, messageIndex); // 提取消息部分
          resultData = resultData.slice(messageIndex + 1); // 更新结果数据字符串，去掉已处理的消息部分

          // 检查消息是否以'data: '开头
          if (message.startsWith('data: ')) {
            const jsonMessage = JSON.parse(message.substring(5)); // 解析消息中的JSON数据

            if (jsonMessage.choices[0]?.finish_reason == 'stop') {
              break; // 检测到stop停止
            }

            // if (resultData.includes('[DONE]')) {
            //   break; // 如果消息包含'[DONE]'，退出循环
            // }
            const createdID = jsonMessage.created; // 获取消息的创建ID
            yield {
              content: jsonMessage.choices[0]?.delta?.content || ' ',
              role: "assistant",
              id: createdID
            };
          }
        }
      }
    },

    // 保存生成次数到本地存储
    saveCountToLocalStorage() {
      localStorage.setItem('generationCount', this.count);
      localStorage.setItem('generationDate', new Date().toDateString());
    },

    // 从本地存储读取生成次数
    loadCountFromLocalStorage() {
      const savedCount = localStorage.getItem('generationCount');
      const savedDate = localStorage.getItem('generationDate');
      const currentDate = new Date().toDateString();

      if (savedDate === currentDate) {
        this.count = savedCount || 10;
        // 如果次数已经用完，保持为0
        if (this.count === 0) {
          this.count = 0;
        }
      } else {
        this.count = 10;
        this.saveCountToLocalStorage();
      }
    },

    // 检查并重置生成次数
    checkAndResetCount() {
      this.loadCountFromLocalStorage();
    },

    //设置连续对话
    sendChat() {
      if (this.sendOption == true) {
        this.sendOption = false
        this.openSuccess('连续对话已关闭')
      } else {
        this.sendOption = true
        this.openSuccess('连续对话已开启')
      }
    },

    //刷新页面
    refreshPage() {
      location.reload();
    },

    //发送消息!!!!
    async sendMessage(inputText) {
      //检查是否开启VIP及检查剩余次数
      const vipSwitch = localStorage.getItem('vipSwitch');
      // 如果 vipSwitch 存在且值为 true，则不执行关于 count 次数的函数

      if (vipSwitch && vipSwitch === 'true') {
        // 直接发送消息，不检查或修改 count
      } else {
        const currentDate = new Date().toDateString();
        const savedDate = localStorage.getItem('generationDate');

        // 如果日期变化，重置生成次数
        if (savedDate !== currentDate) {
          this.count = 10;
          this.saveCountToLocalStorage();
        }
        if (this.count <= 0) {
          this.openWarning('今日生成次数已用完，请明天再来！');
          return;
        }
        this.count = this.count - 1;
        this.saveCountToLocalStorage();
      }

      //检查是否有对话进行中
      if (this.waiting) return;
      this.waiting = true;

      // this.allMessages = [{ role: 'system', content: this.prompt }]
      //判断是否开启连续对话
      if (this.sendOption) {
        //连续对话模式
        //添加用户消息
        console.log(this.allMessages);

        this.allMessages[0] = { role: 'system', content: this.prompt }
        this.allMessages.push({ role: 'user', content: inputText })

        this.aiMessages = [];

        for await (const message of this.getGPT(this.allMessages)) {
          // console.log(message);
          // 将新消息内容追加到消息列表中
          if (this.aiMessages.content) {
            this.aiMessages.content += message.content; // 添加换行符以分隔消息
          }
          else {
            this.aiMessages = {
              role: message.role, content: message.content
            }
            // this.messages.role = message.role
            // this.messages.content = message.content;
          }
        }
        this.waiting = false;

        //把AI回复添加到历史消息
        this.allMessages.push(this.aiMessages)

        // console.log(this.allMessages);

      } else {

        //一次性对话模式
        //定义一个一次性消息数组
        const userMessage = [
          { role: 'system', content: this.prompt },
          { role: 'user', content: inputText },
        ];

        this.aiMessages = [];

        for await (const message of this.getGPT(userMessage)) {
          // console.log(message);
          // 将新消息内容追加到消息列表中
          if (this.aiMessages.content) {
            this.aiMessages.content += message.content; // 添加换行符以分隔消息
          }
          else {
            this.aiMessages = {
              role: message.role, content: message.content
            }
          }
        }
        this.waiting = false;
      }

    },

    //读取本地Prompt
    async readPromptFile(prompt) {
      try {
        //根据变量变化初始提示词
        const response = await axios.get(prompt, {
          responseType: 'text' // 指定响应类型为文本
        });
        this.prompt = response.data;
        // return response.data;
      } catch (error) {
        console.error('读取失败！:', error);
        return null;
      }
    },
    //检查是否自定义API
    checkApiSwitch() {
      const apiSwitch = localStorage.getItem('apiSwitch');

      if (apiSwitch && apiSwitch === 'true') {
        const userKey = localStorage.getItem('userKey');
        const userUrl = localStorage.getItem('userUrl');
        const userModel = localStorage.getItem('userModel');

        if (!userKey || !userUrl || !userModel) {
          this.openError('API自定义失败，请检查');
        } else {
          this.API_KEY = userKey;
          this.ENDPOINT = userUrl;
          this.MODEL_NAME = userModel;
        }
      }
    },
  },
  created() {
    // 初始化本地变量
    this.localTool = this.$store.state.tool;
    if (this.localTool.prompt) {
      this.readPromptFile(this.localTool.prompt); // 初始化时读取文件内容
    };
    this.checkAndResetCount(); // 检查并重置生成次数
  },
  mounted() {
    this.checkApiSwitch();
    this.checkAndResetCount(); // 确保在挂载时也检查生成次数
    // 检查本地存储中的 vipSwitch
    const vipSwitch = localStorage.getItem('vipSwitch');
    if (vipSwitch && vipSwitch === 'true') {
      this.isVip = true; // 设置 isVip 为 true
    }
  },
};
</script>

<style scoped>
.tool {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.topTool {
  width: 600px;
  display: flex;
  flex-direction: column;
  user-select: none;
}

.backHome {
  width: 100px;
  color: white;
  text-align: center;
  text-decoration: none;
  padding: 4px;
  background-color: skyblue;
  border-radius: 9px;
  margin-top: 20px;
  margin-bottom: 5px;
}

.backHome:hover {
  background-color: rgb(100, 200, 240);
}

.toolBigName {
  font-size: 30px;
  font-weight: 600;
}

.toolName {
  color: #a3a3a3;
  margin-bottom: 10px;
}

.toolInput {
  /* width: 600px; */
  /* height: 200px; */
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  background-color: #f9f9f9;
  border: 1px solid #eaeaea;
  border-radius: 12px;
  padding: 15px;
}

.inputText {
  border: none;
  resize: none;
  /* 禁止调整大小 */
  width: 570px;
  height: 150px;
  font-size: 18px;
  background-color: #f9f9f9;
  outline: none;
  border-bottom: 1px solid #eaeaea;
}

.inputBox {
  display: flex;
  user-select: none;
}

.sendOption {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
  margin-right: 15px;
  /* width: 100px; */
  text-align: center;
  text-decoration: none;
  padding: 4px 10px;
  font-size: 16px;
  background-color: white;
  border: 1px solid #eaeaea;
  border-radius: 9px;
}

.sendOption:hover {
  border: 1px solid #d2d2d2;
}

.sendInput {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
  width: 160px;
  color: white;
  text-align: center;
  text-decoration: none;
  padding: 4px;
  font-size: 16px;
  background-color: skyblue;
  border-radius: 9px;
}

.sendInput:hover {
  background-color: rgb(100, 200, 240);
}

.outputBox {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 20px;
  margin-bottom: 50px;
  width: 600PX;
  background-color: #f9f9f9;
  border: 1px solid #eaeaea;
  border-radius: 12px;
  padding: 15px;
}

.outputText {
  border-top: 1px solid #eaeaea;
  background-color: #f9f9f9;
  margin-top: 15px;
}

.copyOutput {
  width: 100px;
  text-align: center;
  text-decoration: none;
  padding: 4px;
  font-size: 16px;
  background-color: white;
  border: 1px solid #eaeaea;
  border-radius: 9px;
  user-select: none;
}

.copyOutput:hover {
  border: 1px solid #d2d2d2;
}

.charCount {
  color: #a2a2a2;
}


@media screen and (max-width: 768px) {
  .topTool {
    width: 360px;
  }

  .inputText {
    width: 330px;
    height: 130px;
  }

  .outputBox {
    width: 360PX;
    padding: 5px;
  }
}
</style>