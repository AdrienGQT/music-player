import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

class MusicPlayer {
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
      {
        id: 4,
        title: "Bleu marine",
        artist: "Jewel Usain",
        featuredArtists: [],
        album: "Où les garçons grandissent",
        cover: "/covers/ou_les_garcons_grandissent.webp",
        url: "/musics/jewel_usain-bleu_marine.mp3",
      },
    ];

    this.currentTrackIndex = 1;
    this.currentSliderIndex = 0;

    this.gap = 40;
    this.coversToUpdate = [];
    this.audio = new Audio();
    this.isPlaying = false;
    this.volume = 1;

    this.init();
  }

  init = () => {
    this.cacheDOM();
    this.bindEvents();
    this.setupDraggable();
    this.setCovers();
    this.loadTrack();
    this.refreshDOM();
    this.initWheelEventListener();
    this.animate();
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

    this.trackCoverContainer = document.querySelector(
      "#track-covers-container"
    );
    this.trackCover = document.querySelector("#track-cover");
  };

  bindEvents = (item) => {
    this.playButton.addEventListener("click", () => this.togglePlay());
    this.nextButton.addEventListener("click", () => this.nextTrack());
    this.prevButton.addEventListener("click", () => this.prevTrack());
    this.audio.addEventListener("ended", () => this.nextTrack());
  };

  setCovers = () => {
    this.tracks.forEach((track) => {
      const clone = this.trackCover.cloneNode(true);
      clone.src = track.cover;
      this.coversToUpdate.push(clone);
      this.trackCoverContainer.appendChild(clone);
    });
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
  };

  togglePlayButton = () => {
    if (this.isPlaying) {
      console.log("set pause button");
      this.playSVG.style.display = "none";
      this.pauseSVG.style.display = "block";
    } else {
      console.log("set play button");

      this.playSVG.style.display = "block";
      this.pauseSVG.style.display = "none";
    }
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

  nextTrack = () => {

    // Update playlist index
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    this.currentSliderIndex +=1

    this.snapSlider()

    this.playTrack();
  };

  prevTrack = () => {

    // Update playlist index
    this.currentTrackIndex =
      (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    this.currentSliderIndex -=1

    this.snapSlider()

    this.playTrack();
  };

  playTrack = () => {
    this.loadTrack();
    this.audio.play();
    this.isPlaying = true;
    this.refreshDOM();
  };

  // Infinite slider
  setupDraggable = () => {
    const proxy = document.createElement("div");

    let lastY = 0;

    const handleDragRef = this.handleDrag;
    const handleDragEndRef = this.handleDragEnd;

    let dragDelta = 0;
    let currentY = 0;
    let previousY = 0;

    Draggable.create(proxy, {
      type: "y",
      inertia: true,
      trigger: this.trackCoverContainer,
      onDrag: function () {
        currentY = this.y;
        dragDelta = currentY - previousY;
        handleDragRef(dragDelta);
        previousY = currentY;
      },
      onDragEnd: function (endValue) {
        let delta = this.endY - this.startY;
        handleDragEndRef(delta)
      },
    });
  };

  handleDrag = (value) => {
    this.targetScrollY -= value;
    this.targetScrollY = Math.round(this.targetScrollY);
    this.setCoversPosition();
  };

  handleDragEnd = (delta) => {
    if(delta < 0){
      this.nextTrack()
    }else{
      this.prevTrack()
    }
  }

  initWheelEventListener = () => {
    this.coverSize = this.trackCover.getBoundingClientRect().width;
    this.containerSize = (this.coverSize + this.gap) * this.tracks.length;
    this.initialValue = this.coverSize + this.gap;

    this.scrollY = 0;
    this.targetScrollY = 0;

    this.wheelTimeout = null;
    this.isWheeling = false;
    this.wheelEndDelay = 250;

    this.setCoversPosition();

    window.addEventListener("wheel", (e) => {
      this.deltaY = e.deltaY
      this.wheelDeltaY = e.wheelDeltaY
      console.log(this.deltaY)
      this.targetScrollY -= this.wheelDeltaY * 0.3;
      this.targetScrollY = Math.round(this.targetScrollY);

      this.isWheeling = true;

      if (this.wheelTimeout) {
        clearTimeout(this.wheelTimeout);
      }  

      // Detect if wheeling has ended
      if ((this.deltaY > 0 && this.deltaY < 5) || (this.deltaY < 0 && this.deltaY > -5)) {
        console.log('wheel ended')
        this.wheelTimeout = setTimeout(() => {
          if (this.isWheeling) {
            this.handleWheelEnd(this.deltaY);
            this.isWheeling = false;
          }
        }, this.wheelEndDelay);
      }

      // Detect end of wheel via deltaY
      // if(this.deltaY > 0 && this.deltaY < 5){
      //   setTimeout(() => {
      //     console.log('heyaaa')
      //     this.handleWheelEnd(this.deltaY)
      //   }, this.wheelEndDelay)
      // }else if(this.deltaY < 0 && this.deltaY > -5){
      //   this.wheelTimeout = setTimeout(() => {
      //     console.log('heyaaaaaaa3')
      //     this.handleWheelEnd(this.deltaY)
      //   }, this.wheelEndDelay)
      // }
    });
  };

  handleWheelEnd = (delta) => {
    // if(delta > 0){
    //   this.nextTrack()
    // }else{
    //   this.prevTrack()
    // }
    this.targetScrollY = (this.coverSize + this.gap) * this.getClosestTrack()
  }

  snapSlider = () => {
    this.targetScrollY = (this.coverSize + this.gap) * this.currentSliderIndex
  }

  getClosestTrack = () => {
    const targetTrackIndex = Math.round(this.targetScrollY / (this.coverSize + this.gap));
    return targetTrackIndex
  }

  setCoversPosition = () => {
    if (this.trackCover.parentNode) {
      this.trackCover.remove();
    }
    this.coversToUpdate.forEach((cover, index) => {
      let basePosition = index * (this.coverSize + this.gap);
      let adjustedPosition =
        -this.initialValue +
        ((basePosition - this.scrollY) % this.containerSize);

      if (adjustedPosition < -this.initialValue) {
        adjustedPosition += this.containerSize;
      }

      gsap.to(cover, {
        top: adjustedPosition,
        duration: 0,
      });
    });
  };

  animate = () => {
    this.lerpFactor = 0.1;

    this.scrollY += (this.targetScrollY - this.scrollY) * this.lerpFactor;
    this.setCoversPosition();
    requestAnimationFrame(this.animate);
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
