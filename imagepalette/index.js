class Background {
  constructor () {
      this.unchanged = [];
      this.changed = []; 
  }
  initialize () {
      this.renderImages();
      this.selectVisible();
      this.renderAnimation();
  }
  //loads in enough images to populate background for large screen
  renderImages () {
      for(let i = 0; i < 4; i ++) {
          for (let i = 1; i <= 20; i ++) {
              const $image = $('<div>').addClass('image');
              $image.css('background-image',`url('./images/home${i}.png')`);
              $('.image-grid').append($image);
          }
      }
  }
  //pushes images into unchanged array
  selectVisible () {
      for(let i = 0; i < 80; i ++) {
          this.unchanged.push($('.image').eq(i));
      }
  }
  //once all images have been changed, restarts cycle by swapping arrays
  resetProperties () {
      this.unchanged = this.changed; 
      this.changed = [];
  }
  renderAnimation () {
      setInterval( () => {
          this.unchanged.length === 0 ? this.resetProperties() : null; 
          //randomly selects image to change
          const $random = this.unchanged.length > 67 ? 
              //transition time being slower than interval time can cause image flash
              //solution: avoid selecting last 13 changed images until their animations render
              this.unchanged[Math.floor(Math.random() * 67)] : this.unchanged[Math.floor(Math.random() * this.unchanged.length)];
          //selects random background 
          const num = Math.floor(Math.random() * 20) + 1; 
          //brightness animation with firefox conditional
          if (typeof InstallTrigger !== 'undefined' || (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1))  {
              $random.css('opacity', '.9');
              setTimeout(()=>$random.css('opacity', '.35'),2000);
          } else {
              $random.css('opacity', '.9').css('background-image', `url('./images/home${num}.png')`);
              setTimeout(()=>$random.css('opacity', '.35'),1000);
          }
          //moves toggled image into changed array
          this.changed.push($random);
          this.unchanged.splice(this.unchanged.indexOf($random),1); 
      }, 150);
  }   
}
const background = new Background;
background.initialize();