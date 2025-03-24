class MusicPlayer {
  // Explication : Le constructeur est la première fonction lancée quand la Classe est instanciée. On y initialise les propriété, et appelle des fonctions.
  constructor() {
    this.tracks = [
      {
        id: 1,
        title: "La clim",
        artist: "Kéroué",
        featuredArtists: ["JeanJass"],
        album: "Scope",
        cover: "/covers/scope.webp",
        url: "/musics/keroue-la_clim.mp3",
      },
      {
        id: 2,
        title: "OUTRO YuU",
        artist: "Ajna",
        featuredArtists: [],
        album: "L'HERMITE",
        cover: "/covers/l_hermite.webp",
        url: "/musics/ajna-outro_yuu.mp3",
      },
      {
        id: 3,
        title: "blccd tears",
        artist: "Mairo",
        featuredArtists: [],
        album: "LA FIEV",
        cover: "/covers/la_fiev.webp",
        url: "/musics/mairo-blccd_tears.mp3",
      },
    ];
    this.currentTrackIndex = 0;
    this.audio = new Audio();
    this.isPlaying = false;
    this.volume = 1;

    this.init();
  }

  // Explication : Ici, on est en dehors du constructor, on y défini toutes les fonctions que la classe possède.

  init = () => {
    this.cacheDOM();
    this.bindEvents();
    // this.setupDraggable();
    this.loadTrack();
  };

  cacheDOM = () => {
    this.playlist = document.querySelector("#playlist");

    this.playButton = document.querySelector("#play");
    this.playSVG = document.querySelector("#playSVG");
    this.pauseSVG = document.querySelector("#pauseSVG");

    this.nextButton = document.querySelector("#next");
    this.prevButton = document.querySelector("#prev");

    this.trackTitle = document.querySelector("#track-title");
    this.trackAlbum = document.querySelector("#track-album");
    this.trackArtist = document.querySelector("#track-artist");
    this.trackFeat = document.querySelector("#track-feat");

    this.currentTrackCover = document.querySelector("#current-track-cover");
    this.previousTrackCover = document.querySelector("#previous-track-cover");
    this.nextTrackCover = document.querySelector("#next-track-cover");
  };

  refreshDOM = () => {
    this.trackTitle.textContent = this.tracks[this.currentTrackIndex].title;
    this.trackAlbum.textContent = this.tracks[this.currentTrackIndex].album;
    this.trackArtist.textContent = this.tracks[this.currentTrackIndex].artist;

    if (this.tracks[this.currentTrackIndex].featuredArtists.length > 0) {
      let feat = "ft.";
      let index = 1;
      let length = this.tracks[this.currentTrackIndex].featuredArtists.length;

      this.tracks[this.currentTrackIndex].featuredArtists.forEach((artist) => {
        feat += " " + String(artist);
        if (index != length) {
          feat = feat + ",";
        }
        index++;
      });

      this.trackFeat.textContent = feat;
    } else {
      this.trackFeat.textContent = "";
    }
    this.togglePlayButton();
    this.refreshCovers()

  };

  togglePlayButton = () => {
    console.log("toggleplayvutton", this.isPlaying);
    if (this.isPlaying) {
      this.playSVG.style.display = "none";
      this.pauseSVG.style.display = "block";
    } else {
      this.playSVG.style.display = "block";
      this.pauseSVG.style.display = "none";
    }
  };

  refreshCovers = () => {
    this.nextTrackCover.src = this.tracks[(this.currentTrackIndex + 1) % this.tracks.length].cover;
    this.currentTrackCover.src = this.tracks[this.currentTrackIndex].cover;
    this.previousTrackCover.src = this.tracks[(this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length].cover;

  }

  bindEvents = (item) => {
    this.playButton.addEventListener("click", () => this.togglePlay());
    this.nextButton.addEventListener("click", () => this.nextTrack()); // Bug: nextButton est undefined
    this.prevButton.addEventListener("wheel", function () {
      this.prevTrack();
    });
    this.audio.addEventListener("ended", () => this.nextTrack());
  };

  loadTrack = () => {
    if (
      this.currentTrackIndex < 0 ||
      this.currentTrackIndex >= this.tracks.length
    ) {
      console.error("Index de piste invalide");
      return;
    }
    this.audio.src = this.tracks[this.currentTrackIndex].url;
    this.refreshDOM();
  };

  togglePlay = () => {
    if (this.isPlaying) {
      console.log("Pause");
      this.audio.pause();
      this.isPlaying = false;
    } else {
      console.log("Play");
      console.log(this.audio.src);
      this.audio
        .play()
        .catch((err) => console.error("Erreur de lecture :", err));
      this.isPlaying = true;
    }
    this.togglePlayButton();
  };

  // Challenge : les fonction Next et previous track ont sensiblement le même traitement. En code, on cherche toujours à ne pas dupliquer de la logique, mais plutôt à factoriser.
  // Peux tu créer une seule fonction à la place de deux ? Comment gérerais tu le cas à ce moment ?

  nextTrack = () => {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    this.loadTrack();
    this.audio.play();
    this.isPlaying = true;
  };

  prevTrack = () => {
    this.currentTrackIndex =
      (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    this.loadTrack();
    this.audio.play();
    this.isPlaying = true;
  };
}

new MusicPlayer();

// Fonctionnalités : Draggable
// On va utiiser Draggable pour drag n drop les images de notre slider, et passer d'une musique à l'autre
// https://gsap.com/docs/v3/Plugins/Draggable/

// Dans cet objet veut utiliser le "Snap", c'est à dire la magnétisation vers un item lorsqu'on relache le drag
// Pour utiliser Snap, il faut également ajouter le Inertia Plugin, (normalement payant, mais la on peut simplement utiliser une version gratos)
// La façon de le faire est d'importer le fichier js https://assets.codepen.io/16327/InertiaPlugin.min.js, dans une balise script, dans ton fichier HTML

// Fonctionnalité : Split Text

// De même, on va utiliser le Plugin Split Text (normalement payant) de GSAP.
// Tu peux trouver le fichier à utiliser ici : https://codepen.io/GreenSock/full/OPqpRJ/
