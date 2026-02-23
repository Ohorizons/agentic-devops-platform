/**
* @file
* This attaches to the code snippets and allows copy to clip board.
*/

(function (Drupal) {
  Drupal.behaviors.codeSnippet = {
    attach: function (context) {
      // We need to get all code snippets. As any classes are added by js
      // there is no guarntee that they will be present when this js is called
      // so we need to base our function on the structure.
      let codeSnip = document.querySelectorAll('pre > code', context);
      let codeCopyIcon = '<svg aria-hidden="true" class="code-copy__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="#06c" d="M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 00358.059 0H352v96h96v-6.059a24 24 0 00-7.029-16.97z"/></svg>';
      let codeCopiedIcon ='<svg aria-hidden="true" class="code-copy__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#3e8635" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"/></svg>';
      // We need a loop as there could be many of these items on the page.
      for (let i = 0; i < codeSnip.length; i++) {
        //Add button and store it.
        codeSnip[i].parentElement.insertAdjacentHTML('afterend',
          '<div class="copy-code-container"><a class="copy-code__link" id="copy-code-' +
            i +
            '">' +
            codeCopyIcon +
            'Copy snippet</a></div>'
        );
        let btn = document.getElementById('copy-code-'+ i);

        // Add event listener to get the code from the snippet.
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          // Get the nearest inner text. As we are controlling the structure
          // this is less fragile than it might appear.
          let text = this.parentElement.previousSibling.childNodes[0].innerText;
          // This requires a secure origin — either HTTPS or localhost (or disabled by running Chrome with a flag).
          // Logged in locally might not meet this criteria.
          navigator.clipboard.writeText(text);
          // Update the button text.
          updateButton(this);
        }, false);
      }

      /**
       * Update the button text when clicked.
       *
       * @param {string} button The button that was clicked
       */
      function updateButton(button) {
          button.innerHTML= codeCopiedIcon + 'Copied';
          button.disabled = true;
          button.classList.add('code-copy__copied');
        setTimeout(function() {
          button.disabled = false;
          button.classList.remove('code-copy__copied');
          button.innerHTML= codeCopyIcon +'Copy snippet';
        }, 2000);
      }
    }
  }
})(Drupal);
