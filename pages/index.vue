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
        <a-icon slot="indicator" type="loading" style="font-size: 50px" spin />
      </a-spin>
    </div>
    <div v-if="loading" class="loading">
      <a-spin>
        <a-icon slot="indicator" type="loading" style="font-size: 50px" spin />
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
                    .filter((e) => e.id === type)
                    .map((e) => e.name)
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
        <div v-swiper:mySwiper="swiperOption" class="swiper-big swiper-container">
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
                        .filter((e) => e.id === type)
                        .map((e) => e.name)
                        .toString()
                    }}
                    <span v-if="index2 !== item.genre_ids.length - 1">|</span>
                  </span>
                </div>
              </div>
            </swiper-slide>
          </div>
          <div class="swiper-button-next"></div>
          <div class="swiper-button-prev"></div>
        </div>
      </div>
      <!-- 即將上映 or On The Air -->
      <div class="row-upcoming" id="upcoming">
        <div class="swiper-title">
          {{ type === 1 ? 'Upcoming' : 'On The Air' }}
        </div>
        <div
          v-swiper:mySwiper2="swiperOption2"
          class="swiper-container swiper-small"
        >
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
                        .filter((e) => e.id === type)
                        .map((e) => e.name)
                        .toString()
                    }}
                    <span v-if="index2 !== item.genre_ids.length - 1">|</span>
                  </span>
                </div>
              </div>
            </swiper-slide>
          </div>
          <div class="swiper-button-next"></div>
          <div class="swiper-button-prev"></div>
        </div>
      </div>
      <!-- 現在播放 Or Airing Today -->
      <div class="row-playing" id="playing">
        <div class="swiper-title">
          {{ type === 1 ? 'Now Playing' : 'Airing Today' }}
        </div>
        <div
          v-swiper:mySwiper3="swiperOption2"
          class="swiper-container swiper-small"
        >
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
                        .filter((e) => e.id === type)
                        .map((e) => e.name)
                        .toString()
                    }}
                    <span v-if="index2 !== item.genre_ids.length - 1">|</span>
                  </span>
                </div>
              </div>
            </swiper-slide>
          </div>
          <div class="swiper-button-next"></div>
          <div class="swiper-button-prev"></div>
        </div>
      </div>
      <!-- 最高評價 -->
      <div class="row-rate" id="rate">
        <div class="swiper-title">Top Rate</div>
        <div
          v-swiper:mySwiper4="swiperOption2"
          class="swiper-container swiper-small"
        >
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
                        .filter((e) => e.id === type)
                        .map((e) => e.name)
                        .toString()
                    }}
                    <span v-if="index2 !== item.genre_ids.length - 1">|</span>
                  </span>
                </div>
              </div>
            </swiper-slide>
          </div>
          <div class="swiper-button-next"></div>
          <div class="swiper-button-prev"></div>
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
import axios from 'axios';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import 'swiper/swiper-bundle.css';
import Detail from '@/components/Detail';
import Detailtv from '@/components/Detailtv';
import Header from '@/components/Header';

export default {
  components: {
    Swiper,
    SwiperSlide,
    Detail,
    Header,
    Detailtv,
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
      observer: true,
      observeParents: true,
      parallax: true,
      /* Dialog */
      showDetail: false,
      /* Swiper 設定 1為熱門 2為其他*/
      swiperOption: {
        slidesPerView: 1,
        spaceBetween: 100,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
          800: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1300: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        },
      },
      swiperOption2: {
        grabCursor: true,
        slidesPerView: 2,
        spaceBetween: 10,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
          800: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
          1300: {
            slidesPerView: 5,
            spaceBetween: 10,
          },
        },
      },
    };
  },
  mounted() {
    const vm = this;
    window.scrollTo({
      top: 0,
    });
    /* call Api */
    vm.callMovie().then(() => {
      document.querySelector('#carousel').classList.add('active');
      document.querySelector('#popular').classList.add('active');
    });
    /* scroll 監聽動畫 */
    window.addEventListener('scroll', () => {
      const top1 = document.documentElement.scrollTop;
      const top2 = document.querySelector('#upcoming').offsetTop;
      const top3 = document.querySelector('#playing').offsetTop;
      const top4 = document.querySelector('#rate').offsetTop;
      const h = window.screen.height;
      // --- upcoming是否顯示 ---
      if (top1 + h / 2 > top2) {
        setTimeout(() => {
          document.querySelector('#upcoming').classList.add('active');
        }, 50);
      }
      // --- playing是否顯示 ---
      if (top1 + h / 2 > top3) {
        setTimeout(() => {
          document.querySelector('#playing').classList.add('active');
        }, 50);
      }
      // --- Rate是否顯示 ---
      if (top1 + h / 2 > top4) {
        setTimeout(() => {
          document.querySelector('#rate').classList.add('active');
        }, 50);
      }
    });
    setTimeout(() => {
      vm.mountedOver = true;
    }, 50);
  },
  methods: {
    withPromise() {
      return new Promise((resolve) => {
        resolve();
      });
    },
    /* call 電影api */
    async callMovie() {
      const vm = this;
      await vm.getTopRateData();
      await vm.getPopularData();
      await vm.getUpcomingData();
      await vm.getNowPlayingData();
      await vm.getType();
      return await new Promise((resolve) => {
        vm.loading = false;
        resolve();
      });
    },
    /* call 影集api */
    async callTv() {
      const vm = this;
      await vm.getTopRateTv();
      await vm.getPopularTv();
      await vm.getUpcomingTv();
      await vm.getNowPlayingTv();
      await vm.getTypeTv();
      return await new Promise((resolve) => {
        vm.loading = false;
        resolve();
      });
    },
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
        (e) => e.backdrop_path !== null
      );
    },
    /* 拿電影熱門 */
    async getPopularData() {
      const vm = this;
      const result = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=0f79586eb9d92afa2b7266f7928b055c&language=en-US&page=1&region=US`
      );
      vm.popularData = result.data.results.filter(
        (e) => e.backdrop_path !== null
      );
      document.querySelector('#popular').classList.add('active');
    },
    /* 拿電影現在播放 */
    async getNowPlayingData() {
      const vm = this;
      const result = await axios.get(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=0f79586eb9d92afa2b7266f7928b055c&language=en-US&page=1&region=US`
      );
      vm.nowPlayingData = result.data.results.filter(
        (e) => e.backdrop_path !== null
      );
    },
    /* 拿電影最高評價 */
    async getTopRateData() {
      const vm = this;
      const result = await axios.get(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=0f79586eb9d92afa2b7266f7928b055c&language=en-US&page=1&region=US`
      );
      vm.topRateData = result.data.results.filter(
        (e) => e.backdrop_path !== null
      );
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
        (e) => e.backdrop_path !== null
      );
    },
    /* 拿影集現在播放 */
    async getNowPlayingTv() {
      const vm = this;
      const result = await axios.get(
        `https://api.themoviedb.org/3/tv/airing_today?api_key=0f79586eb9d92afa2b7266f7928b055c&language=en-US&page=1&region=US`
      );
      vm.nowPlayingData = result.data.results.filter(
        (e) => e.backdrop_path !== null
      );
    },
    /* 拿影集最高評價 */
    async getTopRateTv() {
      const vm = this;
      const result = await axios.get(
        `https://api.themoviedb.org/3/tv/top_rated?api_key=0f79586eb9d92afa2b7266f7928b055c&language=en-US&page=1&region=US`
      );
      vm.topRateData = result.data.results.filter(
        (e) => e.backdrop_path !== null
      );
    },
    /* 拿影集熱門 */
    async getPopularTv() {
      const vm = this;
      const result = await axios.get(
        `https://api.themoviedb.org/3/tv/popular?api_key=0f79586eb9d92afa2b7266f7928b055c&language=en-US&page=1&region=US`
      );
      vm.popularData = result.data.results.filter(
        (e) => e.backdrop_path !== null
      );
    },
    /* 點擊電影後開啟dialog */
    goDetail(item) {
      const vm = this;
      vm.data = item;
      vm.showDetail = true;
    },
    /* 移除動畫class */
    removeClass() {
      window.scrollTo({
        top: 0,
      });
      document.querySelector('#carousel').classList.remove('active');
      document.querySelector('#popular').classList.remove('active');
      document.querySelector('#upcoming').classList.remove('active');
      document.querySelector('#playing').classList.remove('active');
      document.querySelector('#rate').classList.remove('active');
    },
    /* 更新為電影 */
    changeMovie() {
      const vm = this;
      vm.type = 1;
      vm.loading = true;
      vm.removeClass();
      vm.callMovie().then(() => {
        document.querySelector('#carousel').classList.add('active');
        document.querySelector('#popular').classList.add('active');
        vm.loading = false;
      });
    },
    /* 更新為影集 */
    changeTv() {
      const vm = this;
      vm.type = 2;
      vm.loading = true;
      vm.removeClass();
      vm.callTv().then(() => {
        document.querySelector('#carousel').classList.add('active');
        document.querySelector('#popular').classList.add('active');
        vm.loading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../static/all.scss';
</style>
