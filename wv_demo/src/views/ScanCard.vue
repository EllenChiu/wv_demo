<template>
  <div>
    <video ref="video" @loadedmetadata="onVideoLoad"></video>
    <canvas ref="canvas" style="display:none;"></canvas>
    <button @click="captureImage">掃描信用卡</button>
    <p>卡號: {{ cardNumber }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Tesseract from 'tesseract.js';

const video = ref(null);
const canvas = ref(null);
const cardNumber = ref('');

onMounted(async () => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.value.srcObject = stream;
      video.value.play();
    } catch (error) {
      console.error("無法訪問相機:", error);
    }
  }
});

const onVideoLoad = () => {
  canvas.value.width = video.value.videoWidth;
  canvas.value.height = video.value.videoHeight;
};

const captureImage = async () => {
  const context = canvas.value.getContext('2d');
  context.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height);
  const imageDataUrl = canvas.value.toDataURL('image/jpeg');

  try {
    const result = await Tesseract.recognize(imageDataUrl);
    const possibleCardNumber = result.data.text.match(/\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}/);
    if (possibleCardNumber) {
      cardNumber.value = possibleCardNumber[0];
    } else {
      cardNumber.value = '未檢測到有效的信用卡號';
    }
  } catch (error) {
    console.error('OCR處理錯誤:', error);
  }
};
</script>