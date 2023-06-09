/*
* all the code for homework 2 goes into this file.
You will attach event handlers to the document, workspace, and targets defined in the html file
to handle mouse, touch and possible other events.

You will certainly need a large number of global variables to keep track of the current modes and states
of the interaction.
*/

const target = document.getElementsByClassName("target");
let followingElement = null;
let dragging = false;
let escaping = false;
let initialTouchPos = { x: 0, y: 0 };
let lastTouchPos = { x: 0, y: 0 };
let lastTapTime = 0;
let lastTapX = 0;
let lastTapY = 0;
const doubleTapDelay = 300;
let mode = 0;
let lastTouches = 0;
let currentElement = null;
let divStartX = 0;
let divStartY = 0;
let divStartWidth = 0;
let divStartHeight = 0;
let mouseStartX = 0;
let mouseStartY = 0;
let touchStartDistance = 0;
let touchMoveDistance = 0;
let selectDiv = null;
let scalingMode = 0;
const followDiv = (e) => {
  if (mode === 0) {
    if (followingElement !== null) {
      followingElement.style.left = e.clientX + "px";
      followingElement.style.top = e.clientY + "px";
    }
  } else {
    if (followingElement !== null) {
      followingElement.style.left = e.touches[0].pageX + "px";
      followingElement.style.top = e.touches[0].pageY + "px";
    }
  }
};
const dragDiv = (e) => {
  e.preventDefault();
  const touchOffsetX = e.touches[0].clientX - initialTouchPos.x;
  const touchOffsetY = e.touches[0].clientY - initialTouchPos.y;
  currentElement.style.left = divStartX + touchOffsetX + "px";
  currentElement.style.top = divStartY + touchOffsetY + "px";
};
const scaling = (e) => {
  if (e.touches.length === 2) {
    if (scalingMode === 0) {
      touchMoveDistance = Math.abs(e.touches[0].clientX - e.touches[1].clientX);
      let deltaDistance = touchMoveDistance - touchStartDistance;
      let scale = 1 + deltaDistance / 100;
      const newWidth = divStartWidth * scale;
      const newTranslateX = (divStartWidth - newWidth) / 2;
      selectDiv.style.transform = `translateX(${newTranslateX}px)`;
      selectDiv.style.width = `${newWidth}px`;
    } else {
      touchMoveDistance = Math.abs(e.touches[0].clientY - e.touches[1].clientY);
      let deltaDistance = touchMoveDistance - touchStartDistance;
      let scale = 1 + deltaDistance / 100;
      const newHeight = divStartHeight * scale;
      const newTranslateY = (divStartHeight - newHeight) / 2;
      selectDiv.style.transform = `translateY(${newTranslateY}px)`;
      selectDiv.style.height = `${newHeight}px`;
    }
  }
};
for (let i = 0; i < target.length; i++) {
  const element = target[i];
  element.setAttribute("tabindex", "1");
  element.style.minWidth = "20px";
  element.style.minHeight = "20px";
  element.style.transformOrigin = "center center";
  const moveDiv = (e) => {
    dragging = true;
    const mouseOffsetX = e.clientX - mouseStartX;
    const mouseOffsetY = e.clientY - mouseStartY;
    element.style.left = divStartX + mouseOffsetX + "px";
    element.style.top = divStartY + mouseOffsetY + "px";
  };
  const abort = (e) => {
    if (e.key === "Escape" || e.keyCode === 27) {
      dragging = false;
      escaping = true;
      followingElement = null;
      element.style.left = divStartX + "px";
      element.style.top = divStartY + "px";
      element.removeEventListener("mousemove", moveDiv);
      document.removeEventListener("mousemove", followDiv);
      element.removeEventListener("keydown", abort);
    }
  };
  // 滑鼠點擊（mouse-click） div - 選取所點擊的 div ，將其顏色改為藍色（#00f），並取消選取任何已被選取的其他 div 。
  element.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dragging) {
      for (let j = 0; j < target.length; j++) {
        const other = target[j];
        if (other.style.backgroundColor === "rgb(0, 0, 255)") {
          other.style.backgroundColor = "red";
        }
      }
      element.style.backgroundColor = "#00f";
    }
  });
  // 長按（mouse down） div 並移動 - 使點擊的 div 隨著滑鼠移動直到放開左鍵。該 div 不應更換顏色，亦即該移動行為不應改變選取的目標。
  element.addEventListener("mousedown", (e) => {
    dragging = false;
    escaping = false;
    mode = 0;
    mouseStartX = e.clientX;
    mouseStartY = e.clientY;
    divStartX = element.offsetLeft;
    divStartY = element.offsetTop;
    element.addEventListener("mousemove", moveDiv);
    element.addEventListener("keydown", abort);
  });
  element.addEventListener("mouseup", () => {
    element.removeEventListener("keydown", abort);
    element.removeEventListener("mousemove", moveDiv);
    followingElement = null;
  });
  // 滑鼠雙擊（mouse double click） div - 選取點擊的 div （改變顏色並取消選取其他 div），同時觸發一個「跟隨模式」使該 div 跟著滑鼠移動（即使放開按鍵）。該 div 應在下次 mouse up 事件發生時停止跟隨滑鼠。在這個模式下，任何其他點擊行為將不會被觸發（e.g. 點擊其他div將不會選取它）。
  element.addEventListener("dblclick", (e) => {
    e.preventDefault();
    divStartX = element.offsetLeft;
    divStartY = element.offsetTop;
    followingElement = element;
    document.addEventListener("mousemove", followDiv);
    element.addEventListener("keydown", abort);
  });
  /////////////////////////////////////////////////////
  // 單指點擊div - 選取所點擊的 div ，將其顏色改為藍色（#00f），並取消選取任何已被選取的其他 div 。
  element.addEventListener("touchstart", (e) => {
    currentElement = element;
    e.preventDefault();
    mode = 1;
    if (lastTouches === 3) {
      return;
    }
    if (e.touches.length === 1) {
      initialTouchPos.x = e.touches[0].clientX;
      initialTouchPos.y = e.touches[0].clientY;
      const now = Date.now();
      const touch = e.touches[0];
      if (
        now - lastTapTime < doubleTapDelay &&
        Math.abs(touch.clientX - lastTapX) < 10 &&
        Math.abs(touch.clientY - lastTapY) < 10
      ) {
        // 雙擊事件
        followingElement = element;
        document.addEventListener("touchmove", followDiv);
      }
      divStartX = element.offsetLeft;
      divStartY = element.offsetTop;
      lastTapTime = now;
      lastTapX = touch.clientX;
      lastTapY = touch.clientY;
      lastTouches = 1;
    }
  });
  element.addEventListener("touchmove", dragDiv);
  element.addEventListener("touchend", (e) => {
    e.preventDefault();
    const now = Date.now();
    const touch = e.changedTouches[0];
    if (
      now - lastTapTime < doubleTapDelay &&
      Math.abs(touch.pageX - lastTapX) < 10 &&
      Math.abs(touch.pageY - lastTapY) < 10
    ) {
      lastTouches = 0;
      document.removeEventListener("touchmove", followDiv);
      followingElement = null;
    }
    if (e.touches.length === 0 && e.changedTouches.length === 1) {
      lastTouches = 0;
      var dx = e.changedTouches[0].pageX - initialTouchPos.x;
      var dy = e.changedTouches[0].pageY - initialTouchPos.y;
      var distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 10) {
        e.stopPropagation();
        if (!dragging) {
          for (let j = 0; j < target.length; j++) {
            const other = target[j];
            if (other.style.backgroundColor === "rgb(0, 0, 255)") {
              other.style.backgroundColor = "red";
            }
          }
          element.style.backgroundColor = "#00f";
          selectDiv = element;
        }
      }
    }
    initialTouchPos = { x: 0, y: 0 };
  });
}

// 滑鼠點擊背景 - 取消選取任何 div 。
const workspace = document.getElementById("workspace");
workspace.addEventListener("click", (e) => {
  e.preventDefault();
  if (!escaping) {
    for (let j = 0; j < target.length; j++) {
      const other = target[j];
      if (other.style.backgroundColor === "rgb(0, 0, 255)") {
        other.style.backgroundColor = "red";
      }
    }
    selectDiv = null;
  } else {
    escaping = false;
  }
});
// 單指點擊背景 - 取消選取任何 div 。
workspace.addEventListener("touchstart", function (e) {
  e.preventDefault();
  if (lastTouches === 3) {
    return;
  }
  if (e.touches.length === 1) {
    initialTouchPos.x = e.touches[0].pageX;
    initialTouchPos.y = e.touches[0].pageY;
  } else if (e.touches.length === 2 && lastTouches === 1) {
    currentElement.style.left = divStartX + "px";
    currentElement.style.top = divStartY + "px";
    document.removeEventListener("touchmove", followDiv);
    followingElement = null;
    currentElement = null;
  } else if (e.touches.length === 2 && lastTouches === 0) {
    lastTouches = 2;
    divStartWidth = selectDiv.offsetWidth;
    divStartHeight = selectDiv.offsetHeight;
    let X = Math.abs(e.touches[0].clientX - e.touches[1].clientX);
    let Y = Math.abs(e.touches[0].clientY - e.touches[1].clientY);
    if (X < Y) {
      touchStartDistance = Y;
      scalingMode = 1;
    } else {
      touchStartDistance = X;
      scalingMode = 0;
    }
    workspace.addEventListener("touchmove", scaling);
  } else if (e.touches.length === 3 && lastTouches === 2) {
    lastTouches = 3;
    selectDiv.style.width = divStartWidth + "px";
    selectDiv.style.height = divStartHeight + "px";
    workspace.removeEventListener("touchmove", scaling);
  }
});

workspace.addEventListener("touchend", function (e) {
  e.preventDefault();
  if (e.touches.length === 0) {
    workspace.removeEventListener("touchmove", scaling);
    lastTouches = 0;
  }
  if (e.touches.length === 0 && e.changedTouches.length === 1) {
    var dx = e.changedTouches[0].pageX - initialTouchPos.x;
    var dy = e.changedTouches[0].pageY - initialTouchPos.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 10) {
      if (!escaping) {
        for (let j = 0; j < target.length; j++) {
          const other = target[j];
          if (other.style.backgroundColor === "rgb(0, 0, 255)") {
            other.style.backgroundColor = "red";
          }
        }
        selectDiv = null;
      } else {
        escaping = false;
      }
    }
  }
  initialTouchPos = { x: 0, y: 0 };
});
