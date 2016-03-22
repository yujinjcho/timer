(function () {
  
  var id;
  var innerBar = document.getElementById("bar-inner");
  var inputElem = document.getElementById("timeInput");
  var alertElem = document.getElementById("alertBox");
  var messageContainer = document.getElementById('message-container');
  var recentElems = document.getElementsByClassName('recent');
  var activeClass = 'bar-active';
  var finishedClass = 'bar-finished';
  var finishedMessage = "Timer Finished";
  
  var audio = new Audio('censor-beep-7.mp3');

  function updateRecent(start) {
    var recentValues = [0, 1, 2, 3].map(function(n) {return recentElems[n].dataset.value;});
    recentValues.pop();
    recentValues.unshift(start);
    //you mentioned use dataset to store information, but is this redunant, should I just use innerHTML?
    [0, 1, 2, 3].map(function(n) {recentElems[n].dataset.value = recentValues[n]; 
                                  recentElems[n].innerHTML = recentElems[n].dataset.value;});
  }

  function setTime(time, start) {
    return function() {	
      var elapsed = (new Date() - start) / 1000;			
      var hms = [wholeHours, remMinutes, remSeconds]
        .map(function(fn) { return fn(elapsed); })
        .map(formatTime);

      messageContainer.textContent = hms.join(':');
      updateBar(elapsed, time);
      if (elapsed >= time) {
        clearInterval(id);
        barEndAlert();
      }
    }
  }

  function wholeHours(seconds) {
    return Math.floor(seconds / 3600);
  }

  function remMinutes(seconds) {
    return Math.floor(seconds / 60) % 60;
  }

  function remSeconds(seconds) {
    return Math.round(seconds % 60);
  }

  function formatTime(time) {
    return ('0' + time.toString()).slice(-2);
  }

  function barEndAlert() {
    innerBar.className = finishedClass;
    messageContainer.className = finishedClass;    
    messageContainer.textContent = finishedMessage;
    if (alertElem.checked) {
      audio.play();
      alert('Timer Has Ended');	
    }
  }

  function updateBar(passed, time) {
    var leftWidth = Math.round(Math.min(passed, time) / time * 220);
    innerBar.style.width = leftWidth + 'px';
  }

  function sendInput() {
    var currentInput = inputElem.value.split(':').map(function(t) { return parseInt(t); });
    startTimer(currentInput);
    updateRecent(inputElem.value); 
  }

  function startTimer(start) {
    clearInterval(id);
    recordCategory(start);
    reset();
    var time = start[0] * 60 * 60 + start[1] * 60 + start[2]; //update with receiving value
    id = setInterval(setTime(time, new Date()), 1000);
  }

  function setInput() {
    document.getElementById('startButton').addEventListener('click', sendInput);
    document.getElementById("timeInput").addEventListener('keydown', handleKey);
    [0,1,2,3].map(function(pos){document.getElementsByClassName('recent')[pos].addEventListener('click', handleRepeat)});
    [0,1].map(function(pos){document.getElementsByClassName('categories')[pos].addEventListener('click', setCategories)});

  }

  function setCategories(e) {
    var activeCategory = e.target.innerHTML;
    var categoryBtn = document.getElementsByClassName("dropbtn")[0];
    categoryBtn.innerHTML = activeCategory;
  }

  function recordCategory(start) {
    var categoryBtn = document.getElementsByClassName("dropbtn")[0];
    var sessionsElem = document.getElementsByClassName("sessions")[0];
    sessionsElem.innerHTML = categoryBtn.innerHTML + ' (' + start.map(formatTime).join(":") + ')';
    sessionsElem.className = 'sessions-filled';
  }

  function handleRepeat(e) {
    start = e.target.dataset.value.split(':').map(function(t) { return parseInt(t); });
    if (e.target.dataset.value != "") {
      startTimer(start);  
    }
  }

  function handleKey(e) {
    e.preventDefault();
    var start = e.target.value.replace(/:/g, '');

    if (e.keyCode === 13) {
      sendInput();
    } else if (e.keyCode === 8) {
      start = '0' + start;
    } else if (isNumber(e.keyCode) && start[0] === '0') {
      start = (start + String.fromCharCode(e.keyCode)).slice(1,7);
    };

    inputElem.value = returnStart(start);
  }

  function isNumber(keyCode) {
    return (keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105);
  }

  function returnStart(startNum) {
    var hour = startNum.slice(0,2);
    var min = startNum.slice(2,4);
    var sec = startNum.slice(4,6);
    return [hour, min, sec].join(':');
  }	

  function reset() {
    messageContainer.className = "";
    innerBar.className = activeClass;
    messageContainer.textContent = "";
    innerBar.style.width = "0px";
  }

  setInput();

})();
