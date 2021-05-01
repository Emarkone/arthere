import { env } from '../env.js';
import Artwork from '../models/artwork.js';

export default class Admin {

    constructor(app) {
        this.app = app;

        this.tableContainer = null;
        this.tagButtonContainer = null;
        this.tagFormContainer = null;

        this.tagsColor = {
            "Blue":"primary",
            "Grey":"secondary",
            "Green":"success",
            "Yellow":"warning",
            "Red":"danger",
            "Cyan":"info",
            "Light":"light",
            "Dark":"dark",
            "Purple":"purple"
        }

        this.render();
    }


    render() {
        this.tableContainer = document.querySelector('.adminPanelTable');
        this.tagButtonContainer = document.querySelector('.labelAdd');
        this.tagFormContainer = document.getElementById('tagsForms');

        document.querySelector('.formAdd').addEventListener('submit', e => {
            e.preventDefault();
            this.addItem(e.target);
            // e.target.reset();
        });

        if (this.app.artworks.length !== 0) this.renderTable();

        this.renderTagButton();

    }

    renderTable() {
        const tableContainer = document.createElement('div');
        tableContainer.className = "table-responsive";

        const table = document.createElement('table');
        table.className = "table";

        const thead = document.createElement('thead');
        thead.appendChild(this.app.artworks[0].renderTableThead());

        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        this.app.artworks.forEach(e => {
            tbody.appendChild(this.renderTableLine(e));
        })

        table.appendChild(tbody);

        tableContainer.appendChild(table);

        this.tableContainer.innerHTML = '';
        this.tableContainer.appendChild(tableContainer);
    }

    renderTableLine(e) {

        let td = document.createElement('td');
        let button = document.createElement('button');
        button.setAttribute("type", "button");
        button.setAttribute("id", e.id);
        button.classList.add("btn", "btn-danger");
        button.innerHTML = ('<i class="bi bi-trash"></i>');
        button.addEventListener('click', b => this.removeItem(b.target));
        td.appendChild(button);

        let line = e.renderTableLine();

        line.appendChild(td);

        return line;
    }

    renderTagButton() {
        let button = document.createElement('button');
        button.setAttribute("type", "button");
        button.classList.add("btn", "btn-primary");
        button.append("Add tag");

        button.addEventListener('click', b => this.renderTagForm());
        this.tagButtonContainer.appendChild(button);
    }

    renderTagForm() {
        
        let tagsContainer = document.createElement('div');
        tagsContainer.classList.add('mb-2', 'row');

        let tagNameContainer = document.createElement('div');
        tagNameContainer.classList.add('col-8', 'mb-1');
        let tagNameInput = document.createElement('input');
        tagNameInput.setAttribute('type', 'text');
        tagNameInput.className = "form-control";
        tagNameInput.setAttribute('name', `tag-text`);
        tagNameContainer.appendChild(tagNameInput);

        tagsContainer.appendChild(tagNameContainer);

        let tagColorContainer = document.createElement('div');
        tagColorContainer.classList.add('col-4', 'mb-1');
        let tagColorSelector = document.createElement('select');
        tagColorSelector.className = 'form-select';
        tagColorSelector.setAttribute('name', `tag-color`);

        for (let i = 0; i < Object.keys(this.tagsColor).length; i++) {
            let option = document.createElement('option');
            if (i == 0) option.selected = true;
            option.append(Object.keys(this.tagsColor)[i]);
            tagColorSelector.appendChild(option);
        }

        tagColorContainer.appendChild(tagColorSelector);

        tagsContainer.appendChild(tagColorContainer);

        this.tagFormContainer.appendChild(tagsContainer);
    }

    addItem(form) {
        let tagsText = form.elements['tag-text'];
        let tagsColor = form.elements['tag-color'];
    
        let tags = {};
        for (let i = 0; i < tagsText.length; i++) {
            if(tagsText[i].value !== '') tags[i] = new Array(tagsText[i].value, this.tagsColor[tagsColor[i].value]);
        }

        let newArtwork = new Artwork({id:this.generateID(), name:form.awname.value, author:form.author.value, description:form.description.value, price:form.price.value, img:form.img.value, tags:tags}, false);

        this.app.artworks.push(newArtwork);
        localStorage.setItem(env.KEY_ARTWORKS, JSON.stringify(this.app.artworks));

        this.tagFormContainer.innerHTML = '';
        this.renderTable();

    }

    removeItem(caller) {
        this.app.artworks.splice(this.app.artworks.find(e => e.id == caller.id), 1);
        caller.closest('tr').remove();
        localStorage.setItem(env.KEY_ARTWORKS, JSON.stringify(this.app.artworks));
    }

    generateID() {
        return 'xxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
    }


}