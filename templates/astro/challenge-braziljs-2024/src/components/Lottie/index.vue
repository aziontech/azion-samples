<script setup>
import { onMounted, ref } from 'vue';
import lottie from 'lottie-web';

const props = defineProps({
  animationData: {
    type: Object,
    default: () => ({}),
    required: true
  },
  hoverAnimation: {
    type: Boolean,
    default: false,
    required: false
  },
});

const lottieContainer = ref(null);
let animationInstance = null;

onMounted(() => {
  animationInstance = lottie.loadAnimation({
    container: lottieContainer.value,
    renderer: 'svg',
    loop: !props.hoverAnimation, // Loop se hoverAnimation for false
    autoplay: !props.hoverAnimation, // Autoplay se hoverAnimation for false
    animationData: props.animationData,
  });
});

const playAnimation = () => {
  if (props.hoverAnimation) {
    animationInstance.setDirection(1);
    animationInstance.play();
  }
};

const reverseAnimation = () => {
  if (props.hoverAnimation) {
    animationInstance.setDirection(-1);
    animationInstance.play();
  }
};

const handleMouseEnter = () => {
  playAnimation();
};

const handleMouseLeave = () => {
  reverseAnimation();
};
</script>

<template>
  <div
    ref="lottieContainer"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave">
  </div>
</template>
