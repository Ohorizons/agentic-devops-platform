/**
 * @file
 * Adds a scroll to top behaviour to any page with a link with and id of 'scroll-to-top'.
 * Curently blog-post-full, article-full, coding-resource & search page.
 */

(function ($, Drupal) {
  Drupal.behaviors.rhd_scrollToTop = {
    attach: function (context, settings) {
      if ($('#scroll-to-top').length) {
        let showBtn = 200, // displays the btn after 100px scroll
          scrollUp = function () {
              let scrollTop = $(window).scrollTop();
              if (scrollTop > showBtn) {
                  $("a[href='#top']").fadeIn(500);
              } else {
                  $("a[href='#top']").fadeOut(500);
              }
          };
        scrollUp();
        $(window).on('scroll', function () {
            scrollUp();
        });
    
        $("a[href='#top']").on('click', function (e) {
            e.preventDefault();
            $('html,body').animate({
                scrollTop: 0
            }, 700);
        });
      }
    }
  }
})(jQuery, Drupal);
