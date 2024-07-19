
<script>
import { ref, onMounted, onUnmounted } from 'vue';
import QrScanner from 'qr-scanner';
export default {
  name: 'QrScanner',
  setup() {
    const video = ref(null);
    const scannedResult = ref('');
    const zoomLevel = ref(1);
    const minZoom = ref(1);
    const maxZoom = ref(5);
    const zoomStep = ref(0.1);
    const zoomSupported = ref(false);
    const isScanning = ref(false);
    let scanner = null;
    let stream = null;
    const checkCameraPermission = () => {
      return new Promise((resolve) => {
        // if (typeof AndroidInterface !== 'undefined' && AndroidInterface.QueryCameraStatus) {
        //   // 使用 app 的 JS Interface 檢查權限
        //   AndroidInterface.QueryCameraStatus((status) => {
        //     resolve(status === 'granted');
        //   });
        // } else {
        //   // 如果不在 app 環境中，假設權限未授予
        //   resolve(false);
        // }
        setTimeout(() => {
          resolve(true)
        }, 1000);
      });
    }; 
    const toggleScanner = async () => {
      if (isScanning.value) {
        stopScanner();
        isScanning.value = false;
      } else {
        const success = await startScanner();
        if (success) {
          isScanning.value = true;
        }
      }
    };
    const startScanner = async () => {
      const hasPermission = await checkCameraPermission();
      if (hasPermission) {
        if (scanner) {
          await scanner.start();
          stream = scanner.$video.srcObject;
          setZoom();
        }
      } else {
        // 如果沒有權限，可以提示用戶或採取其他動作
        console.log('沒有相機權限，請在app設置中授予權限');
        // 可以添加邏輯來引導用戶到app設置頁面
      }
    };
    const stopScanner = () => {
      if (scanner) {
        scanner.stop();
      }
    };
    const setZoom = async () => {
      if (stream && zoomSupported.value) {
        const track = stream.getVideoTracks()[0];
        await track.applyConstraints({
          advanced: [{ zoom: Number(zoomLevel.value) }]
        });
      }
    };
    onMounted(async () => {
      const hasPermission = await checkCameraPermission();
      if (hasPermission) {
        scanner = new QrScanner(
          video.value,
          result => {
            scannedResult.value = result.data;
          },
          {
            highlightScanRegion: true,
            highlightCodeOutline: true,
          }
        );

        // 檢查縮放功能
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { zoom: true } });
          const track = stream.getVideoTracks()[0];
          const capabilities = track.getCapabilities();
          
          if ('zoom' in capabilities) {
            zoomSupported.value = true;
            minZoom.value = capabilities.zoom.min;
            maxZoom.value = capabilities.zoom.max;
            zoomStep.value = (maxZoom.value - minZoom.value) / 100;
          }
        } catch (error) {
          console.error('無法獲取相機權限或設備不支持縮放:', error);
        }
      } else {
        console.log('沒有相機權限，請在app設置中授予權限');
        // 可以添加邏輯來引導用戶到app設置頁面
      }
    });
    onUnmounted(() => {
      if (scanner) {
        scanner.destroy();
      }
    });
    return {
      video,
      scannedResult,
      zoomLevel,
      minZoom,
      maxZoom,
      zoomStep,
      zoomSupported,
      isScanning,
      toggleScanner,
      setZoom,
    };
  },
};
</script>
<template>
  <div class="qr-scanner-container">
    <video ref="video"></video>
    <div class="scanner-overlay" v-if="isScanning">
      <div class="scan-region-highlight"></div>
    </div>
    <div class="controls">
      <button @click="toggleScanner">{{ isScanning ? '停止掃描' : '開始掃描' }}</button>
      <div v-if="zoomSupported" class="zoom-control">
        <input 
          type="range" 
          :min="minZoom" 
          :max="maxZoom" 
          :step="zoomStep" 
          v-model="zoomLevel" 
          @input="setZoom"
        >
        <span>縮放: {{ Number(zoomLevel).toFixed(1) }}x</span>
      </div>
    </div>
    <p v-if="scannedResult">掃描結果: {{ scannedResult }}</p>
  </div>
</template>
<style scoped>
.qr-scanner-container {
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}
video {
  width: 100%;
  height: auto;
}
.scanner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
}
.scan-region-highlight {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  transform: translate(-50%, -50%);
  border: 2px solid yellow;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
}
.controls {
  margin-top: 10px;
}
.zoom-control {
  margin-top: 10px;
}
</style>