import Artwork from '../models/artwork.js';
import { env } from '../env.js';
import User from '../models/user.js';
import Admin from './admin.js';
import Utils from './utils.js'

export default class App {
    constructor() {
        this.contentPage = "";

        this.artworksList = null;
        this.artworkShow = null;

        this.artworks = [];
        this.users = [];

        this.currentUser = null;

        this.formCount = 1;
    }

    async goTo(view) {

        await fetch('./src/views/header.html')
            .then(res => res.text())
            .then(data => this.contentPage += data);

        await fetch(`./src/views/${view}.html`)
            .then(res => res.text())
            .then(data => {
                this.contentPage += data;
            });

        await fetch('./src/views/footer.html')
            .then(res => res.text())
            .then(data => this.contentPage += data);

        document.body.innerHTML = this.contentPage;

        if (this.currentUser) {
            document.getElementById('connectButton').innerHTML = `Connected as <strong>${this.currentUser.username}</strong>`;
        }


        switch (view) {
            case 'artworks':
                this.loadArtworks();
                this.createArtworkPreview();
                this.responsivePreview();
                break;
            case 'login':
                this.loadUsers();
                this.loginPage();
                break;
            case 'admin':
                this.loadArtworks();
                new Admin(this);
                break;
            default:
                break;
        }

        this.contentPage = "";
    }

    async loadUsers() {
        let importedUsers = {};

        if (window.localStorage.getItem(env.KEY_ADMINS) && JSON.parse(localStorage.getItem(env.KEY_ADMINS)).length !== 0) {
            const users = localStorage.getItem(env.KEY_ADMINS);
            importedUsers = JSON.parse(users);
        } else {
            await fetch('./assets/misc/placeholderAdmin.json')
                .then(res => res.json())
                .then(data => {
                    importedUsers = data.users;
                })
        }

        importedUsers.forEach(userData => {
            this.users.push(new User(userData));
        })

        localStorage.setItem(env.KEY_ADMINS, JSON.stringify(this.users));
    }

    async loadArtworks() {
        if(this.artworks.length !== 0) return;

        if (window.localStorage) {
            let importedArtworks = {};

            if (window.localStorage.getItem(env.KEY_ARTWORKS) && JSON.parse(localStorage.getItem(env.KEY_ARTWORKS)).length !== 0) {
                const artworksString = localStorage.getItem(env.KEY_ARTWORKS);
                importedArtworks = JSON.parse(artworksString);
                localStorage.removeItem(env.KEY_ARTWORKS);
            } else if (env.IMPORT) {
                await fetch('./assets/misc/placeholderArtwork.json')
                    .then(res => res.json())
                    .then(data => {
                        importedArtworks = data.artworks;
                    })
            } else {
                importedArtworks = null;
            }

            if (!importedArtworks || importedArtworks[0].id === undefined) return;

            importedArtworks.forEach(
                (data, index) => {
                    this.artworks.push(new Artwork(data, (index == 0)));
                }
            );

            this.saveArtworks();
        }
    }

    saveArtworks() {
        localStorage.setItem(env.KEY_ARTWORKS, JSON.stringify(this.artworks));
    }

    createArtworkPreview() {
        this.artworksList = document.querySelector('.artList');
        this.artworkShow = document.querySelector('.artShow');

        if (this.artworks.length !== 0) {
            if (this.artworksList.hasChildNodes) this.artworksList.innerHTML = '';
            this.artworks.forEach(this.createArtworkPreviewRow.bind(this));
            this.updateArtworkShow(this.artworks[0].id);
        } else {
            this.artworksList.innerHTML = Utils.renderAlert('secondary', ' No artwork in my localstorage. (⩾﹏⩽)', false);
            this.artworkShow.closest('.col-lg-6').remove();
            this.artworksList.closest('.col-lg-6').classList.add('col-lg-12');
        }
    }

    createArtworkPreviewRow(artworkInstance) {
        const renderArtworkPreview = artworkInstance.renderPreview();
        artworkInstance.renderTableLine();
        renderArtworkPreview.addEventListener('click', e => { this.updateArtworkShow(e.currentTarget.id) });
        this.artworksList.appendChild(renderArtworkPreview);
    }

    updateArtworkShow(id) {

        let previous = this.artworks.find(a => a.state.displayed);

        if (previous) {
            previous.state.displayed = false;
            document.getElementById(previous.id).classList.remove('active');
        }

        let selectedArtwork = this.artworks.find(a => a.id == id);
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
            if (!preview) return;
            let maxScrollValue = contentHeight - preview.clientHeight + document.getElementById('header').clientHeight - document.getElementById('footer').clientHeight - 15;
            if (preview && window.innerWidth >= 992) {

                if (maxScrollValue > window.scrollY && window.scrollY > 40) {
                    preview.style.marginTop = window.scrollY + "px";
                }

                if (maxScrollValue < window.scrollY) {
                    preview.style.marginTop = maxScrollValue + 1;
                }

                if (window.scrollY < 40) {
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
        let user = this.users.find(e => e.username == username);

        if (user && user.checkPassword(password)) {
            this.currentUser = user;
            location.hash = 'admin';
        } else {
            document.getElementById('loginAlert').innerHTML = Utils.renderAlert('danger', 'Invalid username or password, check localstorage !', true);
        }
    }

}
