/**
 * @file
 * Articles custom behaviors
 */
/*eslint no-magic-numbers: ["error", { "ignore": [0, 1, -1] }]*/

(function ($, Drupal, once) {
  Drupal.behaviors.rhd_articleToc = {
    // eslint-disable-next-line no-unused-vars
    attach: function (context, settings) {
      let articleHeadingsCount = $('.rhd-c-fetch-article-toc h2').length;
      if (articleHeadingsCount >= 1) {
        // create nav and nav targets
        $(once('rhd-c-article-toc-nav', ".rhd-c-article-toc-nav", context)).each(function () {
          let html = '';
          let articleHeadings = $('.rhd-c-fetch-article-toc h2');

          articleHeadings.each(function () {
            let replace_id = $(this).text().replace(/\W/g, '_').toLowerCase();
            $(this).before('<span id="' + replace_id + '" class="rhd-c-has-toc-target">' + $(this).text() + '</span>');
            $(this).attr('id', replace_id+'-h2');
            html += '<li><a  class="pf-c-dropdown__menu-item" href="#' + replace_id + '">' + $(this).text() + '</a></li>';
          });
          $(this).html(html);
          $('.rhd-c-article-toc').show();
        });

        // Dropdown toggle click event to toggle nav
        $('.rhd-c-article-toc > .pf-c-dropdown > button.pf-c-dropdown__toggle').click(function (event) {
          event.stopPropagation();
          let tmpMenu = $(event.target).next('ul.pf-c-dropdown__menu')[0];
          if (tmpMenu.hasAttribute('hidden')) {
            tmpMenu.removeAttribute('hidden');
          } else {
            let tmpAttr = document.createAttribute("hidden")
            tmpMenu.setAttributeNode(tmpAttr);
          }
          $(event.target).parent('.pf-c-dropdown').toggleClass('pf-m-expanded');
        });

        // Dropdown item click event to toggle nav
        $('.rhd-c-article-toc > .pf-c-dropdown > ul > li > a.pf-c-dropdown__menu-item').click(function (event) {
          event.stopPropagation();
          $(event.target).closest('.pf-c-dropdown').removeClass('pf-m-expanded');
          let tmpMenu = $(event.target).closest('ul.pf-c-dropdown__menu')[0];
          if (tmpMenu.hasAttribute('hidden')) {
            tmpMenu.removeAttribute('hidden');
          } else {
            let tmpAttr = document.createAttribute("hidden")
            tmpMenu.setAttributeNode(tmpAttr);
          }
        });

        // Bind body click away event
        $(document).click(function () {
          let tmpNav = $('.rhd-c-article-toc > .pf-c-dropdown');
          let tmpMenu = tmpNav.find('ul.pf-c-dropdown__menu')[0]
          tmpNav.removeClass('pf-m-expanded');
          if (!tmpMenu.hasAttribute('hidden')) {
            let tmpAttr = document.createAttribute("hidden")
            tmpMenu.setAttributeNode(tmpAttr);
          }

        })

        // Bind Scroll events
        let currentHash = window.location.hash;
        let startNavPosition = $('.rhd-c-article-toc').offset().top;
        let positiveMargin = 20;
        let negativeMargin = -20;
        $(document).scroll(function () {
          $('.rhd-c-fetch-article-toc .rhd-c-has-toc-target').each(function () {
            let top = window.scrollY;
            let distance = top - $(this).offset().top;
            let hash = $(this).attr('id');
            let activeTocText = "";
            let tocText = $('#toc-dropdown-active-section').text();
            if (distance < positiveMargin && distance > negativeMargin && currentHash !== hash) {
              currentHash = hash;
              window.location.hash = hash;
              activeTocText = $(this).text();
              if (tocText !== activeTocText) {
                $('#toc-dropdown-active-section').text(activeTocText)
              }
            }
            if (top <= 0) {
              hash = "";
              currentHash = hash;
              window.location.hash = hash;
              $('#toc-dropdown-active-section').text("");
            }
          });
          $('.rhd-c-article-toc').each(function() {
            let hasStuckClass = $(this).hasClass('rhd-m-stuck');
            let currentNavPosition = $(this).offset().top;
            if (currentNavPosition > startNavPosition) {
              if (!hasStuckClass) {
                $(this).addClass('rhd-m-stuck');
              }
            } else {
              if (hasStuckClass) {
                $(this).removeClass('rhd-m-stuck');
              }
            }
          });
        });
      } else {
        $(".rhd-c-article-toc").remove();
      }
    }
  };

// eslint-disable-next-line no-undef
})(jQuery, Drupal, once);
