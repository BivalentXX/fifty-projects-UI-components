class Canvas {
  constructor () {
      //size parameters
      this.mediumTop = [100,95,225,5,'flex-end','top',0,-6.25,-6.8,18];
      this.mediumBot = [0,5,225,5,'flex-start','bottom',100,6.25,6.8,18];
      //focus parameters
      this.simplified = ['10000%','200000%'];
      this.detailed = ['cover','1600%'];
      //depth parameters
      this.flat = '';
      this.shadow = '-2.5px 5px 25px 0px rgba(0,0,0,.55)';
      //default settings
      this.url = null;
      this.currentFocus = this.detailed;
      this.currentDepth = this.flat;
      //prevents shadow and detail rendering of non rendered images
      this.generated = false; 
      //tracks user account; removes extra ejs spaces
      this.user = $('#user').text().replace(/\s/g, '');
      //keeps track of whether user clicks link or search to share pop up nav
      this.source = null; 
  }
  initialize() {
      //remove invisible div
      $('#user').remove();
      this.addEventListeners();
  }
  renderAppstraction () {
      //enables instant rendering for toggle buttons
      this.generated = true;
      //renders appstraction layers
      this.createCanvasBackground();  
      this.createCanvasLayer(...this.mediumBot);
      this.createCanvasLayer(...this.mediumTop);
      //renders background image
      $('.background-canvas').eq(0).css('background-image',`url(${this.url})`);
      //renders focus
      $('.cell').css('background-image',`url(${this.url})`);
      $('.background-canvas').eq(0).css('background-size',`${this.currentFocus[0]}`);
      $('.cell').css('background-size',`${this.currentFocus[1]}`);
      //renders depth
      $('.cell').css('box-shadow', this.currentDepth);
      //waits to delete old appstraction to prevent blank background from load delay
      setTimeout( () => this.swapAppstractions(), 2000);
  }

  editAppstraction () {
      //remove animation for toggle buttons
      $('.cell').css('transition','');
      $('.background-canvas').removeClass('show');
      //applies effects without regenerating to keep same pattern 
      $('.cell').css('box-shadow', this.currentDepth);
      $('.cell').css('background-size',`${this.currentFocus[1]}`);
      $('.background-canvas').css('background-size',`${this.currentFocus[0]}`);
  }

  toggleImage (url) {
      //remove tooltip
      $('#tooltip-container',parent.document).css('display','none');
      //enables editing buttons once image is selected
      this.activateButtons();
      //updates background image url 
      this.url = url;
      //disables auto rendering for toggle buttons
      this.generated = false; 
      //renders linked or searched image without effects
      const $backgroundCanvas = $('<div>').addClass('background-canvas')
      const $bottomCanvas = $('<div>').addClass('bottom-canvas');
      const $topCanvas = $('<div>').addClass('top-canvas');
      $backgroundCanvas.css('background-image',`url(${this.url})`); 
      $backgroundCanvas.prependTo($('body'));
      $bottomCanvas.prependTo($('body'));
      $topCanvas.prependTo($('body'));
      //waits to delete old appstraction to prevent blank background from load delay
      setTimeout( () => this.swapAppstractions(), 500);
  }

  toggleDetail () {
      //toggles focus effect
      this.currentFocus === this.detailed ? this.currentFocus = this.simplified : this.currentFocus = this.detailed; 
      this.generated === true ? this.editAppstraction() : null;
  }
  toggleShadow () {
      //toggles depth effect
      this.currentDepth === this.shadow ? this.currentDepth = this.flat : this.currentDepth = this.shadow; 
      this.generated === true ? this.editAppstraction() : null;
  }

  createCanvasBackground () {
      const $canvas = $('<div>').addClass('background-canvas'); 
      $canvas.prependTo($('body'));
      //background animation
      $canvas.addClass('show');
  }
  createCanvasLayer (xStart,yStart,blockCount,blockWidth,blockJustify,layerPos,xLimit,xChange,yChange,rowLimit) {
      //background image positioning variables
      let xPos = xStart; 
      let yPos = yStart; 
      let rowCount = 0; 
      //create canvas layer based on position 
      const $canvas = layerPos === 'top' ? $('<div>').addClass('top-canvas') : $('<div>').addClass('bottom-canvas'); 
      $canvas.prependTo($('body'));
      //create blocks
      for(let i = 0; i < blockCount; i ++){  
          //create block node
          const $block = $('<div>').addClass('block');
          $canvas.append($block);
          //block width 
          const width = [blockWidth/2, blockWidth, blockWidth * 1.5]; 
          //cell quantity
          const num = Math.floor(Math.random() * 3 + 1); 
          //cell orientation
          const direction = ["row","column"]; 
          //add block css
          $block.css('flex-direction',`${direction[Math.floor(Math.random() * direction.length)]}`);
          $block.css('max-width',`${width[Math.floor(Math.random() * width.length)]}%`);
          $block.css('flex-basis',`100%`);
          $block.css('justify-content',blockJustify);
          //create cells
          for(let i = 0; i < num; i ++){
              //cell width ratio
              const flexBasis =  ["25","100"];
              //cell background image positioning
              const backgroundX = [xPos - 50, xPos, xPos + 50];
              const backgroundY = [yPos - 5, yPos, yPos + 5];
              //create cell node
              const $cell = $('<div>').addClass('cell');
              $block.append($cell);
              //add cell css
              $cell.css('flex-basis',`${flexBasis[Math.floor(Math.random() * flexBasis.length)]}%`);
              $cell.css('background-position-x',`${backgroundX[Math.floor(Math.random() * backgroundX.length)]}%`)
              $cell.css('background-position-y',`${backgroundY[Math.floor(Math.random() * backgroundY.length)]}%`);
              //cell load in animation
              $cell.css('opacity','0');
              setTimeout(()=> $cell.css('transition',`${Math.random() * 1}s`).css('opacity','1'), 1);
          }
          //background image position debugging
          // console.log(`${xPos}   ${yPos}`);
          //update background image position variables
          rowCount += 1; 
          xPos += xChange; 
          $canvas.attr('class') === 'bottom-canvas' ?
              (xPos > xLimit ? xPos = xStart : null) : (xPos < xLimit ? xPos = xStart : null);
          rowCount === rowLimit ? yPos += yChange : false; 
          rowCount === rowLimit ? rowCount = 0 : false; 
      }
  }

  swapAppstractions () {
      $('.background-canvas').eq(1).remove();
      $('.bottom-canvas').eq(1).remove();
      $('.top-canvas').eq(1).remove();
      //sets current appstraction as background for future renders 
      $('.background-canvas').eq(0).css('z-index','0');
      $('.bottom-canvas').eq(0).css('z-index','1');
      $('.top-canvas').eq(0).css('z-index','2');
  }
  // does not apply to link and search
  activateButtons(){
      $('#render',parent.document).css('opacity','1').css('pointer-events','auto');
      $('#detail',parent.document).css('opacity','1').css('pointer-events','auto');
      $('#shadow',parent.document).css('opacity','1').css('pointer-events','auto');
      $('#save',parent.document).css('opacity','1').css('pointer-events','auto');
  }
  //temporary
  disableButtons (num) {
          $('.button',parent.document).css('opacity','.5').css('pointer-events','none');
          setTimeout( () => {
              $('.button',parent.document).css('opacity','1').css('pointer-events','auto');
          },num);
  }
  apiQuery () {
      const app_id = '4229c9ccce8609e45051cea4103298e9a0bc85c2173c8c719dfde18bf2ea0ee2'
      //set input value as query param 
      const query = $('#shared-input',parent.document).val();
      //specify search params 
      const url = 'https://api.unsplash.com/search/photos?client_id='+app_id+'&page=1&per_page=10&orientation=landscape&query='+ query;    
      $.ajax({
          url: url,
          dataType: 'json',
          //randomize return 
          success: (json) => this.toggleImage(json.results[Math.floor(Math.random() * 10)]['urls']['regular'])
      });
  }
  //easier to access parent nodes from iframe, than iframe script from parent window
  addEventListeners () {
      $('#tooltip-container',parent.document).on('click', () => {
          $('#tooltip-text',parent.document).css('opacity') === '0' ?
                  $('#tooltip-image',parent.document).css('opacity','0') &&
                  $('#tooltip-text',parent.document).css('opacity','1') : 
                  $('#tooltip-image',parent.document).css('opacity','1') &&
                  $('#tooltip-text',parent.document).css('opacity','0');       
      })
      $('#link',parent.document).on('click', () => {
          this.source = 'link';
          $('#shared-input',parent.document).val('').attr('placeholder','Paste HTTP Link');
          $('#shared-panel',parent.document).css('display','inherit');
          setTimeout( ()=> $('#shared-input',parent.document).focus(), 0);
      });
      $('#search',parent.document).on('click', () => {
          this.source = 'search';
          $('#shared-input',parent.document).val('').attr('placeholder','Search Images');
          $('#shared-panel',parent.document).css('display','inherit');
          setTimeout( ()=> $('#shared-input',parent.document).focus(), 0);
      });
      $('#render',parent.document).on('click', (event) => {
          image.renderAppstraction();
          this.disableButtons(2000);
      });
      $('#detail',parent.document).on('click', () => {
          image.toggleDetail();
      });
      $('#shadow',parent.document).on('click', () => {
          image.toggleShadow();
      });
      //passes iframe body html to POST/save route 
      $('#save',parent.document).on('click', () => {
          $('#user-input',parent.document).val(this.user);
          $('#dom-input',parent.document).val($('body').html());
          this.disableButtons(500);
      }); 
      $('#back',parent.document).on('click', () => {
          $('#shared-panel',parent.document).css('display','none');
      });
      $('#submit-search',parent.document).on('click', () => {
          //same pop up used for both link and search; different outcome depending on which button is clicked
          this.source === 'search' ? this.apiQuery() : 
              $('#shared-input',parent.document).val().length > 0 ? this.toggleImage($('#shared-input',parent.document).val()) : null;
          $('#shared-panel',parent.document).css('display','none');
          return false;
      });   
  }
}
const image = new Canvas;
image.initialize();