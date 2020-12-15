class Gallery {
  constructor() {
      this.currentIndex = 0
      // script tracks data length for rendering iframe arrows based on index
      this.dataLength = parseFloat($('#length').text());
      // script tracks doc ids for unique file naming 
      this.docIDs = $('#docIDs').text().split(',');
      // tracks username to download correct file 
      this.user = $('#user').text().replace(/\s/g, '');
      this
  }
  
  initialize () {
      //removes first and last element arrays which store isolated enter characters
      this.docIDs.splice(0,1);
      this.docIDs.pop();
      this.removeDataDivs();
      //loads first doc if it exists
      this.dataLength > 0 ? $('iframe').attr('src',`/saved/${this.docIDs[this.currentIndex]}`) : null;
      //disables buttons on load in if gallery is empty
      this.dataLength < 1 ? $('.button').css('opacity','.5').css('pointer-events','none') : null;
      //updates actions if docs exist 
      this.dataLength > 0 ? this.updateFormActions() :  null;
      this.toggleArrows();
      this.toggleSkip();   
      this.addEventListeners();
  }
  //removes invisible divs that transfer data to script
  removeDataDivs () {
      $('#length').remove();
      $('#docIDs').remove();
  }
  //groups all non destructive update methods
  updateGallery (index) {
      this.updateFormActions(); 
      this.lockArrows(); 
      this.toggleIframes(index);
      this.toggleArrows();
      this.toggleSkip();
  }
  //syncs forms with current iframe index
  updateFormActions () {
      $('#download-form').attr('action',`/saved/${this.docIDs[this.currentIndex]}`);
      $('#delete-form').attr('action',`/saved/${this.docIDs[this.currentIndex]}/?_method=DELETE`);
      $('#save-form').attr('action',`/saved/${this.docIDs[this.currentIndex]}/?_method=PUT`);
      $('#skip-input').val(null);
  }
  //prevents fast clicking
  lockArrows () {
      $('#left-arrow').css('pointer-events','none');
      $('#right-arrow').css('pointer-events','none');
      setTimeout(()=> {
          $('#left-arrow').css('pointer-events','auto');
          $('#right-arrow').css('pointer-events','auto');
      }, 200);
  }
  //prevents gallery from surpassing data length
  toggleArrows  () {
      //no left arrow past index 0
      this.currentIndex === 0 ? 
          $('#left-arrow').css('display','none') : $('#left-arrow').css('display','');
      //no right arrow past last index
      (this.currentIndex === this.dataLength - 1) || (this.dataLength < 1) ? 
          $('#right-arrow').css('display','none') : $('#right-arrow').css('display','');
  }
  //prevents blank container on load in
  toggleIframes (index)  { 
      index = index || this.currentIndex;
      //conditional prevents non disruptive error 
      let $iframe = $('<iframe>');
      $iframe.insertAfter($('iframe'));

      this.dataLength > 0 ? 
      $iframe.attr('src',`/saved/${this.docIDs[index]}`) : $iframe.attr('src','');


     
      //prevents fast clicking from causing population error
      setTimeout(()=> {
          for(let i = 0; i < $('iframe').length - 1; i++){
              $('iframe').eq(i).remove()
          }
      }, 200); 
  }
  //enables skip button based on data length
  toggleSkip () {
      this.dataLength > 0 ? $('#skip-input').attr('placeholder',`${this.currentIndex + 1} of ${this.dataLength}`) : null; 
      this.dataLength > 0 ? $('#skip-form').css('display','inherit') : $('#skip-form').css('display','none'); 
  }
  disableButtons (num) {
      $('#left-arrow').css('pointer-events','none');
      $('#right-arrow').css('pointer-events','none');
      $('.button').css('opacity','.5').css('pointer-events','none');
      setTimeout( () => {
          $('#left-arrow').css('pointer-events','auto').css('opacity','1');
          $('#right-arrow').css('pointer-events','auto').css('opacity','1');
          this.toggleSkip();
          //buttons remain disabled when gallery fully empties
          this.dataLength > 0 ? 
              $('.button').css('opacity','1').css('pointer-events','auto') : null; 
      },num);
  }
  //update for gallery skip
  skip () {
      this.currentIndex = parseFloat($('#skip-input').val()) - 1;
      this.updateGallery(parseFloat($('#skip-input').val()) - 1);
  }
  //update skip input if index does not exist 
  notFound () {
      $('#skip-input').val(null);
      $('#skip-input').attr('placeholder','Not Found');
      setTimeout(()=> this.toggleSkip(), 1000)
  }
  //image download function
  downloadPNG () {
      //jQuery does not work
      const link = document.createElement('a');
      $(link).attr('download', `appstractor${this.docIDs[this.currentIndex]}.png`);
      $(link).attr('href', `/./saved/appstractor${this.user}.png`);
      link.click(); 
  }
  //html download function 
  downloadHTML () {
      //jQuery does not work
      const link = document.createElement('a');
      const html = $('iframe').contents().find('html').html();
      $(link).attr('download', `appstractor${this.docIDs[this.currentIndex]}.html`);
      $(link).attr('href', 'data:' + 'text/plain' + ';charset=utf-8,' + encodeURIComponent(html));
      link.click();  
  }
  //instructions on how to convert html to png should png download fail
  downloadTXT () {
      //jQuery does not work
      const link = document.createElement('a');
      $(link).attr('download', `instructions.txt`);
      $(link).attr('href', `/./saved/instructions.txt`);
      link.click(); 
  }
  loadingBar () {
      $('#load-bar-container').css('display','inherit');
      $('#load-bar').addClass('load');
      setTimeout( ()=> {
          $('#load-bar-container').css('display','none');
          $('#load-bar').removeClass('load');
      }, 3000);
  }
  addEventListeners () {
      $('#left-arrow').on('click', () => {
          this.currentIndex -= 1
          this.updateGallery(); 
      });
      $('#right-arrow').on('click', () => {
          this.currentIndex += 1
          this.updateGallery();

      });
      $('#edit').on('click', () => {
          //disable arrows
          $('#left-arrow').css('pointer-events','none').css('opacity','0');
          $('#right-arrow').css('pointer-events','none').css('opacity','0');
          //disable skip
          $('#skip-form').css('display','none');
          //toggle conditional
          $('#edit-panel').css('display') === 'none' ?
              $('#edit-panel').css('display','inherit') : $('#edit-panel').css('display','none');
      });
      //also submits current index to download route
      $('#download').on('click', () => {
          // alert(this.currentIndex);
          this.loadingBar();
          this.disableButtons(3000);
          //also hide arrows
          $('#left-arrow').css('opacity','0');
          $('#right-arrow').css('opacity','0');
          //hide skip
          $('#skip-form').css('display','none');
          //delayed to allow time for page to be captured as png before download
          setTimeout( () => { 
              this.downloadPNG();
              this.downloadHTML(); 
              this.downloadTXT(); 
              //show arrows
              $('#left-arrow').css('opacity','1');
              $('#right-arrow').css('opacity','1');
              //show skip
              $('#skip-form').css('display','inherit');
          },3000);
      });
      //also submits current index to delete route
      $('#delete').on('click', () => {
          //prevents spamming of delete button and accidental deletes
          this.disableButtons(500);
          //reduces data length on deletion 
          this.dataLength > 0 ? this.dataLength -= 1 : null;
          //removes current index's id from docIDs array to sync with data length
          this.dataLength > 0 ? this.docIDs.splice(this.currentIndex, 1) : null;
          //if last image deleted, renders previous; otherwise, renders proceeding
          (this.currentIndex === this.dataLength) && (this.dataLength > 0)? 
              this.currentIndex -= 1 : null; 
          //forces update to wait until properties are updated to prevent incorrect render
          setTimeout(()=> this.updateGallery(), 0); 
      }); 
      $('#detail').on('click', () => {
          const $iframe = $('iframe').contents();
          //remove transition animation
          $iframe.find('.cell').css('transition','');
          $iframe.find('.background-canvas').removeClass('show');
          //toggle conditionals
          $iframe.find('.cell').css('background-size') === '1600%' ?
              $iframe.find('.cell').css('background-size','200000%') : $iframe.find('.cell').css('background-size','1600%');
          $iframe.find('.background-canvas').css('background-size') === 'cover' ?
              $iframe.find('.background-canvas').css('background-size','10000%') : $iframe.find('.background-canvas').css('background-size','cover');
      });
      $('#shadow').on('click', () => {
          const $iframe = $('iframe').contents();
          //remove transition animation
          $iframe.find('.cell').css('transition','');
          //toggle conditional
          $iframe.find('.cell').css('box-shadow') === 'none' ?
              $iframe.find('.cell').css('box-shadow','-2.5px 5px 25px 0px rgba(0,0,0,.55)') : $iframe.find('.cell').css('box-shadow','none');
      });
      //passes iframe body html to POST/save route 
      $('#save').on('click', () => {
          $('#save-input').val($('iframe').contents().find('html').html());
          this.disableButtons(500);
          setTimeout( ()=> $('#edit-panel').css('display','none'), 500);
      }); 
      $('#skip-submit').on('click', () => {
         (parseFloat($('#skip-input').val()) > 0) && (parseFloat($('#skip-input').val()) <= this.dataLength) ? 
              this.skip() : this.notFound();
          return false; 
      });
  }
}
const gallery = new Gallery;
gallery.initialize(); 