import Artwork from '../models/artwork.js';
import { env } from '../env.js';

export default class App {
    constructor() {
        this.contentPage = "";

        this.artworksList = null;
        this.artworkShow = null;

        this.artworks = [];
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

        if (view === 'shop') this.loadData();
        this.contentPage = "";
    }

    async loadData() {
        this.artworksList = document.querySelector('.classList');
        this.artworkShow = document.querySelector('.artShow');

        if(window.localStorage) {

            let importedArtworks = {};

            if(!window.localStorage.getItem(env.KEY_ARTWORKS)) {
                const artworksString = localStorage.getItem(env.KEY_ARTWORKS);
                importedArtworks = JSON.parse(artworksString);
            } else {
                await fetch('/assets/misc/placeholder.json')
                .then(res => res.json())
                .then(data => {
                    importedArtworks = data.artworks;
                })
            }

            importedArtworks.forEach(
                (data, index) => {
                    let artwork = new Artwork(data, (index == 0));
                    this.artworks.push(artwork);
                    let renderArtwork = artwork.renderPreview()
                    renderArtwork.addEventListener('click', function() {console.log(this)});
                    this.artworksList.appendChild(renderArtwork);
                }
            );

            localStorage.setItem(env.KEY_ARTWORKS, JSON.stringify(this.artworks));
        }
    }

    updateShow(id = 0) {
        alert("hewo");
        this.artworkShow = document.querySelector('.artShow');
        this.artworkShow.innerHTML = '';
        this.artworkShow.appendChild(this.artworks[id].render());
    }

}