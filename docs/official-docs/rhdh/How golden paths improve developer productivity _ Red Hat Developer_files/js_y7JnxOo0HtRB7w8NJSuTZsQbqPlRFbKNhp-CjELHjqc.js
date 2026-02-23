/* @license MIT https://raw.githubusercontent.com/js-cookie/js-cookie/v3.0.5/LICENSE */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self,function(){var n=e.Cookies,o=e.Cookies=t();o.noConflict=function(){return e.Cookies=n,o;};}());}(this,(function(){"use strict";function e(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)e[o]=n[o];}return e;}var t=function t(n,o){function r(t,r,i){if("undefined"!=typeof document){"number"==typeof (i=e({},o,i)).expires&&(i.expires=new Date(Date.now()+864e5*i.expires)),i.expires&&(i.expires=i.expires.toUTCString()),t=encodeURIComponent(t).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape);var c="";for(var u in i)i[u]&&(c+="; "+u,!0!==i[u]&&(c+="="+i[u].split(";")[0]));return document.cookie=t+"="+n.write(r,t)+c;}}return Object.create({set:r,get:function(e){if("undefined"!=typeof document&&(!arguments.length||e)){for(var t=document.cookie?document.cookie.split("; "):[],o={},r=0;r<t.length;r++){var i=t[r].split("="),c=i.slice(1).join("=");try{var u=decodeURIComponent(i[0]);if(o[u]=n.read(c,u),e===u)break;}catch(e){}}return e?o[e]:o;}},remove:function(t,n){r(t,"",e({},n,{expires:-1}));},withAttributes:function(n){return t(this.converter,e({},this.attributes,n));},withConverter:function(n){return t(e({},this.converter,n),this.attributes);}},{attributes:{value:Object.freeze(o)},converter:{value:Object.freeze(n)}});}({read:function(e){return '"'===e[0]&&(e=e.slice(1,-1)),e.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent);},write:function(e){return encodeURIComponent(e).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,decodeURIComponent);}},{path:"/"});return t;}));;
/* @license GPL-2.0-or-later https://www.drupal.org/licensing/faq */
(function(window){if(!window.rhdp_fe_app)window.rhdp_fe_app={sso:{attached:0},page_state:{attached:0},file_download:{attached:0,is_download_page:false}};if(!window.rhdp_fe_app.sso)window.rhdp_fe_app.sso={attached:0};if(!window.rhdp_fe_app.page_state)window.rhdp_fe_app.page_state={attached:0};if(!window.rhdp_fe_app.file_download)window.rhdp_fe_app.file_download={attached:0,is_download_page:false};window.rhdp_fe_app.urlParam=(name)=>{let queryString=window.location.search;let urlParams=new URLSearchParams(queryString);return urlParams.get(name);};let isDownloadURL=window.rhdp_fe_app.urlParam("tcDownloadURL")?true:false;let isDownloadFileName=window.rhdp_fe_app.urlParam("tcDownloadFileName")?true:false;let isProduct=window.rhdp_fe_app.urlParam("p")?true:false;if(isDownloadURL&&isDownloadFileName&&isProduct)window.rhdp_fe_app.file_download.is_download_page=true;else window.rhdp_fe_app.file_download.is_download_page=false;})(window);;
(function($,Drupal,rhdp_fe_app){Drupal.behaviors.page_state={attach:function(context,settings){rhdp_fe_app.page_state.attached++;if(rhdp_fe_app.page_state.attached>1)return;document.addEventListener("pageUserUpdate",function(){pageUserUpdate();});document.addEventListener("updateAudienceSelectionState",function(){updateAudienceSelectionState();});function updateNavLoginState(){let tmp_keycloak=rhdp_fe_app.rhdKeycloak;let isAuthenticated=false;if(tmp_keycloak&&tmp_keycloak.authenticated)isAuthenticated=tmp_keycloak.authenticated;if(typeof rhAccountDropdown==="undefined"||rhAccountDropdown===null)return;if(isAuthenticated){if(rhAccountDropdown.hasDropdownComponent()){let mappedUserData={realm_access:tmp_keycloak.tokenParsed.realm_access,REDHAT_LOGIN:tmp_keycloak.tokenParsed.preferred_username,lastName:tmp_keycloak.tokenParsed.family_name?tmp_keycloak.tokenParsed.family_name:"User",account_number:tmp_keycloak.tokenParsed.rh_account_number,preferred_username:tmp_keycloak.tokenParsed.preferred_username,firstName:tmp_keycloak.tokenParsed.given_name?tmp_keycloak.tokenParsed.given_name:"RHD ",email:tmp_keycloak.tokenParsed.email,username:tmp_keycloak.tokenParsed.name};rhAccountDropdown.setLogOutState(mappedUserData);}}else{if(rhAccountDropdown.hasDropdownComponent())rhAccountDropdown.setLogInState();}}function updateAudienceSelectionState(){let tmp_keycloak=rhdp_fe_app.rhdKeycloak;let isAuthenticated=false;if(tmp_keycloak&&tmp_keycloak.authenticated)isAuthenticated=tmp_keycloak.authenticated;let skipAudienceCheck=false;let onPageNav;let onPageNavItems;if(drupalSettings.rhd_admin&&drupalSettings.rhd_admin["disable-audience-selection-display"]){skipAudienceCheck=true;$("[data-audience]").addClass("rhd-show-auth-status");}onPageNav=document.querySelector(".assembly-type-on_page_navigation");if(onPageNav!==null){document.querySelectorAll('[data-audience="'+isAuthenticated?"unauthenticated":"authenticated"+'"]').forEach(function(e){let hrefVal="#"+e.id;$(onPageNav.querySelector('a[href^="'+hrefVal+'"')).detach();});onPageNavItems=onPageNav.querySelectorAll("a");onPageNavItems.forEach(function(e){e.style.visibility="visible";});}if(!skipAudienceCheck)$('[data-audience]').addClass(isAuthenticated?'rhd-authenticated':'rhd-unauthenticated');}function pageUserUpdate(){let tmp_keycloak=rhdp_fe_app.rhdKeycloak;let isAuthenticated=false;if(tmp_keycloak&&tmp_keycloak.authenticated)isAuthenticated=tmp_keycloak.authenticated;if(isAuthenticated)$("a.rhd-c-login-button").on("click",function(e){e.preventDefault();let redirectUri=rhdp_fe_app.page_state.createRedirectUri();window.location.href=redirectUri;});else $("a.rhd-c-login-button").on("click",function(e){e.preventDefault();let redirectUri=rhdp_fe_app.page_state.createRedirectUri();tmp_keycloak.login({redirectUri});});updateNavLoginState();}rhdp_fe_app.page_state.createRedirectUri=function(){let destination=window.location.protocol+"//"+window.location.host;if(window.location.pathname==="/user/login")return destination+"/contributor/dashboard?source=sso";const queryString=window.location.search;const urlParams=new URLSearchParams(queryString);if(!queryString)return window.location.href+"?source=sso";if(queryString&&urlParams.get("source"))return window.location.href;return window.location.href+"&source=sso";};let isLayoutBuilderForm=document.querySelector(".node-layout-builder-form");if(isLayoutBuilderForm!==null)$(document).ajaxComplete(function(){document.dispatchEvent(new Event("updateAudienceSelectionState"));});}};})(jQuery,Drupal,rhdp_fe_app);;
(function($,window){var htmlSpecialCharsRegEx=/[<>&\r\n"']/gm;var htmlSpecialCharsPlaceHolders={'<':'lt;','>':'gt;','&':'amp;','\r':"#13;",'\n':"#10;",'"':'quot;',"'":'#39;'};$.extend({fileDownload:function(fileUrl,options){var settings=$.extend({preparingMessageHtml:null,failMessageHtml:null,androidPostUnsupportedMessageHtml:"Unfortunately your Android browser doesn't support this type of file download. Please try again with a different browser.",dialogOptions:{modal:true},prepareCallback:function(url){},successCallback:function(url){},abortCallback:function(url){},failCallback:function(responseHtml,url,error){},httpMethod:"GET",data:null,checkInterval:100,cookieName:"fileDownload",cookieValue:"true",cookiePath:"/",cookieDomain:null,popupWindowTitle:"Initiating file download...",encodeHTMLEntities:true},options);var deferred=new $.Deferred();var userAgent=(navigator.userAgent||navigator.vendor||window.opera).toLowerCase();var isIos;var isAndroid;var isOtherMobileBrowser;if(/ip(ad|hone|od)/.test(userAgent))isIos=true;else if(userAgent.indexOf('android')!==-1)isAndroid=true;else isOtherMobileBrowser=/avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|playbook|silk|iemobile|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(userAgent)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(userAgent.substr(0,4));var httpMethodUpper=settings.httpMethod.toUpperCase();if(isAndroid&&httpMethodUpper!=="GET"&&settings.androidPostUnsupportedMessageHtml){if($().dialog)$("<div>").html(settings.androidPostUnsupportedMessageHtml).dialog(settings.dialogOptions);else alert(settings.androidPostUnsupportedMessageHtml);return deferred.reject();}var $preparingDialog=null;var internalCallbacks={onPrepare:function(url){if(settings.preparingMessageHtml)$preparingDialog=$("<div>").html(settings.preparingMessageHtml).dialog(settings.dialogOptions);else{if(settings.prepareCallback)settings.prepareCallback(url);}},onSuccess:function(url){if($preparingDialog)$preparingDialog.dialog('close');settings.successCallback(url);deferred.resolve(url);},onAbort:function(url){if($preparingDialog)$preparingDialog.dialog('close');;settings.abortCallback(url);deferred.reject(url);},onFail:function(responseHtml,url,error){if($preparingDialog)$preparingDialog.dialog('close');if(settings.failMessageHtml)$("<div>").html(settings.failMessageHtml).dialog(settings.dialogOptions);settings.failCallback(responseHtml,url,error);deferred.reject(responseHtml,url);}};internalCallbacks.onPrepare(fileUrl);if(settings.data!==null&&typeof settings.data!=="string")settings.data=$.param(settings.data);var $iframe,downloadWindow,formDoc,$form;if(httpMethodUpper==="GET"){if(settings.data!==null){var qsStart=fileUrl.indexOf('?');if(qsStart!==-1){if(fileUrl.substring(fileUrl.length-1)!=="&")fileUrl=fileUrl+"&";}else fileUrl=fileUrl+"?";fileUrl=fileUrl+settings.data;}if(isIos||isAndroid){downloadWindow=window.open(fileUrl);downloadWindow.document.title=settings.popupWindowTitle;window.focus();}else if(isOtherMobileBrowser)window.location(fileUrl);else $iframe=$("<iframe style='display: none' src='"+fileUrl+"'></iframe>").appendTo("body");}else{var formInnerHtml="";if(settings.data!==null)$.each(settings.data.replace(/\+/g,' ').split("&"),function(){var kvp=this.split("=");var k=kvp[0];kvp.shift();var v=kvp.join("=");kvp=[k,v];var key=settings.encodeHTMLEntities?htmlSpecialCharsEntityEncode(decodeURIComponent(kvp[0])):decodeURIComponent(kvp[0]);if(key){var value=settings.encodeHTMLEntities?htmlSpecialCharsEntityEncode(decodeURIComponent(kvp[1])):decodeURIComponent(kvp[1]);formInnerHtml+='<input type="hidden" name="'+key+'" value="'+value+'" />';}});if(isOtherMobileBrowser){$form=$("<form>").appendTo("body");$form.hide().prop('method',settings.httpMethod).prop('action',fileUrl).html(formInnerHtml);}else{if(isIos){downloadWindow=window.open("about:blank");downloadWindow.document.title=settings.popupWindowTitle;formDoc=downloadWindow.document;window.focus();}else{$iframe=$("<iframe style='display: none' src='about:blank'></iframe>").appendTo("body");formDoc=getiframeDocument($iframe);}formDoc.write("<html><head></head><body><form method='"+settings.httpMethod+"' action='"+fileUrl+"'>"+formInnerHtml+"</form>"+settings.popupWindowTitle+"</body></html>");$form=$(formDoc).find('form');}$form.submit();}setTimeout(checkFileDownloadComplete,settings.checkInterval);function checkFileDownloadComplete(){var cookieValue=settings.cookieValue;if(typeof cookieValue=='string')cookieValue=cookieValue.toLowerCase();var lowerCaseCookie=settings.cookieName.toLowerCase()+"="+cookieValue;if(document.cookie.toLowerCase().indexOf(lowerCaseCookie)>-1){internalCallbacks.onSuccess(fileUrl);var cookieData=settings.cookieName+"=; path="+settings.cookiePath+"; expires="+new Date(0).toUTCString()+";";if(settings.cookieDomain)cookieData+=" domain="+settings.cookieDomain+";";document.cookie=cookieData;cleanUp(false);return;}if(downloadWindow||$iframe)try{var formDoc=downloadWindow?downloadWindow.document:getiframeDocument($iframe);if(formDoc&&formDoc.body!==null&&formDoc.body.innerHTML.length){var isFailure=true;if($form&&$form.length){var $contents=$(formDoc.body).contents().first();try{if($contents.length&&$contents[0]===$form[0])isFailure=false;}catch(e){if(e&&e.number==-2146828218)isFailure=true;else throw e;}}if(isFailure){setTimeout(function(){internalCallbacks.onFail(formDoc.body.innerHTML,fileUrl);cleanUp(true);},100);return;}}}catch(err){internalCallbacks.onFail('',fileUrl,err);cleanUp(true);return;}setTimeout(checkFileDownloadComplete,settings.checkInterval);}function getiframeDocument($iframe){var iframeDoc=$iframe[0].contentWindow||$iframe[0].contentDocument;if(iframeDoc.document)iframeDoc=iframeDoc.document;return iframeDoc;}function cleanUp(isFailure){setTimeout(function(){if(downloadWindow){if(isAndroid)downloadWindow.close();if(isIos)if(downloadWindow.focus){downloadWindow.focus();if(isFailure)downloadWindow.close();}}},0);}function htmlSpecialCharsEntityEncode(str){return str.replace(htmlSpecialCharsRegEx,function(match){return '&'+htmlSpecialCharsPlaceHolders[match];});}var promise=deferred.promise();promise.abort=function(){cleanUp();$iframe.attr('src','').html('');internalCallbacks.onAbort(fileUrl);};return promise;}});})(jQuery,this||window);;
(function($,Drupal,rhdp_fe_app){'use strict';const CONSTANTS={ALLOWED_CDN_HOST:'https://access.cdn.redhat.com/',DOWNLOAD_ALERT_ID:'downloadthankyou',SSO_SOURCE_PARAM:'&source=sso',MIN_PRODUCT_PARTS:2,EVENTS:{DOWNLOAD_FILE:'rhdp_feDownloadFile',HIDE_MESSAGE:'rhdp_feHideDownloadMessage',DOWNLOAD_STARTED:'Download Started',GTM_DOWNLOAD_REQUESTED:'Product Download Requested'}};const DOWNLOAD_TYPES=['media','cloud','product','eol','gated asset','gated course','gated link','gated trial','redirect'];function getSuccessAlertTemplate(downloadUrl){return `
      <div class="component rhd-m-max-width-xl rhd-c-product-download-alert pf-c-content pf-u-py-xl" id="${CONSTANTS.DOWNLOAD_ALERT_ID}">
        <div class="pf-c-alert pf-m-success" aria-label="Success alert">
          <div class="pf-c-alert__icon">
            <i class="fas fa-fw fa-check-circle" aria-hidden="true"></i>
          </div>
          <p class="pf-c-alert__title pf-u-font-size-2xl">
            <span class="pf-screen-reader">Success alert:</span>
            Thank you for downloading!
          </p>
          <div class="pf-c-alert__description">
            <p>
              Your download should start automatically.
              If you have any problems with the download, please use the
              <a id="tcDownloadLink" href="${downloadUrl}">direct link</a>.
            </p>
          </div>
        </div>
      </div>
    `;}function getErrorAlertTemplate(){return `
      <div class="component rhd-m-max-width-xl rhd-c-product-download-alert pf-c-content pf-u-py-xl" id="${CONSTANTS.DOWNLOAD_ALERT_ID}">
        <div class="pf-c-alert pf-m-danger" aria-label="Error invalid download url">
          <div class="pf-c-alert__icon">
            <i class="fas fa-fw fa-exclamation-circle" aria-hidden="true"></i>
          </div>
          <p class="pf-c-alert__title pf-u-font-size-2xl">
            <span class="pf-screen-reader">Error:</span>
            Invalid download URL!
          </p>
          <div class="pf-c-alert__description">
            <p>
              Please contact the support team for assistance.
            </p>
          </div>
        </div>
      </div>
    `;}function getAlertTemplate(downloadUrl){if(downloadUrl&&downloadUrl.startsWith(CONSTANTS.ALLOWED_CDN_HOST))return getSuccessAlertTemplate(downloadUrl);return getErrorAlertTemplate();}function hideDownloadMessage(){$(`#${CONSTANTS.DOWNLOAD_ALERT_ID}`).hide();}function parseDownloadParameters(){const downloadUrl=rhdp_fe_app.urlParam('tcDownloadURL');const fileName=rhdp_fe_app.urlParam('tcDownloadFileName');let product=rhdp_fe_app.urlParam('p');if(!downloadUrl||!fileName||!product)return {downloadUrl:'',fileName:'',product:''};product=decodeURI(product);product=parseProductString(product);return {downloadUrl:downloadUrl.trim(),fileName:fileName.trim(),product:product.trim()};}function parseProductString(productString){const productParts=productString.split(':');if(Array.isArray(productParts)&&productParts.length>=CONSTANTS.MIN_PRODUCT_PARTS&&DOWNLOAD_TYPES.includes(productParts[0].toLowerCase())){productParts.shift();return productParts.join(':');}return productString;}function sanitizeDownloadUrl(url){return url.replace(CONSTANTS.SSO_SOURCE_PARAM,'');}function isValidDownloadUrl(url,fileName){return (url&&url.startsWith(CONSTANTS.ALLOWED_CDN_HOST)&&url.includes(fileName));}function pushDataLayerProductDownload(downloadFileName,product){if(!downloadFileName){console.warn('Download filename is required for GTM tracking');return;}try{window.dataLayer=window.dataLayer||[];window.dataLayer.push({product_download_file_name:downloadFileName});window.dataLayer.push({event:CONSTANTS.EVENTS.GTM_DOWNLOAD_REQUESTED});const fileExtension=downloadFileName.includes('.')?downloadFileName.split('.').pop():'';document.dispatchEvent(new ReporterEvent(CONSTANTS.EVENTS.DOWNLOAD_STARTED,{fileName:downloadFileName,fileType:fileExtension,product:[{productInfo:{name:product,productID:'',sku:''}}]}));}catch(error){console.error('Error pushing download data to GTM:',error);}}function initiateDownload(){const {downloadUrl,fileName,product}=parseDownloadParameters();if(!downloadUrl||!fileName||!product){console.warn('Missing required download parameters');return;}const sanitizedUrl=sanitizeDownloadUrl(downloadUrl);const isDownloadPage=rhdp_fe_app.file_download.is_download_page;if(isDownloadPage&&sanitizedUrl&&product)$('main').prepend(getAlertTemplate(sanitizedUrl));if(isDownloadPage&&isValidDownloadUrl(sanitizedUrl,fileName))try{$.fileDownload(sanitizedUrl);pushDataLayerProductDownload(fileName,product);}catch(error){console.error('Error initiating file download:',error);}}Drupal.behaviors.rhdp_fe_file_download={attach:function(context,settings){rhdp_fe_app.file_download.attached++;if(rhdp_fe_app.file_download.attached>1)return;document.addEventListener(CONSTANTS.EVENTS.DOWNLOAD_FILE,()=>{initiateDownload();});document.addEventListener(CONSTANTS.EVENTS.HIDE_MESSAGE,()=>{hideDownloadMessage();});}};})(jQuery,Drupal,window.rhdp_fe_app);;
/* eslint-disable no-magic-numbers */
/**
 * @file
 * Handles views exposed filters functionality including:
 * - See More/See Less buttons for filter options
 * - Mobile accordion behavior
 * - Selected options reordering
 * - Reset button functionality
 * - AJAX-aware initialization and re-initialization
 * 
 * Architecture: All functions now use parameter-based design for better encapsulation
 * and to avoid global state dependencies. The accordion collection is passed through
 * the function chain to ensure proper scoping in both AJAX and initial load contexts.
 */
(function ($, Drupal) {
  // Array to track which accordions have their "See More" button clicked
  let seeMoreArray = [];
  // Flag to track if we're in an AJAX context (vs initial page load)
  let isAjax = false;
  Drupal.behaviors.view_exposed_filters = {
    attach: function (context, settings) {
      // Determine if this is an AJAX request or initial page load
      // When context !== document, it means we're processing a partial page update (AJAX)
      if (context !== document) {
        isAjax = true;
      }

      /**
       * Creates and manages "See More" and "See Less" buttons for filter accordions.
       * Handles showing/hiding additional filter options beyond the first 5.
       * 
       * @param {jQuery} tmp_accordions - Collection of accordion elements to process
       */
      function seeMoreLessButtons(tmp_accordions) {
        tmp_accordions.each(function (index) {
          let accordion = $(this);
          // Find the checkbox container within this accordion
          let filterOptions = accordion.find(
            ".form-checkboxes.bef-checkboxes"
          );
          // Get all checkbox options
          let options = filterOptions.find(".js-form-type-checkbox");

          // Create the "See More" button
          let seeMoreButton = $("<button>")
            .text("See More")
            .addClass(
              `pf-m-primary pf-u-mr-md pf-u-ml-0 see-more see-more-${index}`
            );

          // Create the "See Less" button (initially hidden)
          let seeLessButton = $("<button>")
            .text("See Less")
            .addClass(
              `pf-m-primary pf-u-mr-md pf-u-ml-0 see-less see-less-${index}`
            )
            .hide();

          // Handle "See More" button click
          seeMoreButton.on("click", function (e) {
            // Track that this accordion is expanded
            seeMoreArray.push(`see-more-${index}`);
            // Show options beyond the first 5
            options.slice(5).show();
            e.preventDefault();
            // Toggle button visibility
            seeMoreButton.hide();
            seeLessButton.show();
          });

          // Handle "See Less" button click
          seeLessButton.on("click", function (e) {
            // Remove this accordion from the expanded tracking array
            let arrayIndex = seeMoreArray.indexOf(`see-more-${index}`);
            if (arrayIndex > -1) {
              seeMoreArray.splice(arrayIndex, 1);
            }
            // Hide options beyond the first 5
            options.slice(5).hide();
            e.preventDefault();
            // Toggle button visibility
            seeLessButton.hide();
            seeMoreButton.show();
          });

          // Only add buttons if there are more than 5 options
          if (options.length > 5) {
            accordion.append(seeMoreButton);
            accordion.append(seeLessButton);
            // Initially hide options beyond the first 5
            options.slice(5).hide();
          }

          // Restore previously expanded accordions after page refresh or AJAX
          if (seeMoreArray.length > 0) {
            seeMoreArray.forEach(function (item) {
              let seeMoreClickedButton = accordion.find(`.${item}`);
              let seeLessClickedButton = accordion.find(`.${item.replace('see-more', 'see-less')}`);
              // Show "See Less" button and hide "See More" button
              seeMoreClickedButton.hide();
              seeLessClickedButton.show();
              // Show all options for this accordion
              let options = seeMoreClickedButton
                .siblings(".form-checkboxes")
                .find(".js-form-type-checkbox");
              options.slice(5).show();
            });
          }
        });
      }

      /**
       * Updates filter options by reordering them with selected options at the top.
       * This function is called when a checkbox state changes and ensures that
       * checked filters appear at the top of their respective accordion.
       * 
       * @param {jQuery} tmp_accordion - The accordion element to update
       */
      function updateFilterOptions(tmp_accordion) {
        let filterOptions = tmp_accordion.find(".form-checkboxes.bef-checkboxes");
        let options = filterOptions.find(".js-form-type-checkbox");
        let selectedOptions = [];
        let unselectedOptions = [];

        // Only reorder if there are more than 5 options to avoid unnecessary DOM manipulation
        if (options.length > 5) {
          // Separate selected and unselected options into different arrays
          options.each(function () {
            if ($(this).find('input[type="checkbox"]').is(":checked")) {
              selectedOptions.push(this);
            } else {
              unselectedOptions.push(this);
            }
          });

          // Clear the container and re-add options with selected ones first
          filterOptions.empty();
          selectedOptions.forEach(function (option) {
            filterOptions.append(option);
          });
          unselectedOptions.forEach(function (option) {
            filterOptions.append(option);
          });
        }

        // Update accordion attributes to track item count and visibility state
        tmp_accordion.attr("item-count", options.length);
        if (options.length === 0) {
          tmp_accordion.attr("show-item", 'no');
        } else {
          tmp_accordion.attr("show-item", 'yes');
        }
      }

      /**
       * Handles accordion behavior for mobile devices.
       * Closes accordions on mobile unless they contain checked filters.
       * 
       * @param {jQuery} tmp_accordions - jQuery object containing accordion elements
       */
      function accordionForMobile(tmp_accordions) {
        tmp_accordions.each(function () {
          let filterOptions = $(this).find(
            ".form-checkboxes.bef-checkboxes"
          );
          let options = filterOptions.find(".js-form-type-checkbox");

          // On mobile devices (width < 768px)
          if ($(window).innerWidth() < 768) {
            // Close all accordions by default
            $(this).removeAttr("open");

            // Re-open accordions that contain checked filters
            options.each(function () {
              if ($(this).find('input[type="checkbox"]').is(":checked")) {
                let accordion = $(this).parents('.form-wrapper')
                accordion.attr("open", "open");
              }
            })
          } else {
            // On desktop, keep all accordions open
            $(this).attr("open", "open");
          }
        });
      }

      /**
       * Binds the window resize event to reapply mobile accordion behavior.
       * Uses debouncing to prevent excessive function calls during resize.
       * 
       * @param {jQuery} tmp_accordions - Collection of accordion elements to process on resize
       */
      function bindResizeEvent(tmp_accordions) {
        $(window).resize(function () {
          // Debounce the resize event to avoid excessive function calls during window resize
          clearTimeout($.data(this, 'resizeTimer'));
          $.data(this, 'resizeTimer', setTimeout(function () {
            accordionForMobile(tmp_accordions)
          }, 150));
        })
      }

      /**
       * Processes and initializes all accordion filters for desktop behavior.
       * This includes setting up see more/less buttons, reordering selected options,
       * and attaching event handlers.
       * 
       * @param {jQuery} tmp_accordions - Collection of accordion elements to process
       */
      function accordionForDesktop(tmp_accordions) {
        tmp_accordions.each(function () {
          let accordion = $(this);
          let filterOptions = accordion.find(".form-checkboxes.bef-checkboxes");
          let options = filterOptions.find(".js-form-type-checkbox");

          // Move selected options to the top within their parent (only for accordions with > 5 options)
          if (options.length > 5) {
            let selectedInputs = options.find('input[type="checkbox"]:checked');
            selectedInputs.each(function () {
              let parentOption = $(this).closest(".js-form-type-checkbox");
              parentOption.prependTo(filterOptions);
            });
          }

          // Attach change event handlers to all checkboxes to trigger reordering
          options.each(function () {
            let checkbox = $(this).find('input[type="checkbox"]');
            checkbox.on("change", function () {
              updateFilterOptions(accordion);
            });
          });

          // Set initial attributes for accordion state tracking
          accordion.attr("item-count", options.length);
          if (options.length === 0) {
            accordion.attr("show-item", 'no');
          } else {
            accordion.attr("show-item", 'yes');
          }
        });
      }

      /**
       * RHDX-4913: Binds the reset button functionality.
       * Removes query parameters from URL and updates browser history when reset is clicked.
       * This is separated into its own function for better organization and reusability.
       */
      function bindResetButton() {
        $('input[name="reset"]').on('click', function () {
          // Get the current URL without query parameters
          var newUrl = window.location.href.split('?')[0];

          // Make AJAX request to the clean URL
          $.ajax({
            url: newUrl,
            type: 'GET',
            success: function (data) {
              // Update browser history without query parameters
              history.pushState(null, null, newUrl);
            },
            error: function (error) {
              console.error('Ajax request failed:', error);
            }
          });
        });
      }

      /**
       * Initializes all filter functionality in the correct order.
       * This function is called both on initial page load and after AJAX updates.
       * All functions now receive the accordion collection as a parameter for better encapsulation.
       * 
       * @param {jQuery} tmp_accordions - Collection of accordion elements to initialize
       */
      function init(tmp_accordions) {
        // Initialize desktop accordion behavior (selected option reordering, event handlers)
        accordionForDesktop(tmp_accordions);
        // Apply mobile-specific accordion behavior (open/close based on screen size)
        accordionForMobile(tmp_accordions);
        // Initialize see more/see less buttons (must happen after desktop initialization)
        seeMoreLessButtons(tmp_accordions);
        // Bind resize event handler (for responsive behavior)
        bindResizeEvent(tmp_accordions);
        // Bind reset button handler (URL parameter cleanup)
        bindResetButton();
      }

      /**
       * Handle initialization based on whether this is an AJAX request or initial page load.
       * For AJAX requests, we need to clean up and reinitialize after the request completes.
       * For initial page load, we can initialize immediately.
       * The accordion collection is now passed as a parameter to all functions for better encapsulation.
       */
      if (isAjax) {
        // Re-attach behavior after AJAX requests complete
        $(document).ajaxComplete(function () {
          // Get the updated accordion elements after AJAX (context-specific)
          let accordions = $("details.form-wrapper", context);

          // Remove any existing see more/see less buttons to prevent duplicates
          accordions.find('.see-more, .see-less').remove();

          // First, update each accordion's filter options ordering
          // This must happen before init() to ensure proper element ordering
          accordions.each(function () {
            updateFilterOptions($(this));
          });

          // Initialize all functionality with the AJAX-updated accordions
          init(accordions);
        });
      } else {
        // Get all filter accordion elements within the current context (initial page load)
        let accordions = $("details.form-wrapper", context);

        // Initial page load - initialize immediately with all accordions
        init(accordions);
      }
    }
  };
})(jQuery, Drupal);
;
