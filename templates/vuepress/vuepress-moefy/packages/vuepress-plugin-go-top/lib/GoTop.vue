<template>
  <div id="goTop" :class="catStyle" @click="goTop"></div>
</template>

<script>
export default {
  name: 'GoTop',
  data() {
    return {
      visibilityHeight: 500,
      catStyle: 'hide-cat',
    }
  },

  mounted() {
    window.addEventListener('scroll', this.handleScroll, true)
  },

  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  },

  methods: {
    handleScroll() {
      this.catStyle = this.getScrollTop() > this.visibilityHeight ? 'show-cat' : 'hide-cat'
    },

    getScrollTop() {
      return (
        window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
      )
    },

    goTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      this.scrollTop = 0
    },
  },
}
</script>

<style lang="stylus" scoped>
$MQWide ?= 1440px
$MQMobile ?= 768px
@keyframes offsets{
  0%{
    transform: translateY(0px);
  }
  10%{
    transform: translateY(0.5px);
  }
  20%{
    transform: translateY(1.5px);
  }
  30%{
    transform: translateY(3px);
  }
  40%{
    transform: translateY(5px);
  }
  50%{
    transform: translateY(7.5px);
  }
  60%{
    transform: translateY(5px);
  }
  70%{
    transform: translateY(3px);
  }
  80%{
    transform: translateY(1.5px);
  }
  90%{
    transform: translateY(0.5px);
  }
  100%{
    transform: translateY(0px);
  }
}
@-webkit-keyframes offsets{
  0%{
    transform: translateY(0px);
  }
  10%{
    transform: translateY(0.5px);
  }
  20%{
    transform: translateY(1.5px);
  }
  30%{
    transform: translateY(3px);
  }
  40%{
    transform: translateY(5px);
  }
  50%{
    transform: translateY(7.5px);
  }
  60%{
    transform: translateY(5px);
  }
  70%{
    transform: translateY(3px);
  }
  80%{
    transform: translateY(1.5px);
  }
  90%{
    transform: translateY(0.5px);
  }
  100%{
    transform: translateY(0px);
  }
}
.show-cat {
  cursor: pointer;
  position: fixed;
  right: 80px;
  top: -200px;
  z-index: 0;
  width: 70px;
  height: 900px;
  background: url(assets/go_top.png);
  opacity: 1;
  transition: top .5s ease-in-out;
  animation-name: offsets;
  animation-duration: 3s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  -webkit-animation-name: offsets;
  -webkit-animation-duration: 3s;
  -webkit-animation-timing-function: linear;
  -webkit-animation-iteration-count: infinite;
}
.hide-cat {
  cursor: pointer;
  position: fixed;
  right: 80px;
  top: -900px;
  z-index: 0;
  width: 70px;
  height: 900px;
  background: url(assets/go_top.png);
  opacity: 1;
  transition: top .5s ease-in-out;
}
@media screen and (max-width: $MQWide) {
  .show-cat {
    all: unset;
    cursor: pointer;
    position: fixed;
    right: 50px;
    bottom: 20px;
    z-index: 0;
    width: 50px;
    height: 50px;
    mask: url(assets/claw.svg) no-repeat 100% 100%;
    -webkit-mask: url(assets/claw.svg) no-repeat 100% 100%;
    mask-size: cover;
    -webkit-mask-size: cover;
    background-color: $accentColor;
    opacity: 0.5;
    transition: bottom .3s ease-in-out;
  }
  .hide-cat {
    all: unset;
    cursor: pointer;
    position: fixed;
    right: 50px;
    bottom: -50px;
    z-index: 0;
    width: 50px;
    height: 50px;
    mask: url(assets/claw.svg) no-repeat 100% 100%;
    -webkit-mask: url(assets/claw.svg) no-repeat 100% 100%;
    mask-size: cover;
    -webkit-mask-size: cover;
    background-color: $accentColor;
    opacity: 0.5;
    transition: bottom .3s ease-in-out;
  }
}
@media screen and (max-width: $MQMobile) {
  .show-cat {
    display: none;
  }
  .hide-cat {
    display: none;
  }
}
</style>
