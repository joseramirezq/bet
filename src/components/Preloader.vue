<!-- Preloader.vue -->
<template>
    <div v-if="visible" class="preloader-container" >
      <div class="preloader-spinner"></div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      zIndex: {
        type: Number,
        default: 9999
      }
    }
  };
  </script>
  
  <style scoped>
   
  .preloader-spinner {
    border: 6px solid #f3f3f3;
    border-top: 6px solid #3498db;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>
  