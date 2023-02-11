const section_1=document.querySelector(".inputs")
const section_2=document.querySelector(".weather")
const info_txt=document.querySelector('.info-txt')
const input=document.querySelector("input")
const locationbtn=document.querySelector('button')
function requestApi(city_name){
    let url="https://api.openweathermap.org/data/2.5/weather?q="+city_name+"&appid=6bd517b784a911528368f56d20a8d509"
    info_txt.classList.add('pending')
    info_txt.innerText="Loading..."
    const data=fetch(url).then(res=>res.json()).then(data=>{
        console.log(data)
        showResults(data)
    }).catch((e)=>{
        info_txt.classList.replace('pending',"error")
        info_txt.innerText="Something went wrong"
    })
}

input.addEventListener('keyup',function(e){
    console.log(input.value)
    if(e.key==="Enter"&& input.value!==''){
        requestApi(input.value)
    }
})
locationbtn.addEventListener('click',function(e){
    if(navigator.geolocation){
        // This needs two callbacks you can eitehr write it as anonymous function here like getCurrentPosition(function(){

        // },function (){})
        navigator.geolocation.getCurrentPosition(onSuccess,onFailure)
    }
})
function onSuccess(geo){
    console.log("success",geo)
    const lat=geo.coords.latitude;
    const lon=geo.coords.longitude;
    let url="https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&appid=6bd517b784a911528368f56d20a8d509"
    
    info_txt.classList.add('pending')
    info_txt.innerText="Loading..."
    const data=fetch(url).then(res=>res.json()).then(data=>{
        console.log(data)
        showResults(data)
    }).catch((e)=>{
        info_txt.classList.replace('pending',"error")
        info_txt.innerText="Something went wrong"
    })
}
function onFailure(){
    console.log("Failed to get location")
    info_txt.classList.replace('pending',"error")
    info_txt.innerText="Location permission was denied go to settings and allow location access"
}
function showResults(data){
    if(data.cod==='404'){
        console.log("not found")
        info_txt.classList.replace("pending","error")
        info_txt.innerText=input.value+" isn't a valid city"
    }else{
        const name=data.name;
        const country=data.sys.country;
        const humidity=data.main.humidity;
        const feels_like=data.main.feels_like;
        const temprature=data.main.temp;
        const description=data.weather[0].description
        console.log(name,humidity,feels_like,temprature)
        section_2.querySelector(".temp .deg").innerText=temprature;
        section_2.querySelector(".location span").innerText=name+", "+country;
        section_2.querySelector('.humidity p').innerText=humidity;
        section_2.querySelector('.numb').innerText=description;
        section_2.querySelector('.numb-1').innerText=feels_like;
        info_txt.classList.remove("pending","error")
        info_txt.innerText=""
        input.value=""

    }
}