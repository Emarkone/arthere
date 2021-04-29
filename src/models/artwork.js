export default class Artwork {
    constructor({id, name, author, price, img, tags}, displayed) {
        this.id = id;
        this.name = name;
        this.author = author;
        this.price = price;
        this.img = img;
        this.tags = tags;
        this.state = { displayed };
    }

    renderPreview() {
        const artItem = document.createElement('div');
        artItem.classList.add("row", "border", "border-dark", "art-item");

        const artImgContainer = document.createElement('div');
        artImgContainer.classList.add("col-md-4", "no-gutters", "border-dark");

        const artImg = document.createElement('div');
        artImg.className = "art-item-img";
        artImg.style.backgroundImage = `url(${this.img}`;

        artImgContainer.appendChild(artImg);

        const artDescContainer = document.createElement('div');
        artDescContainer.classList.add("col-md-8", "p-3");

        const artPriceContainer = document.createElement('div');
        artPriceContainer.className = "pull-right";
        const artPrice = document.createElement('h5');
        artPrice.append(this.price + "€");
        artPriceContainer.appendChild(artPrice);

        const artTitle = document.createElement('h5');
        artTitle.append(this.name);

        //const artAuthor = document.createElement('h6');
        // artAuthor.innerHTML = `<i class="bi bi-person-badge"></i> ${this.author}`;

        artDescContainer.appendChild(artPriceContainer);
        artDescContainer.appendChild(artTitle);
        // artDescContainer.appendChild(artAuthor);

        if(this.tags) {
            for (var i in this.tags) {
                let artItemTag = document.createElement('div');
                artItemTag.classList.add('badge', 'rounded-pill', `bg-${i}`);
                artItemTag.append(this.tags[i]);
                artDescContainer.appendChild(artItemTag);
            }
        }

        artItem.appendChild(artImgContainer);
        artItem.appendChild(artDescContainer);
        
        return artItem;
        
    }

    render() {
        const artItem = document.createElement('div');

        const artImg = document.createElement('img');
        artImg.className = "art-thumbnail";
        artImg.src = this.img;

        const artText = document.createElement('div');
        artText.className = "art-item-text";

        const artTitle = document.createElement('div');
        artTitle.className = "art-item-title";
        artTitle.append(this.name);

        const artAuthor = document.createElement('div');
        artAuthor.className = "art-item-author";
        artAuthor.append(`<i class="bi bi-person-badge"></i> ${this.author}`);

        artText.appendChild(artTitle);
        artText.appendChild(artAuthor);

        artItem.appendChild(artImg);
        artItem.appendChild(artText);

        const artItemInfo = document.createElement('div');
        artItemInfo.className = "art-item-infos";

        const artPrice = document.createElement('div');
        artPrice.className = "art-item-price";
        artPrice.append(this.price);

        artItemInfo.appendChild(artPrice);

        if(this.tags) {
            const artItemTags = document.createElement('div');

            for (var i in this.tags) {
                let artItemTag = document.createElement('div');
                artItemTag.classList.add('badge', 'rounded-pill', `bg-${i}`);
                artItemTag.append(this.tags[i]);
                artItemTags.appendChild(artItemTag);
            }

            artItemInfo.appendChild(artItemTags);
        }

        artItem.appendChild(artItemInfo);

        return artItem;
        
    }
}