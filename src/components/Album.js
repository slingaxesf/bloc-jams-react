import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';

class Album extends Component {
  constructor(props) {
     super(props);


         const album = albumData.find( album => {
           return album.slug === this.props.match.params.slug
         });

         this.state = {
           album: album,
           currentSong: album.songs[0],
           currentTime: 0,
           duration: false,
           isPlaying: false,
           hoveredSong: null
         };

         this.audioElement = document.createElement('audio');
         this.audioElement.src = album.songs[0].audioSrc;
  } // end constructor

         // audio control methods
         play() {
           this.audioElement.play();
           this.setState({ isPlaying: true });
         }

         pause() {
           this.audioElement.pause();
           this.setState({ isPlaying: false });
         }

         // component lifecycles
         componentDidMount() {
           this.eventListeners = {
             timeupdate: e => {
               this.setState({ currentTime: this.audioElement.currentTime });
             },
             durationchange: e => {
               this.setState({ duration: this.audioElement.duration });
             },
             volumechange: e => {
               this.setState({ currentVolume: this.audioElement.volume});
             }

           };
           this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
           this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
           this.audioElement.addEventListener('volumechange', this.eventListeners.volumechange);
         }

         componentWillUnmount() {
           this.audioElement.src = null;
           this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
           this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
           this.audioElement.removeEventListener('volumechange', this.eventListeners.volumechange);
         }

         setSong(song) {

             this.audioElement.src = song.audioSrc;
             this.setState({ currentSong: song });
          }

          handleSongClick(song) {
               const isSameSong = this.state.currentSong === song;
               if (this.state.isPlaying && isSameSong) {
                  this.pause();
                } else {
                  if(!isSameSong){ this.setSong(song);}
                  this.play();
                }
          }

          handlePrevClick() {
           const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
           const newIndex = Math.max(0,currentIndex - 1);
           const newSong = this.state.album.songs[newIndex];
           this.setSong(newSong);
           this.play();
          }

          handleTimeChange(e) {
             console.log("element duration:" + this.audioElement.duration);
             console.log("e target value" + e.target.value);
             const newTime = this.audioElement.duration * e.target.value;
             this.audioElement.currentTime = newTime;
             this.setState({ currentTime: newTime });
             this.formatTime(this.state.currentTime);
           }

          handleNextClick() {
          const highestIndex = this.state.album.songs.length;
          const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
          const newIndex = Math.min(highestIndex -1, currentIndex + 1);
          const newSong = this.state.album.songs[newIndex];
          this.setSong(newSong);
          this.play();
          }

          handleVolumeChange(e){
             console.log("current song volume:" + this.state.currentSong.volume);
             const newVolume = e.target.value;
             console.log(newVolume);
             this.audioElement.volume = newVolume;
             this.setState({currentVolume: newVolume});
          }

          setHoveredSong(index){
            this.setState({hoveredSong: index});

          }
          getTrackButton(song,index) {
             if(song === this.state.currentSong && this.state.isPlaying){
               return <span className="ion-pause"></span>;
             }
            else if(index === this.state.hoveredSong){
               return <span className="ion-play"></span>;
             }
             else
              return index + 1;
          }

          formatTime(timeSeconds){
            let totalSeconds = Math.round(timeSeconds);
            let hours = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;
            let minutes = Math.floor(totalSeconds / 60);
            let seconds = totalSeconds % 60;

            console.log("hours: " + hours);
            console.log("minutes: " + minutes);
            console.log("seconds: " + seconds);

            // If you want strings with leading zeroes:
            minutes = String(minutes).padStart(2, "0");
            seconds = String(seconds).padStart(2, "0");
            console.log(minutes + ":" + seconds);

            if(timeSeconds === isNaN){
              return "-:--";
            }
            else {
              return (minutes + ":" + seconds);
            }

          }



   render() {
     return (
      <section className="album">
        <section id="album-info">
           <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title}/>
           <div className="album-details">
             <h1 id="album-title">{this.state.album.title}</h1>
             <h2 className="artist">{this.state.album.artist}</h2>
             <div id="release-info">{this.state.album.releaseInfo}</div>
           </div>
        </section>
        <table id="song-list">
           <colgroup>
              <col id="song-number-column" />
              <col id="song-title-column" />
              <col id="song-duration-column" />
          </colgroup>
          <tbody>
          {this.state.album.songs.map( (song, index) =>

           <tr className="song" key={index} onClick={() => this.handleSongClick(song)}  onMouseEnter={() => this.setHoveredSong(index)} onMouseLeave={() => this.setHoveredSong(null)}>
              <td>{this.getTrackButton(song, index)}</td>
              <td>{song.title}</td>
              <td>{this.formatTime(song.duration)}</td>
           </tr>


         )}
         </tbody>
        </table>
         <PlayerBar
           isPlaying={this.state.isPlaying}
           currentSong={this.state.currentSong}
           currentTime={this.formatTime(this.audioElement.currentTime)}
           duration={this.audioElement.duration}
           volume={this.audioElement.volume}
           handleSongClick={() => this.handleSongClick(this.state.currentSong)}
           handlePrevClick={() => this.handlePrevClick()}
           handleNextClick={() => this.handleNextClick()}
           handleTimeChange={(e) => this.handleTimeChange(e)}
           handleVolumeChange={(e) => this.handleVolumeChange(e)}
         />
      </section>
   );
  }
}
 export default Album;
