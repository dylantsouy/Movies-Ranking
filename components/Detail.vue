<template>
  <div class="section">
    <div class="back" @click="close()">Back</div>
    <!-- 上方電影介紹 -->
    <div class="row-top">
      <!-- 圖片 -->
      <div class="item top-left">
        <img
          v-if="data.backdrop_path"
          :src="`https://image.tmdb.org/t/p/w500/${data.backdrop_path}`"
        />
      </div>
      <!-- 內容 -->
      <div class="item top-right">
        <div>
          <div class="title">{{ data.original_title }}</div>
          <!-- 電影分類 -->
          <div class="type">
            <span v-for="(item, index) in data && data.genre_ids" :key="index">
              {{
                typeData
                  .filter((e) => e.id === item)
                  .map((e) => e.name)
                  .toString()
              }}
              <span v-if="index !== data.genre_ids.length - 1">|</span>
            </span>
          </div>
          <!-- 日期 -->
          <div class="date">{{ data.release_date }}</div>
          <!-- 評價 -->
          <a-rate
            :default-value="data.vote_average"
            disabled
            allow-half
            :count="10"
          />
          <div class="date" style="margin-top:10px">
            Popularity:
            <span class="green" :class="{ red: data.popularity > 60 }">{{
              data.popularity
            }}</span>
          </div>
          <div class="date">Vote Count: {{ data.vote_count }}</div>
        </div>
        <!-- 內容 -->
        <div>
          <div class="overview">{{ data.overview }}</div>
        </div>
      </div>
    </div>
    <div class="row">
      <!-- Cast Area -->
      <div class="swiper-title">Cast</div>
      <!-- 沒資料 -->
      <div v-if="castData && !castData.length" class="review-area">
        <a-empty />
      </div>
      <!-- 有資料 -->
      <div
        v-swiper:mySwiper="swiperOption"
        v-show="castData && castData.length"
      >
        <div class="swiper-wrapper">
          <swiper-slide v-for="(item, index) in castData" :key="index">
            <img
              :src="`https://image.tmdb.org/t/p/w500${item.profile_path}`"
              @click.prevent="goCast(item)"
            />
            <div class="name">{{ item.character }}</div>
            <div class="name">as</div>
            <div class="name">{{ item.name }}</div>
          </swiper-slide>
        </div>
        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
      </div>
    </div>
    <div class="row">
      <!-- 評論區 -->
      <div class="swiper-title">Review</div>
      <!-- 有資料 -->
      <div class="review-area" v-if="reviewData && reviewData.length">
        <div
          v-for="(review, index2) in reviewData"
          :key="index2"
          class="review"
        >
          <div class="author">
            <a-avatar
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            />
            {{ review.author }}
          </div>
          <div class="content">{{ review.content }}</div>
          <a class="link" :href="review.url" target="_blank"
            >Click here for the detail!</a
          >
        </div>
      </div>
      <!-- 沒資料 -->
      <div class="review-area" v-else>
        <a-empty />
      </div>
    </div>
    <!-- 點擊Cast -->
    <a-drawer
      title="Cast Detail"
      placement="right"
      :closable="true"
      :visible="showCast"
      @close="showCast = false"
    >
      <cast @close="showCast = false" v-if="showCast" :data="castDetail"></cast>
    </a-drawer>
  </div>
</template>

<script>
import axios from 'axios';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import 'swiper/swiper-bundle.css';
import Cast from '@/components/Cast';

export default {
  props: {
    /* Cast Data */
    data: {
      type: Object,
      default: () => {},
    },
    /* 分類資料 */
    typeData: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    Swiper,
    SwiperSlide,
    Cast,
  },
  data() {
    return {
      /* 資料 */
      castData: [],
      castDetail: {},
      reviewData: [],
      /* dialog */
      showCast: false,
      /* Swiper 設定 */
      swiperOption: {
        slidesPerView: 2,
        spaceBetween: 20,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
          500: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          800: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1300: {
            slidesPerView: 6,
            spaceBetween: 30,
          },
        },
      },
    };
  },
  async mounted() {
    const vm = this;
    /* 拿API */
    await vm.getCast();
    await vm.getReview();
  },
  methods: {
    /* EMIT CLOSE */
    close() {
      const vm = this;
      vm.$emit('close');
    },
    /* 拿CAST API */
    async getCast() {
      const vm = this;
      const result = await axios.get(
        `https://api.themoviedb.org/3/movie/${vm.data.id}/credits?api_key=0f79586eb9d92afa2b7266f7928b055c`
      );
      vm.castData = result.data.cast.filter((e) => e.profile_path !== null);
    },
    /* 拿Review Api */
    async getReview() {
      const vm = this;
      const result = await axios.get(
        `https://api.themoviedb.org/3/movie/${vm.data.id}/reviews?api_key=0f79586eb9d92afa2b7266f7928b055c`
      );
      vm.reviewData = result.data.results;
    },
    /* 點擊看cast detail */
    goCast(item) {
      const vm = this;
      vm.castDetail = item;
      vm.showCast = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.ant-empty {
  width: 100%;
  margin: 0 auto;
}
.section {
  background: #fff;
  padding-top: 80px;
  .row-top {
    display: flex;
    position: relative;
    box-shadow: 0 0 5px #666;
    border-radius: 10px;
    background: #fff;
    margin: 0 20px;

    .vote-top {
      position: absolute;
      right: 10px;
      top: 25px;
      font-size: 26px;
      color: #fff;
      font-weight: 600;
      z-index: 2;
    }

    .top-left {
      flex-basis: 45%;

      img {
        width: 100%;
        height: 100%;
        border-radius: 10px 0 0 10px;
      }
    }
    .top-right {
      flex-basis: 50%;
      padding: 15px 30px 15px 30px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      position: relative;

      .title {
        color: #000;
        font-weight: 600;
        font-size: 32px;
        font-family: 'Bangers', cursive;
        font-family: 'Krona One', sans-serif;
      }
      .date {
        font-size: 14px;
        font-family: 'Bangers', cursive;
        font-family: 'Krona One', sans-serif;
      }
      .type {
        font-size: 14px;
        font-family: 'Bangers', cursive;
        font-family: 'Krona One', sans-serif;
      }
      .overview {
        font-size: 16px;
      }
    }
  }
}
.swiper-slide:hover {
  transform: scale(1.1);
}
.swiper-container {
  padding: 30px;
}
.swiper-slide {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: 0.3s all;
  height: 100%;
  background: #fff;
  box-shadow: 0 0 2px #333;
  padding-bottom: 15px;
  border-radius: 15px 15px 0 0;

  img {
    width: 100%;
    height: 80%;
    border-radius: 15px 15px 0 0;
    margin-bottom: 15px;
  }
}
.swiper-title {
  font-size: 30px;
  font-weight: 600;
  margin: 30px 15px 0 30px;
  color: #333;
}
.name {
  font-size: 16px;
  font-weight: 600;
  margin: 0 auto;
  width: 90%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}
.green {
  color: #2f2;
}

.red {
  color: #f33;
}
.back {
  display: flex;
  z-index: 101;
  top: 12px;
  left: 20px;
  position: fixed;
  justify-content: center;
  width: 55px;
  padding: 4px 2px;
  border: 1px solid #fff;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s all;

  &:hover {
    background: #fbfbfb;
    color: #000;
  }
}
.swiper_btn {
  width: 20px;
  height: 20px;
  background-size: contain;
  color: #aaa;
}
/deep/ .ant-drawer-content-wrapper {
  width: 100% !important;
  .ant-drawer-header {
    background: #000;
    border-radius: 0;
    .ant-drawer-title {
      width: 70%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #fff;
      margin-left: 80px;
      font-family: 'Bangers', cursive;
      font-family: 'Krona One', sans-serif;
    }
    svg {
      color: #fff;
    }
  }
  .ant-drawer-body {
    padding: 0 !important;
  }
  .ant-drawer-header {
    width: 100%;
    position: fixed;
    z-index: 100;
  }
}
/deep/ .ant-empty-description {
  font-weight: 600 !important;
}
.review-area {
  border-radius: 10px;
  padding: 15px;
  margin: 30px;
  box-shadow: 0 0 5px #666;
  .review {
    margin: 10px 0 30px 0;
    .author {
      display: flex;
      align-items: flex-end;
      font-size: 22px;
      font-weight: 600;
      color: #333;
      .ant-avatar {
        width: 50px;
        height: 50px;
        margin-right: 5px;
      }
    }
    .content {
      margin: 10px 20px 10px 55px;
      max-height: 100px;
      overflow: hidden;
    }
    .link {
      margin-left: 55px;
    }
  }
}

.swiper-button-next {
  font-size: 12px;
  color: #fff;
  text-shadow: 0px 0px 5px #333;
  margin-right: 5px;
  transform: translateY(-70%);
  z-index: 100;

  &:after {
    font-weight: 600;
    font-size: 40px;
    z-index: 100;
  }
}

.swiper-button-prev {
  color: #fff;
  text-shadow: 0px 0px 5px #333;
  margin-left: 5px;
  transform: translateY(-70%);
  z-index: 100;

  &:after {
    font-weight: 600;
    font-size: 40px;
    z-index: 100;
  }
}
@media screen and (max-width: 1100px) {
  .section {
    .row-top {
      .top-right {
        .title {
          font-size: 22px;
        }
        .date {
          font-size: 12px;
        }
        .type {
          font-size: 12px;
        }
        .overview {
          font-size: 14px;
        }
      }
    }
  }
}
@media screen and (max-width: 800px) {
  .ant-rate {
    font-size: 14px;
  }
  .section {
    .row-top {
      flex-direction: column;

      &::before {
        border-radius: 0 10px 0 20%;
      }
      .top-left {
        img {
          border-radius: 10px 10px 0 0;
        }
      }
      .top-right {
        .title {
          font-size: 18px;
        }
        .date {
          font-size: 12px;
        }
        .type {
          font-size: 12px;
        }
        .overview {
          font-size: 14px;
          margin-top: 20px;
        }
      }
    }
  }
}

@media screen and (max-width: 500px) {
  .swiper-slide:hover {
    transform: scale(1);
  }

  .name {
    font-size: 14px;
  }
}
</style>
