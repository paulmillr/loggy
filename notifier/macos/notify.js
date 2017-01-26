'use strict';
var showNode = function() {
  var term = Application('Terminal');
  if (!term.running()) return;

  term.windows().some(function(win) {
    return win.tabs().some(function(tab) {
      if (!tab.processes().includes('node')) return;

      tab.selected = true;
      win.frontmost = true;
      term.activate();

      return true;
    });
  });
};

var app = Application.currentApplication();
app.includeStandardAdditions = true;

var title = app.systemAttribute('TITLE');
var message = app.systemAttribute('MESSAGE');

if (title || message) {
  app.displayNotification(message, {withTitle: title});
} else {
  showNode();
}
