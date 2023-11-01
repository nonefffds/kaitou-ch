<template>
  <div class="wrapper">
    <div class="container">
        <span class="percent">{{ percentage }}%</span>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, onMounted } from "vue";
export default {
  
  setup() {
    let percentage = 50;  // Hard-coded percentage value

    const postOption = (option) => {
      console.log(`User selected: ${option}`);
    };

    return { percentage, postOption };
  },
};
</script>
  
  <style>
  .wrapper {
  max-width: 1500px;
  padding: 0px;
  text-align: center;
}
  @font-face {
  font-family: "Contrail One";
  src: url("./assets/ContrailOne-Regular.ttf");
}
  .logo {
    width: 100px;
    margin: 0 auto;
    display: block;}
  .buttons {
    margin-top: 60px;}
  .container {
    margin-top: 100px;
    padding: 0px;
  }
  
  .poll {
    margin-left: auto;
    margin-right: auto;
    width: 300px;
    margin-top: 60px;
    position: relative;
  }
  
  .poll .wrap {
    width: 100%;
  }
  
  .poll .bar {
    background-color: red;
    height: 40px;
    position: absolute;
    width: 0px;
    left: 20px;
    bottom: 10px;
    z-index: -1;
  }
  
  .poll .percent {
    color: red;
    font-family: 'Contrail One';
    z-index: 100;
    position: absolute;
    font-size: 50px;
    right: -70px;
    bottom: 5px;
  }
  
  .bolt1 {
    height: 35px;
    position: absolute;
    top: -10px;
    left: 47%;
  }
  
  .bolt2 {
    height: 35px;
    position: absolute;
    top: -30px;
    left: 56%;
  }
  
  .question {
    font-size: 12px;
    font-family: test;
    color: white;
    position: absolute;
    bottom: 42px;
    left: 75px;
    -ms-transform: rotate(-7deg);
    -webkit-transform: rotate(-7deg);
    transform: rotate(-7deg);
    white-space: nowrap;
    letter-spacing: 0.05em;
    -webkit-text-stroke: 0.3px #000;
    text-stroke: 0.3px #000;
  }

  .question span {
    color: red;
  }
  </style>
  