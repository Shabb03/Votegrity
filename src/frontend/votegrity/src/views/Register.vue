<template>
    <div class="hello">
      <NavigationBar/>
      <PageTitle/>
      <PageSubTitle :pageSubTitle="pageSubTitle" />
    </div>
</template>
  
<script>
import PageTitle from '../components/PageTitle.vue';
import NavigationBar from '../components/NavigationBar.vue';
import PageSubTitle from '../components/PageSubTitle.vue';

  export default {
    name: 'TESTName',
    components: {
      PageTitle,
      NavigationBar,
      PageSubTitle
    },
    props: {
      msg: String
    },
    data() {
      return {
        pageSubTitle: 'TestSubText',
      };
    },
  }
  </script>
  
  <style scoped>
  </style>  