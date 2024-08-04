import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

createApp({
  data() {
    return {
      geos: [],
      infos: [],
      page1: true,
      page2: null,
      temp: null,
      tempFeel: null,
      desc: "",
      gust: null,
      date: null,
      hours: null,
      minutes: null,
      dateSet: null,
      hoursSet: null,
      minutesSet: null,
      img: null,
      direc: "",
      rainy: null,
      time: null,
    };
  },
  methods: {
    //Location() allows you to retrieve a longitude and the attitude and send them to weather(geo)
    location() {
      let form = document.forms.form;
      let form_data = new FormData();
      let town = document.forms.form.town;
      let code = document.forms.form.code;
      let url =
        "http://api.openweathermap.org/geo/1.0/direct?q=" +
        town.value +
        "," +
        code.value +
        "&limit=10&appid=b11545ac4744c66878046e357976e369";
      fetch(url)
        .then((resp) => resp.json())
        .then((data) => {
          this.geos = data;
          this.weather(this.geos[0]);
        });
    },
    //weather(geo) allows you to return weather information depending on the parameter provided by the API
    //example: temperature, wind, time zone etc.
    weather(geo) {
      let url =
        "https://api.openweathermap.org/data/2.5/weather?lat=" +
        geo.lat +
        "&lon=" +
        geo.lon +
        "&appid=b11545ac4744c66878046e357976e369&lang=fr";

      fetch(url)
        .then((resp) => resp.json())
        .then((data) => {
          this.infos = data;
          this.page1 = false;
          this.page2 = true;
          this.temperature(this.infos.main.temp);
          this.description(this.infos.weather[0].description);
          this.wind(this.infos.wind.speed);
          this.sunrise(this.infos.sys.sunrise);
          this.sunset(this.infos.sys.sunset);

          this.img =
            "https://openweathermap.org/img/wn/" +
            this.infos.weather[0].icon +
            "@2x.png";

          this.direction(this.infos.wind.deg);
          this.timezone(this.infos.timezone);
          this.rain(this.infos.rain);
          this.winter(this.infos.snow);
        });
    },
    // method that convert the temperature in celcius
    temperature(temp) {
      (this.temp = temp - 273), 15;
      (this.tempFeel = temp - 273), 15;
      this.temp = this.temp.toFixed(2);
      this.tempFeel = this.tempFeel.toFixed(2);
    },
    // method that change some aspect of the description like first lettre to uppercase
    description(desc) {
      this.desc = desc;
      this.desc = this.desc.charAt(0).toUpperCase() + this.desc.slice(1);
    },
    // method that convert the wind in km/h and slice it to no number after the comma
    wind() {
      this.gust = this.infos.wind.speed * 3.6;
      this.gust = this.gust.toFixed(0);
    },
    //method that convert the time in time clock for the sunrise
    sunrise(sun) {
      this.date = new Date(sun * 1000);
      this.hours = this.date.getHours();
      this.minutes = this.date.getMinutes().toString().padStart(2, "0");
    },
    //method that convert the time in time clock for the sunset
    sunset(sun) {
      this.dateSet = new Date(sun * 1000);
      this.hoursSet = this.dateSet.getHours();
      this.minutesSet = this.dateSet.getMinutes().toString().padStart(2, "0");
    },
    //method that get a degree and convert it to a direction of wind
    direction(deg) {
      if (deg === 360 || 0) {
        this.direc = "NORD";
      } else if (deg > 0 && deg < 45) {
        this.direc = "Nord Nord Est";
      } else if (deg === 45) {
        this.direc = "Nord EST";
      } else if (deg > 45 && deg < 90) {
        this.direc = "EST NORD EST";
      } else if (deg === 90) {
        this.direc = "EST";
      } else if (deg > 90 && deg < 135) {
        this.direc = "EST SUD EST";
      } else if (deg === 135) {
        this.direc = "SUD EST";
      } else if (deg > 135 && deg < 180) {
        this.direc = "SUD SUD EST";
      } else if (deg === 180) {
        this.direc = "SUD";
      } else if (deg > 180 && deg < 225) {
        this.direc = "SUD SUD OUEST";
      } else if (deg > 225 && deg < 270) {
        this.direc = "OUEST SUD OUEST";
      } else if (deg === 270) {
        this.direc = "OUEST";
      } else if (deg > 270 && deg < 315) {
        this.direc = "Nord OUEST";
      } else if (deg > 315 && deg < 360) {
        this.direc = "Nord Nord OUEST";
      }
    },
    //method that convert time zone seconds into timezone
    timezone(time) {
      this.time = time / 60 / 60;
    },
    //method that determine if rain is true
    rain(rainfall) {
      this.rainy = rainfall;

      if (this.rainy == undefined) {
      } else {
        this.rainy = rainfall["1h"];
      }
    },
    //method that determine if snow is true
    winter(snow) {
      this.snow = snow;
      if (this.snow == undefined) {
      } else {
        this.snow = snow["1h"];
      }
    },
    return() {
      this.page1 = true;
      this.page2 = false;
    },
  },
  mounted() {},
}).mount("#app");
