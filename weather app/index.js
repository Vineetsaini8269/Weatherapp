console.log('ram ram ji');


// const API_KEY="64b70588ca3c17e13c41181c3f8236bb";

// function renderWeatherInfo(data){
//     // UI pe data lane ke liye code
//    let newPara =document.createElement('p');
//    newPara.textContent = `${data?.main?.temp.toFixed(2)} °C `;

//    document.body.appendChild(newPara);

// }

// async function showWeather(params) {
    

//     // API Call 
//     try{
//     let city ="indore";

//     const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
//     const data = await response.json();
//     console.log("weather data : => " , data );

//     renderWeatherInfo(data);
//     }
//     catch(e){
//         console.log("the data was not fetched");

//     }

    

//     // https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}&units=metric

// }

// async function getCustomWeatherDetails(params) {
// try{
//     let lati=17.6333;
//     let longi = 18.3333;
    
//     let  result =await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lati}&lon=${longi}&appid=${API_KEY}&units=metric`);
//     let data =await result.json();

//     console.log(data);
//     renderWeatherInfo(data);
//   }
//   catch(err){
//     console.log(" Error found" ,err);
//   }

    
// }


// // geolocation se apni location niklna 

// function getLocation(){
//     if(navigator.geolocation){
//         navigator.geolocation.getCurrentPosition(showPostion);
//     }
//     else{
//         console.log("no geolocation");
//     }
// }

// function showPostion(position) {
//     let lat=position.coords.latitude;
//     let long= position.coords.longitude;

//     console.log(lat);
//     console.log(long);


// }



const userTab =document.querySelector("[data-userWeather]");
const searchTab= document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoConatiner = document.querySelector(".user-info-container");

// intially variable needs

let oldTab = userTab;
const API_KEY = "64b70588ca3c17e13c41181c3f8236bb";
oldTab.classList.add("current-tab");
getFromSessionStorage();


function switchTab(newTab){
    if(newTab != oldTab){
        oldTab.classList.remove("current-tab");
        oldTab =newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            // kya search form wala container is invisble , if yes then make it visible
            userInfoConatiner.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // main pehle search wale tab pr visible tha ,ab weather tab visible krna ha 
            searchForm.classList.remove("active");
            userInfoConatiner.classList.remove("active");
            // ab me your weather tab me aa gya hu toh weather bhi display karna padega , so let's check local storage first 
            // for cordinates , if we have saved them there.  
            getFromSessionStorage();
            
        }
    }
}

userTab.addEventListener("click" ,() =>{
    // pass clicked tab as input parameter
    switchTab(userTab);

});

searchTab.addEventListener("click" , () => {
    // pass clicked tab as input parameter
    switchTab(searchTab);
});

// check if cordinates are already present in session storage
function getFromSessionStorage(){
    const localCordinates = sessionStorage.getItem("user-cordinates");
    if(!localCordinates){
        // agar local cordinates nahi mile
        grantAccessContainer.classList.add("active");
    }
    else {
        const cordinates =JSON.parse(localCordinates);
        fetchUserWeatherInfo(cordinates);
    }


}

 async function fetchUserWeatherInfo(cordinates){
    const {lat ,lon} =cordinates;
    // make grantcontainer invisble
    grantAccessContainer.classList.remove("active");
    // make loader visible 
    loadingScreen.classList.add("active");

    // API CALL
    try{
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
            );
            const data = await response.json();

            loadingScreen.classList.remove("active");
            userInfoConatiner.classList.add("active");
            renderWeatherInfo(data);

    }
    catch(err){
        loadingScreen.classList.remove("active");
        // hw


    }

}



function renderWeatherInfo(weatherInfo){
    // firstle we have fetch element

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[Data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    // fetch values in weather info object and put it UI element
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

}

function getLocation(){
    if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(showPostion);
    }
    else{
        // hw - show an alert for no geolocation support available
    }
}

function showPostion(position){
    const userCoordinates ={
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-cordinates" ,JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]")
grantAccessButton.addEventListener("click" , getLocation);


const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit" , (e) => {
    e.preventDefault();
    let cityName =searchInput.value;
    
    if(cityName === "") return ;
    else 
        fetchSearchWeatherInfo(cityName);
    

});

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoConatiner.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoConatiner.classList.add("active");
        renderWeatherInfo(data);

    }
    catch(err){
        // hW
        
    }
}







