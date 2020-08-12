<template>
  <div class="section">
    <div class="back" @click="close()">Back</div>
    <!-- loading -->
    <div v-if="loading" class="loading">
      <a-spin>
        <a-icon slot="indicator" type="loading" style="font-size:50px" spin />
      </a-spin>
    </div>
    <div v-else class="row">
      <!-- Cast 詳細 -->
      <div class="swiper-title">Cast Detail</div>
      <div class="wrapper">
        <div class="item">
          <!-- 圖片 -->
          <div class="img-area">
            <img
              :src="`https://image.tmdb.org/t/p/w500${detail.profile_path}`"
            />
          </div>
          <!-- 內容 -->
          <div class="right-area">
            <div class="top">
              <div class="title">{{ detail.name }}</div>
              <div class="overview">{{ detail.birthday }}</div>
              <div class="overview">{{ detail.place_of_birth }}</div>
            </div>
            <div class="bottom">
              <div v-if="detail.biography" class="overview">
                {{ detail.biography }}
              </div>
              <div v-else class="overview">No more data for this cast</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 演過的電影 -->
      <div class="swiper-title">Acted Movie</div>
      <div class="wrapper">
        <div v-for="(item, index) in beforeMovie" :key="index" class="item">
          <!-- 圖片 -->
          <div class="img-area">
            <img :src="`https://image.tmdb.org/t/p/w500${item.poster_path}`" />
          </div>
          <!-- 內容 -->
          <div class="right-area">
            <div class="top">
              <!-- 標題 -->
              <div class="title">
                {{
                  item.original_title ? item.original_title : item.original_name
                }}
              </div>
              <!-- 日期 -->
              <div class="overview">{{ item.release_date }}</div>
              <!-- 評價 -->
              <a-rate
                :default-value="item.vote_average"
                disabled
                allow-half
                :count="10"
              />
              <!-- 角色 -->
              <div class="name">
                Character: {{ item.character ? item.character : "No Data" }}
              </div>
            </div>
            <div class="bottom">
              <div class="popularity">Popularity: {{ item.popularity }}</div>
              <div class="vote-count">Vote Count: {{ item.vote_count }}</div>
              <div class="overview">{{ item.overview }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    /* 上頁傳來角色資料 */
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: true,
      /* 資料 */
      beforeMovie: [],
      detail: {}
    };
  },
  async mounted() {
    const vm = this;
    /* 拿Api */
    await vm.getBeforeMovie();
    await vm.getDetail();
    setTimeout(() => {
      vm.loading = false;
    }, 50);
  },
  methods: {
    /* Emit close */
    close() {
      const vm = this;
      vm.$emit("close");
    },
    /* 拿過往電影api */
    async getBeforeMovie() {
      const vm = this;
      const result = await axios.get(
        `https://api.themoviedb.org/3/person/${vm.data.id}/combined_credits?api_key=0f79586eb9d92afa2b7266f7928b055c&language=en-US`
      );
      vm.beforeMovie = result.data.cast.filter(e => e.poster_path !== null);
    },
    /* 拿詳細資料api */
    async getDetail() {
      const vm = this;
      const result = await axios.get(
        `https://api.themoviedb.org/3/person/${vm.data.id}?api_key=0f79586eb9d92afa2b7266f7928b055c&language=en-US`
      );
      vm.detail = result.data;
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  font-size: 18px;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  margin: 35px;

  .item {
    margin: 0 30px 60px 30px;
    width: 100%;
    border-radius: 10px;
    display: flex;
    box-shadow: 0 0 5px #666;
    position: relative;

    .img-area {
      margin: 30px;
      flex-basis: 35%;
    }

    .right-area {
      flex-basis: 50%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      padding: 0 30px;

      .title {
        font-size: 36px;
        font-weight: 600;
        color: #000;
      }
      .name {
        font-size: 20px;
        color: #000;
        font-weight: 600;
        margin-top: 10px;
      }
      .popularity {
        font-weight: 600;
      }
      .vote-count {
        font-weight: 600;
      }
      .overview {
        font-weight: 600;
        margin: 10px 0;
      }
    }

    .vote-top {
      position: absolute;
      right: 10px;
      top: 25px;
      font-size: 26px;
      color: #fff;
      font-weight: 600;
      z-index: 2;
    }
  }
}

.swiper-title {
  font-size: 30px;
  font-weight: 600;
  margin: 0 15px 0 30px;
  color: #333;
}
.back {
  display: flex;
  top: 12px;
  z-index: 101;
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
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  color: #fff;
}
.swiper-title {
  font-size: 30px;
  font-weight: 600;
  margin: 0 15px 0 30px;
  color: #333;
}
.back {
  display: flex;
  top: 12px;
  z-index: 101;
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
@media screen and (max-width: 980px) {
  .wrapper {
    .item {
      flex-direction: column;

      .right-area {
        .title {
          font-size: 30px;
        }
        .name {
          padding-bottom: 20px;
        }
      }
    }
  }
}
@media screen and (max-width: 650px) {
  .ant-rate {
    font-size: 14px;
  }
  .wrapper {
    .item {
      width: 100%;
      .img-area {
        margin: 30px;
        width: 90%;
        height: 100%;
        margin: 30px auto 10px;
        img {
          width: 100%;
          height: 100%;
        }
      }

      .right-area {
        .title {
          font-size: 21px;
        }
        .name {
          font-size: 16px;
        }
        .popularity {
          font-size: 14px;
        }
        .vote-count {
          font-size: 14px;
        }
        .overview {
          font-size: 14px;
        }
      }
    }
  }
}
</style>
