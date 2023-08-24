let getSearchItem = document.querySelector("#search-item");
let getSearchBtn = document.querySelector("#search-btn");


getSearchBtn.addEventListener("click", ()=> {
    sessionStorage.setItem("searchItem", getSearchItem.value);
    window.location.href = "index.html";
});