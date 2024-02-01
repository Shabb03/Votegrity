<template>
    <div class="loader-container">
        <div class="loader"></div>
    </div>
</template>

<script>

</script>

<style scoped>
    .loader-container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 70vh;
    }
    
    .loader {
      border-image: linear-gradient(#2616bb, #00e5ff) 30;
      border-width: 15px;
      border-style: solid;
      width: 120px;
      height: 120px;
      -webkit-animation: spin 1.5s linear infinite;
      animation: spin 1.5s linear infinite;
    }
    
    @-webkit-keyframes spin {
      0% { -webkit-transform: rotate(0deg); }
      100% { -webkit-transform: rotate(360deg); }
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
</style>  