<template>
  <div class="header">
    <img class="logo" src="../assets/images/ai.png" alt="">
    <ol class="headerOl">
      <li>
        <RouterLink class="upVip" to="/setting">高级功能</RouterLink>
      </li>
      <li class="upVip" @click="toggleDiv">联系我们 </li>
      <img v-if="isDivVisible" class="callme" src="../assets/images/wxgzh.png" alt="">
      <li>
        <RouterLink class="toSetting" to="/setting">设置</RouterLink>
      </li>
      <li>
        <RouterLink class="aboutMe" to="/about">关于</RouterLink>
      </li>
    </ol>
  </div>

</template>

<script>
export default {
  data() {
    return {
      isDivVisible: false,
    };
  },
  methods: {
    //界面显示隐藏
    toggleDiv() {
      this.isDivVisible = !this.isDivVisible;
    },
  },
};
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  background-color: white;
  border-bottom: 1px solid #eaeaea;
}

.logo {
  padding: 2px 2px 2px 30px;
  width: 80px;
  height: 50px;
}

.headerOl {
  display: flex;
}

.headerOl li {
  display: flex;
  justify-content: center;
  text-align: center;
  width: 120px;
  font-size: large;
}

.headerOl li:hover {
  color: skyblue;
}

.aboutMe {
  color: black;
  text-decoration: none;
}

.upVip {
  color: black;
  text-decoration: none;
}

.upVip:hover {
  color: skyblue;
}

.toSetting {
  color: black;
  text-decoration: none;
}

.toSetting:hover {
  color: skyblue;
}


.aboutMe:hover {
  color: skyblue;
}

.callme {
  position: absolute;
  top: 50px;
  width: 250px;
  height: 100px;
  border-radius: 6px;
}

@media screen and (max-width: 768px) {
  .logo {
    padding: 2px 2px 2px 20px;
    width: 60px;
    height: 50px;
  }

  .headerOl li {
    width: 75px;
  }

  .upVip {
    display: none;
  }
}
</style>
