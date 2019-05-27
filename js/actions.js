var mainContainer = document.querySelector('.photos');
var load = document.querySelector('.photos-loading');
var _H;
var _W;
var _MARGIN_ROW = 10; //px
var _MARGIN_COL = 10; //px
var _LEVELS = 2;
var photos;
var used_photos;
var super_duper;
var best_w;
var new_height;
var aspect_ratio;
var resizeId;

window.onresize = function() {
    load.style.display = "flex";
    mainContainer.style.maxHeight = _H + "px";
    mainContainer.style.opacity = "0";
    clearTimeout(resizeId);
    resizeId = setTimeout(create_banner, 500);
};

create_banner();

function place(k, current_w){
  if(photos[k].cancel) return false;
  if(used_photos[k] === 0 &&
    (photos[k].width + current_w + _MARGIN_COL <= _W))
      return true;
  return false;
}

function backtrack(current_w){
  if(current_w > best_w){
    super_duper = new Array();
    for(let k = 0; k < used_photos.length; k++)
      if(used_photos[k] === 1)
        super_duper.push(k);
    best_w = current_w;
  }
  for(let k = 0; k < photos.length; k++){
    if(place(k, current_w)){
      used_photos[k] = 1;
      backtrack(current_w + photos[k].width + _MARGIN_COL);
      used_photos[k] = 0;
    }
  }
}

function fit_images(){
  if(super_duper == undefined){
    super_duper = new Array();
    super_duper[0] = 0;
  }
  let sum = 0;
  let x = 0;
  for(let i = 0; i < super_duper.length; i++){
    console.log(super_duper[i]);
    sum += photos[super_duper[i]].ratio;
  }
  sum *= new_height;
  x = ( _W - ((super_duper.length - 1) * _MARGIN_COL) ) / sum;
  for(let i = 0; i < super_duper.length; i++){
    photos[super_duper[i]].height *= x;
    photos[super_duper[i]].width = photos[super_duper[i]].height * photos[super_duper[i]].ratio;
  }
}

function show_photos(){
  for(let i = 0; i < super_duper.length; i++){
    let node = document.createElement("div");
    //console.log(photos[super_duper[i]].width);
    node.style.width = photos[super_duper[i]].width + "px";
    node.style.height = new_height + "px";
    node.style.margin = "0 0 " + _MARGIN_ROW + "px 0";
    node.style.backgroundImage = "url('"+ photos[super_duper[i]].src +"')"
    node.classList.add('bw');
    photos[super_duper[i]].cancel = true;
    mainContainer.appendChild(node);
  }
}

function resize(){ // set the photos into the correct layout
  used_photos = new Array(photos.length);
  for(let i = 0; i < used_photos.length; i++) used_photos[i] = 0;
  for(let i = 0; i < _LEVELS; i++){
    best_w = 0;
    super_duper = undefined;
    backtrack(0);
    console.log(super_duper);
    fit_images();
    show_photos();
  }
}

function create_banner(){ // decide wheter create a layout for the photos or just use the first one as background
  while (mainContainer.firstChild) {
      mainContainer.removeChild(mainContainer.firstChild);
  }
  _H = mainContainer.offsetHeight;
  _W = mainContainer.offsetWidth;
  mainContainer.style.display = "none";
  let p = load_photos();
  p.then( (res) => {
    console.log(photos);
    resize();
    mainContainer.style.display = "flex";
    mainContainer.style.maxHeight = "none";
    mainContainer.style.opacity = "1";
    load.style.display = "none";
  });

  // if(photos.length > 4){
  //   resize();
  //   mainContainer.style.display = "flex";
  //   mainContainer.style.maxHeight = "none";
  //   mainContainer.style.opacity = "1";
  //   load.style.display = "none";
  // }
  // else{
  //   console.log("I don't do that yet!");
  // }
}

function load_image(url) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.addEventListener('load', e => resolve(img));
      img.addEventListener('error', () => {
        reject(new Error(`Failed to load image's URL: ${url}`));
      });
      img.src = url;
    });
  }

function load_photos(){ // load the photos from the hidden links
  return new Promise((resolve, reject) => {

    photos = new Array();
    let p = new Array();
    let tam = 0;
    let counter = 0;
    let container = document.querySelectorAll('#sectionPhotos input[type=hidden]');
    for(let k = 0; k < container.length; k++){
      p[k] = load_image(container[k].value);
    }
    if(p.length > 3){
      _LEVELS = 2;
      counter = p.length;
    }
    else{
      _LEVELS = 1;
      counter = 1;
    }
    new_height = ( _H - ( (_LEVELS+1) * _MARGIN_ROW) ) / _LEVELS;
    aspect_ratio = _W / _H;
    for(let k = 0; k < counter; k++){
      p[k].then( (img) => {
        photos[k] = img;
        tam += 1;
        photos[k].cancel = false;
        photos[k].height = new_height;
        photos[k].ratio = photos[k].naturalWidth / photos[k].naturalHeight;
        photos[k].width = photos[k].height * photos[k].ratio;
        console.log('ya cargue');
        if(tam == counter){
          resolve(1);
        }
      })
      .catch(error => console.error(error));
    }

  });
}
