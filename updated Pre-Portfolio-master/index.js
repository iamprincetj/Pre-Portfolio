let makePage = {}

let getBody = document.querySelector("#container");
let items = []
let getWrapper = document.querySelector("#wrapper");
let getPaginate = document.querySelector("#paginate");
let movie_list = [];
let rows = 6;
let getBackBtn;
let getInput = document.querySelector("#input");
let getPrevBtn = document.querySelector("#btn-prev");
let getNextBtn = document.querySelector("#btn-next");
let getNumOfPage = sessionStorage.getItem("numOfPage");
let currPage = sessionStorage.getItem("currentPage");
let currentPage;
let getBackBtn1 = document.querySelector("#back-btn");


getBackBtn1.style.visibility = "hidden";

let getSearchItem = document.querySelector("#input");
let getSearchBtn = document.querySelector(".search-btn");



getSearchBtn.addEventListener("click", ()=> {
    sessionStorage.setItem("searchItem", getSearchItem.value);
    let searchItem = sessionStorage.getItem("searchItem");
    if (searchItem) {
        window.location.href = "index.html";
    }else{
        window.location.href = "404.html";
    }
})


getBackBtn1.addEventListener("click", ()=> {
    location.reload();
});


if (currPage && currPage <= getNumOfPage){
    currentPage = currPage
}else {
    currentPage = 1;
}


//This is an object that contain all our functions of the page
// As key, Value pairs
makePage = {
    // The Display funcion is used to call all useful function. Calling two or more function just by calling one is cool
    //It's killing two birds with one stone 😁
    Display: function () {
        //This calls the getItems() that which returns a Promise, the ".then" is used to output the return value of the Promise returned.
        //NB. The 'this' means we are referring to a function that belongs to this "makePage" Object.
        this.getItems().then((result)=> {
            // We need the "result" because that is what is returned from the getItem() which returns a Promise. A Promise return is not like a regular return so we needed the .then to get the return value.
            // So we called the DisplayList function of THIS object which takes 4 parameters, one being the first index of the returned Promise. Because it returns an Array/List
            this.DisplayList(result[0], getWrapper, rows, currentPage);
        });
        // This calls the Paginate() of THIS Object
        this.Paginate();

        //end of the Display() of THIS makePage Object.
    },

    // THIS Object getItems() is an async Function that's why you see the async b4 the function declaration
    getItems: async ()=> {

        let searchItem = sessionStorage.getItem("searchItem");

        let itemUrl = `https://api.themoviedb.org/3/search/movie?primary_release_date.gte=2010-01-01&api_key=5bc61b6bb6be8659b76261c169094ea9&query=${searchItem}`

        

        // We are making a request to our movie api (kinda stored the value in a file, but if you change in to our movie api it will still work) using the await keyword
        // We are able to use await because this is an asynchronous function
        // the await keyword means it waits till the request is done because we are making a request which can take time to repond
        //const request = await fetch(`./data/data_${searchItem}.json`);
        //const request = await fetch(itemUrl);
        const request_id = await fetch(itemUrl);
        //const response = await request.json(); //this give us our response in json format
        const response_id = await request_id.json();

        
        

        // Our returned json (key, value pair file) formatted response has a key named "results" which has a value that is a list #check our json file for confirmation
        
        item_id = response_id.results;
        //console.log(item_id);

        let movie_id;

        for (let i in item_id) {
            if (i == 0) {
                movie_id = item_id[i].id
            }
        };


        alert(movie_id)

        if (movie_id) {
            const request = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}/recommendations?primary_release_date.gte=2010-01-01&api_key=5bc61b6bb6be8659b76261c169094ea9`);
            const response = await request.json();
            items_list = response.results;
        }else {
            window.location.href = "404.html";
        }



        //alert(`${item_id[0].title} ${movie_id} ${item_id}`);

        
        //NB. Our response.result value which is a list containing another dictionary in Python/ object in Javascript (key, value pair datatype) separated by comma. It's a LIST OF OBJECTS / DICTIONARIES.

        let items_date = {}; // This is to store our items_list.result[index] release_date(key) values, which are strings. NB. the INDEX is because we will be looping through our LIST OF OBJECTS to get each movies details.

        let items_title = []; // This is to get the title of each movie
        let items_overview = {};
        let items_image = {};
        let movieId = {};
        let each_item; // this is for the overview of each movie.

        //So this is the loop i was talking bout, going through our LIST OF OBJECTS.
        console.log(items_list);
        if (items_list.length != 0) {
            for (let i in items_list) {
                each_item = items_list[i]; // stores each items details in a variable.

                movieTitle = each_item.title; // stores each movies titles.

                items_title.push(movieTitle); // appends all movies titles into a list.

                items_date[movieTitle] = each_item.release_date; // guess that 😁.

                items_overview[movieTitle] = each_item.overview; // and this

                items_image[movieTitle] = each_item.poster_path;
                movieId[movieTitle] = each_item.id;

            };
    }else {
        window.location.href = "404.html";
    }

        // This is to calculate our number of page due to the length of movie title list divide by the number of movies we wanna show on each page
        let page = Math.ceil(items_title.length / rows);


        // this stores our number of pages in sessionStorage so we can use it somewhere else without using the "this.getItem().then" stuff get it?
        sessionStorage.setItem("numOfPage", page);

        //this returns 4 important things we need from this function
        return [items_title, items_date, items_overview, page, items_image, movieId];

        // end of THIS OBJECTS getItem().
    },


    // This is for Displaying our list per page #5 or any amount it doesn't matter.
    DisplayList: function (items, wrapper, row, page) {

        if (wrapper) { // This check if our wrapper (the div to house our Movie Titles to display on each page) is not empty, if it's not it makes it empty. This is because on every page we need an empty wrapper, this ensure our movie list doesn't stay on top of each other

            wrapper.innerHTML = ""; 
        };

        // This decrements our current page value, you will see the reason later on.
        page--;


        // This is the index start of our list on each page
        // So if page is 1 (the page-- up there ☝️) means it's now zero and row is constant

        /*  So page = 0, perPage = 0 * 5 = 0 # we start from index zero of the list displaying 5 items
                page = 1, perPage = 1 * 5 = 5 # we start from index zero of the list displaying 5 items and so on
        
        */
        perPage = row * page;

        //alert(`perpage = ${perPage} row =${row} page= ${page}`);
        
        for (let i = perPage; i < row+perPage; i++) { //this makes sure that the specified number of movie items are displayed. 
            itemDiv = document.createElement("div");
            itemDiv.classList.add("item");
            itemDiv.textContent = items[i];
            if (itemDiv.textContent) {
                wrapper.appendChild(itemDiv);
                movie_list.push(itemDiv);
            }
        }

        this.getItems().then((result) => { //we are doing this so when you click on a movie it changes to the details of the selected movie.

           let res_date = result[1];
           let res_overview = result[2];
           let res_image = result[4];
           let movie_id = result[5];

            for (let i in movie_list) {
                movieDiv = movie_list[i];
                movie_list[i].addEventListener("click", ()=> {
                    getBackBtn1.style.visibility = "visible";
                    movieName = movie_list[i].textContent;
                    newContent =  `<div class="div_title">Title: ${movieName}</div><div class="div_date">Release date: ${res_date[movieName]}</div>
                    <img class="movie-img" src= https://image.tmdb.org/t/p/w185/${res_image[movieName]}><div class="div_overview">Overview: ${res_overview[movieName]}</div><a href="https://www.themoviedb.org/movie/${movie_id[movieName]}" class="watch-btn" title="Stream on TMDB" target="_blank">Watch</a>`;
                    getBody.innerHTML = newContent;
                });
            };

        });

    },

    creatBtn: function (numPage) {
            //this is a special function for creating our buttons
            let btn = document.createElement("Button");
            btn.classList.add("btn");
            btn.textContent = numPage;
    
            // we do this to add a special class name "active" which makes our current button show colors
            if (numPage == currentPage) btn.classList.add("active");
            return btn;
    },

    Paginate: function () {
        // The very special function which almost everything is done
        this.getItems().then((result)=> {
            page = result[3];  // we first of all get the number of button that needs to be created.


            for (let i = 1; i < page+1; i++){//then we loop through them creating our button
                let button = this.creatBtn(i);
                getPaginate.appendChild(button);// Then appending each button to the div created in html, which displays our buttons down there
            };


            let buttons = document.querySelectorAll(".btn"); // this stores all our button which the class name "btn" into a list


            getPrevBtn.addEventListener("click", ()=> { // this is our previous button event listener so when it's clicked
                if (currentPage > 1) { // checks if the current page we are in is > 1, because if it' less that one or == 1 we want to stop going back

                    --currentPage; // if it's true we decrement our current page by one
                }
                sessionStorage.setItem("currentPage", currentPage); // then store it in sessionStorage

                this.DisplayList(result[0], getWrapper, rows, currentPage); //then we want to display the list on that specific page

                this.btnColor(buttons[currentPage-1], buttons); // then put the color on the right button again
            });
            

            getNextBtn.addEventListener("click", ()=> { // this is our next button event listener so when it's clicked
                if (currentPage < page) { // checks if the current page we are in is < the number of pages we have, because if it' greater that the number of pages we have we want to stop going forward
                    currentPage++; // if it's true we increment our current page by one
                }
                sessionStorage.setItem("currentPage", currentPage); // then store it in sessionStorage
                this.DisplayList(result[0], getWrapper, rows, currentPage); //then we want to display the list on that specific page

                this.btnColor(buttons[currentPage-1], buttons); // then put the color on the right button again

            });


            for(let i = 0; i < buttons.length; i++) {
                // now we are looping through our button list, told you it will be useful😁
                buttons[i].addEventListener("click", ()=> {
                    // then for each of the buttons we are make an event listerner of when it's clicked

                    this.btnColor(buttons[i], buttons); // then calling our function that colors our button when any of them is clicked # later implemented... hold on
                    this.DisplayList(result[0], getWrapper, rows, i+1); //Now we are calling our displayList depending on which button is clicked
                    // so if you click on button 2 we want page 2's list to show not page 1's, Right? Well that's what this guy those

                    sessionStorage.setItem("currentPage", i+1); // now am storing our current page in sessionStorage so when we are in page 2 if we refresh the page it still stays in page 2 not otherwise.


                    currentPage = sessionStorage.getItem("currentPage");//this set or current page to our exact current page when any button is clicked
                });
            };

        });
    },
    
    btnColor: function (btnNum, btnClass) {
        // Now the button color function i told about, takes two parameters. First, the button's number second our button list we created up there


        // So we loop through it
        for (let i = 0; i < btnClass.length; i++) { 
            btnClass[i].classList.remove("active"); //then remove any button in the list that has the "active" class which gives it color
        }

        //then we give the button we click the "active" class so it now have the color
        btnNum.classList.add("active");
        // get it?
    }
};

makePage.Display();    