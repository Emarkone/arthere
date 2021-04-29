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
        artItem.classList.add("art-item");

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
        artAuthor.innerHTML = `<i class="bi bi-person-badge"></i> ${this.author}`;

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
            artItemTags.className= 'art-item-tags';

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