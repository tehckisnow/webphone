//I have realized far too late into this that a better way of implementing this project would be
//  to have external css stylesheets employing classes, and have the js only manipulate classes, 
//  as opposed to manually setting everything in js
//whoops

//TODO:
////"fullscreen" method quickly toggles statusbar and navbar
//a generic build-icon method would be useful!
////top bar (time, signal, etc)
//nav bar
////build homescreen
//build apps
//build input
//how does screen hold content? (append to element?)
//timer delay events
//phone settings (theme, font)
//embed google material icons and fonts to eliminate reliance on web connection
//show/hide methods should be consolidated to reduce how often they are repeated (single static method or universal constructor?)

//manipulation 
    ////rotate phone
    //toggle phone border for mobile view
    //change phone color/style/model

//modify dropshadow based on not only rotation, but also z-axis elevation

//main engine, static
let engine = {
  //settings used if not overridden by settings object
  defaultSettings: {
    useWrapper: true,
  },

  //methods to construct elements
  build: {

    //control to manipulate phone position, hardkeys, etc
    manipulator: function(phone){
      let manipulator = {
        phone: phone,
        element: document.createElement("div"),
        visible: true,
        showHide: {
          element: document.createElement("button"),
        },
        rotate: {
          element: document.createElement("input"),
        },
        center: {
          element: document.createElement("button"),
        },
        power: {
          element: document.createElement("button"),
        },
        show: function(){
          manipulator.element.style.display = "block";
        },//manipulator.show()
        hide: function(){
          manipulator.element.style.display = "none";
        },//manipulator.hide()
        update: function(){},//manipulator.update()
      };//manipulator

      //style
      manipulator.element.style.border = "solid black";
      manipulator.element.style.backgroundColor = "#333333";
      manipulator.element.style.textAlign = "center";
      manipulator.element.style.width = "150px";
      manipulator.element.style.padding = "10px";
      manipulator.element.style.position = "absolute";
      manipulator.element.style.top = "10";
      //manipulator.element.style.zIndex = 0;

      //show/hide
      manipulator.showHide.element.innerHTML = "hide";
      manipulator.element.appendChild(manipulator.showHide.element);
      manipulator.showHide.element.style.margin = "0px 10px 20px 10px";
      manipulator.showHide.element.onclick = function(){
        if(manipulator.visible){
          manipulator.hide();
        };
      };

      //rotator
      manipulator.element.appendChild(manipulator.rotate.element);
      manipulator.rotate.element.type = "range";
      manipulator.rotate.element.min = -180;
      manipulator.rotate.element.max = 180;
      manipulator.rotate.element.value = 0;
      //manipulator.rotate.element.step = 45
      manipulator.rotate.element.oninput = function(){
        manipulator.phone.rotate(this.value);
      };
      manipulator.element.appendChild(manipulator.center.element);
      manipulator.center.element.innerHTML = "center";
      //manipulator.center.element.style.display = "block";
      manipulator.center.element.style.margin = "auto";
      manipulator.center.element.onclick = function(){
        manipulator.phone.rotate(0);
        manipulator.rotate.element.value = 0;
      };

      //power
      manipulator.power.element.innerHTML = "power";
      manipulator.power.element.style.margin = "20px";
      manipulator.element.appendChild(manipulator.power.element);
      manipulator.power.element.style.display = "block";
      manipulator.power.element.onclick = function(){
        if(phone.on){
          phone.turnOff();
        }else {
          phone.turnOn();
        };
      };

      return manipulator;
    },//engine.build.manipulator()

    //used to center phone on screen
    wrapper: function(child){
      let wrapper = {};
      wrapper.element = document.createElement("div");
      wrapper.element.appendChild(child.element);
      child.element.style.margin = "auto";
      wrapper.add = function(target){
        let parent = document.body;
        if(target){
          parent = target.element;
        };
        parent.appendChild(wrapper.element);
      };
      return wrapper;
    },//wrapper

    //creates a new phone object
    phone: function(settings){
      //build
      let phone = {
        element: document.createElement("div"),
        on: false,
        apps: {
          current: {},
          recent: [],
          open: function(app){
            if(phone.on && app.app){
              phone.apps.current.hide();
              if(phone.apps.recent.includes(phone.apps.current)){
                //remove
                let index = phone.apps.recent.indexOf(phone.apps.current);
                phone.apps.recent.splice(index, 1);
              };
              phone.apps.recent.push(phone.apps.current);
              phone.apps.current = app;
              phone.apps.current.show();
            };
          },
          close: function(){},  //! what should this do?
          switch: function(app){
            //? append app (?)
            //make app visible
            //make previous app not visible
            //add previous app to recent list
          },
        },//phone.apps
        turnOn: function(){
          if(!phone.on){
            //phone won't turn on if battery is dead
            if(phone.battery < 1){return};
            console.log("booting");
            phone.screen.turnOn();
            setTimeout(function(){phone.screen.homescreen.show()}, 3000)};
            setTimeout(function(){phone.screen.toggleFullscreen()}, 3500);
            setTimeout(function(){phone.on = true}, 3500);
        },//phone.turnOn()
        turnOff: function(){
          if(phone.on){
            console.log("shutting down");
            //!remove screen.content children
            //for(let i in screen.content.apps){
              //screen.content.apps[i].hide();
            //};

            if(!phone.screen.fullscreen){
              phone.screen.toggleFullscreen();
            };
            
            setTimeout(function(){
              phone.screen.homescreen.hide();
            }, 1000);

            phone.on = false;

            setTimeout(function(){phone.screen.turnOff()}, 2000);


          };
        },//phone.turnOff()
        rotate: function(degrees){
          phone.element.style.transform = "rotate(" + degrees + "deg)";
          //phone.element.style.boxShadow = "";
          //!

        },//phone.rotate()
        launch: function(app){
          // ? order ?
          // remove screen.content children and put in "recent apps"
          // append new app to screen.content

        },//phone.launch()
        update: function(){
          //time //?

          //screen
          phone.screen.update();
        },//phone.update()
  //phone default settings //!move this later?
  //-------------------
        width: 200,
        height: 360,
        unit: "px",
        screenBorder: 10,
        screenVerticalOffset: 0, //moves screen vertically
        screenVerticalAspectRatioOffset: 10, //resizes screen vertically
        orientation: "portrait",
        battery: 100,
        signal: 100,
  //-------------------
      };//phone
      phone.element.setAttribute("id", "phone");
      //update settings
      for(let s in settings){
        phone[s] = settings[s];
      };
      //style
      phone.element.style.borderRadius = "20px";
      phone.element.style.backgroundColor = "black";
      phone.element.style.width = phone.width + phone.unit;
      phone.element.style.height = phone.height + phone.unit;
      phone.element.style.boxShadow = "10px 20px 10px 10px rgba(50, 50, 50, .7)";
      //screen
        //build
      phone.screen = engine.build.screen(phone.width - (2 * phone.screenBorder), phone.height - (2 * phone.screenBorder) - phone.screenVerticalAspectRatioOffset);
        //style
      phone.screen.element.style.position = "relative";
      phone.screen.element.style.top = phone.screenBorder + phone.screenVerticalOffset + phone.unit;
        //append
      phone.element.appendChild(phone.screen.element);
      
      //! which of the following will become the standard?
      phone.screen.phone = phone;
      phone.screen.parent = phone;
      
      //return
      return phone;
    },//engine.build.phone()

    //builds a new phone screen; to be called by phone only
    screen: function(width, height){
      let screen = {
        on: false,
        element: document.createElement("div"),
        width: width,
        height: height,
        backgroundOffColor: "black",
        backgroundOnColor: "white",
        fullscreen: true,
        turnOff: function(){
          screen.element.style.backgroundColor = screen.backgroundOffColor;
          screen.on = false;
        },//screen.turnOff()
        turnOn: function(){
          screen.element.style.backgroundColor = screen.backgroundOnColor;
          screen.on = true;
        },//screen.turnOn()
        toggleFullscreen: function(){
          if(screen.fullscreen){
            screen.fullscreen = false;
            screen.statusBar.show();
            screen.navbar.show();
          }else {
            screen.fullscreen = true;
            screen.statusBar.hide();
            screen.navbar.hide();
          };
        },//screen.toggleFullscreen()
        update: function(){
          screen.statusBar.update();
          screen.content.update();
          screen.navbar.update();
        },//screen.update()
      };//screen
      //style
      screen.element.style.display = "flex";
      screen.element.style.flexDirection = "column";
      screen.element.style.backgroundColor = screen.backgroundColor;
      screen.element.style.margin = "auto";
      screen.element.style.width = screen.width;
      screen.element.style.height = screen.height;
      screen.element.style.border = "solid 1px #222222";
      //screen.element.style.borderRadius = "5px";

      screen.statusBar = engine.build.statusBar(screen);
      screen.content = engine.build.content(screen);
      screen.content.element.style.flexGrow = 3;
      screen.navbar = engine.build.navbar(screen);

      screen.homescreen = engine.build.homescreen();
      screen.homescreen.hide();
      screen.content.element.appendChild(screen.homescreen.element);


      //return
      return screen;
    },//engine.build.screen()

    view: function(){

    },//engine.build.view()

    //builds a new statusbar; to be used by screen only
    statusBar: function(screen){
      let statusBar = {
        parent: screen,
        element: document.createElement("div"),
        height: "20px", //!
        visible: false,
        backgroundColor: "black",
        foregroundColor: "white",
        time: {
          value: "12:00",
          element: document.createElement("p"),
        },
        icons: [],
        iconsOrder: ['time', 'spacer', 'signal', 'battery'],
        signal: {
          value: "signal_cellular_4_bar",
          element: document.createElement("p"),
        },
        spacer: {
          value: 0,
          element: document.createElement("p"),
        },
        batteryIcon: {
          value: "battery_full",
          element: document.createElement("p"),
        },
        battery: {
          value: 100,
          element: document.createElement("p"),
        },
        show: function(){
          statusBar.element.style.display = "flex";
        },
        hide: function(){
          statusBar.element.style.display = "none";
        },
        update: function(){
          statusBar.element.style.height = statusBar.height;
          statusBar.element.style.backgroundColor = statusBar.backgroundColor;
          statusBar.element.style.color = statusBar.foregroundColor;
          //time
          const now = new Date();
          let hours = now.getHours();
          if(hours > 12){hours -= 12};
          statusBar.time.value = hours + ":" + now.getMinutes();

          statusBar.time.element.innerHTML = statusBar.time.value;
          //icons

          //signal
          statusBar.signal.element.innerHTML = statusBar.signal.value;
          //battery
          statusBar.battery.element.innerHTML = statusBar.battery.value + "%";
          //batteryIcon
          statusBar.batteryIcon.element.innerHTML = statusBar.batteryIcon.value;
          //visible
          statusBar.visible ? statusBar.show() : statusBar.hide();
        },
      };//statusbar

      statusBar.element.style.display = "flex";
      statusBar.element.style.flexDirection = "row";
      statusBar.element.appendChild(statusBar.time.element);
      statusBar.element.appendChild(statusBar.spacer.element);
      statusBar.spacer.element.style.flexGrow = 3;
      statusBar.element.appendChild(statusBar.signal.element);
      statusBar.element.appendChild(statusBar.batteryIcon.element);
      statusBar.element.appendChild(statusBar.battery.element);
      statusBar.parent.element.appendChild(statusBar.element);

      statusBar.element.style.fontSize = "8px";
      statusBar.signal.element.classList.add("material-icons");
      statusBar.batteryIcon.element.classList.add("material-icons");
      statusBar.signal.element.style.fontSize = "8px";
      statusBar.batteryIcon.element.style.fontSize = "8px";

      statusBar.update();
      return statusBar;
    },//engine.build.statusbar()


    //builds a new content panel; to be used by screen only
    //!considering renaming this; app? screenContent?
    content: function(screen){
      let content = {
        parent: screen,
        element: document.createElement("div"),
        apps: [],
        //height
        visible: true,
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

        //
        show: function(){
          //! is block appropriate for a default? (inline? flex?)
          content.element.style.display = "block"; 
        },//content.show()
        hide: function(){
          content.element.style.display = "none";
        },//content.hide()
        update: function(){
          //!

          content.visible ? content.show() : content.hide();
        },//content.update()
      };//content
      content.parent.element.appendChild(content.element);

      content.update();
      return content;
    },//engine.build.content()

    //builds a new navbar; to be called by screen only
    navbar: function(screen){
      let navbar = {
        parent: screen,
        element: document.createElement("div"),
        height: "30px", //!
        visible: false,
        backgroundColor: "black",
        foregroundColor: "white",
        back: {
          value: "navigate_before",
          element: document.createElement("p"),
        },
        home: {
          value: "panorama_fish_eye",
          element: document.createElement("p"),
        },
        overview: {
          value: "check_box_outline_blank",
          element: document.createElement("p"),
        },
        show: function(){
          navbar.element.style.display = "flex";
        },
        hide: function(){
          navbar.element.style.display = "none";
        },
        //!update may not be needed
        update: function(){
          navbar.element.style.height = navbar.height;
          navbar.element.style.backgroundColor = navbar.backgroundColor;
          navbar.element.style.color = navbar.foregroundColor;
          navbar.back.element.innerHTML = navbar.back.value;
          navbar.home.element.innerHTML = navbar.home.value;
          navbar.overview.element.innerHTML = navbar.overview.value;
          navbar.visible ? navbar.show() : navbar.hide();
        },
      };//navbar
      navbar.element.style.display = "flex";
      navbar.element.style.flexDirection = "row";
      navbar.element.appendChild(navbar.back.element);
      navbar.element.appendChild(navbar.home.element);
      navbar.element.appendChild(navbar.overview.element);
      screen.element.appendChild(navbar.element);
      navbar.back.element.style.fontSize = "20px";
      navbar.home.element.style.fontSize = "14px";
      navbar.overview.element.style.fontSize = "14px";
      //navbar key css classes
      navbar.back.element.classList.add("material-icons");
      navbar.home.element.classList.add("material-icons");
      navbar.overview.element.classList.add("material-icons");

      navbar.update();
      //return
      return navbar;
    },//engine.build.navbar()

    //creates a new homescreen; to be called by screen only
    homescreen: function(){
      let homescreen = {
        element: document.createElement("div"),
        wallpaper: "wallpapers/wallpaper1.jpg",
        apps: [],
        show: function(){
          homescreen.element.style.display = "block"; //! ?
        },//homescreen.show()
        hide: function(){
          homescreen.element.style.display = "none";
        },//homescreen.hide()
        update: function(){
          homescreen.element.style.backgroundImage = "url(" + homescreen.wallpaper + ")";
          homescreen.element.style.height = "100%";
          homescreen.element.style.backgroundPosition = "center";
          homescreen.element.style.backgroundSize = "100% 100%";
        },//homescreen.update()
      };//homescreen


      homescreen.update();
      return homescreen;
    },//engine.build.homescreen()

    //builds a new app
    app: function(screen){
      let app = {
        app: true,
        element: document.createElement("div"),
        visible: false,
        defaultDisplay: "block",
        show: function(){
          app.element.style.display = app.defaultDisplay;
          app.visible = true;
        },//app.show()
        hide: function(){
          app.element.style.display = "none";
          app.visible = false;
        },//app.hide()
        update: function(){
          //

          //app.visible ? app.show() : app.hide();
        },//app.update()
      };
      app.hide();
      screen.content.element.appendChild(app.element);
      screen.content.apps.push(app);

      return app;
    },//engine.build.app()

  },//engine.build

};//engine

//-------------------
//test

let settings = {
  width: 200,
  height: 340,
};
let phone1 = engine.build.phone(settings);

let manipulator = engine.build.manipulator(phone1);
document.body.appendChild(manipulator.element);

//use wrapper to center phone
let wrapper = engine.build.wrapper(phone1);
wrapper.add();

//turn on
//phone1.turnOn();

//replace with changing z-level?
wrapper.element.removeChild(phone1.element);
wrapper.element.appendChild(phone1.element);

//app test
let app1 = engine.build.app(phone1.screen);
phone1.screen.content.element.appendChild(app1.element);
app1.element.style.backgroundColor = "grey";
app1.element.style.height = "100%";
let box = document.createElement("div");
box.style.width = "30px";
box.style.height = "30px";
box.style.backgroundColor = "black";
app1.element.appendChild(box);

//?
phone1.screen.element.style.borderRadius = "5px";