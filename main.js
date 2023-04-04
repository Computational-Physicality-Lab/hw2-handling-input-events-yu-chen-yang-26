// NOTE: The variable "shirts" is defined in the shirts.js file as the full list of shirt offerings
//       You can access this variable here, and should use this variable here to build your webpages

let initProducts = () => {
    // To see the shirts object, run:
    var view = document.getElementsByClassName("product-quick-view")[0];
    var viewFront = document.getElementsByClassName("product-quick-view-front")[0];
    var viewBack = document.getElementsByClassName("product-quick-view-back")[0];
    var viewName = document.getElementsByClassName("product-quick-view-name")[0];
    var viewPrice = document.getElementsByClassName("product-quick-view-price")[0];
    var viewDescription = document.getElementsByClassName("product-quick-view-description")[0];
    document.getElementsByClassName("product-quick-view-close")[0].addEventListener(
        "click", () => {
            view.style.display = "none"
        }
    )
    let handleClick = (value) => {
        localStorage.setItem("name", value);
        window.location.href = "details.html";
    }
    let handleError = (img) => {
        img.src = "./shirt_images/not-found.png";
    }
    let quickView = (item) => {
        viewFront.src = "./"+item.colors[Object.keys(item.colors)[0]].front
        viewBack.src = "./"+item.colors[Object.keys(item.colors)[0]].back
        viewName.innerHTML = `${item.name}`;
        viewPrice.innerHTML = `${item.price? item.price:"Please contact us to get the price."}`;
        viewDescription.innerHTML = `${item.description}`;
        viewFront.addEventListener("click", () => handleClick(item.name));
        viewBack.addEventListener("click", () => handleClick(item.name));
        viewFront.addEventListener("error", () => handleError(viewFront));
        viewBack.addEventListener("error", () => handleError(viewBack));
        view.style.display = "flex";
    }
    var product = document.getElementsByClassName("product-items")[0];
    for (let index = 0; index < shirts.length; index++) {
        const element = shirts[index];
        let newNode = document.createElement("div");
        newNode.classList.add("product-item");
        newNode.innerHTML = `
        <img class="product-item-pic" src="./${element.colors[Object.keys(element.colors)[0]].front}">
        <div class="product-item-name">${element.name}</div>
        <div class="product-item-status">Available in ${Object.keys(element.colors).length} colors</div>
        <div class="product-item-button">
            <button class="product-item-quick-view">Quick View</button>
            <button class="product-item-see-page">See Page</button>
        </div>`;        
        newNode.getElementsByClassName("product-item-pic")[0].addEventListener("error", () => handleError(newNode.getElementsByClassName("product-item-pic")[0]));
        newNode.getElementsByClassName("product-item-pic")[0].addEventListener("click", () => handleClick(element.name));
        newNode.getElementsByClassName("product-item-see-page")[0].addEventListener("click", () => handleClick(element.name));
        newNode.getElementsByClassName("product-item-quick-view")[0].addEventListener("click", () => quickView(element));
        product.appendChild(newNode);
    }
    for (let index = 0; index < 3-shirts.length%3; index++) {
        const element = shirts[index];
        let newNode = document.createElement("div");
        newNode.classList.add("product-item");
        newNode.style.visibility = "hidden";
        product.appendChild(newNode);
    }
    // Your Code Here
};

let initDetails = () => {
    // To see the shirts object, run:
    // console.log(shirts);
    var item = shirts.find(x => x.name == localStorage.getItem("name"));
    var detail = document.getElementsByClassName("detail-body")[0];
    var header = document.createElement("div");
    header.classList.add("detail-header");
    header.innerHTML = `${item.name}`;
    detail.appendChild(header);
    var shirt = document.createElement("div");
    shirt.classList.add("detail-shirt");
    shirt.innerHTML = `
      <img class="detail-shirt-pic" src="./${item.colors[Object.keys(item.colors)[0]].front}"/>
      <div class="detail-shirt-info">
        <div class="detail-shirt-price">${item.price? item.price:"Please contact us to get the price."}</div>
        <div class="detail-shirt-description">${item.description}</div>
        <div class="detail-shirt-side">
          <div class="detail-shirt-side-text">Side:</div>
          <button class="detail-shirt-front-button">Front</button>
          <button class="detail-shirt-back-button">Back</button>
        </div>
        <div class="detail-shirt-color">
          <div class="detail-shirt-color-text">Color:</div>
        </div>
      </div>
    `;
    localStorage.setItem("color", Object.keys(item.colors)[0]);
    var colorButton = shirt.getElementsByClassName("detail-shirt-color")[0];
    var imgSrc = shirt.getElementsByClassName("detail-shirt-pic")[0];
    let handleError = () => {
        imgSrc.src = "./shirt_images/not-found.png";
    }
    let handleColorClick = (src, color) => {
        localStorage.setItem("color", color);
        imgSrc.src = src;
    }
    let handleSideClick = (side) => {
        let color = localStorage.getItem("color");
        imgSrc.src = "./"+item.colors[color][side];
    }
    imgSrc.addEventListener("error", () => handleError());
    Object.keys(item.colors).forEach(key => {
        var newNode = document.createElement("div");
        newNode.classList.add("detail-shirt-color-button");
        newNode.innerHTML = `${key}`;
        newNode.style.backgroundColor = key;
        newNode.addEventListener("click", ()=>handleColorClick("./"+item.colors[key].front, key));
        colorButton.appendChild(newNode);
    })
    shirt.getElementsByClassName("detail-shirt-front-button")[0].addEventListener(
        "click", () => handleSideClick("front")
    )
    shirt.getElementsByClassName("detail-shirt-back-button")[0].addEventListener(
        "click", () => handleSideClick("back")
    )
    detail.appendChild(shirt);

    // Your Code Here
};