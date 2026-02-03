addEventListener("keydown", (e) => {
    const marker = document.querySelector(".marker");
    if (marker === null) return;
    const x = Number(window.getComputedStyle(marker).gridColumn);
    const y = Number(window.getComputedStyle(marker).gridRow);
    if (e.key == "d") {
        marker.style.gridColumn = x+1;
    }
    if (e.key == "a") {
        marker.style.gridColumn = x-1;
    }
    if (e.key == "s") {
        marker.style.gridRow = y+1;
    }
    if (e.key == "w") {
        marker.style.gridRow = y-1;
    }
})