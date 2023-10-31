<template>
  <div class="wrapper">
    <div class="container">
      <img class="logo" src="./assets/logo.png">
      <p5-divider></p5-divider>
      <div class="poll">
        <img class="bolt1" src="./assets/bolt1.png">
        <img class="bolt2" src="./assets/bolt2.png">
        <img class="wrap" src="./assets/Q.png">
        <div class="bar" :style="{ width: progress + '%' }"></div>
        <div class="question">
          你认为怪盗团是<span style="red;font-size: 16px;">清白</span>的吗？
        </div>
        <span class="percent">{{ progress }}%</span>
      </div>
      <div class="buttons">
        <p5-button>
        <p5-title content="是" :animation="true" font_color="#ff0022"  selected_font_color="#000" selected_bg_color="#ff0022" @click="postOption(Yes)"></p5-title>
        </p5-button>
        <p5-button>
        <p5-title content="不是" :animation="true" font_color="#ff0022"  selected_font_color="#000" selected_bg_color="#ff0022" @click="postOption(No)"></p5-title>
        </p5-button>
      </div>
    </div>
  </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import { P5Message } from 'p5-ui'
  
  export default {
    name: 'App',
    setup() {
      const progress = ref(0)
  
      const postOption = async (vote) => {
        try {
          await axios.post('https://qezrh5rdak.execute-api.ap-northeast-1.amazonaws.com/default/phantom-vote', {
            vote
          },
          {
            withCredentials: true
          }
      )
          fetchData()
        } catch (error) {
          console.error(error)
        }
      }
      const fetchData = async () => {
      try {
        const response = await axios.get('https://qezrh5rdak.execute-api.ap-northeast-1.amazonaws.com/default/phantom-vote', {
          data: {
            httpMethod: 'GET'
          }
        })
        const data = JSON.parse(response.data.body)
        yesVotes.value = data.Yes
        noVotes.value = data.No
        progress = Math.floor(yesVotes.value / (yesVotes.value + noVotes.value) * 100)
      } catch (error) {
        console.error(error)
      }
    }
      onMounted(() => {
        fetchData()
      })
  
      return {
        progress,
        postOption
      }
    }
  }
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
    right: -30px;
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
  