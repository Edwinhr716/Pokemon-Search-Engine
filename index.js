//PokeAPI's list of the Undiscovered Egg group is missing the following pokemon
let legendariesNotEgg = ["melmetal","zarude","deoxys-normal","manaphy","shaymin-land","landorus-incarnate", "meloetta-aria"]

let genLowerLimit = {
    I:1,
    II:152,
    III:252,
    IV:387,
    V:494,
    VI:650,
    VII:722,
    VIII:810
}

let genUpperLimit = {
    I:151,
    II:251,
    III:386,
    IV:493,
    V:649,
    VI:721,
    VII:809,
    VIII:898
}



$("#menuLabel").click(async ()=>{
    $(".listClass").fadeToggle(500)
    await initializeTypeList()
})

$("#aboutLabel").click((e)=>{
    $(".aboutPage").show()
    $(".listClass").hide()
    $(".genListClass").hide()
    $(".pokemonTableClass").hide()
    $(".singlePokemonTableClass").hide()    
    e.preventDefault()

})

$(".listClass").hover(()=>{
    $(".listClass").show()
    $(".genListClass").hide()
    $("#typeListClass").hide()
})


$("#generationSelection").hover(()=>{
    $(".genListClass").show()
    $("#typeListClass").hide()
})

$(".genListClass").hover(()=>{
    $(".genListClass").show()
    $("#typeListClass").hide()
})

$("#resetButton").click(()=>{
    $(".listClass").hide()
    $(".genListClass").hide()
    $("#typeListClass").hide()
})

$(".gen").click( async function(e){
    console.log(this.innerHTML)
    let pokemon = await setPokemonGenerations(this.innerHTML)
    $(".aboutPage").hide()
    setPokemonTable(pokemon)
    hideTopMenus()
    e.preventDefault()
    
})

$("#typeSelection").hover(()=>{
    $("#typeListClass").show()
    $(".genListClass").hide()
})

$("#typeListClass").hover(()=>{
    $("#typeListClass").show()
    $(".genListClass").hide()
})
/*
$("#legendariesSelection").hover(()=>{
    $("#typeListClass").hide()
    $(".genListClass").hide()
})

$("#pseudo-legendariesSelection").hover(()=>{
    $("#typeListClass").hide()
    $(".genListClass").hide()
})
*/
let legendariesSelection = document.getElementById("legendariesSelection")
legendariesSelection.addEventListener('click', async (e)=>{
    await getDataNew("Legendaries")
    $(".aboutPage").hide()
    //hideTopMenus()
    e.preventDefault()
})


let pseudo_legendariesSelection = document.getElementById("pseudo-legendariesSelection")
pseudo_legendariesSelection.addEventListener('click', async (e) =>{
    await getDataNew("Pseudo-Legendaries")
    $(".aboutPage").hide()
    hideTopMenus()
    e.preventDefault()

})

$(document).on('keypress',async function(e) {
    if(e.which == 13) {
        let text = document.getElementById("searchBar").value
        if(text != ""){
            await setDataSingle(text)
            hideTopMenus()
            e.preventDefault()
        }
    }
});

const hideTopMenus = ()=>{
    $(".listClass").hide()
    $(".genListClass").hide()
    $("#typeListClass").hide()
}

const initializeTypeList = async ()=>{
    $("#typeListClass").empty()
    let divType = document.getElementById("typeListClass")
    let typeData = await fetchPokemonData("https://pokeapi.co/api/v2/type")
    let typeList = document.createElement("ul")
    typeList.id = "typeList"
    for(let i = 0; i < 18; i++){
        let type = document.createElement("li")
        let text = capitalizeFirstLetter(typeData["results"][i]["name"])
        type.className = "typeListItem"
        type.addEventListener('click', async function(e){
            let pokemon = await setPokemonTypes(this.innerHTML)
            setPokemonTable(pokemon)
            $(".aboutPage").hide()
            hideTopMenus()
            e.preventDefault()
        })
        text = document.createTextNode(text)
        type.appendChild(text)
        typeList.appendChild(type)
    }
    divType.appendChild(typeList)
}

const setPokemonTypes = async (input)=>{
    let type = input.toLowerCase()
    url ="https://pokeapi.co/api/v2/type/" + type
    let data = await fetchPokemonData(url)
    const pokemonURLs = new Array()
    const pokemonType = new Array()
    for(let i = 0; i < data["pokemon"].length; i++){
        pokemonURLs.push(data["pokemon"][i]["pokemon"]["url"])
    }

    for(let i = 0; i < pokemonURLs.length; i++){
        let responseData = await fetchPokemonData(pokemonURLs[i])
        let bst = 0
            for(let j = 0; j < 6; j++){
                bst+= parseInt(responseData["stats"][j]['base_stat'])
        }
        let pokemon = {
            id : responseData["name"], 
            sprite : responseData["sprites"]["front_default"], 
            bst : bst,
            type : returnTypeString(responseData["types"])
        }
        pokemonType.push(pokemon)
    }
    return pokemonType
}

const setPokemonGenerations = async (input)=>{
    let gen = input.split("Gen ")
    url = "https://pokeapi.co/api/v2/pokemon?limit=" + (genUpperLimit[gen[1]] - genLowerLimit[gen[1]]).toString() + "&offset=" + (genLowerLimit[gen[1]] - 1).toString()
    //console.log(url)
    let data = await fetchPokemonData(url)
    const pokemonURLs = new Array()
    const pokemonGen = new Array()
    for(let i = 0; i < data["results"].length; i++){
        pokemonURLs.push(data["results"][i]["url"])
    }
    for(let i = 0; i < pokemonURLs.length; i++){
        let responseData = await fetchPokemonData(pokemonURLs[i])
        let bst = 0
            for(let j = 0; j < 6; j++){
                bst+= parseInt(responseData["stats"][j]['base_stat'])
        }
        let pokemon = {
            id : responseData["name"], 
            sprite : responseData["sprites"]["front_default"], 
            bst : bst,
            type : returnTypeString(responseData["types"])
        }
        pokemonGen.push(pokemon)
    }
    return pokemonGen
}

const setDataSingle = async (pokemon) =>{

    $(".pokemonTableClass").hide()
    $(".singlePokemonTableClass").hide()
    $(".aboutPage").hide()
    let responseData = await fetchPokemonData('https://pokeapi.co/api/v2/pokemon/' + pokemon.toLowerCase())
        
        let data = responseData["stats"]
        
        document.getElementById("nameOfPokemon").innerHTML = capitalizeFirstLetter(responseData["name"])
        document.getElementById("spriteImage").src= responseData["sprites"]["front_default"]
        document.getElementById("typeBox").innerHTML = returnTypeString(responseData["types"])

        $("#abilitiesClass").empty()
        let div = document.getElementById("abilitiesClass")
        


        for(let i =0; i < responseData["abilities"].length; i++){
            let pElementName = document.createElement("h3")
            let pElementInfo = document.createElement("p")
            pElementInfo.id = "abilityInfo"
            pElementName.id = "abilityName"
            let abilityInfo = await fetchPokemonData(responseData["abilities"][i]["ability"]["url"])
            pElementName.innerHTML = capitalizeFirstLetter(abilityInfo["name"])
            pElementInfo.innerHTML = abilityInfo["effect_entries"][1]["effect"]

            div.appendChild(pElementName)
            div.appendChild(pElementInfo)
        }

        let table = document.getElementById("singlePokemonTable")
        
        if(table.rows.length > 1){
            for(let i = 6; i > 0; i--){
                table.deleteRow(i)
            }
        }
        
        for(let i = 0; i < 6; i++){
            let row = table.insertRow(-1)
            let stat = row.insertCell(0)
            let value = row.insertCell(1)
            stat.innerHTML = capitalizeFirstLetter(data[i]["stat"]["name"])
            value.innerHTML = data[i]["base_stat"]
            stat.id = "addedCellStat"
            value.id = "addedCellValue"
        }
    $(".singlePokemonTableClass").show()
}

async function getDataNew(index){
    let responseData = await fetchPokemonData('https://pokeapi.co/api/v2/pokemon?limit=898&offset=0')
    switch(index){
        case "Legendaries": 
            let pokemon = await getLegendariesNew(responseData, true)
            setPokemonTable(pokemon)
            break
        case "Pseudo-Legendaries":
            let pokemon2 = await getLegendariesNew(responseData, false)
            setPokemonTable(pokemon2)
            break
    }
}

//pokemon is array of objects
const setPokemonTable = (pokemon) =>{
    $(".pokemonTableClass").hide()
    $(".singlePokemonTableClass").hide()
    let table = document.getElementById("pokemonTable")
    if(table.rows.length > 1){
        for(let i = table.rows.length-1; i > 0; i--){
            table.deleteRow(i)
        }
    }

    for(let i = 0; i < pokemon.length; i++){

        let row = table.insertRow(-1)

        let imageCell = row.insertCell(0)
        let img = document.createElement("img")
        img.src = pokemon[i].sprite
        img.id = "spriteTableCell"
        imageCell.appendChild(img)


        let name = row.insertCell(1)
        let pElement = document.createElement("p")
        let text = capitalizeFirstLetter(pokemon[i].id)
        text = document.createTextNode(text)
        pElement.addEventListener("click" , async function(e){
            $(".aboutPage").hide()
            await openPokemonWindow(this)
            hideTopMenus()
            e.preventDefault()
        }, false)
        pElement.id = "pokemonName" + i.toString()
        pElement.appendChild(text)
        name.appendChild(pElement)
        
        let type = row.insertCell(2)
        let pElementType = document.createElement("p")
        pElementType.id = "typeCell"
        let text1 = pokemon[i].type 
        text1 = document.createTextNode(text1)
        pElementType.appendChild(text1)
        type.appendChild(pElementType)

        let bst = row.insertCell(3)
        bst.innerHTML = pokemon[i].bst
        bst.id = "bst"
    }
    $(".pokemonTableClass").show()
}


const openPokemonWindow = async (index)=>{
    let identity = index.id.toString()
    await setDataSingle(document.getElementById(identity).innerHTML)
}

const getLegendariesNew = async (data, legendary)=>{

    const hello = new Array()
    const pseudo = new Array()
    const noEgg = new Array()
    const legendaries = new Array()

    let newEggInfo = await fetchPokemonData('https://pokeapi.co/api/v2/egg-group/15')
    for(let i = 0; i < newEggInfo['pokemon_species'].length; i++){
        noEgg.push(newEggInfo['pokemon_species'][i]['name'])
    }

    for(let i = 0; i < 898; i++){
        hello.push(data["results"][i]["url"])
    }

    for(let i = 0; i < hello.length; i++){
        let responseData = await fetchPokemonData(hello[i])
        let bst = 0
            for(let j = 0; j < 6; j++){
                bst+= parseInt(responseData["stats"][j]['base_stat'])
            }
            if(bst === 600 && (!noEgg.includes(responseData["name"]) && !legendariesNotEgg.includes(responseData["name"]))){
                let pokemon = {
                    id : responseData["name"], 
                    sprite : responseData["sprites"]["front_default"], 
                    bst : bst,
                    type : returnTypeString(responseData["types"])
                }
                pseudo.push(pokemon)
            }else if(bst >= 580 && (noEgg.includes(responseData["name"]) || legendariesNotEgg.includes(responseData["name"]))){
                let pokemon = {
                    id : responseData["name"], 
                    sprite : responseData["sprites"]["front_default"], 
                    bst : bst,
                    type : returnTypeString(responseData["types"])
                }
                legendaries.push(pokemon)
            }
    }
    if(legendary){
        return legendaries
    }
    else{
        return pseudo
    }
}

async function fetchPokemonData(url){
    const response = await fetch(url)
    const pokemon = await response.json()
    return pokemon
}

const returnTypeString = (types) =>{
    let typeString = ""
    for(let i = 0; i < types.length; i++){
        typeString = typeString + capitalizeFirstLetter(types[i]["type"]["name"]) + " "
    }
    return typeString
}

const sendHttpRequest = (method, url)=>{
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url)
        xhr.responseType = 'json'

        xhr.onload = () => {
            if(xhr.status >= 400){
                reject(xhr.response)
            }else{
                resolve(xhr.response)
            }
        }

        xhr.onerror = () => {
            reject("Something went wrong!")
        }

        xhr.send()
    })
    return promise
}

const capitalizeFirstLetter = (string) =>{
    if(string === "hp"){
        return "HP"
    }else if(string == "special-attack"){
        return "Special-Attack"
    }else if(string === "special-defense"){
        return "Special-Defense"
    }
    return string.charAt(0).toUpperCase() + string.slice(1)
}

