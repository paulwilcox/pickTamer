window.addEventListener("contextmenu", function(event) {

  if(!event.ctrlKey)
    return;

  var x = event.clientX;
  var y = event.clientY;
  let img = 
    document.elementsFromPoint(x,y)
    .find(el => el.tagName == "IMG");

  if (!img) 
    return;  

  event.preventDefault();

  let cm = document.querySelector("#pickTamerContextMenu");
  Object.assign(cm.style, {
    top: event.pageY + "px",
    left: event.pageX + "px",
    display: "block"
  });

  let cmItem = cm.querySelector("#viewImage");
  cmItem.href = img.src;

});

document.addEventListener("mousedown", hideConextMenu)
document.addEventListener("keydown", event => {
  if (event.key === "Escape") 
    hideConextMenu(event);
});

function hideConextMenu (event) {
  let contextMenu = document.querySelector("#pickTamerContextMenu");
  // Check if the context menu is open and the click did not occur inside the context menu
  if (contextMenu && (!event || !contextMenu.contains(event.target))) {
    contextMenu.style.display = "none";
  }
}

window.onload = function() {

  let div = document.createElement("div");
  div.id = "pickTamerContextMenu";
  Object.assign(div.style, {
    position: "absolute",
    zIndex: 9999,
    top: 0,
    left: 0,
    backgroundColor: "white",
    border: "1px solid black",
    padding: "10px",
    display: "none"  
  });
  
  let item = document.createElement("a");
  Object.assign(item, {
    id: "viewImage",
    textContent: "View Image",
    href: "https://www.google.com",
    target: "_blank"
  })
  div.appendChild(item);
  
  document.body.appendChild(div);

};
