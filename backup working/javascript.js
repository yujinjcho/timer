(function () {
  
  var id;
  var innerBar = document.getElementById("bar-inner");
  var inputElem = document.getElementById("timeInput");
  var alertElem = document.getElementById("alertBox");
  var messageContainer = document.getElementById('message-container');
  var startButton = document.getElementById('startButton');
  var recentElems = document.getElementsByClassName('recent');
  var categories = document.getElementsByClassName('categories');
  var categoryBtn = document.getElementsByClassName("dropbtn")[0];
  var activeClass = 'bar-active';
  var finishedClass = 'bar-finished';
  var finishedMessage = "Timer Finished";
  var recentValues = [];
  var audio = new Audio('censor-beep-7.mp3');

  function updateRecent(start) {
    recentValues.unshift(start);
    recentValues.slice(0,4).forEach(function(val, i){
      recentElems[i].dataset.value = val;
      recentElems[i].innerHTML = val;
    });
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
    startTimer(inputElem.value);
    updateRecent(inputElem.value); 
  }

  function startTimer(start) {
    reset();
    recordCategory(start);
    var hms = start.split(":").map(function(t) {return parseInt(t)});
    var time = hms[0] * 60 * 60 + hms[1] * 60 + hms[2];
    id = setInterval(setTime(time, new Date()), 1000);
  }

  function setInput() {
    startButton.addEventListener('click', sendInput);
    inputElem.addEventListener('keydown', handleKey);
    inputElem.addEventListener('focus', function() {this.value = this.value})
    Array.from(recentElems).forEach(function(el) {el.addEventListener('click', handleRepeat)}) 
    Array.from(categories).forEach(function(el) {el.addEventListener('click', setCategories)}) 
  }

  function setCategories(e) {
    categoryBtn.innerHTML = e.target.innerHTML;
  }

  function recordCategory(start) {
    var sessionsElem = document.getElementsByClassName("sessions")[0];
    sessionsElem.innerHTML = categoryBtn.innerHTML + ' (' + start + ')';
    sessionsElem.className = 'sessions-filled';
  }

  function handleRepeat(e) {
    var value = e.target.dataset.value;
    if (value != "") {
      startTimer(value);  
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
    clearInterval(id);
    messageContainer.className = "";
    innerBar.className = activeClass;
    messageContainer.textContent = "";
    innerBar.style.width = "0px";
  }

  setInput();

})();
