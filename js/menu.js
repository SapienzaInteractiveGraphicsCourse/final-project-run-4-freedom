var selectedScenario = false;
var selectedVehicle = false;
var buttons;
var i;

function onLoading() {
    setCookie("env", "");
    setCookie("car", "");
    buttons = document.getElementsByClassName('vButton');
    var env = getCookie("env").toLowerCase();
    var dif = getCookie("car");
    if (env != '') {
        document.getElementById(env + "Btn").style.backgroundColor = 'green';


    }
    if (dif != '')
        document.getElementById(dif + "Btn").style.backgroundColor = 'green';
    if (env && dif) {
        setTimeout(function () {
            document.getElementById("startBtn").style.display = "inherit";
        }, 6000);

    }
}

/* Menu buttons */
function onClick(button, type) {
    if (type == 'env') {
        selectedScenario = true;
        buttons = document.getElementsByClassName('vButton');

        
        if (button != "forest") {
            /*
            if (getCookie("car") == "nathan")
                selectedVehicle = false;
            
            document.getElementById("characterTxt").style.display = "none";
            */
            for (i = 0; i < buttons.length; i++)
                buttons[i].removeAttribute("disabled");
        }
        else {
            for (i = 0; i < buttons.length; i++) {
                buttons[i].setAttribute("disabled", false);
                buttons[i].style.opacity = 0.1;
            }
            setCookie("car", "nathan");
            selectedVehicle = true;
            document.getElementById("characterTxt").style.display = "inherit";
        }
        buttons = document.getElementsByClassName('eButton');
        setCookie('env', button.toUpperCase());

    }
    else {
        selectedVehicle = true;
        buttons = document.getElementsByClassName('vButton');
        setCookie("car", button);
    }

    for (i = 0; i < buttons.length; i++)
        buttons[i].style.opacity = 0.1;
    document.getElementById(button + "Btn").style.opacity = 1;
    console.log(selectedScenario + " e " + selectedVehicle);

    if (selectedScenario && selectedVehicle)
        document.getElementById("startBtn").style.display = "inherit";
    else
        document.getElementById("startBtn").style.display = "none";

}

function playGame() {
    window.location.replace("index.html");
}

/* Cookie management */
function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue;
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

/* */

function onTutorial() {
    document.getElementById("overlay").style.display = "block";
}

function offTutorial() {
    document.getElementById("overlay").style.display = "none";
}

window.onload = function () {
    onLoading();
}