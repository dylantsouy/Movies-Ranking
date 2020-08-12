<template>
  <div id="header" class="header">
    <div v-if="!noback" class="go-back" @click="goPrevPage()">
      <i class="iconfont icon-arrow_left" />
      <span>返回</span>
    </div>
    <nuxt-link class="main" to="/">
      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="film" class="svg-inline--fa fa-film fa-w-16 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M488 64h-8v20c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12V64H96v20c0 6.6-5.4 12-12 12H44c-6.6 0-12-5.4-12-12V64h-8C10.7 64 0 74.7 0 88v336c0 13.3 10.7 24 24 24h8v-20c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v20h320v-20c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v20h8c13.3 0 24-10.7 24-24V88c0-13.3-10.7-24-24-24zM96 372c0 6.6-5.4 12-12 12H44c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40zm0-96c0 6.6-5.4 12-12 12H44c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40zm0-96c0 6.6-5.4 12-12 12H44c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40zm272 208c0 6.6-5.4 12-12 12H156c-6.6 0-12-5.4-12-12v-96c0-6.6 5.4-12 12-12h200c6.6 0 12 5.4 12 12v96zm0-168c0 6.6-5.4 12-12 12H156c-6.6 0-12-5.4-12-12v-96c0-6.6 5.4-12 12-12h200c6.6 0 12 5.4 12 12v96zm112 152c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40zm0-96c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40zm0-96c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40z"></path></svg>
      Movie Ranking
    </nuxt-link>
  </div>
</template>

<script>
export default {
  props: {
    noback: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    goPrevPage() {
      const vm = this;
      vm.$router.back();
    }
  }
};
</script>
<style lang="scss" scoped>

.header {
  display: flex;
  align-items: center;
  height: 50px;
  background: rgba(0,0,0,.6);
  font-size: 1rem;
  position: fixed;
  width: 100%;
  z-index: 105;
  top: 0;
  font-weight: 400;

  .go-back {
    position: absolute;
    top: 50%;
    left: 2rem;
    transform: translateY(-50%);
    color:#fff;

    > i {
      font-size: 1.2rem;
      vertical-align: middle;
    }

    > span {
      font-size: 12px;
      font-weight: 400;
      vertical-align: middle;
      margin-left: -6px;
    }
  }
  .main {
    display: flex;
    color:#fff;
    margin-left: 50px;

    svg {
      width: 25px;
      height: 25px;
      margin-right: 15px;
    }
  }
}
</style>
