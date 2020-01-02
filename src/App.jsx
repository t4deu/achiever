import React from 'react';
import TopLeft from './components/TopLeft';
import Wallpaper from './components/Wallpaper';
import WallpaperInfo from './components/WallpaperInfo';
import Weather from './components/Weather';
import Center from './components/center/Center';
import Quote from './components/random-quote/Quote';
import ToDoList from './components/toDo/ToDoList';
import AskInput from './components/askInput';
import './assets/css/index.css';
import {
  initializeLocalStorage,
  localStorageKeyExists,
  addToLocalStorage,
  getFromLocalStorage,
  updateLocalStorageObjProp,
  addToLocalStorageArray,
  removeFromLocalStorageArray,
} from './scripts/utilities';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    if (!localStorageKeyExists('localStorageInitialized')) {
      initializeLocalStorage();
    }
    const savedUsername = 'Tadeu' // localStorageKeyExists('username');
    const username = savedUsername;
    const userSettings = getFromLocalStorage('userSettings');
    const currentQuote = getFromLocalStorage('quote') || {};
    const arrLikedQuotes = getFromLocalStorage('arrLikedQuotes') || [];
    const arrLikedWallpapers = getFromLocalStorage('arrLikedWallpapers') || [];
    const wallpaperData = getFromLocalStorage('wallpaper');

    this.state = {
      wallpaperData,
      usernameStatus: {
        username: savedUsername === true ? username : '',
        existName: savedUsername,
        askName: "Hello, what's your name?",
      },
      askNameStyle: {
        label: 'askName-label',
        input: 'askName-input',
      },
      currentQuote,
      arrLikedQuotes,
      arrLikedWallpapers,
      showFeatures: userSettings.showFeatures,
      options: userSettings.options,
      responsiveWPI: 'wallpaper-info-container hide700',
      responsiveQuote: 'quote-container hide700',
      quoteToggle: 'Quote',
      wpiToggle: 'Pic Info',
      showText: false,
    };
  }

  addInput(e) {
    if (e.key === 'Enter') {
      addToLocalStorage('username', this.state.usernameStatus.username);
      this.setState({
        usernameStatus: {
          existName: true,
        },
      });
    }
  }

  updateInputValue(e) {
    this.setState({
      usernameStatus: {
        username: e.target.value,
        existName: false,
        askName: "Hello, what's your name?",
      },
    });
  }

  toggleSettingsModal() {
    this.setState({
      showSettingsModal: !this.state.showSettingsModal,
    });
  }

  toggleFeature(e) {
    const feature = e.target.id;
    const userSettings = getFromLocalStorage('userSettings');
    userSettings.showFeatures[feature] = !this.state.showFeatures[feature];
    addToLocalStorage('userSettings', userSettings);
    this.setState({
      showFeatures: userSettings.showFeatures,
    });
  }

  changeOption(e) {
    const optionArr = e.target.id.split('-');
    const userSettings = getFromLocalStorage('userSettings');
    userSettings.options[optionArr[0]] = optionArr[1];
    addToLocalStorage('userSettings', userSettings);
    this.setState({
      options: userSettings.options,
    });
  }

  updateQuoteInfo(currentQuote) {
    this.setState({
      currentQuote,
    });
  }

  displayFavQuote(currentDisplayedQuote, selectedQuoteId) {
    if (currentDisplayedQuote.id !== selectedQuoteId) {
      const newDisplayQuote = this.state.arrLikedQuotes.find(
        (quote) => quote.id === selectedQuoteId
      );
      const currentQuote = newDisplayQuote;
      addToLocalStorage('quote', newDisplayQuote);
      this.setState({
        currentQuote,
      });
    }
  }

  displayFavWallpaper(currentDisplayedWallpaper, selectedWallpaperId) {
    if (currentDisplayedWallpaper.id !== selectedWallpaperId) {
      const wallpaperData = this.state.arrLikedWallpapers.find(
        (wallpaper) => wallpaper.id === selectedWallpaperId
      );
      addToLocalStorage('wallpaper', wallpaperData);
      this.setState({
        wallpaperData,
      });
    }
  }

  toggleLike(likeStatus, objId, type) {
    if (type === 'quote') {
      const currentQuote = updateLocalStorageObjProp(
        'quote',
        'liked',
        likeStatus
      );
      if (currentQuote.id === objId) {
        this.setState({ currentQuote }, () => {
          if (likeStatus) {
            const arrLikedQuotes = addToLocalStorageArray(
              'arrLikedQuotes',
              this.state.currentQuote
            );
            this.setState({
              arrLikedQuotes,
            });
          } else {
            const arrLikedQuotes = removeFromLocalStorageArray(
              'arrLikedQuotes',
              'id',
              objId
            );
            this.setState({
              arrLikedQuotes,
            });
          }
        });
      } else {
        const arrLikedQuotes = removeFromLocalStorageArray(
          'arrLikedQuotes',
          'id',
          objId
        );
        this.setState({
          arrLikedQuotes,
        });
      }
    } else if (type === 'wallpaper') {
      const wallpaperData = updateLocalStorageObjProp(
        'wallpaper',
        'wallpaperLiked',
        likeStatus
      );
      if (wallpaperData.id === objId) {
        this.setState({ wallpaperData }, () => {
          if (likeStatus) {
            const arrLikedWallpapers = addToLocalStorageArray(
              'arrLikedWallpapers',
              this.state.wallpaperData
            );
            this.setState({
              arrLikedWallpapers,
            });
          } else {
            const arrLikedWallpapers = removeFromLocalStorageArray(
              'arrLikedWallpapers',
              'id',
              objId
            );
            this.setState({
              arrLikedWallpapers,
            });
          }
        });
      } else {
        const arrLikedWallpapers = removeFromLocalStorageArray(
          'arrLikedWallpapers',
          'id',
          objId
        );
        this.setState({
          arrLikedWallpapers,
        });
      }
    }
  }

  showText() {
    this.setState({
      showText: true,
    });
  }

  updateWallpaperInfo(wallpaperData) {
    console.log('update wallpaper info called in app');
    this.setState({
      wallpaperData,
    });
  }

  toggleShow(e) {
    const target = e.target.id.slice(0, -7).concat('ClassName');
    if (target === 'quoteClassName') {
      const newState =
        this.state.responsiveQuote === 'quote-container hide700'
          ? 'quote-container'
          : 'quote-container hide700';
      const newToggleState = this.state.quoteToggle === 'Quote' ? 'X' : 'Quote';
      this.setState({
        responsiveQuote: newState,
        quoteToggle: newToggleState,
        responsiveWPI: 'wallpaper-info-container hide700',
        wpiToggle: 'Pic Info',
      });
    } else {
      const newState =
        this.state.responsiveWPI === 'wallpaper-info-container hide700'
          ? 'wallpaper-info-container'
          : 'wallpaper-info-container hide700';
      const newToggleState =
        this.state.wpiToggle === 'Pic Info' ? 'X' : 'Pic Info';
      this.setState({
        responsiveWPI: newState,
        wpiToggle: newToggleState,
        responsiveQuote: 'quote-container hide700',
        quoteToggle: 'Quote',
      });
    }
  }

  render() {
    if (this.state.usernameStatus.existName) {
      return (
        <main id="main">
          <Wallpaper
            updateWallpaperInfo={this.updateWallpaperInfo.bind(this)}
            showText={this.showText.bind(this)}
            wallpaperData={this.state.wallpaperData}
          />
          {this.state.showText && (
            <div className="row top-row">
              <div className="top-left-flex">
                <TopLeft showFeatures={this.state.showFeatures} />
              </div>
              <Weather
                showWeather={this.state.showFeatures.showWeather}
                tempScale={this.state.options.tempScale}
              />
            </div>
          )}
          {this.state.showText && (
            <div className="row middle-row">
              <Center
                showFocus={this.state.showFeatures.showFocus}
                clockFormat={this.state.options.clockFormat}
              />
            </div>
          )}
          {this.state.showText && (
            <div className="row bottom-row">
              <div className="toggle-div show700">
                <div
                  id="wallpaperInfo-toggle"
                  onClick={this.toggleShow.bind(this)}
                >
                  {this.state.wpiToggle}
                </div>
                <div id="quote-toggle" onClick={this.toggleShow.bind(this)}>
                  {this.state.quoteToggle}
                </div>
              </div>
              {this.state.wallpaperData && (
                <WallpaperInfo
                  wallpaperInfoClassName={this.state.responsiveWPI}
                  wallpaperData={this.state.wallpaperData}
                  toggleLike={this.toggleLike.bind(this)}
                />
              )}
              {this.state.showFeatures.showQuote && (
                <Quote
                  quoteClassName={this.state.responsiveQuote}
                  updateQuoteInfo={this.updateQuoteInfo.bind(this)}
                  toggleLike={this.toggleLike.bind(this)}
                  quote={this.state.currentQuote}
                  quoteFrequency={this.state.options.quoteFrequency}
                />
              )}
              {this.state.showFeatures.showTodo && <ToDoList />}
            </div>
          )}
        </main>
      );
    }
    return (
      <main id="main">
        <Wallpaper
          updateWallpaperInfo={this.updateWallpaperInfo.bind(this)}
          showText={this.showText.bind(this)}
          wallpaperData={this.state.wallpaperData}
        />
        <div className="row top-row"></div>
        {this.state.showText && (
          <div className="row middle-row">
            <AskInput
              labelStyle={this.state.askNameStyle.label}
              inputStyle={this.state.askNameStyle.input}
              addInput={(e) => this.addInput(e)}
              updateInputValue={(e) => this.updateInputValue(e)}
              value={this.state.usernameStatus.username}
              askInput={this.state.usernameStatus.askName}
            />
          </div>
        )}
        <div className="row bottom-row"></div>
      </main>
    );
  }
}
