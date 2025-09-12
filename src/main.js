import { Volutus } from "volutus";

export default class MusicPlayer {
  constructor() {
    this.tracks = [
      {
        id: 0,
        title: "La clim",
        artist: "Kéroué",
        featuredArtists: ["JeanJass"],
        album: "Scope",
        cover: "/covers/scope.webp",
        url: "/musics/keroue-la_clim.mp3",
      },
      {
        id: 1,
        title: "OUTRO YuU",
        artist: "Ajna",
        featuredArtists: [],
        album: "L'HERMITE",
        cover: "/covers/l_hermite.webp",
        url: "/musics/ajna-outro_yuu.mp3",
      },
      {
        id: 2,
        title: "blccd tears",
        artist: "Mairo",
        featuredArtists: [],
        album: "LA FIEV",
        cover: "/covers/la_fiev.webp",
        url: "/musics/mairo-blccd_tears.mp3",
      },
      {
        id: 3,
        title: "Bleu marine",
        artist: "Jewel Usain",
        featuredArtists: [],
        album: "Où les garçons grandissent",
        cover: "/covers/ou_les_garcons_grandissent.webp",
        url: "/musics/jewel_usain-bleu_marine.mp3",
      },{
        id: 4,
        title: "On a pris l'habitude",
        artist: "BEN_plg",
        featuredArtists: [],
        album: "Dire je t'aime",
        cover: "/covers/dire_je_t_aime.webp",
        url: "/musics/ben_pg-on-a-pris-l-habitude.mp3",
      },
      {
        id: 5,
        title: "Fast learner",
        artist: "Mairo",
        featuredArtists: ['H JeuneCrack'],
        album: "La solution",
        cover: "/covers/la_solution.webp",
        url: "/musics/mairo-fast_learner.mp3",
      },
    ];

    this.coversToUpdate = [];
    this.audio = new Audio();
    this.lastIndex = null;

    this.init();
  }

  init = () => {
    this.cacheDOM();
    this.setCovers();
    this.setPlayButton();
    this.setVolutus();
    this.refreshDOM();
    this.loadTrack();
    this.setAudioProperties();
    this.setLastIndex();
    this.refreshStyle()
    this.updateMusicPlayer();
  };

  cacheDOM = () => {
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

  setCovers = () => {
    this.trackCover.remove();
    this.tracks.forEach((track) => {
      const clone = this.trackCover.cloneNode(true);
      clone.src = track.cover;
      this.coversToUpdate.push(clone);
      this.trackCoverContainer.appendChild(clone);
    });
  };

  setPlayButton = () => {
    this.playButton.addEventListener("click", () => this.togglePlay());
  };

  setVolutus = () => {
    this.volutus = new Volutus({
      direction: "column",
      container: this.trackCoverContainer,
      items: this.coversToUpdate,
      gap: 12,
      previousButton: this.prevButton,
      nextButton: this.nextButton,
    });
  };

  refreshDOM = () => {
    const sliderIndex = this.volutus.currentItemIndex;
    this.trackTitle.textContent = this.tracks[sliderIndex].title;
    this.trackAlbum.textContent = this.tracks[sliderIndex].album;
    this.trackArtist.textContent = this.tracks[sliderIndex].artist;

    if (this.tracks[sliderIndex].featuredArtists.length > 0) {
      let feat = "ft.";
      let index = 1;
      let length = this.tracks[sliderIndex].featuredArtists.length;

      this.tracks[sliderIndex].featuredArtists.forEach((artist) => {
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
      this.playSVG.style.display = "none";
      this.pauseSVG.style.display = "block";
    } else {
      this.playSVG.style.display = "block";
      this.pauseSVG.style.display = "none";
    }
  };

  togglePlay = () => {
    if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    } else {
      this.audio
        .play()
        .catch((err) => console.error("Erreur de lecture :", err));
      this.isPlaying = true;
    }
    this.togglePlayButton();
  };

  loadTrack = () => {
    const index = this.volutus.currentItemIndex;
    if (index < 0 || index >= this.tracks.length) {
      console.error("Index de piste invalide");
      return;
    }
    this.audio.src = this.tracks[index].url;
  };

  playTrack = () => {
    this.loadTrack();
    this.audio.play();
    this.isPlaying = true;
    this.refreshDOM();
  };

  setAudioProperties = () => {
    this.audio.addEventListener("ended", () =>
      this.volutus.buttonsManager.nextItem()
    );
  };

  checkIndex = () => {
    const currentIndex = this.volutus.currentItemIndex;
    if (this.lastIndex != currentIndex) {
      this.playTrack();
      this.refreshStyle()
    }
    this.lastIndex = currentIndex;
  };

  setLastIndex = () => {
    this.lastIndex = this.volutus.currentItemIndex;
  };

  updateMusicPlayer = () => {
    this.checkIndex();
    requestAnimationFrame(this.updateMusicPlayer);
  };

  refreshStyle = () => {
    const currentIndex = this.volutus.currentItemIndex;
    const previousIndex = this.volutus.previousItemIndex;
    const nextIndex = this.volutus.nextItemIndex;

    this.coversToUpdate[currentIndex].classList.add('shadow-2xl')
    this.coversToUpdate[previousIndex].classList.remove('shadow-2xl')
    this.coversToUpdate[nextIndex].classList.remove('shadow-2xl')
    this.coversToUpdate[currentIndex].classList.remove('shadow-md')
    this.coversToUpdate[previousIndex].classList.add('shadow-md')
    this.coversToUpdate[nextIndex].classList.add('shadow-md')

    this.coversToUpdate[currentIndex].classList.add('opacity-100')
    this.coversToUpdate[previousIndex].classList.remove('opacity-100')
    this.coversToUpdate[nextIndex].classList.remove('opacity-100')
    this.coversToUpdate[currentIndex].classList.remove('opacity-75')
    this.coversToUpdate[previousIndex].classList.add('opacity-75')
    this.coversToUpdate[nextIndex].classList.add('opacity-75')
  }
}

new MusicPlayer();
