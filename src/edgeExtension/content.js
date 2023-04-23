document.addEventListener("contextmenu", function(event) {

  let target = event.target;
  
  if (target.tagName !== "IMG") 
    return;

  event.preventDefault();

  let imageUrl = target.src;
  
  // Create your custom context menu
  let contextMenu = document.createElement("div");
  contextMenu.id = "pickTamerContextMenu";
  contextMenu.style.position = "absolute";
  contextMenu.style.top = event.pageY + "px";
  contextMenu.style.left = event.pageX + "px";
  contextMenu.style.backgroundColor = "white";
  contextMenu.style.border = "1px solid black";
  contextMenu.style.padding = "10px";
  
  let contextMenuItem = document.createElement("a");
  contextMenuItem.textContent = "View Image";
  contextMenuItem.href = imageUrl;
  contextMenuItem.target = "_blank";
  contextMenu.appendChild(contextMenuItem);
  
  document.body.appendChild(contextMenu);
  
});

document.addEventListener("mousedown", removeContextMenus)
document.addEventListener("keydown", event => {
  if (event.key === "Escape") 
    removeContextMenus(event);
});

function removeContextMenus (event) {

  let contextMenus = document.querySelectorAll("#pickTamerContextMenu");
  
  for(let contextMenu of contextMenus)
    // Check if the context menu is open and the click did not occur inside the context menu
    if (contextMenu && !contextMenu.contains(event.target)) {
      contextMenu.remove();
      contextMenu = null;
    }  

}