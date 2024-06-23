<template>
  <div class="about">
    <div class="topAbout">
      <RouterLink class="backHome" to="/">返回首页</RouterLink>
      <div class="aboutName">关于</div>
      <p>0.1.2</p>
    </div>
  </div>
</template>

<script>
</script>

<style scoped>
.about {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.topAbout {
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

.aboutName {
  font-size: 30px;
  font-weight: 600;
}


@media screen and (max-width: 768px) {
  .topAbout {
    width: 360px;
  }

}
</style>
