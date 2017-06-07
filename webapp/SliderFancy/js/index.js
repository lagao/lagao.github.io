var s = document.createElement('style'), 
    r = document.querySelector('[type=range]');

document.body.appendChild(s);

/* IE doesn't need the JS part & this won't work in IE anyway ;) */
r.addEventListener('input', function() {
  var val = this.value + '% 100%';
        
  s.textContent = 
    '.js input[type=range]::-webkit-slider-runnable-track{background-size:' + val + '}' + 
    '.js input[type=range]::-moz-range-track{background-size:' + val + '}';
  s.textContent += '.js input[type=range] /deep/ #thumb:before{content:"' + this.value + '%"}';
}, false);