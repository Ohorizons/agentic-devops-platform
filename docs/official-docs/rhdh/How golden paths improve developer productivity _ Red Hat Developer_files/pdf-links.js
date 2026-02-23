/**
 * @file
 * Opens in a new tab all (except Download Manager) links ending in .pdf extension
 */
/*eslint no-magic-numbers: ["error", { "ignore": [0, 1, -1] }]*/

(function ($, Drupal, once) {
  Drupal.behaviors.rhd_pdfLinks = {
    // eslint-disable-next-line no-unused-vars
    attach: function (context, settings) {
      $(once('rhdHandlePDFs', "a[href$='.pdf']", context)).each(function () {

        if (this.href.indexOf('/content-gateway/') <= -1 || this.href.indexOf('/download-manager/') <= -1) {
          return;
        }

        if (this.href.indexOf(location.hostname) === -1) {
          $(this).append(" <i class='far fa-file-pdf'></i>");
          $(this).attr({target: "_blank"});
        }
      });
    }
  }
// eslint-disable-next-line no-undef
})(jQuery, Drupal, once);
