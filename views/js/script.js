let items = document.querySelectorAll('.Upcomingcarousel .Upcomingcarousel-item')
items.forEach((el) => {
    const minPerSlide =4
    let next = el.nextElementSibling
    for (var i = 1; i < minPerSlide; i++) {
        if (!next) {
            // wrap carousel by using first child
            next = items[0]
        }
        let cloneChild = next.cloneNode(true)
        el.appendChild(cloneChild.children[0])
        next = next.nextElementSibling
    }
})







// script for search


$(document).ready(function () {
    // Search for contacts
    $("#searchContacts").on("keyup", function () {
        let value = $(this).val().toLowerCase();
        $("#contactTable tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });
});



// search  movie quer

$(document).ready(function () {
    // Search functionality
    $("#myInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();  // Get the search input
        $(".movie-card").filter(function () {
            // Get the movie name from the <h4> inside each .movie-card div
            var movieName = $(this).find(".movie-title").text().toLowerCase();
            $(this).toggle(movieName.indexOf(value) > -1);  // Hide or show based on match
        });
    });
});