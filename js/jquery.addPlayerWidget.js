(function($){
	$.fn.addPlayerWidget = function(options) {
		var defaults = {
			formElement: $('#positionForm'),
			playerNameEl: $('#new-player'),
			positionEl: $('#player-position')
		},
		ENTER_KEY = 13,
		opts = $.extend({}, defaults, options);

		var playerName = '',
			playerPosition = '',
			nameElement = opts.playerNameEl;
			posElement = opts.positionEl;

		var nameEditKeyUp = function(e) {
			var $input = $(e.target);
			var val = $input.val().trim();

			if (e.which !== ENTER_KEY || !val) {
				return;
			}

			playerName = val;
			if(!firePlayerAddedEvent()){
				posElement.first().focus();
			}	
		},
		setNameAfterFocusOut = function(e) {
			var $input = $(e.target);
			var val = $input.val().trim();

			if (!val) {
				return;
			}

			playerName = val;
			if(!firePlayerAddedEvent()){
				posElement.first().focus();
			}
		},
		positionChange = function(e) {
			var optionSelected = $('option:selected', this);
			var val = optionSelected.text();

			if(val === '' || val === '--') {
				return;
			}

			playerPosition = val;
			if(!firePlayerAddedEvent()){
				nameElement.focus();
			}
		},
		firePlayerAddedEvent = function() {
			if(playerName !== '' && playerPosition !== '') {
				opts.formElement.trigger('addPlayer', [{name: playerName, position: playerPosition }]);
				clearValues();
				return true;
			}
			return false;
		},
		clearValues = function() {
			playerName = '';
			playerPosition = '';
			nameElement.val('');
			posElement.prop('selectedIndex', 0);
		};

		return this.each(function () {
			// bind elements
			nameElement.on('keyup', nameEditKeyUp.bind(this));
			nameElement.on('focusout', setNameAfterFocusOut.bind(this));
			posElement.on('change', positionChange.bind(this));
		});
	};
})(jQuery);
