<template>
    <div class="container">
      <h2>Question of the dAy</h2>
      <div class="poll">
        <img class="bolt1" src="/web/20170418051345im_/http://phansite.net/images/bolt1.png">
        <img class="bolt2" src="/web/20170418051345im_/http://phansite.net/images/bolt2.png">
        <img class="wrap" src="/web/20170418051345im_/http://phansite.net/images/Q.png">
        <div class="bar" :style="{ width: progress + '%' }"></div>
        <div class="question">
          Do you <span>believe</span> in Phantom Thieves?
        </div>
        <span class="percent">{{ progress }}%</span>
      </div>
      <div class="buttons">
        <div class="btn" @click="postOption(1)">Yes</div>
        <div class="btn" @click="postOption(0)">No</div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  export default {
    name: 'App',
    setup() {
      const progress = ref(0)
  
      const postOption = async (vote) => {
        try {
          await axios.post('https://qezrh5rdak.execute-api.ap-northeast-1.amazonaws.com/default/phantom-vote', {
            vote
          })
          fetchData()
        } catch (error) {
          console.error(error)
        }
      }
  
      const fetchData = async () => {
        try {
          const response = await axios.get('https://qezrh5rdak.execute-api.ap-northeast-1.amazonaws.com/default/phantom-vote')
          const votes = response.data.split("-")
          const percent = Math.floor((parseInt(votes[0]) / parseInt(votes[1])) * 250)
          progress.value = percent / 2.5
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
  .container {
    margin-left: auto;
    margin-right: auto;
    width: 800px;
    margin-top: 100px;
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
    font-family: Number;
    z-index: 100;
    position: absolute;
    font-size: 50px;
    right: -85px;
    bottom: 5px;
  }
  
  .bolt1 {
    position: absolute;
    top: -30px;
    left: 42%;
  }
  
  .bolt2 {
    position: absolute;
    top: -50px;
    left: 52%;
  }
  
  .question {
    font-size: 16px;
    font-family: test;
    color: white;
    position: absolute;
    bottom: 53px;
    left: 65px;
    -ms-transform: rotate(-7deg);
    -webkit-transform: rotate(-7deg);
    transform: rotate(-7deg);
    text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
    white-space: nowrap;
  }
  
  .question span {
    color: red;
  }
  </style>
  