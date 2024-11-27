function setActiveLink(event) {
    // Get all navigation links
    const links = document.querySelectorAll("nav ul li a");

    // Remove 'active' class from all links
    links.forEach(link => link.classList.remove("active"));

    // Add 'active' class to the clicked link
    const clickedLink = event.target;
    clickedLink.classList.add("active");

}

