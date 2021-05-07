export default class Artwork {
    constructor({id, name, author, description, price, img, tags}, displayed = false) {
        this.id = id;
        this.name = name;
        this.author = author;
        this.price = price;
        this.img = img;
        this.tags = tags;
        this.description = description;
        this.state = { displayed };
    }

    renderPreview() {
        const artItem = document.createElement('div');
        artItem.classList.add("row", "art-item", "g-0", "mb-3");
        artItem.setAttribute("id", this.id);

        if(this.state.displayed) { artItem.classList.add("active") };

        const artImgContainer = document.createElement('div');
        artImgContainer.classList.add("col-md-4", "border-dark");

        const artImg = document.createElement('div');
        artImg.className = "art-item-img";
        artImg.style.backgroundImage = `url(${this.img}`;

        artImgContainer.appendChild(artImg);

        const artDescContainer = document.createElement('div');
        artDescContainer.classList.add("col-md-8", "p-3");

        const artPriceContainer = document.createElement('div');
        artPriceContainer.className = "float-end";
        const artPrice = document.createElement('h5');
        artPrice.append(this.price + "€");
        artPriceContainer.appendChild(artPrice);

        const artTitle = document.createElement('h5');
        artTitle.append(this.name);

        artDescContainer.appendChild(artPriceContainer);
        artDescContainer.appendChild(artTitle);

        if(this.tags) {
            this.tags.forEach(e => artDescContainer.appendChild(this.renderTag(e)));
        }

        artItem.appendChild(artImgContainer);
        artItem.appendChild(artDescContainer);
        
        return artItem;
        
    }

    renderTag(tag) {
        let tagRender = document.createElement('div');
        tagRender.classList.add('badge', 'rounded-pill', `bg-${tag[1]}`);
        tagRender.append(tag[0]);
        return tagRender;
    }

    renderTableThead() {

        let line = document.createElement('tr');

        for (const [key,value] of Object.entries(this)) {
            let th = document.createElement('th');
            th.setAttribute("scope", "col");

            if(key == "description" || key == "img") th.classList.add("d-none", "d-lg-table-cell");
            if(key == "tags") th.classList.add("d-none", "d-md-table-cell");
            (key == "state") ? th.append(' ') : th.append(key);
            
            line.appendChild(th);
        }

        const th = document.createElement('th');
        line.appendChild(th);

        return line;

    }

    renderTableLine() {
        const line = document.createElement('tr');

        for (const [key,value] of Object.entries(this)) {

            if (key == 'id') {
                let th = document.createElement('th');
                th.append(value);
                th.setAttribute("scope", "row");
                line.appendChild(th);
            } else {
                let td = document.createElement('td');

                switch (key) {
                    case 'description':
                        td.append(value);
                        td.classList.add("d-none", "d-lg-table-cell");
                        break;
                    case 'tags':
                        value.forEach(e => td.appendChild(this.renderTag(e)));
                        td.classList.add("d-none", "d-md-table-cell");
                        break;
                    case 'img':
                        td.append(value);
                        td.classList.add("d-none", "d-lg-table-cell");
                        break;
                    case 'state':
                        break;
                    default:
                        td.append(value);
                        break;
                }

                line.appendChild(td);
            }
        }

    return line;

    }
}