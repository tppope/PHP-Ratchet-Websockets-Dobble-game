let socket;
addEventListener('load', () => {
    $("#playground").hide();
    $("#waiting-screen").hide();
    $("#already-start-info").hide();
    socket = new WebSocket('wss://wt122.fei.stuba.sk/ws/:9000');
    socket.onopen = function (e){
        console.log("Connection established!");
    }
    socket.onclose = function (){
        console.log("disconnected");
    }
    socket.onmessage = function (e){
    if(~((e.data).indexOf("resetCount"))){
        disabledPlayerCount(0);
        hideWaiting();
    }
    else if (~((e.data).indexOf("countWasSet")))
        disabledPlayerCount((JSON.parse(e.data)).countWasSet);
    else if(~((e.data).indexOf("waiting")))
        showWaiting();
    else if(~((e.data).indexOf("alreadyStart"))){
        gameAlreadyStartShow();
        setTimeout(gameAlreadyStartHide,5000);
    }
    else if(~((e.data).indexOf("owner"))){
        $("#exit").show();
    }
    else
        showPictures(JSON.parse(e.data));
    }
});

function deletePlayerCount(){
    $("#exit").hide();
    socket.send("deletePlayerCount");
}
function gameAlreadyStartShow(){
    let alreadyStartInfo = $("#already-start-info");
    alreadyStartInfo.show();
    alreadyStartInfo.css("opacity",0.8);
}
function gameAlreadyStartHide(){
    let alreadyStartInfo = $("#already-start-info");
    alreadyStartInfo.css("opacity",0);
    setTimeout(hideAlreadyStartInfo,300);

}
function hideAlreadyStartInfo(){
    $("#already-start-info").hide();
}
function startGame(){
    if (checkFormValidation()) {
        let startInfo = ["start",Number($("#player-count").val()),$("#nickname").val()]
        socket.send(JSON.stringify(startInfo));
    }
}
function showWaiting(){
    let playgroundLogin = $("#playground-login");
    playgroundLogin.addClass("set-blur");
    $("#waiting-screen").show();
}
function hideWaiting(){
    let playgroundLogin = $("#playground-login");
    playgroundLogin.removeClass("set-blur");
    $("#waiting-screen").hide();
}
function showGame(){
    showWaiting();
    countdownPlay();
    setTimeout(showGamePlayGround,3000);
}
function showGamePlayGround(){
    let playgroundLogin = $("#playground-login");
    playgroundLogin.removeClass("set-blur");
    playgroundLogin.hide();
    $("#waiting-screen").hide();
    $("#playground").show();
}
function countdownPlay(){
    $("#exit").hide();
    $("#waiting-text").hide();
    let countdown = $("#countdown");
    countdown.show();
    countdown.get(0).play();
}

function disabledPlayerCount(count){
    let playerCount = $("#player-count");
    if (count > 0){
        playerCount.val(count);
        playerCount.prop("disabled",true);
        playerCount.addClass("is-invalid");
    }
    else {
        playerCount.prop("disabled",false);
        playerCount.removeClass("is-invalid");
    }
}
function showPictures(pictures){
    if (pictures.start)
        showGame();
    $("#cardCount").text(pictures.cardCount + 1);
    if (pictures.correctPicture)
        showCorrectPicture(pictures.correctPicture)

    let leftCard = $("#left-card");
    let rightCard = $("#right-card");
    leftCard.empty();
    rightCard.empty();
    showPicturesInTheCard(pictures.old,rightCard);
    if(pictures.new)
        showPicturesInTheCard(pictures.new,leftCard)
    else
        showResult(pictures.players,leftCard);
}
function showResult(players,leftCard){
    $("#cardCount").text(0);
    leftCard.append(createScoreTable());
    let tbody = $("#score");
    for(let key in players){
        tbody.append(createScoreRow(key,players[key]));
    }
    doSort();
    $("#score-table").show();
    leftCard.css("transform","rotate(0turn)");
    $("#refresh").show();
}

function createScoreTable() {
    let div = document.createElement("div");
    let table = document.createElement("table");
    $(div).attr("id","score-table");
    $(table).addClass("table table-sm");
    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");
    $(tbody).attr("id","score");
    let tr = document.createElement("tr");
    let thName = document.createElement("th");
    let thScore = document.createElement("th");
    $(thName).text("Prezývka");
    $(thScore).text("Skóre");
    $(thScore).attr("id","score-sort");
    tr.append(thName,thScore);
    thead.append(tr);
    table.append(thead,tbody);
    div.append(table);
    return div;
}
function createScoreRow(name, score){
    let tdName = document.createElement("td");
    let tdScore = document.createElement("td");
    $(tdName).text(name);
    $(tdScore).text(score);
    let tr = document.createElement("tr");
    tr.append(tdName,tdScore)
    return tr;

}
function showPicturesInTheCard(pictures,card){
    // $("#right-card-case").css("left","100vw");
    // setTimeout(removeRightCardCase,500);
    // setTimeout(setLeftCardCaseAsRight,510);
    $.each(pictures,function (index){
        let picture = createImage(this,index)
        card.append(picture);
    })
    card.css("transform","rotate("+(Number((Math.random()).toFixed(2)))+"turn)");
}
// function removeRightCardCase(){
//     $("#right-card-case").remove();
// }
// function setLeftCardCaseAsRight(){
//     $("#left-card-case").prop("id","right-card-case");
// }
function showCorrectPicture(correctPicture){
    let img = createElementImg(correctPicture);
    $(img).css("max-height","100%");
    let divCorrectPicture = $("#correct-picture");
    divCorrectPicture.empty();
    divCorrectPicture.append(img);
    divCorrectPicture.css("right","0");
    setTimeout(hideImage,2000);

}
function createImage(picture,index){
    let img = createElementImg(picture)
    $(img).css("height",(Number((Math.random()*5)+13).toFixed(2))+"%");
    $(img).css("transform","rotate("+(Number((Math.random()).toFixed(2)))+"turn)");
    setPosition($(img),index);

    $(img).on("click",function (){
        socket.send(picture);
    })
    return img;
}

function hideImage(){
    $("#correct-picture").css("right","-300px");
}

function createElementImg(picture){
    let img = document.createElement("img");
    $(img).attr("alt",picture);
    $(img).attr("src","resources/dobble/"+picture+".png");
    img.draggable = false;
    return img;
}

function setPosition(img,index){
    if (index %7 === 0){
        if (index)
            $(img).css("top","77%");
        else
            $(img).css("top","8%");
        $(img).css("left",(Number((Math.random()*30)+25).toFixed(2))+"%");
    }
    else if(index < 7){
        if (index < 4)
            $(img).css("top",(Number(((Math.random()*3)+25).toFixed(2)))+"%");
        else
            $(img).css("top",(Number(((Math.random()*5)+50).toFixed(2)))+"%");

        if (index === 1 || index === 4)
            $(img).css("left",(Number(((Math.random()*3)+8).toFixed(2)))+"%");
        else if(index === 2 || index === 5)
            $(img).css("left",(Number(((Math.random()*3)+34).toFixed(2)))+"%");
        else
            $(img).css("left",(Number(((Math.random()*3)+63).toFixed(2)))+"%");
    }
}
function checkFormValidation(){
    let inputs = $("#game-form").find("input");
    for (let i = 0; i < inputs.length; i++) {
        if (!inputs.get(i).checkValidity())
            return false;
    }
    return true;
}

function doSort(){
    const getCellValue = (tr, idx) => parseInt(tr.children[idx].innerText) || parseInt(tr.children[idx].textContent);
    const comparer = (idx) => (a, b) => ((v1, v2) =>
            v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2,'sk')
    )(getCellValue(b, idx), getCellValue(a, idx));

    const tbody = document.getElementById("score");
    const th = document.getElementById("score-sort");
    Array.from(tbody.querySelectorAll('tr'))
        .sort(comparer(Array.from(th.parentNode.children).indexOf(th)))
        .forEach(tr => tbody.appendChild(tr) );
}


