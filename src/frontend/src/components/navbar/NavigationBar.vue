<template>
    <header>
        <v-app-bar class="navbar" :elevation="9">
            <div class="spacer"></div>
            <slot></slot>
        </v-app-bar>
    </header>
</template>
  
<script>
export default {
    name: 'NavigationBar',
};
</script>
  
<style scoped>
@import '../../styles/navbar.css';
</style>
  