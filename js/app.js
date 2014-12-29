(function($, window, undefined){

	function Pitch(canvasElement){
		var canvas = canvasElement;
		var context = canvas.getContext('2d');
		var textContext = canvas.getContext('2d');
		
		context.lineWidth = 1;
		context.font = '11pt Calibri';
		context.fillStyle = 'black';
		context.textAlign = 'center';
		
		var draw = function() {
			var infieldSize = 180;
			
			context.fillStyle = "white";
			context.fillRect(0, 0, canvas.width, canvas.height);
			
			// translate context to center of canvas
			context.translate(canvas.width / 2, canvas.height / 2);

			// rotate 45 degrees clockwise
			context.rotate(Math.PI / 4);
			context.strokeStyle = 'black';
			context.lineWidth = 3;
			context.strokeRect(infieldSize / -2, infieldSize / -2, infieldSize, infieldSize);

			context.rotate(-(Math.PI / 4));
			context.translate(-(canvas.width / 2), -(canvas.height / 2));
		},
		
		_clear = function () {
			context.clearRect(0, 0, canvas.width, canvas.height);
		};
		
		return {
			draw: draw
		};
	}

	function Team(canvas, positions) {
		var teamCanvas = canvas,
			teamContext = teamCanvas.getContext('2d'),
			posDB = positions,
			players = new Array();
		
		var _addPlayer = function(name, positionName) {
			var pos = posDB.getCoordinates(positionName);
			players[positionName] = { name: name, x: pos.x, y: pos.y };
		},
		_updatePlayer = function(name, newPosition) {
			if(_playerExists(name)) {
				var oldPos = _getPlayerPosition(name);
				if(oldPos !== false) {
					delete players[oldPos];
				}
				
				_addPlayer(name, newPosition);
			}
		},
		_playerExists = function(name) {
			for(var position in players) {
				if(players[position].name === name) {
					return true;
				}
			}
			
			return false;
		},
		_getPlayerPosition = function(name){
			for(var position in players) {
				if(players[position].name === name) {
					return position;
				}
			}
			
			return false;
		},
		_drawTeam = function() {
			_clearTeam();

			teamContext.lineWidth = 1;
			teamContext.font = '14pt Calibri';
			teamContext.fillStyle = 'black';
			teamContext.textAlign = 'center';
			
			for(var position in players) {
				_drawPlayer(players[position]);
			}
		},
		_drawPlayer = function(p) {
			cx = teamCanvas.width * (p.x/100);
			cy = teamCanvas.height * (p.y/100);
			
			teamContext.fillText(p.name, cx, cy);	
		},
		_clearTeam = function() {
			teamContext.clearRect(0, 0, teamCanvas.width, teamCanvas.height);
		};
		
		return {
			addPlayer: _addPlayer,
			updatePlayer: _updatePlayer,
			draw: _drawTeam
		};
	}

	function PositionDB() {
		var positions = new Array();
		
		var _addPosition = function(name, x, y){
			positions[name] = {x: x, y: y};
		},
		_getCoords = function(positionName) {
			return positions[positionName];
		};
		
		return {
			addPosition: _addPosition,
			getCoordinates: _getCoords
		};
	}

	function App() {
		var indoorPitch, team, posDB, basicPlayerList;
		//var UI elements
		var $app, $newPlayer, $playerPosition, $playerList, $posForm;
		var playerTemplate;

		var ENTER_KEY = 13;

		var _render = function() {
			$playerList.html(playerTemplate(basicPlayerList));
			indoorPitch.draw();
			team.draw();
		},
		init = function() {
			basicPlayerList = new Array();

			posDB = new PositionDB();
			_setupPositionDB(posDB);

			var canvas = document.getElementById('pitchCanvas'),
				teamCanvas = document.getElementById('team');

			indoorPitch = new Pitch(canvas);
			team = new Team(teamCanvas, posDB);

			cacheUIElements();
			bindEvents();

			_setupPositionSelect();
			_render();
		},
		cacheUIElements = function() {
			playerTemplate = Handlebars.compile($('#player-template').html());
			$app = $('#lineup-app');
			$playerList = $app.find('#player-list');
			$playerPosition = $app.find('#player-position');
			$posForm = $app.find('#positionForm');
			$newPlayer = $app.find('#new-player');
		},
		bindEvents = function() {
			$posForm.addPlayerWidget();
			$posForm.on('addPlayer', function(e, player) {
				addPlayer(player);
				$newPlayer.focus();
			});
			$playerList.on('click', '.destroy', deletePlayer);
		},
		addPlayer = function(playerDetails) {
			team.addPlayer(playerDetails.name, playerDetails.position);

			basicPlayerList.push( { name: playerDetails.name, position: playerDetails.position } );
			// $posForm.addPlayerWidget.clear();
			_render();
		},
		deletePlayer = function (e) {
			
		},
		_setupPositionDB = function(posDB) {
			posDB.addPosition('1B', 85, 40);
			posDB.addPosition('SS', 15, 40);
			posDB.addPosition('LF', 15, 8);
			posDB.addPosition('RF', 85, 8);
			posDB.addPosition('IL', 15, 75);
			posDB.addPosition('IR', 85, 75);
			posDB.addPosition('P', 50, 50);
			posDB.addPosition('C', 50, 90);
		},
		_setupPositionSelect = function() {
			var positions = ['LF','RF','SS','1B','P','C','IL','IR'];
			$.each(positions, function(i, val) {
				$playerPosition.append(
					$('<option></option>')
					.attr('value', i)
					.text(val)
					);
			})
		};

		return {
			init: init
		};
	}

	var app = new App();
	app.init();

})(jQuery, window);