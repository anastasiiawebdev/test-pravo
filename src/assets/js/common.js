(function($) {
 function domReady() {
  requestForm();
 }

 function requestForm() {
  $('form[name=\'request\']').validate({
   rules: {
    phone: {
     required: true,
     phoneUkraine: true
    },
    email: {
     required: true,
     email: true
    }
   },
   messages: {
    phone: '',
    email: ''
   },
   highlight: function(element, errorClass, validClass) {
    $(element).parent().addClass(errorClass);
   },
   unhighlight: function(element, errorClass, validClass) {
    $(element).parent().removeClass(errorClass);
   },
   submitHandler: function(form) {
    form.submit();
   }
  });
  $.validator.addMethod('phoneUkraine', function(phone_number, element) {
   phone_number = phone_number.replace(/\s+/g, '');
   return this.optional(element) || phone_number.length > 9 &&
     phone_number.match(/^(\+?0-?)?(\([0-9]([0-9]\d|1[0-9])\)|[0-9]([0-9]\d|1[0-9]))-?[0-9]\d{2}-?\d{4}$/);
  });
 }

 $(domReady);
})(jQuery);

if (!String.prototype.includes) {
 String.prototype.includes = function(search, start) {
  if (typeof start !== 'number') {
   start = 0;
  }

  if (start + search.length > this.length) {
   return false;
  } else {
   return this.indexOf(search, start) !== -1;
  }
 };
}

if (!Array.from) {
 Array.from = (function() {
  let toStr = Object.prototype.toString;
  let isCallable = function(fn) {
   return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
  };
  let toInteger = function(value) {
   let number = Number(value);
   if (isNaN(number)) { return 0; }
   if (number === 0 || !isFinite(number)) { return number; }
   return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
  };
  let maxSafeInteger = Math.pow(2, 53) - 1;
  let toLength = function(value) {
   let len = toInteger(value);
   return Math.min(Math.max(len, 0), maxSafeInteger);
  };
  return function from(arrayLike) {
   let C = this;
   let items = Object(arrayLike);
   if (arrayLike == null) {
    throw new TypeError('Array.from requires an array-like object - not null or undefined');
   }
   let mapFn = arguments.length > 1 ? arguments[1] : void undefined;
   let T;
   if (typeof mapFn !== 'undefined') {
    if (!isCallable(mapFn)) {
     throw new TypeError('Array.from: when provided, the second argument must be a function');
    }
    if (arguments.length > 2) {
     T = arguments[2];
    }
   }
   let len = toLength(items.length);
   let A = isCallable(C) ? Object(new C(len)) : new Array(len);

   let k = 0;
   let kValue;
   while (k < len) {
    kValue = items[k];
    if (mapFn) {
     A[k] = typeof T === 'undefined' ? mapFn(kValue, k) :
       mapFn.call(T, kValue, k);
    } else {
     A[k] = kValue;
    }
    k += 1;
   }
   A.length = len;
   return A;
  };
 }());
}

function domReady() {
 let forms = Array.from(document.querySelectorAll('.form-request'));
 Array.prototype.slice.call(forms).forEach(function(item) {
  new CustomRequest(item);
 });
 textareaHeight();
 headerChange();
 customVideo();
 videoContentPaddingTop();
 mouseoverListener();
}

function getBlock(el) {
 if ('classList' in el && !el.classList.contains('js_service')) {
  return getBlock(el.parentNode);
 } else if (el.className !== undefined) {
  return el.id;
 } else {
  return null;
 }
}

function mouseoverListener() {
 document.addEventListener('mouseover', function(e) {
  const mq = window.matchMedia('(min-width: 768px)');
  if (mq.matches) {
   let block = getBlock(e.target);
   let serviceModalCol = document.querySelectorAll('.js_details');
   Array.prototype.slice.call(serviceModalCol).forEach(function(item) {
    let itemParent = item.parentNode;
    if (block) {
     if (item.id.includes(block)) {
      item.classList.add('show');
      itemParent.classList.add('show');
     } else {
      item.classList.remove('show');
      itemParent.classList.remove('show');
     }
    } else if (block === null) {
     item.classList.remove('show');
     itemParent.classList.remove('show');
    }
   });
  } else {
   return;
  }
 });
}

function CustomRequest(element) {
 this.inputs = Array.from(element.querySelectorAll('input[type="text"], textarea'));
 Array.prototype.slice.call(this.inputs).forEach(function(input) {
  input.addEventListener('focus', () => {
   input.parentNode.classList.add('active');
  });
 });
 Array.prototype.slice.call(this.inputs).forEach(function(input) {
  input.addEventListener('focusout', () => {
   if (input.value === '') {
    input.parentNode.classList.remove('active');
   }
  });
 });
}

function textareaHeight() {
 let checkboxGroup = document.querySelector('.js_checkbox_group'),
   formRequestColLeft = document.querySelector('.js_form_col_left'),
   textareaWrap = document.querySelector('.js_textarea_wrap'),
   textareaBlockHeight = formRequestColLeft.offsetHeight - checkboxGroup.offsetHeight;
 textareaWrap.style.height = textareaBlockHeight - 30 + 'px';
}

function headerChange() {
 document.addEventListener('scroll', function() {
  let header = document.getElementById('header');
  if (window.pageYOffset > 20 || document.documentElement.scrollTop > 20) {
   header.classList.add('header_change');
  } else {
   header.classList.remove('header_change');
  }
 });
}

function customVideo() {
 document.addEventListener('click', function() {
  let videoBtns = document.querySelectorAll('.js_video_btn');
  Array.prototype.slice.call(videoBtns).forEach(function(element) {
   if (event.target === element) {
    let elementParentChildrenArray = Array.from(element.parentNode.children);
    for (let i = 0; i < elementParentChildrenArray.length; i++) {
     if (elementParentChildrenArray[i].classList.contains('js_video')) {
      if (elementParentChildrenArray[i].paused || elementParentChildrenArray[i].ended) {
       element.title = 'pause';
       element.classList.add('pause');
       elementParentChildrenArray[i].play();
      }
      else {
       element.title = 'play';
       element.classList.remove('pause');
       elementParentChildrenArray[i].pause();
      }
     }
    }
   }
  });

 });
}

function videoContentPaddingTop() {
 let videoInfo = document.getElementById('video_info'),
   header = document.getElementById('header'),
   anchor = document.querySelectorAll('.anchor');
 videoInfo.style.paddingTop = header.offsetHeight + 75 + 'px';
 Array.prototype.slice.call(anchor).forEach(function(element) {
  element.style.height = header.offsetHeight + 'px';
  element.style.marginTop = - header.offsetHeight + 'px';
 });
}

window.addEventListener('resize', function() {
 mouseoverListener();
});
document.addEventListener('DOMContentLoaded', domReady);










