// This is a huge hackjob done on my last day of work
//
//= require jquery
//= require jquery_ujs

function Status(id) {
  this.targ = document.getElementById(id);
  this.content = this.targ.getElementsByClassName('content')[0];
}

Status.prototype.show = function(msg, cssClass, autoHideDelay) {
  cssClass = cssClass || 'ok';
  this.setCssClass(cssClass);
  this.setMessage(msg, cssClass);
  if (autoHideDelay) {
    this.hide(autoHideDelay);
  }
  this.targ.classList.remove('hidden');
}

Status.prototype.hide = function(delay) {
  var _this = this;
  setTimeout(function() {
    _this.targ.classList.add('hidden');
  }, delay)
}

Status.prototype.setMessage = function(msg) {
  this.content.innerText = msg;
}

Status.prototype.setCssClass = function(cssClass) {
  this.clearClasses();
  this.targ.classList.add(cssClass);
}

Status.prototype.clearClasses = function() {
  this.targ.classList.remove('ok');
  this.targ.classList.remove('warning');
  this.targ.classList.remove('error');
}

var lock = function() {
  $('body').addClass('locked');
  window.isLocked = true;
}

var unlock = function() {
  $('body').removeClass('locked');
  window.isLocked = false;
}

$(function() {
  var status = new Status('status-overlay');

  document.ondragover = document.ondrop = function(event) {
    event.preventDefault();
  }

  document.body.ondrop = function(event) {
    event.preventDefault();

    if (window.isLocked) {
      return;
    }

    lock();

    var update_handle = null;
    var file = event.dataTransfer.files[0]
    status.show('Geting location data for: ' + file.name + '. This may take a while.');

    var data = new FormData();
    data.append('file', file);

    $.ajax({
      url: '/geocode',
      type: 'POST',
      data: data,
      cache: false,
      contentType: false,
      processData: false,
      success: function(data) {
        document.location.href = '/geocode';
        clearInterval(update_handle);
        status.show('Mission accomplished. Your file should have downloaded.');
        unlock();
      },
      error: function(xhr) {
        status.show(xhr.responseJSON ? xhr.responseJSON.message : xhr.responseText, 'error');
        clearInterval(update_handle);
        unlock();
      }
    });

    update_handle = setInterval(function() {
      $.get('/geocode_update', function(data) {
        status.show('Processed ' + data.records_processed + ' of ' + data.total_records);
      })
    }, 1000)
  }
});
