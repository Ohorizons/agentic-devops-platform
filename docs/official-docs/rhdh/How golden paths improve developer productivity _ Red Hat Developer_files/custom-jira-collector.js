/* eslint-disable prettier/prettier */
/* eslint-disable comma-dangle */
/*
  This script is responsible for opening the jira report a website issue modal form.
 */

window.ATL_JQ_PAGE_PROPS = jQuery.extend(window.ATL_JQ_PAGE_PROPS, {
  // Footer Jira issue collector
  "03f305bd": {
    triggerFunction: function(showCollectorDialog) {
      jQuery("#rhdCustomTrigger, .rhdCustomTrigger").on("click", function (e) {
        e.preventDefault();
        showCollectorDialog();
      });
    }
  },
  // 404 and general error pages' Jira issue collector
  "98c38440": {
    triggerFunction: function(showCollectorDialog) {
      jQuery("#errorPageCustomTrigger, .errorPageCustomTrigger").on("click", function (e) {
        e.preventDefault();
        showCollectorDialog();
      });
    }
  }
});
