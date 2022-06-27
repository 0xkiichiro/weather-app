const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner form input");
const msg = document.querySelector("span.msg");
const list = document.querySelector(".ajax-section .cities");

// localStorage.setItem(
//   "apiKey",
//   EncryptStringAES("ca9eea956a0c6f5a4ccd9ca6cf057ad7")
// );

form.addEventListener("submit", (event) => {
  event.preventDefault();
  getWeatherDataFromApi();
});

const getWeatherDataFromApi = async () => {
  //   alert("http request sent!");
  let apiKey = DecryptStringAES(localStorage.getItem("apiKey"));
  let inputValue = input.value;
  let lang = "eng";
  let unitType = "metric";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${apiKey}&units=${unitType}&lang=${lang}`;

  try {
    // const res = await fetch(url).then((re) => res.json());
    // axios.get(url) == axios(url);
    const res = await axios.get(url);
    const { name, main, sys, weather } = res.data;
    // console.log(res);

    //* we can use forEach() method on nodeList
    const cityListItems = list.querySelectorAll(".city");
    const cityListArray = Array.from(cityListItems);
    console.log(cityListArray);
    if (cityListItems.length > 0) {
      const filteredArray = cityListArray.filter(
        (city) => city.querySelector("span").innerText == name
      );
      if (filteredArray.length > 0) {
        msg.innerText = `You already know the weather for ${name} :)`;
        setTimeout(() => {
          msg.innerText = "";
        }, 5000);
        form.reset();
        return;
      }
    }

    let iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

    const createdLi = document.createElement("li");
    createdLi.classList.add("city");

    const createdLiInnerHTML = `<h2 class="city-name" data-name="${name}, ${
      sys.country
    }">
        <span>${name}</span>
        <sup>${sys.country}</sup>
    </h2>
    <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
    <figure>
        <img class="city-icon" src="${iconUrl}">
        <figcaption>${weather[0].description}</figcaption>
    </figure>`;

    createdLi.innerHTML = createdLiInnerHTML;
    //! append vs prepend
    // list.append(createdLi);
    list.prepend(createdLi);
  } catch (error) {
    msg.innerText = error;
    setTimeout(() => {
      msg.innerText = "";
    }, 5000);
  }
  form.reset(); //! clears all inputs after submitting
};
