const section_1 = document.querySelector(".inputs")
const section_2 = document.querySelector(".weather")
const info_txt = document.querySelector('.info-txt')
const input = document.querySelector("input")
const locationbtn = document.querySelector('button')
const back_btn_elem = document.querySelector(".back-btn")
const favorite_btn_element = document.querySelector('.favourite_btn')

window.addEventListener('load', () => {
    console.log("Loaded")
    section_2.style.display = "none"
    back_btn_elem.style.display = "none"
    favorite_btn_element.className = "bx bx-heart favourite_btn"

    fetch_favorites()
})

function fetch_favorites() {
    let all_favorites = JSON.parse(window.localStorage.getItem("favorite_cities"))
    if (all_favorites) {
        let cities = all_favorites
        if (cities) {
            let favorite_temps = ''
            for (let i = 0; i < cities.length; i++) {
                let url = "https://api.openweathermap.org/data/2.5/weather?q=" + cities[i] + "&appid=6bd517b784a911528368f56d20a8d509"
                const data = fetch(url).then(res => res.json()).then(data => {
                    console.log(data, cities[i])
                    favorite_temps = favorite_temps + ` <div class="favorite_item">
                   <p class="favorite_item_name">${cities[i]}</p>
                   <p class="favorite_item_temp">${data.main.temp}</p>
                               </div>`
                    document.querySelector('.favorites').innerHTML = favorite_temps
                }).catch((e) => {
                    // info_txt.classList.replace('pending',"error")
                    // info_txt.innerText="Something went wrong"
                })
            }

        }

    }
}
function requestApi(city_name) {
    let url = "https://api.openweathermap.org/data/2.5/weather?q=" + city_name + "&appid=6bd517b784a911528368f56d20a8d509"
    info_txt.classList.add('pending')
    info_txt.innerText = "Loading..."
    const data = fetch(url).then(res => res.json()).then(data => {
        console.log(data)
        showResults(data)
    }).catch((e) => {
        info_txt.classList.replace('pending', "error")
        info_txt.innerText = "Something went wrong"
    })
}

input.addEventListener('keyup', function (e) {
    console.log(input.value)
    if (e.key === "Enter" && input.value !== '') {
        requestApi(input.value)
    }
})
locationbtn.addEventListener('click', function (e) {
    if (navigator.geolocation) {
        // This needs two callbacks you can eitehr write it as anonymous function here like getCurrentPosition(function(){

        // },function (){})
        navigator.geolocation.getCurrentPosition(onSuccess, onFailure)
    }
})
function onSuccess(geo) {
    console.log("success", geo)
    const lat = geo.coords.latitude;
    const lon = geo.coords.longitude;
    let url = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=6bd517b784a911528368f56d20a8d509"

    info_txt.classList.add('pending')
    info_txt.innerText = "Loading..."
    const data = fetch(url).then(res => res.json()).then(data => {
        console.log(data)
        showResults(data)
    }).catch((e) => {
        info_txt.classList.replace('pending', "error")
        info_txt.innerText = "Something went wrong"
    })
}
function onFailure() {
    console.log("Failed to get location")
    info_txt.classList.replace('pending', "error")
    info_txt.innerText = "Location permission was denied go to settings and allow location access"
}
function showResults(data) {
    let all_favorites = JSON.parse(window.localStorage.getItem("favorite_cities"))
    if (data.cod === '404') {
        console.log("not found")
        info_txt.classList.replace("pending", "error")
        info_txt.innerText = input.value + " isn't a valid city"
    } else {
        section_2.style.display = "flex"
        section_1.style.display = "none"
        back_btn_elem.style.display = "inline-block"
        const name = data.name;
        const country = data.sys.country;
        const humidity = data.main.humidity;
        const feels_like = data.main.feels_like;
        const temprature = data.main.temp;
        const description = data.weather[0].description
        console.log(name, humidity, feels_like, temprature)
        section_2.querySelector(".temp .deg").innerText = temprature;
        section_2.querySelector(".location span").innerText = name + ", " + country;
        section_2.querySelector('.humidity p').innerText = humidity;
        section_2.querySelector('.numb').innerText = description;
        section_2.querySelector('.numb-1').innerText = feels_like;
        info_txt.classList.remove("pending", "error")
        info_txt.innerText = ""
        input.value = ""
        if (all_favorites.includes(name)) {
            favorite_btn_element.className = "bx bxs-heart favourite_btn"
            favorite_btn_element.style.color = "red"
        }

    }
}

back_btn_elem.addEventListener("click", (e) => {
    section_2.style.display = "none"
    section_1.style.display = "block"
    back_btn_elem.style.display = "none"

})

favorite_btn_element.addEventListener('click', () => {
    const address = section_2.querySelector(".location span").innerText
    const city_name = address.split(",")[0]
    let all_favorites = JSON.parse(window.localStorage.getItem("favorite_cities"))
    if ((all_favorites != null || all_favorites != undefined) && all_favorites.includes(city_name)) {
        console.log(all_favorites, "before filter")
        all_favorites = all_favorites.filter(el => el !== city_name)
        console.log(all_favorites, "after filter")
        window.localStorage.setItem("favorite_cities", JSON.stringify(all_favorites))
        favorite_btn_element.className = "bx bx-heart favourite_btn"

    } else {
        const saved_cities = window.localStorage.getItem("favorite_cities")
        let cities = []
        if (saved_cities) {
            cities = JSON.parse(saved_cities)
        }
        console.log(typeof cities)
        cities.push(city_name)
        console.log(cities)
        window.localStorage.setItem("favorite_cities", JSON.stringify(cities))
        favorite_btn_element.className = "bx bxs-heart favourite_btn"
    }
    fetch_favorites()
    // `{
    //     "cities","sadasdsad"
    // }`
})