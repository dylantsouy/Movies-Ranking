<template>
  <div class="container">
    <header :noback="true"></header>
    <!-- 右上角更換類型按鈕 -->
    <div v-if="mountedOver" class="btn-area">
      <div v-if="type === 2" class="movie" @click.prevent="changeMovie()">
        Movie<a-icon type="double-right" />
      </div>
      <div v-else class="tv" @click.prevent="changeTv()">
        TV Show<a-icon type="double-right" />
      </div>
    </div>
    <!-- 讀取畫面 -->
    <div v-if="pass" class="loading">
      <a-spin>
        <a-icon slot="indicator" type="loading" style="font-size:50px" spin />
      </a-spin>
    </div>
    <div v-if="loading" class="loading">
      <a-spin>
        <a-icon slot="indicator" type="loading" style="font-size:50px" spin />
      </a-spin>
    </div>
    <!-- 跑馬燈 -->
    <a-carousel
      v-if="!loading"
      id="carousel"
      class="carousel"
      autoplay
      effect="fade"
    >
      <div
        v-for="(item, index) in topRateData"
        :key="index"
        class="carousel-item"
        @click="goDetail(item)"
      >
        <!-- 左邊圖片 -->
        <div class="left-area">
          <img
            v-if="item.backdrop_path"
            :src="`https://image.tmdb.org/t/p/w500/${item.backdrop_path}`"
          />
        </div>
        <!-- 右邊內容 -->
        <div class="right-area">
          <div class="top">
            <div class="title">
              {{ item.title ? item.title : item.name }}
            </div>
            <div class="type">
              <span v-for="(type, index2) in item.genre_ids" :key="index2">
                {{
                  typeData
                    .filter(e => e.id === type)
                    .map(e => e.name)
                    .toString()
                }}
                <span v-if="index2 !== item.genre_ids.length - 1">|</span>
              </span>
            </div>
            <a-rate
              :default-value="item.vote_average"
              disabled
              allow-half
              :count="10"
            />
          </div>
          <div class="bottom">
            <div class="vote">Popularity: {{ item.popularity }}</div>
            <div class="vote">Vote Count: {{ item.vote_count }}</div>
            <div class="vote">
              Release Date:
              {{ item.release_date ? item.release_date : item.first_air_date }}
            </div>
          </div>
        </div>
      </div>
    </a-carousel>
    <!-- 電影swiper -->
    <div class="movie">
      <!-- 熱門 -->
      <div class="swiper-title popular-title">Popular</div>
      <div class="row-popular" id="popular">
        <div v-swiper:mySwiper="swiperOption" class="swiper-container">
          <div class="swiper-wrapper">
            <swiper-slide v-for="(item, index) in popularData" :key="index">
              <div class="rating">{{ index + 1 }}</div>
              <div class="show-title">
                {{
                  item.original_title ? item.original_title : item.original_name
                }}
              </div>
              <img
                v-if="item.backdrop_path"
                :src="`https://image.tmdb.org/t/p/w500/${item.backdrop_path}`"
                @click.prevent="goDetail(item)"
              />
              <div class="bg-text-popular">
                <div class="type">
                  <span v-for="(type, index2) in item.genre_ids" :key="index2">
                    {{
                      typeData
                        .filter(e => e.id === type)
                        .map(e => e.name)
                        .toString()
                    }}
                    <span v-if="index2 !== item.genre_ids.length - 1">|</span>
                  </span>
                </div>
              </div>
            </swiper-slide>
          </div>
        </div>
      </div>
      <!-- 即將上映 or On The Air -->
      <div class="row-upcoming" id="upcoming">
        <div class="swiper-title">
          {{ type === 1 ? "Upcoming" : "On The Air" }}
        </div>
        <div v-swiper:mySwiper2="swiperOption2" class="swiper-container">
          <div class="swiper-wrapper">
            <swiper-slide v-for="(item, index) in upcomingData" :key="index">
              <img
                v-if="item.backdrop_path"
                :src="`https://image.tmdb.org/t/p/w500/${item.backdrop_path}`"
              />
              <div class="bg-text" @click="goDetail(item)">
                <div class="bg-title">
                  {{
                    item.original_title
                      ? item.original_title
                      : item.original_name
                  }}
                </div>
                <div class="type">
                  <span v-for="(type, index2) in item.genre_ids" :key="index2">
                    {{
                      typeData
                        .filter(e => e.id === type)
                        .map(e => e.name)
                        .toString()
                    }}
                    <span v-if="index2 !== item.genre_ids.length - 1">|</span>
                  </span>
                </div>
              </div>
            </swiper-slide>
          </div>
        </div>
      </div>
      <!-- 現在播放 Or Airing Today -->
      <div class="row-playing" id="playing">
        <div class="swiper-title">
          {{ type === 1 ? "Now Playing" : "Airing Today" }}
        </div>
        <div v-swiper:mySwiper3="swiperOption2" class="swiper-container">
          <div class="swiper-wrapper">
            <swiper-slide v-for="(item, index) in nowPlayingData" :key="index">
              <img
                v-if="item.backdrop_path"
                :src="`https://image.tmdb.org/t/p/w500/${item.backdrop_path}`"
              />
              <div class="bg-text" @click="goDetail(item)">
                <div class="bg-title">
                  {{
                    item.original_title
                      ? item.original_title
                      : item.original_name
                  }}
                </div>
                <div class="type">
                  <span v-for="(type, index2) in item.genre_ids" :key="index2">
                    {{
                      typeData
                        .filter(e => e.id === type)
                        .map(e => e.name)
                        .toString()
                    }}
                    <span v-if="index2 !== item.genre_ids.length - 1">|</span>
                  </span>
                </div>
              </div>
            </swiper-slide>
          </div>
        </div>
      </div>
      <!-- 最高評價 -->
      <div class="row-rate" id="rate">
        <div class="swiper-title">Top Rate</div>
        <div v-swiper:mySwiper4="swiperOption2" class="swiper-container">
          <div class="swiper-wrapper">
            <swiper-slide v-for="(item, index) in topRateData" :key="index">
              <img
                v-if="item.backdrop_path"
                :src="`https://image.tmdb.org/t/p/w500/${item.backdrop_path}`"
              />
              <div class="bg-text" @click="goDetail(item)">
                <div class="bg-title">
                  {{
                    item.original_title
                      ? item.original_title
                      : item.original_name
                  }}
                </div>
                <div class="type">
                  <span v-for="(type, index2) in item.genre_ids" :key="index2">
                    {{
                      typeData
                        .filter(e => e.id === type)
                        .map(e => e.name)
                        .toString()
                    }}
                    <span v-if="index2 !== item.genre_ids.length - 1">|</span>
                  </span>
                </div>
              </div>
            </swiper-slide>
          </div>
        </div>
      </div>
    </div>
    <!-- 詳細的Dialog -->
    <a-drawer
      :title="data.original_title ? data.original_title : data.original_name"
      placement="right"
      :closable="true"
      :visible="showDetail"
      @close="showDetail = false"
    >
      <!-- movie -->
      <detail
        @close="showDetail = false"
        v-if="showDetail && type === 1"
        :typeData="typeData"
        :data="data"
      ></detail>
      <!-- Tv Show -->
      <detailtv
        @close="showDetail = false"
        v-if="showDetail && type === 2"
        :typeData="typeData"
        :data="data"
      ></detailtv>
    </a-drawer>
  </div>
</template>

<script>
import axios from "axios";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/swiper-bundle.css";
import Detail from "@/components/Detail";
import Detailtv from "@/components/Detailtv";
import Header from "@/components/Header";

export default {
  components: {
    Swiper,
    SwiperSlide,
    Detail,
    Header,
    Detailtv
  },
  data() {
    return {
      /* 電影資料 */
      upcomingData: {},
      popularData: {},
      nowPlayingData: {},
      topRateData: {},
      data: {},
      /* 電影分類 */
      typeData: [],
      /* 類型 1 是電影 2 是影集 */
      type: 1,
      /* Render */
      loading: true,
      mountedOver: false,
      pass: false,
      /* Dialog */
      showDetail: false,
      /* Swiper 設定 1為熱門 2為其他*/
      swiperOption: {
        grabCursor: true,
        slidesPerView: 1,
        spaceBetween: 100,
        breakpoints: {
          800: {
            slidesPerView: 2,
            spaceBetween: 20
          },
          1300: {
            slidesPerView: 3,
            spaceBetween: 30
          }
        }
      },
      swiperOption2: {
        grabCursor: true,
        slidesPerView: 2,
        spaceBetween: 10,
        breakpoints: {
          800: {
            slidesPerView: 3,
            spaceBetween: 10
          },
          1300: {
            slidesPerView: 5,
            spaceBetween: 10
          }
        }
      }
    };
  },
  async mounted() {
    const vm = this;
    window.scrollTo({
      top: 0
    });
    /* call Api */
    await vm.getNowPlayingData();
    await vm.getPopularData();
    await vm.getUpcomingData();
    await vm.getTopRateData();
    await vm.getType();
    setTimeout(() => {
      vm.loading = false;
    }, 500);

    /* 動畫 */
    setTimeout(() => {
      document.querySelector("#carousel").classList.add("active");
      document.querySelector("#popular").classList.add("active");
    }, 500);
    window.addEventListener("scroll", () => {
      const top1 = document.documentElement.scrollTop;
      const top2 = document.querySelector("#upcoming").offsetTop;
      const top3 = document.querySelector("#playing").offsetTop;
      const top4 = document.querySelector("#rate").offsetTop;
      const h = window.screen.height;
      // --- upcoming是否顯示 ---
      if (top1 + h / 2 > top2) {
        setTimeout(() => {
          document.querySelector("#upcoming").classList.add("active");
        }, 50);
      }
      // --- playing是否顯示 ---
      if (top1 + h / 2 > top3) {
        setTimeout(() => {
          document.querySelector("#playing").classList.add("active");
        }, 50);
      }
      // --- Rate是否顯示 ---
      if (top1 + h / 2 > top4) {
        setTimeout(() => {
          document.querySelector("#rate").classList.add("active");
        }, 50);
      }
    });
    setTimeout(() => {
      vm.mountedOver = true;
    }, 50);
  },
  methods: {
    /* 拿電影分類 */
    async getType() {
      const vm = this;
      const result = await axios.get(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=0f79586eb9d92afa2b7266f7928b055c&language=en-US`
      );
      vm.typeData = result.data.genres;
    },
    /* 拿電影最近更新 */
    async getUpcomingData() {
      const vm = this;
      const result = await axios.get(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=0f79586eb9d92afa2b7266f7928b055c&language=en-US&page=1&region=US`
      );
      vm.upcomingData = result.data.results.filter(
        e => e.backdrop_path !== null
      );
    },
    /* 拿電影熱門 */
    async getPopularData() {
      const vm = this;
      const result = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=0f79586eb9d92afa2b7266f7928b055c&language=en-US&page=1&region=US`
      );
      vm.popularData = result.data.results.filter(
        e => e.backdrop_path !== null
      );
    },
    /* 拿電影現在播放 */
    async getNowPlayingData() {
      const vm = this;
      const result = await axios.get(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=0f79586eb9d92afa2b7266f7928b055c&language=en-US&page=1&region=US`
      );
      vm.nowPlayingData = result.data.results.filter(
        e => e.backdrop_path !== null
      );
    },
    /* 拿電影最高評價 */
    async getTopRateData() {
      const vm = this;
      const result = await axios.get(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=0f79586eb9d92afa2b7266f7928b055c&language=en-US&page=1&region=US`
      );
      vm.topRateData = result.data.results.filter(
        e => e.backdrop_path !== null
      );
    },
    /* 點擊電影後開啟dialog */
    goDetail(item) {
      const vm = this;
      vm.data = item;
      vm.showDetail = true;
    },
    /* 更新為電影 */
    async changeMovie() {
      const vm = this;
      vm.type = 1;
      vm.pass = true;
      window.scrollTo({
        top: 0
      });
      document.querySelector("#carousel").classList.remove("active");
      document.querySelector("#popular").classList.remove("active");
      document.querySelector("#upcoming").classList.remove("active");
      document.querySelector("#playing").classList.remove("active");
      document.querySelector("#rate").classList.remove("active");
      await vm.getTopRateData();
      await vm.getPopularData();
      await vm.getUpcomingData();
      await vm.getNowPlayingData();
      await vm.getType();
      setTimeout(() => {
        vm.pass = false;
        document.querySelector("#carousel").classList.add("active");
        document.querySelector("#popular").classList.add("active");
      }, 500);
    },
    /* 更新為影集 */
    async changeTv() {
      const vm = this;
      vm.type = 2;
      vm.pass = true;
      window.scrollTo({
        top: 0
      });
      document.querySelector("#carousel").classList.remove("active");
      document.querySelector("#popular").classList.remove("active");
      document.querySelector("#upcoming").classList.remove("active");
      document.querySelector("#playing").classList.remove("active");
      document.querySelector("#rate").classList.remove("active");
      await vm.getTopRateTv();
      await vm.getPopularTv();
      await vm.getUpcomingTv();
      await vm.getNowPlayingTv();
      await vm.getTypeTv();
      setTimeout(() => {
        vm.pass = false;
        document.querySelector("#carousel").classList.add("active");
        document.querySelector("#popular").classList.add("active");
      }, 500);
    },
    /* 拿影集分類 */
    async getTypeTv() {
      const vm = this;
      const result = await axios.get(
        `https://api.themoviedb.org/3/genre/tv/list?api_key=0f79586eb9d92afa2b7266f7928b055c&language=en-US`
      );
      vm.typeData = result.data.genres;
    },
    /* 拿影集最近更新 */
    async getUpcomingTv() {
      const vm = this;
      const result = await axios.get(
        `https://api.themoviedb.org/3/tv/on_the_air?api_key=0f79586eb9d92afa2b7266f7928b055c&language=en-US&page=1&region=US`
      );
      vm.upcomingData = result.data.results.filter(
        e => e.backdrop_path !== null
      );
    },
    /* 拿影集現在播放 */
    async getNowPlayingTv() {
      const vm = this;
      const result = await axios.get(
        `https://api.themoviedb.org/3/tv/airing_today?api_key=0f79586eb9d92afa2b7266f7928b055c&language=en-US&page=1&region=US`
      );
      vm.nowPlayingData = result.data.results.filter(
        e => e.backdrop_path !== null
      );
    },
    /* 拿影集最高評價 */
    async getTopRateTv() {
      const vm = this;
      const result = await axios.get(
        `https://api.themoviedb.org/3/tv/top_rated?api_key=0f79586eb9d92afa2b7266f7928b055c&language=en-US&page=1&region=US`
      );
      vm.topRateData = result.data.results.filter(
        e => e.backdrop_path !== null
      );
    },
    /* 拿影集熱門 */
    async getPopularTv() {
      const vm = this;
      const result = await axios.get(
        `https://api.themoviedb.org/3/tv/popular?api_key=0f79586eb9d92afa2b7266f7928b055c&language=en-US&page=1&region=US`
      );
      vm.popularData = result.data.results.filter(
        e => e.backdrop_path !== null
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  margin: 0 auto;
  height: 100%;
  background: #000;
  padding: 10px 0 50px;
}
.loading {
  display: flex;
  position: fixed;
  top: 0;
  right: 0;
  justify-content: center;
  z-index: 2000;
  align-items: center;
  width: 100%;
  background: #000;
  height: 100vh;
  color: #fff;
}
/deep/ .slick-dots {
  margin-bottom: 15px;
  button {
    height: 10px !important;
    width: 10px !important;
    border-radius: 50% !important;
    margin: 0 2px !important;
  }
}
.carousel {
  width: 90%;
  padding: 50px 0 0;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  height: 100%;
  transition: transform 1s, opacity 2s;
  opacity: 0;
  transform: translateY(-500px);
  cursor: pointer;
  margin: 0 auto;

  &.active {
    opacity: 1;
    transform: translateY(0);
  }

  .carousel-item {
    display: flex !important;
    height: 500px;
    position: relative;
    width: 100%;

    .left-area {
      flex-basis: 50%;
      height: 100%;
      border-radius: 10px 0 0 10px;

      img {
        height: 100%;
        width: 100%;
        border-radius: 10px 0 0 10px;
      }
    }

    .right-area {
      padding: 30px;
      flex-basis: 50%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      background: #333;
      border-radius: 0 10px 10px 0;

      .title {
        font-size: 40px;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-family: "Bangers", cursive;
      }
      .type {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        width: 100%;
        font-size: 14px;
      }
      .bottom {
        margin-bottom: 20px;
        font-size: 20px;
      }
    }
  }
}
.swiper-title {
  font-size: 30px;
  font-weight: 600;
  margin: 30px;
  color: #fff;
}
.swiper-container {
  width: 100%;
  height: 100%;
}
.row-popular {
  opacity: 0;
  transition: all 1s;
  transform: translateX(-2500px);

  &.active {
    opacity: 1;
    transform: translateX(0);
  }
  &:hover {
    transform: scale(1.05);
    margin-left: 50px;
  }
}

.row-upcoming {
  opacity: 0;
  transition: all 1s;
  transform: translateX(2500px);

  &.active {
    opacity: 1;
    transform: translateX(0);
  }
}
.row-playing {
  opacity: 0;
  transition: all 1s;
  transform: translateX(-2500px);

  &.active {
    opacity: 1;
    transform: translateX(0);
  }
}
.row-rate {
  opacity: 0;
  transition: all 1s;
  transform: translateX(2500px);

  &.active {
    opacity: 1;
    transform: translateX(0);
  }
}
.swiper-slide {
  position: relative;
  display: flex;
  justify-content: center;

  img {
    width: 95%;
    height: 95%;
  }

  .show-title {
    position: absolute;
    color: #fff;
    font-size: 24px;
    left: 30px;
    bottom: 40px;
    width: 72%;
    font-family: "Bangers", cursive;
    font-family: "Krona One", sans-serif;
    z-index: 10;
    text-shadow: 0 0 5px #000;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .rating {
    position: absolute;
    color: #fff;
    font-size: 160px;
    right: -30px;
    bottom: -40px;
    font-family: "Diplomata", cursive;
    z-index: 10;
    text-shadow: 0 0 5px #000;
  }

  .bg-text {
    display: flex;
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 21;
    background: rgba(0, 0, 0, 0.3);
    top: 0;
    color: #fff;
    font-size: 20px;
    justify-content: center;
    text-align: center;
    align-items: center;
    flex-direction: column;
    opacity: 0;
    transition: all 0.3s;

    &::after {
      content: "";
      position: absolute;
      opacity: 1;
      transition: all 0.4s ease-out;
      top: 1rem;
      bottom: 1rem;
      left: 1rem;
      right: 1rem;
      border-left: 2px solid #fff;
      border-right: 2px solid #fff;
      transform: scale(1, 0);
    }
    &::before {
      content: "";
      position: absolute;
      opacity: 1;
      transition: all 0.4s ease-out;
      top: 1rem;
      bottom: 1rem;
      left: 1rem;
      right: 1rem;
      border-top: 2px solid #fff;
      border-bottom: 2px solid #fff;
      transform: scale(0, 1);
    }
    &:hover {
      opacity: 1;
      &::before {
        transform: scale(1.05, 1);
      }
      &::after {
        transform: scale(1, 1.05);
      }
      .content {
        opacity: 1;
      }
    }

    .bg-title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 80%;
      margin: 0 auto;
    }

    .type {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 10px;
      width: 80%;
      margin: 0 auto;
    }
  }
  .bg-text-popular {
    display: none;
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 21;
    background: rgba(0, 0, 0, 0);
    top: 0;
    color: #fff;
    font-size: 20px;
    justify-content: center;
    text-align: center;
    align-items: center;
    flex-direction: column;
    opacity: 0;
    transition: all 0.3s;

    &:hover {
      opacity: 1;
    }

    .bg-title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 80%;
      margin: 0 auto;
    }

    .type {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 10px;
      width: 80%;
      margin: 0 auto;
    }
  }
}
/deep/ .ant-drawer-content-wrapper {
  width: 100% !important;
  .ant-drawer-header {
    background: #000;
    border-radius: 0;
    .ant-drawer-title {
      color: #fff;
      margin-left: 80px;
      width: 70%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-family: "Bangers", cursive;
      font-family: "Krona One", sans-serif;
    }
    svg {
      color: #fff;
    }
  }
  .ant-drawer-body {
    padding: 0 !important;
  }
  .ant-drawer-header {
    z-index: 100;
    width: 100%;
    position: fixed;
  }
}

.btn-area {
  display: flex;
  z-index: 200;
  top: 12px;
  right: 20px;
  position: fixed;
  justify-content: center;
  width: 90px;
  padding: 4px 2px;
  border: 1px solid #fff;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s all;
  white-space: nowrap;
  &:hover,
  &:focus {
    background-color: #fff;
    color: #000;
    animation: pulse 1s;
    box-shadow: 0 0 0 2em rgba(#fff, 0);
  }
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 #fff;
    }
  }
}

@media screen and (max-width: 1300px) {
  .swiper-slide {
    .show-title {
      width: 65%;
      font-size: 20px;
    }

    .rating {
      font-size: 150px;
      right: 20px;
    }
  }
}
@media screen and (max-width: 1000px) {
  .swiper-slide {
    .show-title {
      width: 60%;
      font-size: 16px;
      bottom: 30px;
    }

    .rating {
      font-size: 120px;
      right: 20px;
      bottom: -25px;
    }
  }
}
@media screen and (max-width: 800px) {
  /deep/ .slick-dots {
    button {
      width: 5px !important;
      height: 5px !important;
    }
  }
  .swiper-slide {
    .show-title {
      width: 60%;
      font-size: 26px;
      bottom: 40px;
    }

    .rating {
      font-size: 180px;
      right: 30px;
    }
  }
  .carousel {
    width: 95%;
    .carousel-item {
      flex-direction: column;
      height: 100%;
      .left-area {
        img {
          width: 100%;
          height: 100%;
          border-radius: 10px 10px 0 0;
        }
      }
      .right-area {
        position: unset;
        border-radius: 0 0 10px 10px;

        .vote-top {
          top: 20px;
        }
        .title {
          font-size: 36px;
        }
        .type {
          font-size: 14px;
        }
        .bottom {
          margin-top: 30px;
          font-size: 18px;
        }
      }
    }
  }
}

@media screen and (max-width: 580px) {
  .row-popular {
    &:hover {
      transform: scale(1);
      margin-left: 0px;
    }
  }
  .swiper-title {
    font-size: 24px;
    margin-left: 20px;
  }
  .swiper-slide {
    .show-title {
      font-size: 26px;
      bottom: 40px;
    }

    .rating {
      font-size: 140px;
      right: 30px;
    }
  }
}
@media screen and (max-width: 490px) {
  .ant-rate {
    font-size: 14px;
  }
  .swiper-slide {
    .show-title {
      width: 60%;
      font-size: 16px;
      bottom: 25px;
    }

    .rating {
      font-size: 110px;
      right: 15px;
      bottom: -30px;
    }
  }
}
</style>
