import Artwork from '../models/artwork.js';
import Utils from './utils.js';

export default class Admin {

    constructor(app) {
        this.app = app;

        this.tableContainer = null;
        this.tagButtonContainer = null;
        this.tagFormContainer = null;
        this.form = null;

        this.artworkToEdit = null;

        this.tagsColor = {
            "Blue": "primary",
            "Grey": "secondary",
            "Green": "success",
            "Yellow": "warning",
            "Red": "danger",
            "Cyan": "info",
            "Light": "light",
            "Dark": "dark",
            "Purple": "purple"
        }

        this.render();
    }


    render() {
        this.tableContainer = document.querySelector('.adminPanelTable');
        this.tagFormContainer = document.getElementById('tagsForms');
        this.form = document.querySelector('.formAdd');
        this.alertContainer = document.getElementById('alertContainer');

        this.form.addEventListener('submit', event => {
            event.preventDefault();
            this.addOrEditItem(event.target);
            event.target.reset();
        });

        document.getElementById('tagAdd').addEventListener('click', e => this.renderTagForm());

        if (Object.keys(this.app.artworks).length !== 0) {
            this.renderTable();
        } else {
            this.tableContainer.innerHTML = Utils.renderAlert('secondary', ' No artwork in my localstorage. (⩾﹏⩽)', false);
        }
    }

    /** 
     *  Render the table of all the artwork stored
     */

    renderTable() {
        let tableContainer = document.createElement('div');
        tableContainer.className = "table-responsive";

        let table = document.createElement('table');
        table.className = "table";

        let thead = document.createElement('thead');
        thead.appendChild(this.app.artworks[0].renderTableThead());

        table.appendChild(thead);

        let tbody = document.createElement('tbody');

        this.app.artworks.forEach(artwork => {
            tbody.appendChild(this.renderTableLine(artwork));
        })

        table.appendChild(tbody);

        tableContainer.appendChild(table);

        this.tableContainer.innerHTML = '';
        this.tableContainer.appendChild(tableContainer);
    }

    /** 
     *  Render a new table line
     * @param {Array} artwork 
     */

    renderTableLine(artwork) {
        let td = document.createElement('td');

        let editButton = Utils.renderButton("warning", `<i class="bi bi-pencil-fill"></i>`, artwork.id, ['m-1']);
        editButton.addEventListener('click', button => this.retrieveItem(button.currentTarget));
        td.appendChild(editButton);

        let deleteButton = Utils.renderButton("danger", `<i class="bi bi-trash"></i>`, artwork.id, ['m-1']);
        deleteButton.addEventListener('click', button => this.removeItem(button.currentTarget));
        td.appendChild(deleteButton);

        let line = artwork.renderTableLine();

        line.appendChild(td);

        return line;
    }

    /** 
     *  Render a new tag form
     * @param {Array} value Preset value in case of editing
     */

    renderTagForm(value = null) {
        let tagsContainer = document.createElement('div');
        tagsContainer.classList.add('mb-2', 'row', 'g-1', 'd-flex', 'justify-content-center');

        let tagNameContainer = document.createElement('div');
        tagNameContainer.classList.add('col-5', 'col-lg-7');
        let tagNameInput = document.createElement('input');
        tagNameInput.setAttribute('type', 'text');
        tagNameInput.className = "form-control";
        tagNameInput.setAttribute('name', `tag-text`);

        if (value) tagNameInput.value = value[0];

        tagNameContainer.appendChild(tagNameInput);
        tagsContainer.appendChild(tagNameContainer);

        let tagColorContainer = document.createElement('div');
        tagColorContainer.classList.add('col-5', 'col-lg-4');

        let tagColorSelector = document.createElement('select');
        tagColorSelector.className = 'form-select';
        tagColorSelector.setAttribute('name', `tag-color`);

        for (let i = 0; i < Object.keys(this.tagsColor).length; i++) {
            let option = document.createElement('option');

            if (value) {
                if (value[1] == Object.values(this.tagsColor)[i]) option.selected = true;
            } else {
                if (i == 0) option.selected = true;
            }

            option.append(Object.keys(this.tagsColor)[i]);
            tagColorSelector.appendChild(option);
        }

        tagColorContainer.appendChild(tagColorSelector);
        tagsContainer.appendChild(tagColorContainer);

        let tagDeleteContainer = document.createElement('div');
        tagDeleteContainer.classList.add('col-1', 'col-lg-1');

        let deleteButton = Utils.renderButton("danger", `<i class="bi bi-trash"></i>`);
        deleteButton.addEventListener('click', b => b.currentTarget.closest(".row").remove());

        tagDeleteContainer.appendChild(deleteButton);
        tagsContainer.append(tagDeleteContainer);

        this.tagFormContainer.appendChild(tagsContainer);
    }

    /** 
     *  Add or remove item in the artwork array
     * @param {Object} form The form from which the data comes
     */

    addOrEditItem(form) {
        let tags = [];

        const tagsText = form.elements['tag-text'];
        const tagsColor = form.elements['tag-color'];

        if (tagsColor && tagsText) {
            if (tagsText.length > 1) {
                for (let i = 0; i < tagsText.length; i++) {
                    if (tagsText[i].value !== '') tags.push(new Array(tagsText[i].value, this.tagsColor[tagsColor[i].value]));
                }
            } else {
                tags.push(new Array(tagsText.value, this.tagsColor[tagsColor.value]));
            }
        }

        if (this.artworkToEdit) {

            Object.values(form).map(formElement => {
                if (this.artworkToEdit[formElement.name]) this.artworkToEdit[formElement.name] = formElement.value;
            });

            this.alertContainer.innerHTML = Utils.renderAlert('success', 'Artwork successfuly edited !', true);

            this.artworkToEdit.tags = tags;
            this.artwortToEdit = null;

        } else {

            let newArtwork = new Artwork({ id: Utils.generateID(), name: form.name.value, author: form.author.value, description: form.description.value, price: form.price.value, img: form.img.value, tags: tags });
            this.app.artworks.push(newArtwork);

            this.alertContainer.innerHTML = Utils.renderAlert('success', 'Artwork successfuly added !', true);
        }

        this.app.saveArtworks();

        document.getElementById('currentAction').innerHTML = "Add new artwork";
        this.tagFormContainer.innerHTML = '';
        this.renderTable();

    }

    /** 
     * Remove an item in and in the table and the artworks array 
     * @param {HTMLElement} caller The button that have been clicked
     */

    removeItem(caller) {
        this.app.artworks.splice(this.app.artworks.findIndex(e => e.id == caller.id), 1);
        caller.closest('tr').remove();
        this.app.saveArtworks();
        if (Object.keys(this.app.artworks).length === 0) this.tableContainer.innerHTML = Utils.renderAlert('secondary', ' No artwork in my localstorage. (⩾﹏⩽)', false);
    }

    /** 
     * Retrieve item values and put them in the form for it to be modified 
     * @param {HTMLElement} caller The button that have been clicked
     */
    retrieveItem(caller) {
        this.tagFormContainer.innerHTML = '';

        document.getElementById('currentAction').innerHTML = "Edit a artwork";

        let artworkToEdit = this.app.artworks.find(artwork => artwork.id == caller.id);

        Object.values(this.form).map(formElement => formElement.value = artworkToEdit[formElement.name]);
        artworkToEdit.tags.forEach(tag => this.renderTagForm(tag));

        this.form.closest('.row').scrollIntoView();

        this.artworkToEdit = artworkToEdit;
    }
}