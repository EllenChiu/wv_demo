<script>
import { ref, onMounted, onUnmounted } from 'vue';
import QrScanner from 'qr-scanner';

export default {
  name: 'QrScanner',
  setup() {
    const video = ref(null);
    const scannedResult = ref('');
    let scanner = null;

    const startScanner = async () => {
      if (scanner) {
        await scanner.start();
      }
    };

    const stopScanner = () => {
      if (scanner) {
        scanner.stop();
      }
    };

    onMounted(() => {
      scanner = new QrScanner(
        video.value,
        result => {
          scannedResult.value = result.data;
          // 這裡可以添加您的掃描後的邏輯,例如停止掃描或發送數據
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );
    });

    onUnmounted(() => {
      if (scanner) {
        scanner.destroy();
      }
    });

    return {
      video,
      scannedResult,
      startScanner,
      stopScanner,
    };
  },
};
</script>
<template>
  <div>
    <video ref="video"></video>
    <button @click="startScanner">開始掃描</button>
    <button @click="stopScanner">停止掃描</button>
    <p v-if="scannedResult">掃描結果: {{ scannedResult }}</p>
  </div>
</template>