<template>
  <div class="setting">
    <div class="topSetting">
      <RouterLink class="backHome" to="/">返回首页</RouterLink>
      <div class="settingName">设置</div>
    </div>
    <div class="settingOption">
      <div class="vip" v-if="!vipSwitch">
        <p>诚信授权</p>
        <p>本产品采用诚信授权模式，灵感来自椒盐音乐<br>如果你喜欢本产品，可以一杯奶茶钱为其付费<br>理论上可以直接使用，但付费使用是诚信的表现</p>
        <div class="vipButton" @click="pay">点击付款</div>
        <!-- <el-button plain @click="pay">Click to open Message Box</el-button> -->
        <!-- <RouterLink class="vipButton" to="/about">点击付款</RouterLink> -->
      </div>
      <div class="pay" v-if="vipPay && !vipSwitch">
        <p>截图后付费</p>
        <img class="apay" src="../assets/images/wxpay.jpg" alt="微信支付">
        <img class="apay" src="../assets/images/zfb.jpg" alt="支付宝">
        <img class="apay" src="../assets/images/wxzs.jpg" alt="微信支付">
      </div>
      <div class="openVip" v-if="vipSwitch">
        <img src="../assets/images/vip.png" alt="会员">
        <div>
          <p style="font-size: larger;">已诚信付费解锁Pro</p>
          <p>感谢你，这将帮助我们更好地发展下去~</p>
        </div>
      </div>

      <div class="switch">
        <p class="switchName">我已诚信付款，启用Pro</p>
        <el-switch v-model="vipSwitch" size="large" />
      </div>
      <!-- <div class="aOption" v-if="vipSwitch">
        <p>测试</p>
      </div> -->
      <div v-if="vipSwitch">
        <p class="optionName">API自定义</p>
        <div class="switch">
          <p class="switchName">API自定义</p>
          <el-switch v-model="apiSwitch" size="large" />
        </div>
        <div class="aOption" v-if="apiSwitch">
          <p class="inputName">APIKEY</p>
          <el-input class="input" v-model="inputKey" placeholder="Please input" />
          <P class="inputName">模型</P>
          <el-input class="input" v-model="inputModel" placeholder="Please input" />
          <p class="inputName">网址</p>
          <el-input class="input" v-model="inputUrl" placeholder="Please input" />
          <el-button class="confirm" color="skyblue" @click="saveButtonApi" plain>保存</el-button>
        </div>
      </div>
      <p class="optionName">会员功能</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'

export default {
  data() {
    return {
      apiSwitch: false,
      vipSwitch: false,
      vipPay: false,
      inputKey: '',
      inputModel: '',
      inputUrl: '',
    };
  },
  methods: {
    //保存设置的数据
    saveButtonApi() {
      localStorage.setItem("userKey", this.inputKey);
      localStorage.setItem("userModel", this.inputModel);
      localStorage.setItem("userUrl", this.inputUrl);
      // localStorage.setItem("apiSwitch", this.apiSwitch);
      // this.refreshPage()
      // alert("保存成功!");
      this.openSuccess('保存成功！');
    },
    //弹出成功消息
    openSuccess(text) {
      this.$message({
        message: text,
        type: 'success',
      });
    },
    //支付
    pay() {
      this.vipPay = !this.vipPay;
    },
  },
  mounted() {
    this.apiSwitch = localStorage.getItem("apiSwitch") === 'true';
    this.vipSwitch = localStorage.getItem("vipSwitch") === 'true';
    // localStorage.setItem("apiSwitch", this.apiSwitch);
    this.inputKey = localStorage.getItem("userKey") || '';
    this.inputUrl = localStorage.getItem("userUrl") || '';
    this.inputModel = localStorage.getItem("userModel") || 'gpt-3.5-turbo';
  },
  watch: {
    apiSwitch(newVal) {
      localStorage.setItem("apiSwitch", newVal);
    },
    vipSwitch(newVal) {
      localStorage.setItem("vipSwitch", newVal);
    },
  },
};
</script>

<style scoped>
.setting {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.topSetting {
  width: 600px;
  display: flex;
  flex-direction: column;
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

.settingName {
  font-size: 30px;
  font-weight: 600;
}

.settingOption {
  width: 600px;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  padding: 2px;
  /* border-top: 1px solid #eaeaea;
  border-bottom: 1px solid #eaeaea; */
}

/* vip相关 */

.openVip {
  display: flex;
  border: 1px solid #ffc107;
  background-color: #fbf8e9;
  align-items: center;
  padding: 10px;
  border-radius: 12px;
}

.openVip img {
  width: 60px;
  height: 60px;
  margin-right: 10px;
}

.vipButton {
  width: 200px;
  margin-top: 20px;
  padding: 5px;
  border-radius: 9px;
  color: white;
  background-color: skyblue;
  text-decoration: none;
}

.vipButton:hover {
  background-color: rgb(100, 200, 240);
}

.vip {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border-radius: 12px;
  background-color: #fbf8e9;
  border: 1px solid #ffc107;
  margin-bottom: 10px;
  padding: 10px;
}

.vipName {
  font-size: 20px;
  font-weight: 500;
  margin: 10px;
}

.vipBox {
  display: flex;
}

.vipContent {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0px 20px 10px 20px;
}

.vipContent li {
  margin: 2px;
}

.avip {
  font-size: 16px;
  font-weight: 500;
}

.pay {
  border: 1px solid #eaeaea;
  border-radius: 12px;
  padding: 10px;
}

.apay {
  width: 180px;
}



.optionName {
  font-size: 14px;
  color: #a9a9a9;
  margin: 3px 0;
  display: flex;
  justify-content: space-between;
}

.switch {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.switchName {
  font-size: 16px;
}

.aOption {
  display: flex;
  flex-direction: column;
}

.inputName {
  font-size: 16px;
  margin: 3px 0px;
}

.input {
  width: 600px;
}

.confirm {
  margin-top: 20px;
}


@media screen and (max-width: 768px) {
  .topSetting {
    width: 400px;
  }

  .settingOption {
    width: 400px;
  }

  .input {
    width: 400px;
  }
}
</style>
