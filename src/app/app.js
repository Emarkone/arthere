import Artwork from '../models/artwork.js';
import { env } from '../env.js';
import User from '../models/user.js';
import Admin from '../app/admin.js';

export default class App {
    constructor() {
        this.contentPage = "";

        this.artworksList = null;
        this.artworkShow = null;

        this.artworks = [];

        this.user = null;

        this.formCount = 1;
    }

    async goTo(view) {
        await fetch('/src/views/header.html')
            .then(res => res.text())
            .then(data => this.contentPage += data);

        await fetch(`/src/views/${view}.html`)
            .then(res => res.text())
            .then(data => {
                this.contentPage += data;
            });

        await fetch('/src/views/footer.html')
            .then(res => res.text())
            .then(data => this.contentPage += data);

        document.body.innerHTML = this.contentPage;

        switch (view) {
            case 'artworks':
                this.createArtworkPreview();
                this.responsivePreview();
                break;
            case 'login':
                this.loginPage();
                break;
            case 'admin':
                new Admin(this);
            default:
                break;
        }

        if (this.user) {
            document.getElementById('connectButton').innerHTML = `Connected as <strong>${this.user.username}</strong>`;
        }

        this.contentPage = "";
    }

    async loadData() {
        if (window.localStorage) {
            this.artworks = [];

            let importedArtworks = {};


            if (window.localStorage.getItem(env.KEY_ARTWORKS) && JSON.parse(localStorage.getItem(env.KEY_ARTWORKS)).length !== 0) {
                const artworksString = localStorage.getItem(env.KEY_ARTWORKS);
                importedArtworks = JSON.parse(artworksString);
                localStorage.removeItem(env.KEY_ARTWORKS);
            } else if (env.IMPORT) {
                await fetch('/assets/misc/placeholder.json')
                    .then(res => res.json())
                    .then(data => {
                        importedArtworks = data.artworks;
                    })
            } else {
                importedArtworks = null;
            }

            if (!importedArtworks) return;

            importedArtworks.forEach(
                (data, index) => {
                    this.artworks.push(new Artwork(data, (index == 0)));
                }
            );

            localStorage.setItem(env.KEY_ARTWORKS, JSON.stringify(this.artworks));
        }
    }

    createArtworkPreview() {
        this.artworksList = document.querySelector('.artList');
        this.artworkShow = document.querySelector('.artShow');
        if (this.artworks.length !== 0) {
            if (this.artworksList.hasChildNodes) this.artworksList.innerHTML = '';
            this.artworks.forEach(this.createArtworkPreviewRow.bind(this));
            this.updateArtworkShow(this.artworks[0].id);
        } else {
            this.artworksList.innerHTML = `<div class="alert alert-secondary" role="alert">
                                            No artwork in my localstorage. (⩾﹏⩽) 
                                           </div>`;

            this.artworkShow.closest('.col-lg-6').remove();

            this.artworksList.closest('.col-lg-6').classList.add('col-lg-12');


        }
    }

    createArtworkPreviewRow(artworkInstance) {
        const renderArtworkPreview = artworkInstance.renderPreview();
        artworkInstance.renderTableLine();
        renderArtworkPreview.addEventListener('click', e => { this.updateArtworkShow(e.target.closest('.art-item').id) });
        this.artworksList.appendChild(renderArtworkPreview);
    }

    updateArtworkShow(id) {

        const previous = this.artworks.find(a => a.state.displayed);

        if (previous) {
            previous.state.displayed = false;
            document.getElementById(previous.id).classList.remove('active');
        }

        const selectedArtwork = this.artworks.find(a => a.id == id);
        selectedArtwork.state.displayed = true;

        document.querySelector('#artshowName').innerHTML = selectedArtwork.name;
        document.querySelector('#artshowPrice').innerHTML = selectedArtwork.price + "€";
        document.querySelector('#artshowImg').src = selectedArtwork.img;
        document.querySelector('#artshowDescription').innerHTML = selectedArtwork.description;
        document.querySelector('#artshowAuthor').innerHTML = "by " + selectedArtwork.author;

        if (window.innerWidth <= 992) {
            this.artworkShow.closest('#previewContainer').scrollIntoView();
        }

        document.getElementById(id).classList.add('active');

    }

    responsivePreview() {
        let contentHeight = document.getElementById('content').clientHeight;
        let preview = document.getElementById('previewContainer');

        window.addEventListener('scroll', function (e) {
            let maxScrollValue = contentHeight - preview.clientHeight + document.getElementById('header').clientHeight - document.getElementById('footer').clientHeight - 15;
            if (preview && window.innerWidth >= 992 ) {

                if (maxScrollValue > window.scrollY && window.scrollY > 40) {
                    preview.style.marginTop = window.scrollY + "px";
                }

                if(maxScrollValue < window.scrollY) {
                    preview.style.marginTop = maxScrollValue + 1;
                }

                if(window.scrollY < 40) {
                    preview.style.marginTop = "0px";
                }

            } else {
                preview.marginTop = "0px";
            }

        });
    }

    // Login Form

    loginPage() {
        document.getElementById('formLogin').addEventListener('submit', e => {
            e.preventDefault();
            this.login(e.target.username.value, e.target.password.value);
        });
    }

    login(username, password) {
        if (username == env.USERNAME && password == env.PASSWORD) {
            this.user = new User(username);
            this.goTo('admin');
        } else {
            document.getElementById('loginAlert').innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
            Wrong combinaison, check <strong>env.js</strong> !
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`
        }
    }

}