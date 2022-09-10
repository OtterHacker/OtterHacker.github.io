require(["gitbook", "jQuery"], function(gitbook, $) {
  function selectElementText(el){
      var range = document.createRange();
      range.selectNodeContents(el);
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
  }

  function getSelectedText() {
    var t = '';
      if (window.getSelection) {
          t = window.getSelection();
      } else if (document.getSelection) {
          t = document.getSelection();
      } else if (document.selection) {
          t = document.selection.createRange().text;
      }
      return t;
  }
  
  function copyToClipboard(text) {
    if (window.clipboardData && window.clipboardData.setData) {
        // IE specific code path to prevent textarea being shown while dialog is visible.
        return clipboardData.setData("Text", text); 

    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
        } catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }
  }

  function expand(chapter) {
    chapter.show();
    if (chapter.parent().attr('class') != 'summary'
        && chapter.parent().attr('class') != 'book-summary'
      && chapter.length != 0
       ) {
         expand(chapter.parent());
       }
  }

  gitbook.events.bind("page.change", function() {
    $("pre").each(function(){
      $(this).css("position", "relative");

      var $copyCodeButton = $('<button class="copy-code-button"><svg viewBox="0 0 16 16" fill="none" preserveAspectRatio="xMidYMid meet" data-rnw-int-class="nearest___624_" class="r-h7gdob" style="height: 14px; vertical-align: middle; width: 14px;"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 .5A.5.5 0 01.5 0h10a.5.5 0 01.5.5V4h-1V1H1v9h3v1H.5a.5.5 0 01-.5-.5V.5z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M5 5.5a.5.5 0 01.5-.5h10a.5.5 0 01.5.5v10a.5.5 0 01-.5.5h-10a.5.5 0 01-.5-.5v-10zM6 6v9h9V6H6z" fill="currentColor"></path></svg></button>');
      $copyCodeButton.css({"position": "absolute", "top": "5px", "right": "5px", "padding": "3px", "background-color":"#313E4E", "color":"white", "border-radius": "5px" , "-moz-border-radius": "5px", "-webkit-border-radius": "5px", "border": "2px solid #CCCCCC"});
      $copyCodeButton.click(function(){
        var $codeContainer = $(this).siblings("code");
        if($codeContainer) {
          selectElementText($codeContainer.get(0));
          var selectedText = getSelectedText();
          copyToClipboard(selectedText);
        }
      });
      
      $(this).append($copyCodeButton);
    });
  });
});
