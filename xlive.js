/*
	The Skins Factory
	http://www.theskinsfactory.com
	info@theskinsfactory.com
*/

function checkMediaOnLoad(){
	if(player){}
	view.width = 0;
	view.height = 0;
	view.backgroundImage = "";
	theme.currentViewID = "mainView";
}

var introAnim = true;
var playAnim = false;

function introSequence(){
	if(introAnim){
		mainIntro.backgroundImage = "intro_anim.gif";
		checkSoundPref( 'intro.wav' );
		view.timerInterval = 13200;
		introAnim = false;
		playAnim = true;
		if(player.OpenState==13&&(!player.currentMedia.ImageSourceWidth>0)){
			theme.savePreference("vidViewer", "false");
		}
	}else if(playAnim){
		shutterButton.enabled = true;
		playbackAnim.visible = true;
			playAnim = false;
			view.timerInterval = 0;
		if(playAnim&&player.playState==3){
			if(player.OpenState==13&&(!player.currentMedia.ImageSourceWidth>0)){
				playbackAnim.alphaBlendTo(255,500);
				visButton.enabled = true;
				visStatus = 1;
			}
		}
	}
}

var visStatus = 1;

function toggleVis(){
	if(("false"==theme.loadPreference("visViewer"))&&visStatus==3){
		visStatus = 1;
	}
	switch(visStatus){
		case 1:
			playbackAnim.visible = true;
			playbackAnim.alphaBlendTo(255,500);
			break;
		case 2:
			playbackAnim.alphaBlendTo(0,500);
			toggleView('visView','visViewer');
			break;
		case 3:
			toggleView('visView','visViewer');
			visStatus = 0;
			break;
	}
}

var shutterStatus = false;

function toggleShutter(){
	if(!shutterStatus){
		mainShutter.backgroundImage = "shutter_close.gif";
		shutterStatic.visible = true;
		volume.visible = seek.visible = playbackAnim.visible = false;
		shutterStatus = !shutterStatus;
	}else{
		mainShutter.backgroundImage = "shutter_open.gif";
		shutterStatic.visible = false;
		volume.visible = seek.visible = playbackAnim.visible = true;
		shutterStatus = !shutterStatus;
	}
}

// sound fx

function loadSoundPrefValue(){
	var val = theme.loadPreference('soundFX');
	if(val=='--'){
		theme.savePreference("soundFX", "true");
	}
}

function checkSoundPref(type){
	if("true"==theme.loadPreference("soundFX")){
		theme.playSound( type );
	}
}

// startup

function mainStartUp(){
	loadSoundPrefValue();
	volume.value = player.settings.volume;
	loadMainPrefs();
	checkPlayerState();
}

/*
if(!introAnim&&(visStatus==1)&&(!shutterStatus)&&(!player.currentMedia.ImageSourceWidth>0)){
					playbackAnim.alphaBlendTo(255,500);
					visButton.enabled = true;
					break;
				}else if(!introAnim&&(visStatus==1||visStatus==2||visStatus==0)&&(player.currentMedia.ImageSourceWidth>0)){
					playbackAnim.alphaBlendTo(0,500);
					visButton.enabled = false;
					break;
				}else if(visStatus==2&&(!shutterStatus)&&(!player.currentMedia.ImageSourceWidth>0)){
					visStatus = 2
					visButton.enabled = true;
					break;
				}else if(!introAnim&&(visStatus==0||visStatus==2)&&(!shutterStatus)&&(!player.currentMedia.ImageSourceWidth>0)){
					visStatus = 0;
					toggleVis();
					visButton.enabled = true;
					break;
				}
				break;
*/

function checkPlayerState(){

	if (player){
		switch (player.playState){

			case 3: 	//playing
				if(("false"==theme.loadPreference("vidViewer"))&&player.currentMedia.ImageSourceWidth>0){
					theme.openView('videoView');
					theme.openView('remoteView');
					playbackAnim.alphaBlendTo(0,500);
					if("true"==theme.loadPreference("visViewer")){
					    theme.savePreference("visViewer", "false");
						visStatus = visStatus;
						theme.closeView( "visView" );
					}
					break
				}else if(player.currentMedia.ImageSourceWidth>0){
					playbackAnim.alphaBlendTo(0,500);
					visButton.enabled = false;
					break;
				}
				if(!player.currentMedia.ImageSourceWidth>0){
					if((!introAnim)&&(visStatus==1)&&(!shutterStatus)){
						playbackAnim.alphaBlendTo(255,500);
						visButton.enabled = true;
					}else if((!introAnim)&&(visStatus==2)&&(!shutterStatus)){
						playbackAnim.alphaBlendTo(0,500);
						visStatus = 2
						visButton.enabled = true;
					}else if((!introAnim)&&(visStatus==0)&&(!shutterStatus)){
						visStatus = 0;
						toggleVis();
						visButton.enabled = true;
					}else{
						visStatus = visStatus;
						visButton.enabled = true;
					}
				break;
				}
			}
		}

	if (!player.controls.isAvailable("Stop")) {
		if(playbackAnim.alphaBlend==255){
			playbackAnim.alphaBlendTo(0,500);
		}
		visButton.enabled = false;
		visStatus = visStatus;

	}
	updateMetadata();
}

// metadata

function updateMetadata(){

	if(player.openState!=13) return;

	metadata.value = player.status;

	authorppl = player.currentmedia.getiteminfo("#author");

	if (authorppl == "") {
		authorppl = player.currentmedia.getiteminfo("author");
	}

	if (authorppl != "") {
		authorppl += " - ";
	}

	if (metadata.value != "") {
		metadata.value += " - ";
	}

	metadata.value += authorppl;
	metadata.value += player.currentmedia.name;
	metadata.scrolling = (metadata.textWidth>metadata.width);

}

// button and hotkey definitions

// open file
function openFile(){
	var media = theme.openDialog('FILE_OPEN','FILES_ALLMEDIA');
	if (media) {
		player.URL = media;
		player.controls.play();
	}
}

function viewHotKeys(){
	switch(event.keycode){
		case 122:
		case 90:
			player.controls.previous();
			break;
		case 120:
		case 88:
			player.controls.play();
			break;
		case 99:
		case 67:
			player.controls.pause();
			break;
		case 118:
		case 86:
			player.controls.stop();
			break;
		case 98:
		case 66:
			player.controls.next();
			break;
		case 108:
		case 76:
			openFile();
			break;
	}
}

function viewResizer(event){
	switch(event.keycode){
		case 37:
			view.width-=20;
			break;
		case 38:
			view.height-=20
			break;
		case 39:
			view.width+=20;
			break;
		case 40:
			view.height+=20;
			break;
		}
}

function updateToolTip(id,button,tip){
	if("true"==theme.loadPreference( id )){
		eval( button +".upToolTip = locHide" + tip + ".toolTip" );
	}else{
		eval( button +".upToolTip = locShow" + tip + ".toolTip" );
	}
}

function updateVolToolTip(){
	volume.toolTip = "";
	volume.toolTip += player.settings.volume;
}

function updateShuffRep(){
	if(player.settings.getMode('shuffle')){
		shuffleButton.down = true;
	}else{
		shuffleButton.down = false;
	}

	if(player.settings.getMode('loop')){
		repeatButton.down = true;
	}else{
		repeatButton.down = false;
	}
}

//

function volKey(event){
	switch(event.keycode){
		case 39:
		case 38:
			if(player.settings.volume < 95){
				player.settings.volume+=5;
			}else{
				player.settings.volume = 100;
			}
			break;
		case 37:
		case 40:
			if(player.settings.volume > 5){
				player.settings.volume-=5;
			}else{
				player.settings.volume = 0;
			}
			break;		
		}
		//mute.down = false;
		player.settings.mute = false;
	}

function seekKey(event){
	switch(event.keycode){
		//case 37:
		case 38:
			if(player.controls.currentPosition > 10){
				player.controls.currentPosition-=10;
			}else{
				player.controls.currentPosition = 0;
			}
			break;
		//case 39:
		case 40:
			if(player.controls.currentPosition < 900){
				player.controls.currentPosition+=10;
			}else{
				player.controls.currentPosition = 1000;
			}
			break;		
		}
	}

// view toggle 

function toggleView(name,id){
	if("true"==theme.loadPreference(id)){
	    theme.savePreference(id, "false");
		theme.closeView( name );
	}else{
		theme.openView( name );
	}
}

function closeView(id){
	theme.savePreference(id, "false");
	if( id=="vidViewer" && player.currentMedia.ImageSourceWidth>0 ){
		player.controls.stop();
	}
	view.close();
}

function autoSizeView(width,height){
    var viewSize = theme.loadPreference( width );

    if( "--" != viewSize )
    {
        view.width = viewSize;
    }else{
		view.width = view.minWidth;
	}

    viewSize = theme.loadpreference( height );

    if( "--" != viewSize )
    {
        view.height = viewSize;
    }else{
		view.height = view.minHeight;
	}
}

function saveViewSize(width,height){
	theme.savepreference( width , view.width );
    theme.savepreference( height , view.height );
}

// preferences

function loadMainPrefs(){

    if ("true"==theme.loadPreference("plViewer")){
        theme.openView( 'plView' );
	}

	if ("true"==theme.loadPreference("infoViewer")){
        theme.openView( 'infoView' );
	}

	if ("true"==theme.loadPreference("eqViewer")){
        theme.openView( 'eqView' );
	}

}

function saveMainPrefs() {
	theme.savePreference("visViewer", "false");
	theme.savePreference("vidViewer", "false");
}

function mainShutDown(){
	saveMainPrefs();
}

// playlist
function loadPlPrefs(){
	theme.savePreference( 'plViewer', "true" );

	autoSizeView('plWidth','plHeight');

	var index = 0;

    playlist1.setColumnResizeMode( index++, "Stretches" );
    playlist1.setColumnResizeMode( index++, "AutosizeHeader" );
    playlist1.setColumnResizeMode( index++, "AutosizeHeader" );
    playlist1.setColumnResizeMode( index++, "AutosizeHeader" );
	playlist1.setColumnResizeMode( index++, "AutosizeHeader" );

}

function addToPlaylist(){
	var media = theme.openDialog( "FILE_OPEN" , "FILES_ALLMEDIA" );
	if(media){
		newMedia = player.mediaCollection.add( media );
		playlist1.playlist.appendItem( newMedia );
	}
}

function delFromPlaylist(){
	playlist1.deleteSelected()
}

function savePlPrefs(){
	saveViewSize('plWidth','plHeight');
}

// equalizer
function loadEQPrefs(){
	theme.savePreference( 'eqViewer', "true" );
	view.width = view.minWidth;
	view.height = view.minHeight;
}

function updateBalToolTip(){
	balance.toolTip = "";
	balance.toolTip += player.settings.balance;
}

function toggleSkinFx(){
	if("true"==theme.loadPreference("soundFX")){
		theme.savePreference("soundFX", "false");
	}else{
		theme.savePreference("soundFX", "true");
	}
}

function toggleSpeaker(){
	if(eq.speakerSize==2){
		eq.speakerSize = -1;
	}
	eq.speakerSize++
}

// visualizations
function loadVisPrefs(){
	theme.savePreference( 'visViewer', "true" );
	visEffects.currentEffectType = mediacenter.effectType;
	visEffects.currentPreset = mediacenter.effectPreset;

	autoSizeView('visWidth','visHeight');

	checkVisualsPlayerState()
}

function saveVisPrefs(){
	mediacenter.effectType = visEffects.currentEffectType;
	mediacenter.effectPreset = visEffects.currentPreset;
	saveViewSize('visWidth','visHeight');
}

function checkVisualsPlayerState(){

	if (player){
		switch (player.playState){
			case 3: 	//playing
				//visMask.visible = true;
				break;

			}
		}

	if (!player.controls.isAvailable("Stop")) {
		//visMask.visible = false;
	}
}

function displayVisText(){
	visEffectsText.visible = true;
	visEffectsText.value = visEffects.currentEffectTitle + ": " + visEffects.currentPresetTitle;
	visView.timerInterval = 6000
}

function hideVisText(){
	visEffectsText.visible = false;
	visView.timerInterval = 0
}



// video

function loadVidPrefs(){
	theme.savePreference( 'vidViewer', "true" );
	checkSnapStatus();
	checkVideoPlayerState();
	updateZoomToolTip();
}

function saveVidPrefs(){

}

function loadVidSize(){
    var vidSizer = theme.loadPreference( "videoWidth" );

    if( "--" != vidSizer )
    {
        view.width = vidSizer;
    }
    vidSizer = theme.loadpreference( "videoHeight" );

    if( "--" != vidSizer )
    {
        view.height = vidSizer;
    }
}

function saveVidSize(){
    theme.savepreference( "videoWidth", view.width );
    theme.savepreference( "videoHeight", view.height );
	theme.savePreference("vidSnapper" , "false");
	vidZoom.upToolTip = vidSetTip.toolTip;
	mediacenter.videoZoom = 50;
}

function videoZoom(){
	if("false"==theme.loadPreference("vidSnapper")){
		mediacenter.videoZoom = 50;
	}
	if(mediacenter.videoZoom < 76){
		mediacenter.videoZoom = 100;
	}else if(mediacenter.videoZoom <101){
		mediacenter.videoZoom = 150;
	}else if(mediacenter.videoZoom < 156){
		mediacenter.videoZoom = 200;
	}else{
		mediacenter.videoZoom = 75;
	}
	SnapToVideo();
	updateZoomToolTip();
}

function updateZoomToolTip(){

	vidZoom.upToolTip = vidZoomIn.toolTip + mediacenter.videoZoom + vidZoomMid.toolTip;

	if(mediacenter.videoZoom < 76){
		nextZoom = 100;
	}else if(mediacenter.videoZoom <101){
		nextZoom = 150;
	}else if(mediacenter.videoZoom < 156){
		nextZoom = 200;
	}else{
		nextZoom = 75;
	}

	vidZoom.upToolTip += nextZoom + vidZoomOut.toolTip;
	
	if("false"==theme.loadPreference("vidSnapper")){
		vidZoom.upToolTip = vidSetTip.toolTip;
	}
}

function SnapToVideo(){

	theme.savePreference("vidSnapper" , "true");

	var zoom = mediacenter.videoZoom;
	var viewWidth = (player.currentMedia.imageSourceWidth * (zoom/100.00));
	var viewHeight = (player.currentMedia.imageSourceHeight * (zoom/100.00));

	view.width = viewWidth + 128;
	view.height = viewHeight + 128;
}

function checkSnapStatus(){
	if("false"==theme.loadPreference("vidSnapper")){
		loadVidSize();
	}else{
		SnapToVideo();
	}
}

function checkVideoPlayerState(){
	if (player){
		switch (player.playState){
			case 0:		//undefined
				
				break;
			case 1:		//stopped

				break;
			case 2:		//paused

				break;
			case 3: 	//playing
				videoFrame.visible = true;
				if(!player.fullScreen){
					checkSnapStatus();
				}
				if(!player.currentMedia.ImageSourceWidth>0){
					theme.savePreference('vidViewer', "false");
					view.close();
					break;
				}
				break;
			case 6:		//buffering
				
				break;
			case 7:		//waiting
				
				break;
			case 8:		//media ended
				
				break;
			case 9:		//Transitioning
				
				break;
			case 10:	//Ready
				
				break;
			}
			vidResize.enabled = true;
			vidZoom.enabled = true;
			xLiveLogo.alphaBlend = 0;
		}

	if (!player.controls.isAvailable("Stop")) {
		videoFrame.visible = false;
		vidResize.enabled = false;
		vidZoom.enabled = false;
		xLiveLogo.alphaBlendTo(255,800);
		view.width = view.minWidth;
		view.height = view.minHeight;
	}
}

// vid remote

function loadVidRemotePrefs(){
	theme.savePreference( 'remoteViewer', "true" );
	view.width = view.minWidth;
	view.height = view.minHeight;
}

function checkVideoRemotePlayerState(){
	if (player){
		switch (player.playState){
			case 3: 	//playing
				if(!player.currentMedia.ImageSourceWidth>0){
					view.close();
					break;
				}
				break;
			}
		}

	if (!player.controls.isAvailable("Stop")) {

	}
}

function checkParentVid(){
	if("false"==theme.loadPreference("vidViewer")){
		view.close();
	}
}

// info / content

function loadInfoPrefs(){
	theme.savePreference( 'infoViewer', "true" );
	view.width = view.minWidth;
	view.height = view.minHeight;
}

var infoGo = 0;

function showInfo(menu,nav,infoGo){
	infoMenuBack.visible = menu;
	infoNavSub.visible = nav;
	switch(infoGo){
		case 0:
			infoSub.backgroundImage = "";
			infoMenuBack.visible = true;
			break;
		case 1:
			infoMode = 1;	// call sections
			navGo = 1;
			navLimit = 2;
			infoNavNext();
			break;
		
	}
}

navGo = 1;

function infoNavNext(){
	infoSub.backgroundImage = "c_sub_" + infoMode + "_" + navGo + ".jpg";
	navCheck();
}

function infoNavPrev(){
	infoSub.backgroundImage = "c_sub_" + infoMode + "_" + navGo + ".jpg";
	navCheck();
}

function navCheck(){
	if(navGo==0){
		navPrev.enabled = false;
		navNext.enabled = true;
		showInfo('true','false',0);
	}else if(navGo==navLimit && infoMode==infoMode){	// enable / disable sections
		navNext.enabled = false;
		navPrev.enabled = true;
	}else{
		navNext.enabled = true;
		navPrev.enabled = true;
	}
	if(infoMode==1&&navGo==1){
		link1.visible = true;
		link2.visible = false;
	}else if(infoMode==1&&navGo==2){
		link1.visible = false;
		link2.visible = true;
	}else{
		link1.visible = false;
		link2.visible = false;
	}
}