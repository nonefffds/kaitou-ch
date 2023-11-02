<template>
  <div class="wrapper">
    <div class="container">
      <img class="logo" src="./assets/logo.png">
      <p5-divider></p5-divider>
      <div class="poll">
        <img class="bolt1" src="./assets/bolt1.png">
        <img class="bolt2" src="./assets/bolt2.png">
        <img class="wrap" src="./assets/Q.png">
        <div class="bar" id="bar"></div>
        <div class="question">
          你认为怪盗团是<span style="color: red; font-size: 16px;">清白</span>的吗？
        </div>
        <span class="percent" id="percentage"></span>
      </div>
<div class="buttons">
   <p5-button>
      <p5-title content="是" :animation="true" font_color="#ff0022" selected_font_color="#000" _bg_color="#ff0022" @click="postOption('Yes')"></p5-title>
   </p5-button>
   <p5-button>
      <p5-title content="不是" :animation="true" font_color="#ff0022" selected_font_color="#000" selected_bg_color="#ff0022" @click="postOption('No')"></p5-title>
   </p5-button>
</div>
</div>
<div class="footer">
      <p style="color: grey;" id="debug"></p>
      <!--<p style="color: grey;" id="date"></p>-->
      <p style="color: grey;">Powered by <a href="https://aws.amazon.com/">AWS Lambda & Amplify</a>, <a href="https://vuejs.org/">Vue.JS</a> & <a href="https://github.com/q-mona/p5-ui">p5-ui</a>. Maintained by <a href="http://MPAM-Lab.xyz">MPAM Lab</a>. </p>
      <p style="color: grey;">Original Credit by (c)Atlus, SEGA</p>
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
    let progress = ref(0); // Declare progress here
    let percentage = ref(0);
    const env = {
       API: process.env.API_ENDPOINT
      }

    const postOption = async (option) => {
      const lastVoteTime = getCookie("LastVoteTime"); // Get the value of the "LastVoteTime" cookie

      if (lastVoteTime) {
        const currentTime = new Date().getTime(); // Get the current time
        const elapsedTime = currentTime - parseInt(lastVoteTime);

        if (elapsedTime < 60000) {
          P5Message({ type: 'fail' })
          console.log("You can only vote once per minute.");
          return;
        }
      }
      const data = {
          option: option
      };
      try {
        await axios.post(env.API, data);
        console.log(`Option ${option} posted successfully.`);
        P5Message({ type: 'clear' })
        fetchData();
        const currentTime = new Date().getTime();
        setCookie("LastVoteTime", currentTime, 1);
      } catch (error) {
        console.error('Error posting option:', error);
        P5Message({ type: 'fail' })
      }
    }
    // Function to get the value of a cookie
    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    }

    // Function to set a cookie
    function setCookie(name, value, minutes) {
      const d = new Date();
      d.setTime(d.getTime() + (minutes * 60 * 1000));
      const expires = "expires=" + d.toUTCString();
      document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(env.API);
        const data = response.data;

        const { Yes, No } = data;
        progress.value = Math.floor(Yes / (Yes + No) * 100);
        percentage = progress.value;

        const numberDisplay = document.getElementById("percentage");
        numberDisplay.innerHTML = percentage + "%";

        const debugDisplay = document.getElementById("debug");
        debugDisplay.innerHTML = "Yes: " + Yes + " No: " + No +",Total: " + (Yes + No);
        // Get the div element with class "bar"
        const barElement = document.getElementById("bar");

        // Set the style properties of the div element
        barElement.style.width = percentage + "%";
        barElement.style.maxWidth = "220px";

        console.log('Progress:', percentage);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }


      onMounted(() => {
        fetchData()
      })
  
      return {
        progress,
        percentage,
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
    left: -5%;
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
  .footer {
  font-size: 10px;
  margin-top: 100px;
}
  </style>
  