//const fs = require ('fs');

const {readFile} = require('fs/promises');
 //lectura del fichero asincrona
exports.load = async (filename) => { //async porque espera a un resultado, buf en este caso
    const buf = await readFile (filename);
    return JSON.parse(buf);
};

exports.max_temp = (cities) => {
    let maxTemp = cities[0].main.temp;
    cities.forEach((city) => {
        let temperatura = city.main.temp;
        if (temperatura > maxTemp) {
            maxTemp = temperatura;
        }
    });
    /*for let (i=0; i<cities.length; i++) {
        const temperatura = cities[i].main.temp;
        if (temperatura > maxTemp) {
            maxTemp = temperatura;
        }*/
    return maxTemp;
};

exports.min_temp = (cities) => {
    let minTemp = cities[0].main.temp;
    cities.forEach((city) => {
        let temperatura = city.main.temp;
        if (temperatura < minTemp) {
            minTemp = temperatura;
        }
    });
    return minTemp;
};

exports.max_temp_min = (cities) => { //maxima temperatura minima
    let maxMinTemp = cities[0].main.temp_min;
    cities.forEach((city) => {
        let tempMin = city.main.temp_min;
        if (tempMin > maxMinTemp) {
            maxMinTemp = tempMin;
        }
    });
    return maxMinTemp;
    
};

exports.min_temp_max = (cities) => {
    let minMaxTemp = cities[0].main.temp_max;
    cities.forEach((city) => {
        let tempMax = city.main.temp_max;
        if (tempMax < minMaxTemp) {
            minMaxTemp = tempMax;
        }
    });
    return minMaxTemp;
};

exports.average_temp = (cities) => {
    let suma = 0;
    cities.forEach((city) => {
        suma += city.main.temp;
    });
    return suma / cities.length;
    //otra forma:
    /*let numeroDeCiudades = cities.length;
    let valorInnicialAcumulado = 0;
    let sumaTemperaturas = cities.reduce((temperaturaAcumulada, ciudad) => {
        let temperatura = ciudad.main.temp;
        return temperaturaAcumulada + temperatura;
    }, valorInnicialAcumulado);
    };
    return sumaTemperaturas / numeroDeCiudades;*/
    
    
};

exports.warmer_average_temp = (cities) => { //devuelve un array con el nombre de las ciuades que tienen una temperatura mayor a la media
    let tempMedia = exports.average_temp(cities);
    let ciudadesMasCalientesQueMedia = cities.filter((ciudad) => {
        let temperatura = ciudad.main.temp;
        return temperatura > tempMedia;
    });
    let nombresCiudades = ciudadesMasCalientesQueMedia.map((ciudad) => ciudad.name);
    return nombresCiudades; 
};

exports.max_north = (cities) => { //devuelve el nombre de la cuidad situada mas al norte
    let ciudadMasNorte = cities[0];
    cities.forEach((ciudad) => {
        let latitud = ciudad.coord.lat;
        if (latitud > ciudadMasNorte.coord.lat) {
            ciudadMasNorte = ciudad;
        }
    });
    return ciudadMasNorte.name;
}; 

exports.max_south = (cities) => {
    let ciudadMasSur = cities[0];
    cities.forEach((ciudad) => {
        let latitud = ciudad.coord.lat;
        if (latitud < ciudadMasSur.coord.lat) {
            ciudadMasSur = ciudad;
        }
    });
    return ciudadMasSur.name;    
};

exports.gravity_center = (cities) => {
    let numeroDeCiudades = cities.length;
    let valorInicialAcumulado = {lat: 0, lon: 0};

    let totalLon= cities.reduce((longAcumulada, ciudad) => {
        return longAcumulada += ciudad.coord.lon;
    }, valorInicialAcumulado.lon);
    
    let totalLat= cities.reduce((latAcumulada, ciudad) => {
        return latAcumulada += ciudad.coord.lat;
    }, valorInicialAcumulado.lat);
    
    let mediaLon = totalLon / numeroDeCiudades;
    let mediaLat = totalLat / numeroDeCiudades;

    return {lat: mediaLat, lon: mediaLon};

    //otra forma:
    /*let sumaLatitud = 0;
    let sumaLongitud = 0;
    cities.forEach((ciudad) => {
        sumaLatitud += ciudad.coord.lat;
        sumaLongitud += ciudad.coord.lon;
    });
    let latitudMedia = sumaLatitud / cities.length;
    let longitudMedia = sumaLongitud / cities.length;
    return {lat: latitudMedia, lon: longitudMedia};*/
};


const diferencia = (cities, ciudad) => {
    let mediaLon = exports.gravity_center(cities).lon;
    let mediaLat = exports.gravity_center(cities).lat;
    let lonCiudad = ciudad.coord.lon;
    let latCiudad = ciudad.coord.lat;
    let diferenciaLon = Math.abs(lonCiudad - mediaLon);
    let diferenciaLat = Math.abs(latCiudad - mediaLat);

    return Math.sqrt(Math.pow(diferenciaLon, 2) + Math.pow(diferenciaLat, 2));
};
exports.closest_GC = (cities) => { //Devuelve el nombre de la ciudad más cercana al centro de gravedad.
    let distanciaMin = diferencia(cities, cities[0]);
    let ciudadMasCercana = cities[0];
    cities.forEach((ciudad) => {
        let distancia = diferencia(cities, ciudad);
        if (distancia < distanciaMin) {
            distanciaMin = distancia;
            ciudadMasCercana = ciudad;
        }
    });
    return ciudadMasCercana.name;
};

//extra
exports.citiesWarmerThanTemp=(cities, temp) => { //Devuelve un array con el nombre de las ciudades que tienen una temperatura mayor a la temperatura dada.
    let warmerCities = cities.filter((ciudad) => {
        return ciudad.main.temp > temp;
    });
    console.log(warmerCities);
    let warmerCitiesNames = warmerCities.map((ciudad) => {
        return {
            name: ciudad.name,
            temp: ciudad.main.temp
        }
    });
    return warmerCitiesNames;
};
const getDiferenciaTempYFeeLike= (ciudad) => {
    return ciudad.main.temp - ciudad.main.feels_like;
};

exports.ciudadGreatestTempDiff = (cities) => { //Devuelve el nombre de la ciudad con mayor diferencia entre temperatura y feels_like.       
    let citiesGreatestDiferrence = cities[0];
    let greatestsTempDiff = getDiferenciaTempYFeeLike(cities[0]);

    cities.forEach((ciudad) => {
        let currentCityDiff = getDiferenciaTempYFeeLike(ciudad);
        if (currentCityDiff > greatestsTempDiff) {
            greatestsTempDiff = currentCityDiff;
            citiesGreatestDiferrence = ciudad;
        }
    });

    //comprobar resultados ordenando las cuidades en un objeto
    let parametrosCiudades = cities.map((ciudad) => {
        return {
            name: ciudad.name,
            temp: ciudad.main.temp,
            feels_like: ciudad.main.feels_like,
            diff: ciudad.main.temp - ciudad.main.feels_like
        }
    }).sort((a, b) => b.diff - a.diff); // orden descendente
    console.log(parametrosCiudades);

    return {
        name: citiesGreatestDiferrence.name,
        temp: citiesGreatestDiferrence.main.temp,
        feels_like: citiesGreatestDiferrence.main.feels_like,
        diff: greatestsTempDiff
    };
};





