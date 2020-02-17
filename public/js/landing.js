function loadingAnimationFunction() {
    myVar = setTimeout(showPage, 50);
}

function showPage() {
    document.getElementById("loader").style.display = "none";
    document.getElementById("loadingAnimationWrapper").style.display = "block";
}        